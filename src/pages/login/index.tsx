import { Wrapper } from "@/components/Wrapper";
import { ShopProvider } from "@/context/ShopContext";
import { getClient } from "@/utils/client";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { Dispatch, SetStateAction, useState } from "react";

type AuthType = "LOGIN" | "REGISTER";

export const Auth = ({
  numberOfItemsInBasket,
}: {
  numberOfItemsInBasket: number;
}) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayUsername] = useState("");
  const [authType, setAuthType] = useState<AuthType>("LOGIN");

  const onClickAuth = async () => {
    const apiStr = authType === "LOGIN" ? "api/login" : "api/register";
    fetch(apiStr, {
      method: "POST",
      body: JSON.stringify({ password, email, displayName }),
    }).then(() => {
      console.log("SUCCESS");
    });
  };
  return (
    <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
      <Wrapper>
        <h1>Inloggen of maak een Account aan.</h1>
        <p>
          Om uw bestellingen te kunnen traceren, en een overzicht te krijgen
          raden wij aan om een account aan te maken
        </p>
        <LoginForm
          password={password}
          setPassword={setPassword}
          email={email}
          setEmail={setEmail}
          authType={authType}
          displayName={displayName}
          setDisplayName={setDisplayUsername}
        />
        <button onClick={() => onClickAuth()} className="buy-button mt-4 mr-4">
          {authType === "LOGIN" ? "Inloggen" : "Registreren"}
        </button>
        <a
          onClick={() => {
            if (authType === "REGISTER") {
              setAuthType("LOGIN");
            } else {
              setAuthType("REGISTER");
            }
          }}
        >
          {authType === "REGISTER"
            ? "Wil je Inloggen?"
            : "Registreer een nieuw account"}
        </a>
      </Wrapper>
    </ShopProvider>
  );
};
export default Auth;

const LoginForm = ({
  password,
  setPassword,
  email,
  setEmail,
  authType,
  displayName,
  setDisplayName,
}: {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  displayName: string;
  setDisplayName: Dispatch<SetStateAction<string>>;
  authType: "LOGIN" | "REGISTER";
}) => {
  return (
    <>
      <h2>{authType === "LOGIN" ? "Inloggen" : "Registreren"}</h2>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          {authType === "REGISTER" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Naam:
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Andre"
                    value={displayName}
                    onChange={(evt) => setDisplayName(evt.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mt-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Emailadres:
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="andre_pronk@hotmail.com"
                  value={email}
                  onChange={(evt) => setEmail(evt.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Wachtwoord:
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="password"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="super geheim"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const userId = getUserIdCookie(context.req, context.res);

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
