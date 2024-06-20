import supabase from "./Supabase";


export async function insertCart (foodItem) {
const { data, error } = await supabase
  .from('cart')
  .insert([{ 
    id: foodItem.id,
    foodName: foodItem.foodName,
    foodPrice: foodItem.foodPrice,
    image: foodItem.image,
    maxQuantity: foodItem.maxQuantity
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

export async function deleteCart (id) {
    
const { data, error } = await supabase
.from('cart')
.delete()
.eq('id', id)

if (error) {
    console.error(error);
    throw new Error("Food not be deleted from Cart");
  }

  return data;
}