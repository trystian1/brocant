import { DialogWindow } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { ProductComponent } from "@/components/Product";
import { Products } from "@/components/Products";
import { Wrapper } from "@/components/Wrapper";
import { ShopProvider, useShop } from "@/context/ShopContext";
import {
  addToBasket,
  getOrCreateBasket,
  substractStock,
} from "@/utils/add-to-basket";
import { getClient, getClientCached } from "@/utils/client";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { Product } from "@/utils/types";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { useState } from "react";

function ProductsPage({
  allProducts,
  userId,
  numberOfItemsInBasket,
}: {
  allProducts: Product[];
  userId: string;
  numberOfItemsInBasket: number;
}) {
  return (
    <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
      <Wrapper>
        <Products
          allProducts={allProducts}
          userId={userId}
          numberOfItemsInBasket={numberOfItemsInBasket}
        />
      </Wrapper>
    </ShopProvider>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  //@ts-ignore
  const userId = getUserIdCookie(context.req, context.res);
  console.log(userId);
  const response = await getClient.query({
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
  const basket = response.data.baskets.find(
    (basket: any) => basket.userid === userId,
  );

  const itemsQuantity = basket?.items?.reduce(
    (a: number, b: any) => a + b.quantity,
    0,
  );
  const numberOfItemsInBasket = itemsQuantity || 0;

  const data = await getClientCached.query({
    query: gql`
      query ProductsQuery {
        products {
          id
          name
          price
          description
          stock
          image {
            url
          }
        }
      }
    `,
  });
  const allProducts = data.data.products;
  return {
    props: {
      allProducts,
      userId,
      numberOfItemsInBasket,
    },
  };
}

export default ProductsPage;
