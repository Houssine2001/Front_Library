import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryService } from '../../../services/summary.service';
import { Summary } from '../../../models/summary.model';

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h4>{{ isEditing ? 'Modifier le Résumé' : 'Nouveau Résumé' }}</h4>
        </div>
        <div class="card-body">
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <form [formGroup]="summaryForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="title">Titre</label>
              <input type="text" class="form-control" id="title" formControlName="title">
              <div class="text-danger" *ngIf="summaryForm.get('title')?.invalid && summaryForm.get('title')?.touched">
                Le titre est requis et doit faire au moins 3 caractères
              </div>
            </div>

            <div class="form-group">
              <label for="content">Contenu</label>
              <textarea class="form-control" id="content" formControlName="content" rows="10"></textarea>
              <div class="text-danger" *ngIf="summaryForm.get('content')?.invalid && summaryForm.get('content')?.touched">
                Le contenu est requis et doit faire au moins 10 caractères
              </div>
            </div>

            <div class="form-group">
              <label for="author">Auteur</label>
              <input type="text" class="form-control" id="author" formControlName="author">
              <div class="text-danger" *ngIf="summaryForm.get('author')?.invalid && summaryForm.get('author')?.touched">
                L'auteur est requis et doit faire au moins 2 caractères
              </div>
            </div>

            <div class="form-group">
              <label for="bookId">ID du livre</label>
              <input type="text" class="form-control" id="bookId" formControlName="bookId">
              <div class="text-danger" *ngIf="summaryForm.get('bookId')?.invalid && summaryForm.get('bookId')?.touched">
                L'ID du livre est requis
              </div>
            </div>

            <div class="form-group">
              <label for="chapter">Chapitre</label>
              <input type="text" class="form-control" id="chapter" formControlName="chapter">
            </div>

            <div class="form-group form-check">
              <input type="checkbox" class="form-check-input" id="isPublic" formControlName="isPublic">
              <label class="form-check-label" for="isPublic">Rendre public</label>
            </div>

            <div class="d-flex gap-2 mt-3">
              <button type="submit" class="btn btn-primary" [disabled]="summaryForm.invalid || isLoading">
                <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isEditing ? 'Mettre à jour' : 'Créer' }}
              </button>
              <button type="button" class="btn btn-secondary" routerLink="/summaries">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0b5ed7;
    }
    .alert {
      margin-bottom: 1rem;
    }
  `]
})
export class SummaryFormComponent implements OnInit {
  summaryForm: FormGroup;
  isEditing = false;
  summaryId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private summaryService: SummaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.summaryForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      bookId: ['', Validators.required],
      chapter: [''],
      isPublic: [false]
    });
  }

  ngOnInit(): void {
    this.summaryId = this.route.snapshot.paramMap.get('id');
    if (this.summaryId) {
      this.isEditing = true;
      this.loadSummary(this.summaryId);
    }
  }

  loadSummary(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.summaryService.getSummaryById(id).subscribe({
      next: (summary) => {
        this.summaryForm.patchValue(summary);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du résumé';
        this.isLoading = false;
        console.error('Error loading summary:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.summaryForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      const summaryData = this.summaryForm.value;
      
      console.log('Submitting summary data:', summaryData);
      
      const operation = this.isEditing && this.summaryId
        ? this.summaryService.updateSummary(this.summaryId, summaryData)
        : this.summaryService.createSummary(summaryData);

      operation.subscribe({
        next: (response) => {
          console.log('Summary operation successful:', response);
          this.isLoading = false;
          this.router.navigate(['/summaries']);
        },
        error: (error) => {
          console.error('Error in summary operation:', error);
          this.isLoading = false;
          this.errorMessage = this.isEditing
            ? 'Erreur lors de la mise à jour du résumé'
            : 'Erreur lors de la création du résumé';
          if (error.status === 0) {
            this.errorMessage += ' - Impossible de se connecter au serveur';
          } else if (error.error && error.error.message) {
            this.errorMessage += ` - ${error.error.message}`;
          }
        }
      });
    }
  }
} 