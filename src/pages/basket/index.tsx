import { Header } from "@/components/Header";
import { doMutation } from "@/utils/add-to-basket";
import { ApolloClient, DefaultOptions, gql, InMemoryCache, useQuery } from "@apollo/client";
import { NextPageContext } from "next";
import { useState } from "react";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const getClient = new ApolloClient({
  uri: "https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clfk1f1f10k0i01uh0s9i8s5y/master",
  cache: new InMemoryCache(),
  defaultOptions
});

type Item = {
  productId: string;
};

const ProductQuery = gql`
  query ProductsQuery($id: ID!) {
    product(where: { id: $id }) {
      id
      name
      image {
        url
      }
    }
  }
`

const BasketPage = ({ basket, products }: { basket: any; products: any }) => {
  
  const itemsQuantity = basket?.items?.reduce((a: number, b: any) => a + b.quantity , 0);
  const [quantity, setQuantity] = useState(itemsQuantity);
  const [stateProducts, setProducts] = useState(products)

  const deleteFromBasket = async (id: string) => {
  
    const iDtoDelete = basket.items.find((item: any) => item.productId === id).id;

    await doMutation(`
      updateBasket(data: {items: {delete: {id: "${iDtoDelete}"}}}, where: { id: "${basket.id}"}) {
        id
      }
    `)
    const result =  await doMutation(`
        publishBasket(where: {id: "${basket.id}"}) {
           items {
              productId,
              quantity
           },   
           id,
           userid
        }
     `);
    
     const products = await getProducts(result.data.publishBasket.items);
     const newQuantity = result.data.publishBasket.items?.reduce((a: number, b: any) => a + b.quantity , 0);
     setQuantity(newQuantity);
     setProducts(products);
  }
  return (
    <>
      <Header amountOfItemsInBasket={quantity || 0} />
   
      <div className="wrapper">
        <h1 className="text-3xl">Winkelmandje</h1>
        {stateProducts.map((item: any) => {
          const basketItem = basket.items.find((basketItem: any) => basketItem.productId == item.product.id);
          return <div key={item.product.id} className="basket-item">
            <div className="basket-image-text">
              <img className="basket-image" src={item.product.image.url}></img>
              <h3 className="basket-text">{item.product.name} - {basketItem.quantity} stuks</h3>
            </div>
   
            <button className="basket-delete" onClick={() => deleteFromBasket(item.product.id)}>
              Verwijderen
            </button>
          </div>;
        })}
        {stateProducts.length == 0 && <h3>Nog niets in je mandje 🥲</h3>}
      </div>
    </>
  );
};

const getProducts = async (items: any) => {

  const itemIds = items?.map((item: Item) => item.productId) || [];
  
  return await Promise.all(
    itemIds.map(async (id: string) => {
      const { data } = await getClient.query({
        query: ProductQuery,
        variables: { id }
      })
      return data;
    })
  );
}

export async function getServerSideProps(context: NextPageContext) {
  //@ts-ignore
  const userId = context?.req?.cookies["userid"];
  const response = await getClient.query({
    query: gql`
      query BasketQuery {
        baskets {
          userid
          id
          items {
            id
            productId,
            quantity
          }
        }
      }
    `,
  });

  const basket = response.data.baskets.find(
    (basket: any) => basket.userid === userId
  );
  const itemIds = basket?.items?.map((item: Item) => item.productId) || [];
  
  const products = await getProducts(basket.items);
  
  return {
    props: {
      basket: basket || {},
      products: products || []
    },
  };
}

export default BasketPage;
