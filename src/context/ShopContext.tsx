import { auth } from "@/utils/firebase.config";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
type Props = {
  numberOfItemsInBasket: number;
  setNumberOfItemsInBasket: Dispatch<SetStateAction<number>>;
  user: any;
  userFetched: boolean;
};

const ShopContext = createContext<Props | null>(null);

export const ShopProvider = ({
  children,
  numberOfItemsInBasket,
}: {
  children: ReactNode;
  numberOfItemsInBasket: number;
}) => {
  const [userFetched, setUserFetched] = useState(false);
  const [numberOfItems, setNumberOfItemsInBasket] = useState(
    numberOfItemsInBasket
  );
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("api/state")
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setUserFetched(true);
      });
  }, []);

  return (
    <ShopContext.Provider
      value={{
        numberOfItemsInBasket: numberOfItems,
        setNumberOfItemsInBasket,
        //@ts-ignore
        user: user ? user.user : null,
        userFetched,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const dataGridContext = useContext(ShopContext);
  if (!dataGridContext) {
    throw new Error(
      "ShopContext: ShopContext cannot be null. Wrap your app with an <ShopProvider>"
    );
  }
  return dataGridContext;
};
