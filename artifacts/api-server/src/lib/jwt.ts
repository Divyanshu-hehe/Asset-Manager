import crypto from "node:crypto";

const SECRET = process.env.SESSION_SECRET ?? "pathnexis-secret-key";

function base64urlEncode(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf8");
}

export function signToken(payload: Record<string, unknown>): string {
  const header = base64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64urlEncode(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [header, body, sig] = token.split(".");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");
    if (sig !== expected) return null;
    return JSON.parse(base64urlDecode(body)) as Record<string, unknown>;
  } catch {
    return null;
  }
}
