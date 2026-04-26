import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Cliente Auth0 (servidor). Lee secretos solo desde variables de entorno del servidor.
 *
 * `NEXT_PUBLIC_*` aquí solo reutiliza dominio/client ID/audiencia que ya son públicos;
 * el **client secret** nunca debe ir con prefijo `NEXT_PUBLIC_`.
 */
export const auth0 = new Auth0Client({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? process.env.AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  appBaseUrl: process.env.APP_BASE_URL,
  authorizationParameters: {
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE ?? "openid profile email offline_access",
  },
  signInReturnToPath: "/app/dashboard",
});
