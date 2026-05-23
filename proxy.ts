import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Logged in user hitting root → redirect to /app
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // Protect /app routes
  if (pathname.startsWith('/app')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Check onboarding status
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single();
    if (profile && !profile.onboarding_complete) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // /onboarding without being logged in
  if (pathname.startsWith('/onboarding') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Logged in user hitting login/signup → go to /app
  if (user && (pathname === '/auth/login' || pathname.startsWith('/auth/sign-up'))) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
