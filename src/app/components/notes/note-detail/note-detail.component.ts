import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../../services/note.service';
import { CommentService } from '../../../services/comment.service';
import { Note } from '../../../models/note.model';
import { Comment } from '../../../models/comment.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container" *ngIf="note">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>{{ note.title }}</h2>
        <div class="btn-group">
          <button class="btn btn-primary" [routerLink]="['/notes', note._id, 'edit']">Modifier</button>
          <button class="btn btn-danger" (click)="deleteNote()">Supprimer</button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <p class="card-text">{{ note.content }}</p>
          <div class="text-muted">
            <small>Par {{ note.author }} - {{ note.createdAt | date:'medium' }}</small>
          </div>
        </div>
      </div>

      <!-- Section des commentaires -->
      <div class="comments-section">
        <h3>Commentaires</h3>
        
        <!-- Formulaire de commentaire -->
        <form [formGroup]="commentForm" (ngSubmit)="submitComment()" class="mb-4">
          <div class="mb-3">
            <textarea 
              class="form-control" 
              formControlName="content" 
              rows="3" 
              placeholder="Ajouter un commentaire..."></textarea>
          </div>
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="commentForm.invalid">
            Commenter
          </button>
        </form>

        <!-- Liste des commentaires -->
        <div class="comments-list">
          <div *ngFor="let comment of comments" class="card mb-3">
            <div class="card-body">
              <p class="card-text">{{ comment.content }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  Par {{ comment.author }} - {{ comment.createdAt | date:'medium' }}
                </small>
                <div class="btn-group">
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    (click)="likeComment(comment._id!)"
                    [disabled]="!comment._id">
                    👍 {{ comment.likes }}
                  </button>
                  <button 
                    *ngIf="comment.author === currentUser"
                    class="btn btn-sm btn-outline-danger"
                    (click)="deleteComment(comment._id!)"
                    [disabled]="!comment._id">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NoteDetailComponent implements OnInit {
  note: Note | null = null;
  comments: Comment[] = [];
  commentForm: FormGroup;
  currentUser = 'User'; // À remplacer par l'utilisateur authentifié

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (noteId) {
      this.loadNote(noteId);
      this.loadComments(noteId);
    }
  }

  loadNote(id: string): void {
    this.noteService.getNoteById(id).subscribe(
      (note) => {
        this.note = note;
      },
      (error) => {
        console.error('Error loading note:', error);
      }
    );
  }

  loadComments(noteId: string): void {
    this.commentService.getCommentsByDocument('note', noteId).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  deleteNote(): void {
    if (!this.note?._id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      this.noteService.deleteNote(this.note._id).subscribe(
        () => {
          this.router.navigate(['/notes']);
        },
        (error) => {
          console.error('Error deleting note:', error);
        }
      );
    }
  }

  submitComment(): void {
    if (this.commentForm.valid && this.note?._id) {
      const commentData = {
        ...this.commentForm.value,
        author: this.currentUser,
        documentType: 'note',
        documentId: this.note._id
      };

      this.commentService.createComment(commentData).subscribe(
        (newComment) => {
          this.comments.unshift(newComment);
          this.commentForm.reset();
        },
        (error) => {
          console.error('Error creating comment:', error);
        }
      );
    }
  }

  likeComment(commentId: string): void {
    this.commentService.likeComment(commentId).subscribe(
      () => {
        const comment = this.comments.find(c => c._id === commentId);
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
        }
      },
      (error) => {
        console.error('Error liking comment:', error);
      }
    );
  }

  deleteComment(commentId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.commentService.deleteComment(commentId).subscribe(
        () => {
          this.comments = this.comments.filter(c => c._id !== commentId);
        },
        (error) => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }
} 