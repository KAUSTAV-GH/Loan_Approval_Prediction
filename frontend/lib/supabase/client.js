'use client';

import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config.js';

let browserClient;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    );
  }

  return browserClient;
}
