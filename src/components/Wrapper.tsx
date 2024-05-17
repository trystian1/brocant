import { useShop } from "@/context/ShopContext";
import { auth } from "@/utils/firebase.config";
import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

const styles = {
  marginLeft: "2em",
  marginRight: "2em",
  minHeight: "72vh",
};

export const Wrapper = ({ children }: { children: ReactNode }) => {
  const { numberOfItemsInBasket } = useShop();
  return (
    <>
      <Header amountOfItemsInBasket={numberOfItemsInBasket} />
      <div className="flex justify-around">
        <div className="min-w-[70%]" style={{ ...styles }}>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};
