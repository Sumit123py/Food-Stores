import supabase from "./Supabase";

export async function getAppSetting() {
  
let { data, error } = await supabase
.from('appSetting')
.select('isDeliveryAvailable, isAppClosed')


  if (error) {
    console.error(error);
    throw new Error("Food could not be loaded in Cart");
  }

  return data;
}
