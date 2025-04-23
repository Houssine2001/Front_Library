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
    <div class="container">
      <h2>{{ isEditing ? 'Modifier le Résumé' : 'Nouveau Résumé' }}</h2>

      <form [formGroup]="summaryForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="mb-3">
          <label for="title" class="form-label">Titre</label>
          <input type="text" class="form-control" id="title" formControlName="title">
          <div *ngIf="summaryForm.get('title')?.invalid && summaryForm.get('title')?.touched" class="text-danger">
            Le titre est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="content" class="form-label">Contenu</label>
          <textarea class="form-control" id="content" rows="10" formControlName="content"></textarea>
          <div *ngIf="summaryForm.get('content')?.invalid && summaryForm.get('content')?.touched" class="text-danger">
            Le contenu est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="author" class="form-label">Auteur</label>
          <input type="text" class="form-control" id="author" formControlName="author">
          <div *ngIf="summaryForm.get('author')?.invalid && summaryForm.get('author')?.touched" class="text-danger">
            L'auteur est requis
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="summaryForm.invalid">
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
          <button type="button" class="btn btn-secondary" routerLink="/summaries">Annuler</button>
        </div>
      </form>
    </div>
  `
})
export class SummaryFormComponent implements OnInit {
  summaryForm: FormGroup;
  isEditing = false;
  summaryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private summaryService: SummaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.summaryForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required]
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
    this.summaryService.getSummaryById(id).subscribe(
      (summary) => {
        this.summaryForm.patchValue(summary);
      },
      (error) => {
        console.error('Error loading summary:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.summaryForm.valid) {
      const summaryData = this.summaryForm.value;
      
      if (this.isEditing && this.summaryId) {
        this.summaryService.updateSummary(this.summaryId, summaryData).subscribe(
          () => {
            this.router.navigate(['/summaries']);
          },
          (error) => {
            console.error('Error updating summary:', error);
          }
        );
      } else {
        this.summaryService.createSummary(summaryData).subscribe(
          () => {
            this.router.navigate(['/summaries']);
          },
          (error) => {
            console.error('Error creating summary:', error);
          }
        );
      }
    }
  }
} 