import { Wrapper } from "@/components/Wrapper";
import { ShopProvider } from "@/context/ShopContext";
import { getClient } from "@/utils/client";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";

export const AboutUs = ({
  numberOfItemsInBasket,
}: {
  numberOfItemsInBasket: number;
}) => {
  return (
    <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
      <Wrapper>
        <h1>Over ons!</h1>
        <p>
          Welkom bij De Kas - Brocante, een betoverende schatkamer van brocante
          vondsten gelegen aan de schilderachtige Aalsmeerderweg in Aalsmeer.
          Gedreven door onze passie voor tijdloze elegantie reizen Richard en
          Vera door binnen- en buitenland om unieke brocante schatten te
          ontdekken en mee te brengen naar ons charmante stukje Aalsmeer. Met
          klanten die helemaal uit Texas komen en frequente reizen naar het hart
          van Frankrijk, is De Kas niet alleen een winkel, maar een reis door de
          geschiedenis en stijl.
        </p>

        <h2>Onze Reis: Een Wereld van Brocante Schatten</h2>

        <p>
          Richard en Vera, de bezielers achter De Kas, zijn niet alleen
          eigenaars van een brocante winkel; ze zijn ontdekkingsreizigers van
          stijl en erfgoed. Hun avontuur begint in de pittoreske Franse dorpen,
          waar ze de geheimen van elk stuk ontrafelen en alleen het beste voor
          hun klanten selecteren. Of je nu een liefhebber bent van prachtig
          antiek meubilair, sierlijke accessoires, of unieke decoratieve
          stukken, bij De Kas ontdek je brocante schatten met een ziel.
        </p>

        <h2>Internationale Klanten, Lokale Gastvrijheid</h2>

        <p>
          Onze klanten komen van heinde en verre, van het lokale Aalsmeer tot
          het verre Texas. De passie voor brocante verbindt ons, en we heten
          iedereen welkom in onze fysieke winkel, geopend op zaterdag van 10.00
          tot 13.00 uur. Hier kun je de magie van brocante ervaren, elk stuk
          voelen en de verhalen erachter ontdekken.
        </p>

        <h2>Online Shoppen: De Kas Bij Jou Thuis</h2>

        <p>
          Voor degenen die de reis naar Aalsmeer niet kunnen maken, brengen we
          De Kas naar jou toe. Onze online winkel is 24/7 geopend, zodat je op
          elk moment kunt snuffelen tussen onze nieuwste vondsten en jouw eigen
          brocante schatten kunt ontdekken. We begrijpen dat het vertrouwen in
          online winkelen essentieel is, en we garanderen de kwaliteit en
          authenticiteit van elk stuk dat onze virtuele deuren verlaat.
        </p>

        <h2>Jouw Reis Begint Hier</h2>

        <p>
          Bij De Kas - Brocante geloven we dat elk stuk een verhaal vertelt en
          elk huis een kans is om dat verhaal te delen. We nodigen je uit om de
          magie van brocante te ontdekken, of het nu in onze fysieke winkel is
          op zaterdagochtend of vanuit het comfort van jouw huis via onze online
          shop. Welkom bij De Kas, waar passie, stijl, en gastvrijheid
          samenkomen om jouw reis door de wereld van brocante onvergetelijk te
          maken.{" "}
        </p>
      </Wrapper>
    </ShopProvider>
  );
};
export default AboutUs;

export async function getServerSideProps(context: NextPageContext) {
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
  return {
    props: {
      numberOfItemsInBasket: 1,
    },
  };
}
