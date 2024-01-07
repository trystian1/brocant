import { DialogWindow } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { addToBasket, getOrCreateBasket, substractStock } from "@/utils/add-to-basket";
import { getClient } from "@/utils/client";
import { Product } from "@/utils/types";
import { DefaultOptions, gql } from "@apollo/client";
import { NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";

export const useCurrencyConverter = (amount: string) => {
  const price = parseFloat(amount);

  const formatter = new Intl.NumberFormat("nl", {
    style: "currency",
    currency: "EUR",
  });
  return formatter.format(price);
};

const Product = ({
  product,
  addProductToBasket,
}: {
  product: Product;
  addProductToBasket: any;
}) => {
  console.log(product);
  const price = useCurrencyConverter(product.price.toString());
  return (
    <div
      className="product"
      style={{
        backgroundImage: `url(${product.image.url})`,
        backgroundSize: "cover",
      }}
    >
      <Link href={`/product/${product.id}`}>
        <h2 className="product-title">{product.name}</h2>
      </Link>
      <div className="product-price-wrap">
        <p className="product-price">{price}</p>
        {product.stock <= 0 && <p>Helaas niet meer op voorraad</p>}
        <button
          disabled={product.stock <= 0}
          onClick={() => addProductToBasket(product)}
          className="buy-button"
        >
          Kopen
        </button>
      </div>
    </div>
  );
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
  const [amountOfItemsInBasket, setAmountOfItemsInBasket] = useState(
    numberOfItemsInBasket
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const addProductToBasket = async (product: Product) => {
    const newStock = product.stock - 1;
    const data = await substractStock(newStock, product.id);
    const basket = await getOrCreateBasket(userId);
    if (data.data.updateProduct.stock < 0 || !basket || !userId) {
      return;
    }
    setDialogOpen(true);
    const updatedBasket = await addToBasket(basket, product.id, 1);
    
    const itemsQuantity = updatedBasket.data.publishBasket.items?.reduce((a: number, b: any) => a + b.quantity , 0);
    setAmountOfItemsInBasket(
      itemsQuantity || 0
    );
    
  };

  return (
    <>
      <Header amountOfItemsInBasket={amountOfItemsInBasket} />
      <div className="page-wrap">
        <div className="products">
          {allProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              addProductToBasket={addProductToBasket}
            />
          ))}
        </div>
      </div>
      dialog:
      <DialogWindow open={isDialogOpen} setIsOpen={setDialogOpen} />
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  //@ts-ignore
  const userId = context?.req?.cookies["userid"];
  console.log(userId)
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
    (basket: any) => basket.userid === userId
  );

  const itemsQuantity = basket?.items?.reduce((a: number, b: any) => a + b.quantity , 0);
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
  return {
    props: {
      allProducts,
      userId,
      numberOfItemsInBasket,
    },
  };
}

export default ProductPage;
