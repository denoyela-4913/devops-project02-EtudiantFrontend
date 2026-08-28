/**
 * Fabrique un JWT `header.payload.signature` avec une signature bidon (jamais vérifiée côté
 * front) et un claim `exp`. `expiresInSeconds` négatif => token déjà expiré.
 * Partagé entre `commands.ts` (`cy.visitAuthenticated`) et les specs d'authentification.
 */
export function fakeJwt(expiresInSeconds = 3600): string {
  const base64url = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  return `${base64url({ alg: 'HS256' })}.${base64url({ exp })}.signature`
}
