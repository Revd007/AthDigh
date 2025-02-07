import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import type { Database } from '@/types/supabase';

// Only use this client in server components/actions!
export const createServerSupabaseClient = async () => {
  const headerList = await headers();
  const authHeader = headerList.get('Authorization');
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: authHeader ?? '',
        },
      },
    }
  );
}; 