import supabase, { supabaseUrl } from "./Supabase";

export async function getFood(id) {
  if (id) {
    let { data, error } = await supabase.from("Food").select("*").eq('id', id).single();

    if (error) {
      console.error(error);
      throw new Error("Food could not be loaded");
    }

    return data;
  } else {
    let { data, error } = await supabase.from("Food").select("*");

    if (error) {
      console.error(error);
      throw new Error("Food could not be loaded");
    }

    return data;
  }
}



export async function deleteFood (id) {

    const { data, error } = await supabase
    .from('Food')
    .delete()
    .eq('id', id)

    if (error) {
        console.error(error);
        throw new Error("Food not be deleted");
      }
    
      return data;
  
}

export async function createEditFood(newFood, id) {
  console.log('name', newFood)

  const hasImagePath = newFood.image?.startsWith?.(supabaseUrl)

  const imageName = `${Math.random()}-${newFood.image.name}`.replaceAll('/','')

  const imagePath = hasImagePath ? newFood.image : `${supabaseUrl}/storage/v1/object/public/Food_type/${imageName}`
  
  let query = supabase.from('Food')
  if(!id) query = query.insert([{...newFood, image: imagePath}])

if(id) query = query.update({...newFood, image: imagePath})
.eq('id', id)
.select()

const { data, error } = await query.select()
.single()

if (error) {
  console.error(error);
  throw new Error("Food not be created");
}


const { error: storageError } = await supabase
  .storage
  .from('Food_type')
  .upload(imageName, newFood.image)
  

  if(storageError){
    await supabase
    .from('Food')
    .delete()
    .eq('id', data.id)
    console.error(storageError);
    throw new Error("Food image could not be created");
  }

return data;

}