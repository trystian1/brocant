import { Wrapper } from "@/components/Wrapper";
import { ShopProvider, useShop } from "@/context/ShopContext";
import { getClient } from "@/utils/client";
import { getUserIdCookie } from "@/utils/get-user-cookie";
import { gql } from "@apollo/client";
import { NextPageContext } from "next";
import { useRouter } from 'next/navigation'

const ProfilePage = ({ numberOfItemsInBasket } : { numberOfItemsInBasket : number }) => {


    return <ShopProvider numberOfItemsInBasket={numberOfItemsInBasket}>
            <Wrapper>
                <Profile />
            </Wrapper>
        </ShopProvider>
}


const Profile = () => {
    const router = useRouter()
    const logout = () => {
        fetch('api/logout').then(() => {
            router.push('/login');
        });
    }

    const { user } = useShop()

    return <>
           {user ?  
            <> 
            
            <h1>Hoi {user.displayName}</h1>
                

                <button onClick={() => logout()} className="buy-button mt-4 mr-4">
                    Uitloggen
                </button>
            </>
            
           :        <button onClick={() => logout()} className="buy-button mt-4 mr-4">
           Uitloggen
       </button>}
        
    
    </>
}


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
        numberOfItemsInBasket: itemsQuantity,
      },
    };
  }

  export default ProfilePage;