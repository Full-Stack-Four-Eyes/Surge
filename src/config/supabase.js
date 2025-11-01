import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tznqgyusbcnfdtwbhyxo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bnFneXVzYmNuZmR0d2JoeXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjA3NTAsImV4cCI6MjA3NzU5Njc1MH0.GuN9XhhJsAYB0YpHxamE2-J_6cl_0PHG5a87SC0BPoY'
const RESUME_BUCKET_NAME = 'resumes'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export { RESUME_BUCKET_NAME }

