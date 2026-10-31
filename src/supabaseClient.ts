import { createClient } from '@supabase/supabase-js'

// Supabase project: blcawafnjzbebbdzvevw (Sandeep project)
// anon key is safe to expose publicly — it is controlled by Row Level Security (RLS)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://blcawafnjzbebbdzvevw.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsY2F3YWZuanpiZWJiZHp2ZXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NzEwNzYsImV4cCI6MjEwOTA0NzA3Nn0.TaBzBUnN2BDY4xwSZfR6QD81GuyR8dj1weEs2Q-pXoU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

