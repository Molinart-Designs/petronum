import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";
import { isAdminUser } from "@/lib/auth/roles";
import { getBackendBaseUrl } from "@/lib/server-env";

const BFF_PREFIX = "/api/petmind";

function getPetmindPath(req: NextRequest): { pathname: string; search: string } {
  const url = new URL(req.url);
  if (!url.pathname.startsWith(BFF_PREFIX)) {
    return { pathname: "", search: url.search };
  }
  const rest = url.pathname.slice(BFF_PREFIX.length) || "/";
  const pathname = rest.startsWith("/") ? rest : `/${rest}`;
  return { pathname, search: url.search };
}

function upstreamUrl(pathname: string, search: string): string {
  const base = getBackendBaseUrl();
  return `${base}${pathname}${search}`;
}

function appendSetCookies(from: NextResponse, onto: NextResponse): void {
  const list = from.headers.getSetCookie();
  for (const c of list) {
    onto.headers.append("Set-Cookie", c);
  }
}

async function forwardPublicGet(req: NextRequest, pathname: string, search: string): Promise<NextResponse> {
  const upstream = await fetch(upstreamUrl(pathname, search), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const out = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });
  const ct = upstream.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);
  return out;
}

async function forwardAuthenticatedPost(
  req: NextRequest,
  pathname: string,
  search: string,
  requireAdmin: boolean,
): Promise<NextResponse> {
  const sessionRes = new NextResponse();

  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (requireAdmin && !isAdminUser(session.user)) {
    return NextResponse.json({ error: "No autorizado (se requiere rol admin)" }, { status: 403 });
  }

  let token: string;
  try {
    ({ token } = await auth0.getAccessToken(req, sessionRes));
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener el token de acceso. Vuelve a iniciar sesión." },
      { status: 401 },
    );
  }

  const rawBody = await req.text();

  const upstream = await fetch(upstreamUrl(pathname, search), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: rawBody.length ? rawBody : undefined,
    cache: "no-store",
  });

  const out = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
  });
  const ct = upstream.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);
  appendSetCookies(sessionRes, out);
  return out;
}

export async function GET(req: NextRequest) {
  const { pathname, search } = getPetmindPath(req);

  if (pathname !== "/api/v1/health") {
    return NextResponse.json({ error: "Ruta no permitida" }, { status: 404 });
  }

  return forwardPublicGet(req, pathname, search);
}

export async function POST(req: NextRequest) {
  const { pathname, search } = getPetmindPath(req);

  if (pathname === "/api/v1/query") {
    return forwardAuthenticatedPost(req, pathname, search, false);
  }

  if (pathname === "/api/v1/ingest") {
    return forwardAuthenticatedPost(req, pathname, search, true);
  }

  return NextResponse.json({ error: "Ruta no permitida" }, { status: 404 });
}
