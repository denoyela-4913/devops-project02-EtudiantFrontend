/** Payload envoyé à `POST /api/register` pour créer un compte utilisateur. */
export interface Register {
  firstName: string,
  lastName: string,
  login: string,
  password: string
}