import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-summaries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Résumés</h2>
      
      <!-- Search and Filter Section -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Rechercher des résumés..." 
                [(ngModel)]="searchTerm"
                (ngModelChange)="filterSummaries()">
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="filterBy" (change)="filterSummaries()">
                <option value="all">Tous</option>
                <option value="popular">Populaires</option>
                <option value="recent">Récents</option>
              </select>
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="sortBy" (change)="filterSummaries()">
                <option value="date">Date</option>
                <option value="likes">Likes</option>
                <option value="title">Titre</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Creation Form -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Créer un nouveau résumé</h5>
          <form (ngSubmit)="createSummary()" class="needs-validation" #summaryForm="ngForm">
            <div class="mb-3">
              <label for="title" class="form-label">Titre</label>
              <input 
                type="text" 
                class="form-control" 
                id="title" 
                [(ngModel)]="newSummary.title" 
                name="title" 
                required
                minlength="3"
                #title="ngModel">
              <div class="invalid-feedback" *ngIf="title.invalid && (title.dirty || title.touched)">
                Le titre doit faire au moins 3 caractères
              </div>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">Contenu</label>
              <textarea 
                class="form-control" 
                id="content" 
                [(ngModel)]="newSummary.content" 
                name="content" 
                required
                minlength="50"
                rows="5"
                #content="ngModel"></textarea>
              <div class="invalid-feedback" *ngIf="content.invalid && (content.dirty || content.touched)">
                Le contenu doit faire au moins 50 caractères
              </div>
            </div>
            <div class="mb-3">
              <label for="bookId" class="form-label">ID du livre</label>
              <input 
                type="text" 
                class="form-control" 
                id="bookId" 
                [(ngModel)]="newSummary.bookId" 
                name="bookId" 
                required
                #bookId="ngModel">
              <div class="invalid-feedback" *ngIf="bookId.invalid && (bookId.dirty || bookId.touched)">
                L'ID du livre est requis
              </div>
            </div>
            <div class="mb-3 form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="isPublic" 
                [(ngModel)]="newSummary.isPublic" 
                name="isPublic">
              <label class="form-check-label" for="isPublic">Rendre public</label>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="summaryForm.invalid">
              <i class="bi bi-plus-circle me-2"></i>Créer le résumé
            </button>
          </form>
        </div>
      </div>

      <!-- Summaries List with Animation -->
      <div class="row" [@listAnimation]="summaries.length">
        <div class="col-md-6 mb-4" *ngFor="let summary of filteredSummaries">
          <div class="card h-100 shadow-sm hover-effect">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">{{summary.title}}</h5>
                <span class="badge" [ngClass]="summary.isPublic ? 'bg-success' : 'bg-secondary'">
                  {{summary.isPublic ? 'Public' : 'Privé'}}
                </span>
              </div>
              <p class="card-text">{{summary.content}}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <button class="btn btn-sm btn-outline-primary" (click)="likeSummary(summary._id)">
                    <i class="bi bi-heart-fill me-1"></i>
                    {{summary.likes || 0}} likes
                  </button>
                </div>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" (click)="editSummary(summary)">
                    <i class="bi bi-pencil me-1"></i>Modifier
                  </button>
                  <button class="btn btn-sm btn-outline-danger" (click)="deleteSummary(summary._id)">
                    <i class="bi bi-trash me-1"></i>Supprimer
                  </button>
                  <button class="btn btn-sm btn-outline-info" (click)="downloadPdf(summary._id)">
                    <i class="bi bi-file-pdf me-1"></i>PDF
                  </button>
                </div>
              </div>
            </div>
            <div class="card-footer bg-transparent">
              <small class="text-muted">
                <i class="bi bi-clock me-1"></i>
                Créé le {{summary.createdAt | date:'dd/MM/yyyy HH:mm'}}
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
    .card-title {
      font-weight: 600;
      color: #2c3e50;
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
export class SummariesComponent implements OnInit {
  summaries: any[] = [];
  filteredSummaries: any[] = [];
  searchTerm: string = '';
  filterBy: string = 'all';
  sortBy: string = 'date';
  newSummary: any = {
    content: '',
    bookId: '',
    title: '',
    isPublic: false,
    userId: 'current-user-id' // TODO: Replace with actual user ID from auth service
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadSummaries();
  }

  filterSummaries() {
    this.filteredSummaries = this.summaries
      .filter(summary => {
        const matchesSearch = summary.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            summary.content.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        switch(this.filterBy) {
          case 'popular':
            return matchesSearch && (summary.likes || 0) > 5;
          case 'recent':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return matchesSearch && new Date(summary.createdAt) > oneWeekAgo;
          default:
            return matchesSearch;
        }
      })
      .sort((a, b) => {
        switch(this.sortBy) {
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'likes':
            return (b.likes || 0) - (a.likes || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }

  loadSummaries() {
    this.apiService.getSummaries().subscribe({
      next: (data) => {
        this.summaries = data;
        this.filterSummaries();
      },
      error: (error) => console.error('Error loading summaries:', error)
    });
  }

  createSummary() {
    if (!this.newSummary.userId) {
      console.error('User ID is required');
      return;
    }
    this.apiService.createSummary(this.newSummary).subscribe({
      next: (data) => {
        this.summaries.unshift(data);
        this.newSummary = {
          content: '',
          bookId: '',
          title: '',
          isPublic: false,
          userId: 'current-user-id' // TODO: Replace with actual user ID from auth service
        };
      },
      error: (error) => console.error('Error creating summary:', error)
    });
  }

  editSummary(summary: any) {
    // Implement edit functionality
    console.log('Edit summary:', summary);
  }

  deleteSummary(id: string) {
    if (confirm('Are you sure you want to delete this summary?')) {
      this.apiService.deleteSummary(id).subscribe({
        next: () => {
          this.summaries = this.summaries.filter(summary => summary._id !== id);
        },
        error: (error) => console.error('Error deleting summary:', error)
      });
    }
  }

  likeSummary(id: string) {
    this.apiService.likeSummary(id).subscribe({
      next: (data) => {
        const summary = this.summaries.find(s => s._id === id);
        if (summary) {
          summary.likes = (summary.likes || 0) + 1;
        }
      },
      error: (error) => console.error('Error liking summary:', error)
    });
  }

  downloadPdf(id: string) {
    this.apiService.downloadSummaryPdf(id).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `summary-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => console.error('Error downloading PDF:', error)
    });
  }
} 