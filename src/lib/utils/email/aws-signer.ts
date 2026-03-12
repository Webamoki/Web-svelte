/**
 * AWS Signature Version 4 signing utilities for SES API
 * Compatible with Cloudflare Workers and other edge runtimes
 */

interface AwsCredentials {
  accessKeyId: string;
  region: string;
  secretAccessKey: string;
}

/**
 * Create AWS Signature V4 authorization header
 */
export async function signRequest(
  method: string,
  host: string,
  path: string,
  body: string,
  credentials: AwsCredentials,
  service: string = 'ses'
): Promise<{ headers: Record<string, string>; signedHeaders: string }> {
  const { accessKeyId, region, secretAccessKey } = credentials;

  // Create timestamp
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // Format: YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // Format: YYYYMMDD

  // Hash the request body
  const payloadHash = bufferToHex(await sha256(body));

  // Create canonical headers
  const canonicalHeaders = `host:${host}\n` + `x-amz-date:${amzDate}\n`;

  const signedHeaders = 'host;x-amz-date';

  // Create canonical request
  const canonicalRequest =
    `${method}\n` +
    `${path}\n` +
    `\n` + // Empty query string
    `${canonicalHeaders}\n` +
    `${signedHeaders}\n` +
    `${payloadHash}`;

  // Create string to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = bufferToHex(await sha256(canonicalRequest));
  const stringToSign =
    `${algorithm}\n` + `${amzDate}\n` + `${credentialScope}\n` + `${canonicalRequestHash}`;

  // Calculate signature
  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));

  // Create authorization header
  const authorizationHeader =
    `${algorithm} ` +
    `Credential=${accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, ` +
    `Signature=${signature}`;

  return {
    headers: {
      Authorization: authorizationHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Amz-Date': amzDate
    },
    signedHeaders
  };
}

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get signing key for AWS Signature V4
 */
async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await hmacSha256(encoder.encode('AWS4' + key), dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);
  const kSigning = await hmacSha256(kService, 'aws4_request');
  return kSigning;
}

/**
 * Create a SHA-256 HMAC
 */
async function hmacSha256(key: ArrayBuffer | Uint8Array, message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = key instanceof ArrayBuffer ? new Uint8Array(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData as BufferSource,
    { hash: 'SHA-256', name: 'HMAC' },
    false,
    ['sign']
  );
  return await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
}

/**
 * Create a SHA-256 hash
 */
async function sha256(message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return await crypto.subtle.digest('SHA-256', data);
}
