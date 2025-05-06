import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);
const isAdminRoute = createRouteMatcher(["/dashboard(.*)"]);

const ADMIN_USER_ID = "user_2whm0gAigcVrbmpUnSfXZ5G5OP7";

export default clerkMiddleware(async (auth, req) => {
  const user = await auth();
  if (isAdminRoute(req)) {
    if (!user.userId || user.userId !== ADMIN_USER_ID) {
      return new Response("Unauthorized", { status: 403 });
    }
    return;
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
