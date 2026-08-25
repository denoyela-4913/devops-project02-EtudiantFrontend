import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.component.css'
})
/** Coquille racine : ne fait qu'héberger le `<router-outlet>`, toute la logique vit dans les pages routées. */
export class AppComponent {
  title = 'etudiant-frontend';
}
