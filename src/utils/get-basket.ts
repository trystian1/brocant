import { gql } from "@apollo/client";
import { getClient } from "./client";

type Item = {
    productId: string;
};
export const getProducts = async (items: any) => {
    const itemIds = items?.map((item: Item) => item.productId) || [];
  
    return await Promise.all(
      itemIds.map(async (id: string) => {
        const { data } = await getClient.query({
          query: ProductQuery,
          variables: { id },
        });
        return data;
      }),
    );
  };

  const ProductQuery = gql`
  query ProductsQuery($id: ID!) {
    product(where: { id: $id }) {
      id
      name
      price
      image {
        url
      }
    }
  }
`;



export const getTotalPrice = (stateProducts: any, basket: any) => stateProducts.reduce((total: any, item: any) => {
    if (!item) {
      return total + 0
    }
    const basketItem = basket.items.find(
      (basketItem: any) => basketItem.productId == item.product.id,
    );
    if (!basketItem) {
      return total + 0
    }
    return total + (basketItem.quantity * item.product.price);
  }, 0)