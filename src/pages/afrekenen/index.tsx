import { Button } from "@/components/Button";
import { Wrapper } from "@/components/Wrapper";
import { ShopProvider, useShop } from "@/context/ShopContext";
import { getClient } from "@/utils/client";
import { getProducts, getTotalPrice } from "@/utils/get-basket";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { currencyConverter } from "..";
import { useEffect } from "react";
import { useRouter } from "next/router";

const CheckoutPage = ({
  numberOfItemsInBasket,
  userId,
  basket,
  products,
}: {
  numberOfItemsInBasket: number;
  userId: string;
  basket: any;
  products: any[];
}) => {
  return (
    <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
      <Wrapper>
        <CheckoutInner
          products={products}
          basket={basket}
          userId={userId}
        ></CheckoutInner>
      </Wrapper>
    </ShopProvider>
  );
};

const CheckoutInner = ({
  products,
  basket,
  userId,
}: {
  products: any;
  basket: any;
  userId: string;
}) => {
  const totalPrice = getTotalPrice(products, basket);
  const titles = products
    .map((product: any) => product.product.name)
    .join(", ");
  const { user, userFetched } = useShop();
  const router = useRouter();
  useEffect(() => {
    console.log(user, userFetched);
    if (!user && userFetched) {
      router.replace("/login");
    }
  }, [userFetched]);

  const pay = () => {
    console.log("USER", user);
    fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({
        amount: totalPrice,
        title: titles,
        products,
        userId,
      }),
    }).then((response) => {
      console.log(response);
      response.json().then((data) => {
        window.location.href = data.checkoutUrl;
      });
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <h1>Hoi {user?.displayName}🙋‍♂️</h1>
      <div className="text-2xl">Dit ga je bestellen:</div>
      {products.map((item: any) => {
        const basketItem = basket.items.find(
          (basketItem: any) => basketItem.productId == item.product.id
        );
        return item ? (
          <div key={item.product.id} className="basket-item">
            <div className="basket-image-text">
              <img className="basket-image" src={item.product.image.url}></img>
              <div>
                <p className="basket-text">{item.product.name}</p>
                <p className="basket-text">{basketItem.quantity} stuks</p>
                <p className="basket-text">
                  {currencyConverter(
                    (basketItem.quantity * item.product.price).toString()
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : null;
      })}
      <div className="text-1xl">Bezorgen doen wij alleen op verzoek</div>
      <div className="text-1xl">
        Na de bestelling krijgt u bericht wanneer u het op kan halen op:
      </div>
      <div className="mt-2 mb-2 p-2 border-solid border-2 border-grey">
        <p className="mb-0">De Brocante Kas</p>
        <p className="mb-0">Aalsmeerderweg 65, Aalsmeer</p>
      </div>
      <div>Totaal te betalen {currencyConverter(totalPrice)}</div>
      <span>U wordt door gestuurd naar een externe pagina om te betalen.</span>
      <div>
        <Button label={"Afrekenen"} onClick={() => pay()} />
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
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
  const basket = basketResponse.data.baskets.find(
    (basket: any) => basket.userid === userId
  );
  const itemsQuantity = basket?.items?.reduce(
    (a: number, b: any) => a + b.quantity,
    0
  );
  const numberOfItemsInBasket = itemsQuantity || 0;
  const products = await getProducts(basket.items);

  return {
    props: {
      userId,
      products: products,
      basket: basket ?? null,
      numberOfItemsInBasket,
    },
  };
}

export default CheckoutPage;
