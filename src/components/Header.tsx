type Props = {
  amountOfItemsInBasket: number;
};

import Image from "next/image";
import { FaShoppingBasket } from "react-icons/fa";
import Link from "next/link";

export const Header = ({ amountOfItemsInBasket }: Props) => {
  return (
    <>
      <div className="header">
        <Link href="/">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/logo.jpg"
              alt="Next.js Logo"
              width={37}
              height={37}
              style={{ borderRadius: "20px", display: "inline-block" }}
              priority
            />
            <h1
              className="text-2xl"
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
          <div className="basker-wrap" style={{ display: "flex", alignItems: "center" }}>
            <FaShoppingBasket color={"#fff"} size={50} />
            <span className="amount">{amountOfItemsInBasket}</span>
          </div>
        </Link>
      </div>
    </>
  );
};
