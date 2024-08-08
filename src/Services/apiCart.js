import supabase from "./Supabase";


export async function insertCart ({foodItem, userId, shortID}) {
  console.log(foodItem)
const { data, error } = await supabase
  .from('cart')
  .insert([{ 
    cartId: foodItem.id,
    foodName: foodItem.foodName,
    foodPrice: foodItem.foodPrice,
    totalPrice: foodItem.totalPrice,
    maxQuantity: foodItem.maxQuantity,
    weight: foodItem.weight,
    image: foodItem.image,
    userId: userId,
    userShortID: shortID
     }])
  .select()
  

  if (error) {
    console.error(error);
    throw new Error("Food not be added to Cart");
  }

  return data;

}

export async function getCart () { 
    
let { data, error } = await supabase
.from('cart')
.select('*')

if (error) {
    console.error(error);
    throw new Error("Food could not be loaded in Cart");
  }

  return data;

}

export async function deleteCart(id) {
  const idType = typeof id === 'string' && id.length === 36 ? 'userId' : 'id';


  const { data, error } = await supabase
    .from('cart')
    .delete()
    .eq(idType, id);

  if (error) {
    console.error(error);
    throw new Error("Food could not be deleted from Cart");
  }

  return data;
}