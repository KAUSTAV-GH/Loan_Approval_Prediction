import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from './lib/supabase/config.js';

function redirectToLogin(request, configurationMissing = false, cookies = []) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  if (configurationMissing) loginUrl.searchParams.set('authConfig', 'missing');

  const response = NextResponse.redirect(loginUrl);
  cookies.forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export async function proxy(request) {
  if (!isSupabaseConfigured()) {
    return redirectToLogin(request, true);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    return redirectToLogin(request, false, response.cookies.getAll());
  }

  return response;
}

export const config = {
  matcher: ['/predict/:path*', '/result/:path*'],
};
