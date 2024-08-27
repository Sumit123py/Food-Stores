// server.js or any server-side file
const { createClient } = require('@supabase/supabase-js');

// Fetching environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://iiokcprfxttdlszwhpma.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpb2tjcHJmeHR0ZGxzendocG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MTgxMTQsImV4cCI6MjAzMDM5NDExNH0.suVgkMsAdXHDDPmhrvXjCop-pbY70b1LzIt_6dS8ddI';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
