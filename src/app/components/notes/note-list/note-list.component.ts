import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { Note } from '../../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Notes</h2>
        <a routerLink="/notes/new" class="btn btn-primary">Nouvelle Note</a>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let note of notes">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ note.title }}</h5>
              <p class="card-text">{{ note.content | slice:0:200 }}...</p>
              <p class="card-text">
                <small class="text-muted">Par {{ note.author }} - {{ note.createdAt | date }}</small>
              </p>
            </div>
            <div class="card-footer">
              <div class="btn-group w-100">
                <a [routerLink]="['/notes', note._id]" class="btn btn-outline-primary">Voir</a>
                <a [routerLink]="['/notes', note._id, 'edit']" class="btn btn-outline-secondary">Modifier</a>
                <button (click)="deleteNote(note._id!)" class="btn btn-outline-danger">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getAllNotes().subscribe(
      (notes) => {
        this.notes = notes;
      },
      (error) => {
        console.error('Error loading notes:', error);
      }
    );
  }

  deleteNote(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.noteService.deleteNote(id).subscribe(
        () => {
          this.notes = this.notes.filter(note => note._id !== id);
        },
        (error) => {
          console.error('Error deleting note:', error);
        }
      );
    }
  }
} 