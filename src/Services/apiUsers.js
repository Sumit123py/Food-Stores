import supabase from "./Supabase";

export async function createUser({ email, password, fcmToken }) {
  console.log('fc', fcmToken)
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
    fcmToken
  });

  if (error) {
    console.error(error);
    throw new Error("User not created");
  }

  const userId = data.user.id;
  const { error: insertError } = await supabase
    .from("users")
    .insert([{ id: userId, email: email, password: password, fcm_token: fcmToken }]);

  if (insertError) {
    console.error(insertError);
    throw new Error("User profile not created");
  }

  if (data.session) {
    localStorage.setItem("supabase_session", JSON.stringify(data.session));
  }

  return data;
}

export async function updateUser({ newData, id, imageData }) {
  const { data, error } = await supabase
    .from("users")
    .update({
      firstName: newData?.firstName,
      lastName: newData?.lastName,
      phone: newData?.phone,
      personalEmail: newData?.personalEmail,
      address: newData?.address,
      logoImage: imageData?.imagePath,
      logoName: imageData?.logoName,
    })
    .eq("id", imageData ? imageData.userId : id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Failed to update user data");
  }

  return data;
}

export async function getUserByEmail(email) {
  let { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("email", email);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch user data");
  }

  return data[0];
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error("Wrong email and password");
  }

  if (data.session) {
    localStorage.setItem("supabase_session", JSON.stringify(data.session));
  }

  return data;
}

export function getCurrentUserId() {
  const session = localStorage.getItem("supabase_session");
  if (session) {
    const parsedSession = JSON.parse(session);
    return parsedSession.user.id;
  }
  return null;
}


export async function getUsersByIds(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, address, firstName, lastName, phone, logoImage, logoName")
    .in("id", userId);

    console.log('us', userId)

  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}

export async function getUser() {

  
let { data, error } = await supabase
.from('users')
.select('*')


  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;

}