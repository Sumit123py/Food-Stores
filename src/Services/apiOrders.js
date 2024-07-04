import supabase from "./Supabase";

export async function getOrders() {
  let { data, error } = await supabase
    .from('Orders')
    .select(`
      *,
      users (
        address,
        firstName,
        lastName,
        phone,
        personalEmail,
        logoImage,
        logoName
      )
    `);

  if (error) {
    console.error(error);
    throw new Error("Orders could not be loaded");
  }

  return data;
}

export async function createOrder(userId, cartItems) {
  console.log('cart', cartItems)

  const { data, error } = await supabase
    .from('Orders')
    .insert(cartItems.map(item => ({
      userId,
      orderId: item.id,
      maxQuantity: item.maxQuantity,
      foodName: item.foodName,
      foodPrice: item.foodPrice,
      totalPrice: item.totalPrice,
      image: item.image
    })));

  if (error) {
    console.error('Failed to place order:', error);
    throw new Error('Failed to place order');
  }

  return data;
}

export async function createDuplicateOrder(userId, cartItems) {
  console.log('cart', cartItems)

  const { data, error } = await supabase
    .from('Orders_duplicate')
    .insert(cartItems.map(item => ({
      userId,
      orderId: item.id,
      maxQuantity: item.maxQuantity,
      foodName: item.foodName,
      foodPrice: item.foodPrice,
      totalPrice: item.totalPrice,
      image: item.image
    })));


  if (error) {
    console.error('Failed to place order:', error);
    throw new Error('Failed to place order');
  }

  return data;
}


export async function deleteOrders(id) {
  const { data, error } = await supabase
    .from('Orders')
    .delete()
    .eq('userId', id);

  if (error) {
    console.error(error);
    throw new Error("Orders could not be deleted");
  }

  return data;
}

export async function updateOrder({ updatedStatus, updatedApproval, check, id, idType }) {
  const updateData = {};
  if (updatedStatus !== undefined) {
    updateData.status = updatedStatus;
  }
  if (updatedApproval !== undefined) {
    updateData.Approval = updatedApproval;
  }
  if (check !== undefined) {
    updateData.check = check;
  }

  const query = supabase.from('Orders').update(updateData);

  if (idType === 'uuid') {
    query.eq('userId', id);
  } else if (idType === 'int8') {
    query.eq('id', id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to update order:', error);
    throw new Error('Failed to update order');
  }

  return data;
}

export async function updateDuplicateOrder({ updatedStatus, updatedApproval, check, id, idType }) {
  const updateData = {};
  if (updatedStatus !== undefined) {
    updateData.status = updatedStatus;
  }
  if (updatedApproval !== undefined) {
    updateData.Approval = updatedApproval;
  }
  if (check !== undefined) {
    updateData.check = check;
  }

  const query = supabase.from('Orders_duplicate').update(updateData);

  if (idType === 'uuid') {
    query.eq('userId', id);
  } else if (idType === 'int8') {
    query.eq('id', id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to update order:', error);
    throw new Error('Failed to update order');
  }

  return data;
}