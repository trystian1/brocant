import { Wrapper } from "@/components/Wrapper";
import { ShopProvider } from "@/context/ShopContext";
import { currencyConverter } from "@/pages";
import { getClient } from "@/utils/client";
import { app } from "@/utils/firebase.config";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { gql } from "@apollo/client";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { NextPageContext } from "next";

const { createMollieClient } = require("@mollie/api-client");
const mollieClient = createMollieClient({
  apiKey: "test_s8h6UB6THxWw8qfNDHJq856rG6scJC",
});
const OrderPage = ({
  numberOfItemsInBasket,
  userId,
  data,
  payment,
}: {
  numberOfItemsInBasket: number;
  userId: string;
  data: any;
  payment: any;
}) => {
  return (
    <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
      <Wrapper>
        {payment.status === "paid" ? (
          <h1>Gelukt!</h1>
        ) : (
          <h1>Er is iets mis gegaan...</h1>
        )}
        {payment.status === "paid" && (
          <>
            <p>De betaling van {currencyConverter(data.amount)} goed gegaan!</p>
            <p>Uw bestelling: {data.title}</p>
            {data.products.map(({ product }: any) => (
              <>
                <div key={product.id} className="basket-item">
                  <div className="basket-image-text">
                    <img className="basket-image" src={product.image.url}></img>
                    <div>
                      <p className="basket-text">{product.name}</p>
                    </div>
                  </div>
                </div>
              </>
            ))}
            <p>
              U krijgt zo snel mogelijk bericht wanneer u het op kan halen op
              het dit adres:
            </p>
            <div className="mt-2 mb-2 p-2 border-solid border-2 border-grey">
              <p className="mb-0">De Brocante Kas</p>
              <p className="mb-0">Aalsmeerderweg 65, Aalsmeer</p>
            </div>
          </>
        )}
      </Wrapper>
    </ShopProvider>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  console.log(id);
  //@ts-ignore
  const userId = getUserIdCookie(context.req, context.res);
  const basketResponse = await getClient.query({
    query: gql`
      query BasketQuery {
        baskets {
          userid
          id
          items {
            productId
            quantity
          }
        }
      }
    `,
  });
  const database = getDatabase(app);
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `orders/${userId}/${id}`));
  let paymentData = null;
  let data = null;
  if (snapshot.exists()) {
    let snapdata = snapshot.val();
    data = snapdata;
    const payment = await mollieClient.payments.get(snapdata.payment.id);
    paymentData = { ...payment };
    await set(ref(database, `orders/${userId}/${id}`), {
      ...snapdata,
      status: paymentData.status,
      paidAt: paymentData.paidAt,
    });
  }

  const basket = basketResponse.data.baskets.find(
    (basket: any) => basket.userid === userId
  );
  const itemsQuantity = basket?.items?.reduce(
    (a: number, b: any) => a + b.quantity,
    0
  );
  const numberOfItemsInBasket = itemsQuantity || 0;

  return {
    props: {
      userId,
      numberOfItemsInBasket,
      data,
      payment: {
        status: paymentData?.status ?? null,
        amount: paymentData?.amount,
      },
    },
  };
}

export default OrderPage;
