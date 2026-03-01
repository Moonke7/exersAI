// ============================================================
// INFRASTRUCTURE — Password Hashing (Web Crypto API — PBKDF2)
// ============================================================
// Compatible con Cloudflare Workers (edge runtime, no Node.js deps)

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // bytes
const ALGORITHM = "PBKDF2";
const HASH = "SHA-256";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hashea una contraseña con PBKDF2 + salt aleatorio.
 * Retorna una cadena con formato: `salt:hash` (ambos en Base64).
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    ALGORITHM,
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  const saltB64 = arrayBufferToBase64(salt.buffer);
  const hashB64 = arrayBufferToBase64(derivedBits);

  return `${saltB64}:${hashB64}`;
}

/**
 * Verifica una contraseña contra un hash almacenado (formato `salt:hash`).
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [saltB64, expectedHashB64] = storedHash.split(":");
  if (!saltB64 || !expectedHashB64) return false;

  const salt = new Uint8Array(base64ToArrayBuffer(saltB64));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    ALGORITHM,
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  const computedHashB64 = arrayBufferToBase64(derivedBits);
  return computedHashB64 === expectedHashB64;
}
