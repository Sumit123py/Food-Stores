// server.js or any server-side file
const { createClient } = require('@supabase/supabase-js');

// Fetching environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
