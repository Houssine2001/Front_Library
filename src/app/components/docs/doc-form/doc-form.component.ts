import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborativeDocService } from '../../../services/collaborative-doc.service';
import { CollaborativeDoc } from '../../../models/collaborative-doc.model';

@Component({
  selector: 'app-doc-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>{{ isEditing ? 'Modifier le Document' : 'Nouveau Document' }}</h2>

      <form [formGroup]="docForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="mb-3">
          <label for="title" class="form-label">Titre</label>
          <input type="text" class="form-control" id="title" formControlName="title">
          <div *ngIf="docForm.get('title')?.invalid && docForm.get('title')?.touched" class="text-danger">
            Le titre est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="content" class="form-label">Contenu</label>
          <textarea class="form-control" id="content" rows="10" formControlName="content"></textarea>
          <div *ngIf="docForm.get('content')?.invalid && docForm.get('content')?.touched" class="text-danger">
            Le contenu est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="author" class="form-label">Auteur</label>
          <input type="text" class="form-control" id="author" formControlName="author">
          <div *ngIf="docForm.get('author')?.invalid && docForm.get('author')?.touched" class="text-danger">
            L'auteur est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="collaborators" class="form-label">Collaborateurs (séparés par des virgules)</label>
          <input type="text" class="form-control" id="collaborators" formControlName="collaborators">
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="docForm.invalid">
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
          <button type="button" class="btn btn-secondary" routerLink="/docs">Annuler</button>
        </div>
      </form>
    </div>
  `
})
export class DocFormComponent implements OnInit {
  docForm: FormGroup;
  isEditing = false;
  docId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private docService: CollaborativeDocService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.docForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      collaborators: ['']
    });
  }

  ngOnInit(): void {
    this.docId = this.route.snapshot.paramMap.get('id');
    if (this.docId) {
      this.isEditing = true;
      this.loadDoc(this.docId);
    }
  }

  loadDoc(id: string): void {
    this.docService.getDocById(id).subscribe(
      (doc) => {
        this.docForm.patchValue({
          ...doc,
          collaborators: doc.collaborators.join(', ')
        });
      },
      (error) => {
        console.error('Error loading doc:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.docForm.valid) {
      const formValue = this.docForm.value;
      const docData = {
        ...formValue,
        collaborators: formValue.collaborators
          ? formValue.collaborators.split(',').map((c: string) => c.trim())
          : []
      };
      
      if (this.isEditing && this.docId) {
        this.docService.updateDoc(this.docId, docData).subscribe(
          () => {
            this.router.navigate(['/docs']);
          },
          (error) => {
            console.error('Error updating doc:', error);
          }
        );
      } else {
        this.docService.createDoc(docData).subscribe(
          () => {
            this.router.navigate(['/docs']);
          },
          (error) => {
            console.error('Error creating doc:', error);
          }
        );
      }
    }
  }
} 