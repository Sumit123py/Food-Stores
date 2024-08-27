const supabase = require('./Components/backend/Supabase');

const fetchUserFromDatabase = async (userId) => {
  const { data: user } = await supabase.from('users').select('*').eq('id', userId).single();
  console.log('Supabase response:', { data: user }, userId);
  return user;
};

const getOrdersByUserId = async (userId) => {
  const { data: orders, error } = await supabase
    .from('Orders')
    .select('*')
    .eq('userId', userId);
    console.log('Supabase response:', { data: orders }, userId);

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error("Orders could not be loaded");
  }

  return orders;
};

module.exports = { fetchUserFromDatabase, getOrdersByUserId };
