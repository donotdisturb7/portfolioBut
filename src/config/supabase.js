import { createClient } from '@supabase/supabase-js'

// Configuration du client Supabase avec les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Création et export du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
