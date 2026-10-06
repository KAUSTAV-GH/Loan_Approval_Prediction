import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');

  const next =
    nextParam === '/result'
      ? '/result'
      : '/predict';

  if (!code) {
    return NextResponse.redirect(
      new URL(
        '/login?error=missing_code',
        requestUrl.origin
      )
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              cookieStore.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const {
    error,
  } = await supabase.auth.exchangeCodeForSession(
    code
  );

  if (error) {
    const loginUrl = new URL(
      '/login',
      requestUrl.origin
    );

    loginUrl.searchParams.set(
      'error',
      'auth_callback_failed'
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(
    new URL(next, requestUrl.origin)
  );
}