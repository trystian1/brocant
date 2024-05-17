import { gql } from "@apollo/client";
import { getClient, mutationClient } from "./client";

export const doMutation = async (mutation: string) => {
  console.log(`
    mutation BasketMutation {
        ${mutation}
     }`);
  return await mutationClient.mutate({
    mutation: gql`
        mutation BasketMutation {
           ${mutation}
        }
     `,
  });
};

export async function substractStock(newStock: number, id: string) {
  return await mutationClient.mutate({
    mutation: gql`
           mutation ProductsQuery {
              updateProduct(data: { stock: ${newStock} }, where: { id: "${id}"}) {
                 id,
                 stock
              }
           }
        `,
  });
}

export async function getOrCreateBasket(userId: string) {
  console.log(userId);
  await getClient.clearStore();
  const response = await getClient.query({
    query: gql`
      query BasketQuery {
        baskets(where: { userid: "${userId}"}) {
          userid
          id
          items {
            productId
            quantity
            id
          }
        }
      }
    `,
  });
  const basketForUser = response.data.baskets.find(
    (basket: any) => basket.userid === userId
  );
  if (basketForUser) {
    return basketForUser;
  }

  const basket = await doMutation(`
      createBasket(data: { userid: "${userId}" }) {
          id,
          userid,
          items {
            productId
          }
        }
     `);
  await doMutation(`
        publishBasket(where: {id: "${basket.data.createBasket.id}"}) {
           id
        }
     `);

  return basket.data.createBasket;
}

export async function addToBasket(
  basket: any,
  productId: string,
  quantity: number
) {
  if (basket?.items?.find((item: any) => productId == item.productId)) {
    const oldItem = basket.items.find(
      (item: any) => productId == item.productId
    );

    await doMutation(`
      updateBasket(
        data: {items: {update: { where: {  id: "${
          oldItem.id
        }"}, data: {productId: "${productId}", quantity: ${
      quantity + oldItem.quantity
    }}}}}
        where: { id: "${basket.id}"}
      ) { id }`);
  } else {
    await doMutation(`
      updateBasket(
        data: {items: {create: {data: {productId: "${productId}", quantity: ${quantity}}}}}
        where: { id: "${basket.id}"}
      ) { id }`);
  }

  return await doMutation(`
        publishBasket(where: {id: "${basket.id}"}) {
           items {
              productId,
              quantity
           },   
           id,
           userid
        }
     `);
}
