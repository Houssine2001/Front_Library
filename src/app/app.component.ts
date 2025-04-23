import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './components/notes/notes.component';
import { SummariesComponent } from './components/summaries/summaries.component';
import { CollaborativeDocsComponent } from './components/collaborative-docs/collaborative-docs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NotesComponent, SummariesComponent, CollaborativeDocsComponent],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="#">Library Notes & Summaries</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/notes">Notes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/summaries">Summaries</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/collaborative-docs">Collaborative Documents</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      margin-bottom: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'library-frontend';
}
