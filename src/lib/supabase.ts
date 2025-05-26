import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fftoeynmwxiqevnfweus.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdG9leW5td3hpcWV2bmZ3ZXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTc4NDQsImV4cCI6MjA2MzY5Mzg0NH0.UUmhQAlBeNJvHy9ELUjKz4PlXSctlIQHiNc5fBs9ZRs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
}); 