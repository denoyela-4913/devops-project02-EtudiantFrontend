/** Étudiant tel qu'échangé avec l'API (`/api/etudiants`). `id` est absent avant création. */
export interface Etudiant {
  id?: number,
  firstName: string,
  lastName: string,
  email: string
}
