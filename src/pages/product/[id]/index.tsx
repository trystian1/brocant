import { DialogWindow } from "@/components/Dialog";
import { Header } from "@/components/Header";
import { Wrapper } from "@/components/Wrapper";
import { addToBasket, getOrCreateBasket, substractStock } from "@/utils/add-to-basket";
import { getClient } from "@/utils/client";
import { Product } from "@/utils/types";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { useState } from "react";

const ProductPage = ({ product, numberOfItemsInBasket, userId }: { product: any, numberOfItemsInBasket: number, userId: string}) => {
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
    return <>
        <Header amountOfItemsInBasket={amountOfItemsInBasket} />
        <Wrapper>
            <h1 className="text-2xl">{product.name}</h1>
            <div className="product-wrap">
                <img className="product-child product-image" src={product.image.url} />
                <div className="product-child product-info">
                    <button
                    disabled={product.stock <= 0}
                    onClick={() => addProductToBasket(product)}
                    className="buy-button buy-button-product"
                    >
                    Kopen
                    </button>
                    {product.stock <= 0 && <p><i>Helaas niet meer op voorraad</i></p>}
                    <p className="product-description">
                        {product.description}
                </p>
                </div>
             
            </div>
        </Wrapper>
        <DialogWindow open={isDialogOpen} setIsOpen={setDialogOpen} />
    </>
}


export async function getServerSideProps(context: NextPageContext) {
    
    const { id } = context.query;
    //@ts-ignore
    const userId = context?.req?.cookies["userid"];
    const basketResponse = await getClient.query({
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
    const basket = basketResponse.data.baskets.find(
    (basket: any) => basket.userid === userId
    );
    const itemsQuantity = basket?.items?.reduce((a: number, b: any) => a + b.quantity , 0);
    const numberOfItemsInBasket = itemsQuantity || 0;
    const response = await getClient.query({
      query: gql`
        query MyQuery {
            product(where: { id: "${id}" }) {
                id,
                name,
                image {
                    url
                }
                stock,
                description
            }
        }
      `,
    });
    
    return {
      props: {
        product: response.data.product,
        userId,
        numberOfItemsInBasket
      },
    };
  }

  export default ProductPage;