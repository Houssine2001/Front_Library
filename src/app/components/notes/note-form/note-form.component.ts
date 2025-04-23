import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { Note } from '../../../models/note.model';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>{{ isEditing ? 'Modifier la Note' : 'Nouvelle Note' }}</h2>

      <form [formGroup]="noteForm" (ngSubmit)="onSubmit()" class="mt-4">
        <div class="mb-3">
          <label for="title" class="form-label">Titre</label>
          <input type="text" class="form-control" id="title" formControlName="title">
          <div *ngIf="noteForm.get('title')?.invalid && noteForm.get('title')?.touched" class="text-danger">
            Le titre est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="content" class="form-label">Contenu</label>
          <textarea class="form-control" id="content" rows="10" formControlName="content"></textarea>
          <div *ngIf="noteForm.get('content')?.invalid && noteForm.get('content')?.touched" class="text-danger">
            Le contenu est requis
          </div>
        </div>

        <div class="mb-3">
          <label for="author" class="form-label">Auteur</label>
          <input type="text" class="form-control" id="author" formControlName="author">
          <div *ngIf="noteForm.get('author')?.invalid && noteForm.get('author')?.touched" class="text-danger">
            L'auteur est requis
          </div>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary" [disabled]="noteForm.invalid">
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
          <button type="button" class="btn btn-secondary" routerLink="/notes">Annuler</button>
        </div>
      </form>
    </div>
  `
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;
  isEditing = false;
  noteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.noteId = this.route.snapshot.paramMap.get('id');
    if (this.noteId) {
      this.isEditing = true;
      this.loadNote(this.noteId);
    }
  }

  loadNote(id: string): void {
    this.noteService.getNoteById(id).subscribe(
      (note) => {
        this.noteForm.patchValue(note);
      },
      (error) => {
        console.error('Error loading note:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
      const noteData = this.noteForm.value;
      
      if (this.isEditing && this.noteId) {
        this.noteService.updateNote(this.noteId, noteData).subscribe(
          () => {
            this.router.navigate(['/notes']);
          },
          (error) => {
            console.error('Error updating note:', error);
          }
        );
      } else {
        this.noteService.createNote(noteData).subscribe(
          () => {
            this.router.navigate(['/notes']);
          },
          (error) => {
            console.error('Error creating note:', error);
          }
        );
      }
    }
  }
} 