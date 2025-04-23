import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Notes</h2>
      
      <!-- Search and Filter Section -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Rechercher des notes..." 
                [(ngModel)]="searchTerm"
                (ngModelChange)="filterNotes()">
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="filterBy" (change)="filterNotes()">
                <option value="all">Tous</option>
                <option value="public">Public</option>
                <option value="private">Privé</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="sortBy" (change)="filterNotes()">
                <option value="date">Date</option>
                <option value="title">Titre</option>
                <option value="chapter">Chapitre</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Creation/Edit Form -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ newNote._id ? 'Modifier la note' : 'Créer une nouvelle note' }}</h5>
          <form (ngSubmit)="newNote._id ? updateNote() : createNote()" #noteForm="ngForm">
            <div class="mb-3">
              <label for="content" class="form-label">Contenu</label>
              <textarea 
                class="form-control" 
                id="content" 
                [(ngModel)]="newNote.content" 
                name="content" 
                required
                minlength="10"
                #content="ngModel"></textarea>
              <div class="text-danger" *ngIf="content.invalid && (content.dirty || content.touched)">
                Le contenu doit faire au moins 10 caractères
              </div>
            </div>
            <div class="mb-3">
              <label for="bookId" class="form-label">ID du livre</label>
              <input 
                type="text" 
                class="form-control" 
                id="bookId" 
                [(ngModel)]="newNote.bookId" 
                name="bookId" 
                required
                #bookId="ngModel">
              <div class="text-danger" *ngIf="bookId.invalid && (bookId.dirty || bookId.touched)">
                L'ID du livre est requis
              </div>
            </div>
            <div class="mb-3">
              <label for="page" class="form-label">Page</label>
              <input 
                type="number" 
                class="form-control" 
                id="page" 
                [(ngModel)]="newNote.page" 
                name="page"
                min="1"
                #page="ngModel">
              <div class="text-danger" *ngIf="page.invalid && (page.dirty || page.touched)">
                Le numéro de page doit être positif
              </div>
            </div>
            <div class="mb-3">
              <label for="chapter" class="form-label">Chapitre</label>
              <input 
                type="text" 
                class="form-control" 
                id="chapter" 
                [(ngModel)]="newNote.chapter" 
                name="chapter">
            </div>
            <div class="mb-3 form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="isPublic" 
                [(ngModel)]="newNote.isPublic" 
                name="isPublic">
              <label class="form-check-label" for="isPublic">Rendre public</label>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="noteForm.invalid">
                {{ newNote._id ? 'Mettre à jour' : 'Créer la note' }}
              </button>
              <button *ngIf="newNote._id" type="button" class="btn btn-secondary" (click)="cancelEdit()">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Notes List with Animation -->
      <div class="row" [@listAnimation]="notes.length">
        <div class="col-md-4 mb-4" *ngFor="let note of filteredNotes">
          <div class="card h-100 shadow-sm hover-effect">
            <div class="card-body">
              <h5 class="card-title d-flex justify-content-between">
                <span>Note #{{note._id}}</span>
                <span class="badge" [ngClass]="note.isPublic ? 'bg-success' : 'bg-secondary'">
                  {{note.isPublic ? 'Public' : 'Privé'}}
                </span>
              </h5>
              <p class="card-text">{{note.content}}</p>
              <div class="text-muted small mb-2">
                <i class="bi bi-book me-2"></i>Page: {{note.page}}
                <i class="bi bi-bookmark me-2 ms-3"></i>Chapitre: {{note.chapter}}
              </div>
              <div class="btn-group w-100">
                <button class="btn btn-sm btn-outline-primary" (click)="editNote(note)">
                  <i class="bi bi-pencil me-1"></i>Modifier
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteNote(note._id)">
                  <i class="bi bi-trash me-1"></i>Supprimer
                </button>
                <button class="btn btn-sm btn-outline-info" (click)="downloadPdf(note._id)">
                  <i class="bi bi-file-pdf me-1"></i>PDF
                </button>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">
                Créé le {{note.createdAt | date:'dd/MM/yyyy HH:mm'}}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-effect {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
    }
    .card {
      border-radius: 10px;
      border: none;
    }
    .btn-group .btn {
      border-radius: 5px;
      margin: 0 2px;
    }
    .badge {
      font-size: 0.8em;
      padding: 5px 10px;
      border-radius: 20px;
    }
    .create-btn {
      opacity: 1 !important;
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 5px;
      transition: background-color 0.2s;
    }
    .create-btn:hover {
      background-color: #0b5ed7;
      border-color: #0b5ed7;
    }
    .create-btn:disabled {
      background-color: #0d6efd !important;
      border-color: #0d6efd !important;
      opacity: 1 !important;
    }
  `],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class NotesComponent implements OnInit {
  notes: any[] = [];
  filteredNotes: any[] = [];
  searchTerm: string = '';
  filterBy: string = 'all';
  sortBy: string = 'date';
  newNote: any = {
    content: '',
    bookId: '',
    page: null,
    chapter: '',
    isPublic: false,
    userId: 'current-user-id' // TODO: Replace with actual user ID from auth service
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadNotes();
  }

  filterNotes() {
    this.filteredNotes = this.notes
      .filter(note => {
        const matchesSearch = note.content.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            note.chapter?.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        if (this.filterBy === 'all') return matchesSearch;
        return matchesSearch && note.isPublic === (this.filterBy === 'public');
      })
      .sort((a, b) => {
        switch(this.sortBy) {
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'title':
            return a.chapter?.localeCompare(b.chapter) || 0;
          case 'chapter':
            return a.chapter?.localeCompare(b.chapter) || 0;
          default:
            return 0;
        }
      });
  }

  loadNotes() {
    this.apiService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.filterNotes();
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        // Afficher un message d'erreur à l'utilisateur
      }
    });
  }

  createNote() {
    if (!this.newNote.content || !this.newNote.bookId) {
      return; // Ne pas soumettre si les champs requis sont vides
    }

    const noteData = {
      ...this.newNote,
      createdAt: new Date(),
      userId: 'current-user-id' // À remplacer par l'ID de l'utilisateur connecté
    };

    this.apiService.createNote(noteData).subscribe({
      next: (data) => {
        console.log('Note created:', data);
        this.notes.unshift(data);
        this.filterNotes();
        // Réinitialiser le formulaire
        this.newNote = {
          content: '',
          bookId: '',
          page: null,
          chapter: '',
          isPublic: false,
          userId: 'current-user-id'
        };
      },
      error: (error) => {
        console.error('Error creating note:', error);
        // Afficher un message d'erreur à l'utilisateur
      }
    });
  }

  editNote(note: any) {
    // Remplir le formulaire avec les données de la note sélectionnée
    this.newNote = {
      content: note.content,
      bookId: note.bookId,
      page: note.page,
      chapter: note.chapter,
      isPublic: note.isPublic,
      _id: note._id // Ajouter l'ID pour la mise à jour
    };
  }

  updateNote() {
    if (!this.newNote._id) return;

    this.apiService.updateNote(this.newNote._id, this.newNote).subscribe({
      next: (updatedNote) => {
        // Mettre à jour la note dans la liste
        const index = this.notes.findIndex(n => n._id === updatedNote._id);
        if (index !== -1) {
          this.notes[index] = updatedNote;
          this.filterNotes();
        }
        // Réinitialiser le formulaire
        this.newNote = {
          content: '',
          bookId: '',
          page: null,
          chapter: '',
          isPublic: false
        };
        alert('Note mise à jour avec succès');
      },
      error: (error) => {
        console.error('Error updating note:', error);
        alert('Erreur lors de la mise à jour de la note. Veuillez réessayer.');
      }
    });
  }

  deleteNote(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.apiService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(note => note._id !== id);
          this.filterNotes();
          alert('Note supprimée avec succès');
        },
        error: (error) => {
          console.error('Error deleting note:', error);
          alert('Erreur lors de la suppression de la note. Veuillez réessayer.');
        }
      });
    }
  }

  downloadPdf(id: string) {
    this.apiService.downloadNotePdf(id).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `note-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        // Afficher un message d'erreur à l'utilisateur
      }
    });
  }

  cancelEdit() {
    this.newNote = {
      content: '',
      bookId: '',
      page: null,
      chapter: '',
      isPublic: false,
      userId: 'current-user-id'
    };
  }
} 