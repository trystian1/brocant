import { currencyConverter } from "@/pages";
import { Product } from "@/utils/types";
import Link from "next/link";

export const ProductComponent = ({
  product,
  addProductToBasket,
}: {
  product: Product;
  addProductToBasket: any;
}) => {
  console.log(product);
  const price = currencyConverter(product.price.toString());
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
