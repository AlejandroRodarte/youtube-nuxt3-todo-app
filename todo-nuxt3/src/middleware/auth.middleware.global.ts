// client-side middleware
const ALLOWED_ROUTES = ['/auth'] as const;

export default defineNuxtRouteMiddleware(async (to) => {
  // is route "/auth"?
  const isRouteAllowed = ALLOWED_ROUTES.some((route) => route === to.path);

  // user has app cookie?
  const cookie = useCookie('nuxt3-todo-token');
  const hasCookie = cookie && cookie.value;

  if (isRouteAllowed) {
    // route is "/auth" and user has cookie: redirect to home page
    if (hasCookie) return navigateTo('/');
    // route is "/auth" and user has no cookie; go to "/auth"
    else return;
  }

  // route is NOT "/auth" and user does NOT have cookie: redirect to "/auth"
  if (!hasCookie) return navigateTo('/auth');
  // route is NOT "/auth" and user has cookie; do nothing
  else return;
});
