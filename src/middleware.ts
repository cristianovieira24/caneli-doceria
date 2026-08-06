import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // Make refreshed cookies visible to the Server Components rendered
          // during this same request.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          // Also persist every refreshed cookie in the browser. Using setAll
          // avoids losing cookie chunks when the Supabase session is split.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicAdminPaths = [
    "/admin/login",
    "/admin/esqueci-senha",
    "/admin/redefinir-senha",
  ];

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !publicAdminPaths.includes(request.nextUrl.pathname) &&
    !user
  ) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
