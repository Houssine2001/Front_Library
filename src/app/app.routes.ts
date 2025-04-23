import { Routes } from '@angular/router';
import { NotesComponent } from './components/notes/notes.component';
import { SummariesComponent } from './components/summaries/summaries.component';
import { CollaborativeDocsComponent } from './components/collaborative-docs/collaborative-docs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  
  // Notes routes
  { path: 'notes', component: NotesComponent },
  { path: 'notes/new', loadComponent: () => import('./components/notes/note-form/note-form.component').then(m => m.NoteFormComponent) },
  { path: 'notes/:id', loadComponent: () => import('./components/notes/note-detail/note-detail.component').then(m => m.NoteDetailComponent) },
  { path: 'notes/:id/edit', loadComponent: () => import('./components/notes/note-form/note-form.component').then(m => m.NoteFormComponent) },
  
  // Summaries routes
  { path: 'summaries', component: SummariesComponent },
  { path: 'summaries/new', loadComponent: () => import('./components/summaries/summary-form/summary-form.component').then(m => m.SummaryFormComponent) },
  { path: 'summaries/:id', loadComponent: () => import('./components/summaries/summary-detail/summary-detail.component').then(m => m.SummaryDetailComponent) },
  { path: 'summaries/:id/edit', loadComponent: () => import('./components/summaries/summary-form/summary-form.component').then(m => m.SummaryFormComponent) },
  
  // Collaborative docs routes
  { path: 'collaborative-docs', component: CollaborativeDocsComponent },
  { path: 'docs', loadComponent: () => import('./components/docs/doc-list/doc-list.component').then(m => m.DocListComponent) },
  { path: 'docs/new', loadComponent: () => import('./components/docs/doc-form/doc-form.component').then(m => m.DocFormComponent) },
  { path: 'docs/:id', loadComponent: () => import('./components/docs/doc-detail/doc-detail.component').then(m => m.DocDetailComponent) },
  { path: 'docs/:id/edit', loadComponent: () => import('./components/docs/doc-form/doc-form.component').then(m => m.DocFormComponent) }
];
