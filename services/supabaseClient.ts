import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqxequahexzheggucfmk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGVxdWFoZXh6aGVnZ3VjZm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2ODYyMjEsImV4cCI6MjA3ODI2MjIyMX0.JNWN_wmI0sbdrn0IBveykhFpetfSSmBbo3QuJgW3y-4';

export const supabase = createClient(supabaseUrl, supabaseKey);
