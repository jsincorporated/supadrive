// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase';

const SUPABASE_URL = "https://jskayjumrblbumouwkja.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
