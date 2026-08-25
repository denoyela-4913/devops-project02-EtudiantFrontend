import {Register} from '../models/Register';
import {Login} from '../models/Login';

import {Observable, of} from 'rxjs';


/**
 * Doublure de `UserService` pour prototyper l'UI sans backend : renvoie des observables vides
 * (ni succès ni erreur ne sont jamais émis). Non fourni via `@Injectable`/DI : à instancier
 * et brancher manuellement si besoin, ce n'est pas un remplacement actif de `UserService`.
 */
export class UserMockService {

  register(user: Register): Observable<Object> {
    return of();
  }

  login(user: Login): Observable<Object> {
    return of();
  }
}
