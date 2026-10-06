'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client.js';
import { isSupabaseConfigured } from '@/lib/supabase/config.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return undefined;

    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user || null);
      setLoading(false);
    });

    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (!isMounted) return;
        setUser(error ? null : data.user);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: new Error('Supabase authentication is not configured.') };

    const { error } = await supabase.auth.signOut();
    if (!error) setUser(null);
    return { error };
  }, []);

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    signOut,
  };
}
