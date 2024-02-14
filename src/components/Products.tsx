import { DialogWindow } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { ProductComponent } from "@/components/Product";
import { useShop } from "@/context/ShopContext";
import {
  addToBasket,
  getOrCreateBasket,
  substractStock,
} from "@/utils/add-to-basket";
import { Product } from "@/utils/types";
import { useState } from "react";

export function Products({
  allProducts,
  userId,
  numberOfItemsInBasket,
}: {
  allProducts: Product[];
  userId: string;
  numberOfItemsInBasket: number;
}) {
  const { setNumberOfItemsInBasket } = useShop();
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

    const itemsQuantity = updatedBasket.data.publishBasket.items?.reduce(
      (a: number, b: any) => a + b.quantity,
      0,
    );
    setNumberOfItemsInBasket(itemsQuantity || 0);
  };

  return (
    <>
      <div className="products">
        {allProducts.map((product) => (
          <ProductComponent
            key={product.id}
            product={product}
            addProductToBasket={addProductToBasket}
          />
        ))}
      </div>
      <DialogWindow open={isDialogOpen} setIsOpen={setDialogOpen} />
    </>
  );
}
