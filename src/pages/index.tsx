import { DialogWindow } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { ProductComponent } from "@/components/Product";
import { Products } from "@/components/Products";
import { Wrapper } from "@/components/Wrapper";
import { ShopProvider } from "@/context/ShopContext";
import {
  addToBasket,
  getOrCreateBasket,
  substractStock,
} from "@/utils/add-to-basket";
import { getClient } from "@/utils/client";
import { Product } from "@/utils/types";
import { DefaultOptions, gql } from "@apollo/client";
import { NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";
import { cookies } from "next/headers";
import { getUserIdCookie } from "@/utils/get-user-cookie";

export const currencyConverter = (amount: string) => {
  const price = parseFloat(amount);

  const formatter = new Intl.NumberFormat("nl", {
    style: "currency",
    currency: "EUR",
  });
  return formatter.format(price);
};

function ProductPage({
  allProducts,
  userId,
  numberOfItemsInBasket,
}: {
  allProducts: Product[];
  userId: string;
  numberOfItemsInBasket: number;
}) {
  return (
    <>
      <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
        <Wrapper>
          <h1>Welkom bij De Kas - Brocante</h1>
          <p>
            {" "}
            Brocante, waar nostalgie en charme samenkomen in een unieke
            collectie van prachtige brocante vondsten. Onze winkel is dé
            bestemming voor liefhebbers van vintage schoonheid en tijdloze
            elegantie.
          </p>
          <p>
            Of je nu op zoek bent naar een stijlvol antiek meubelstuk, sierlijke
            accessoires of unieke decoratieve items, bij De Kas vind je het
            allemaal.
          </p>
          <p>Bekijk hier enkele van onze producten:</p>
          <Products
            allProducts={allProducts}
            userId={userId}
            numberOfItemsInBasket={numberOfItemsInBasket}
          />
          <h2>Ontdek Onze Brocante Schatten</h2>
          <p>
            Stap binnen in een wereld van karaktervolle stukken die de tand des
            tijds hebben doorstaan. Onze collectie omvat een breed scala aan
            brocante spullen, van prachtige meubels tot charmante snuisterijen.
            Elk item vertelt een verhaal en voegt een vleugje geschiedenis toe
            aan jouw interieur.
          </p>
          <h2>Waarom Kiezen voor De Kas - Brocante?</h2>
          <p>
            Authenticiteit: Al onze brocante stukken zijn zorgvuldig
            geselecteerd op basis van hun authentieke charme en kwaliteit.
          </p>

          <p>
            Unieke Vondsten: Onze winkel biedt een constante aanvoer van unieke
            vondsten, zodat je altijd iets bijzonders ontdekt.
          </p>
          <p>
            Betaalbare Elegantie: Bij De Kas geloven we dat stijlvol wonen niet
            duur hoeft te zijn. Ontdek betaalbare elegantie in onze prachtige
            collectie.
          </p>
          <h3>Bezoek Onze Winkel</h3>
          <p>
            Of je nu je huis wilt verfraaien met tijdloze brocante schatten of
            op zoek bent naar een uniek cadeau, bij De Kas - Brocante ben je aan
            het juiste adres. Onze winkel is gelegen op{" "}
            <strong>Aalsmeerderweg 65, Aalsmeer, Netherlands</strong>, waar we
            je verwelkomen om de sfeer van vervlogen tijden te ervaren.
          </p>
        </Wrapper>
      </ShopProvider>
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  //@ts-ignore
  const userId = getUserIdCookie(context.req, context.res);
  //const user =  await (await fetch('http://localhost:3000/api/state')).json();
  //console.log('YO',user.displayName);
  // const userState = await fetch("http://localhost:3000/api/state");
  // const { user } = await userState.json();
  // console.log(">>>>>>>>>", user, userId);
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

  const data = await getClient.query({
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
  console.log("USER ID", userId);
  return {
    props: {
      allProducts,
      userId,
      numberOfItemsInBasket,
    },
  };
}

export default ProductPage;
