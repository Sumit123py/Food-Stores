import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://iiokcprfxttdlszwhpma.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpb2tjcHJmeHR0ZGxzendocG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ4MTgxMTQsImV4cCI6MjAzMDM5NDExNH0.suVgkMsAdXHDDPmhrvXjCop-pbY70b1LzIt_6dS8ddI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;