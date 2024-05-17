type Props = {
  amountOfItemsInBasket: number;
};

import Image from "next/image";
import { FaShoppingBasket } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";

export const Header = ({ amountOfItemsInBasket }: Props) => {
  const { user } = useShop();

  return (
    <>
      <div className="header">
        <div className="inner-header">
          <Link href="/">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.jpg"
                alt="Next.js Logo"
                width={30}
                height={30}
                style={{ borderRadius: "20px", display: "inline-block" }}
                priority
              />
              <h1
                className="text-2xl sm:text-1xl"
                style={{
                  color: "#fff",
                  display: "inline-block",
                  marginLeft: "30px",
                }}
              >
                Brocante Kas
              </h1>
            </div>
          </Link>
          <Link href={"/basket"}>
            <div
              className="basker-wrap"
              style={{ display: "flex", alignItems: "center" }}
            >
              <FaShoppingBasket color={"#fff"} size={40} />
              <span className="amount">{amountOfItemsInBasket}</span>
            </div>
          </Link>
        </div>
        <div className="flex justify-end mt-4 text-white">
          {user && (
            <Link href={"/login"}>
              <div className="flex justify-end items-baseline">
                <CgProfile />
                <p className="ml-2 ">{user.displayName}</p>
              </div>
            </Link>
          )}
          {!user && (
            <Link href={"/login"}>
              <div className="flex justify-end items-baseline">
                <CgProfile />
                <p className="ml-2 ">Inloggen</p>
              </div>
            </Link>
          )}
        </div>
      </div>
      <nav>
        <Link href={"/brocante-struinen"}>Alle items</Link>
        <Link href={"/over-ons"}>Over ons</Link>
      </nav>
    </>
  );
};
