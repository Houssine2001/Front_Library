import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborativeDocService } from '../../../services/collaborative-doc.service';
import { CommentService } from '../../../services/comment.service';
import { CollaborativeDoc, DocVersion } from '../../../models/collaborative-doc.model';
import { Comment } from '../../../models/comment.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container" *ngIf="doc">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>{{ doc.title }}</h2>
        <div class="btn-group">
          <button class="btn btn-primary" [routerLink]="['/docs', doc._id, 'edit']">Modifier</button>
          <button class="btn btn-danger" (click)="deleteDoc()">Supprimer</button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <p class="card-text">{{ doc.content }}</p>
          <div class="text-muted">
            <small>Par {{ doc.author }} - {{ doc.createdAt | date:'medium' }}</small>
          </div>
          <hr>
          <div class="collaborators">
            <h6>Collaborateurs :</h6>
            <div class="d-flex gap-2 flex-wrap">
              <span class="badge bg-primary" *ngFor="let collaborator of doc.collaborators">
                {{ collaborator }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des versions -->
      <div class="versions-section mb-4">
        <h3>Versions</h3>
        <div class="list-group">
          <div *ngFor="let version of versions" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">Version du {{ version.createdAt | date:'medium' }}</h6>
                <p class="mb-1">Par {{ version.author }}</p>
              </div>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" (click)="viewVersion(version)">
                  Voir
                </button>
                <button class="btn btn-sm btn-outline-secondary" (click)="restoreVersion(version._id!)" [disabled]="!version._id">
                  Restaurer
                </button>
              </div>
            </div>
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
export class DocDetailComponent implements OnInit {
  doc: CollaborativeDoc | null = null;
  versions: DocVersion[] = [];
  comments: Comment[] = [];
  commentForm: FormGroup;
  currentUser = 'User'; // À remplacer par l'utilisateur authentifié

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private docService: CollaborativeDocService,
    private commentService: CommentService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id');
    if (docId) {
      this.loadDoc(docId);
      this.loadVersions(docId);
      this.loadComments(docId);
    }
  }

  loadDoc(id: string): void {
    this.docService.getDocById(id).subscribe(
      (doc) => {
        this.doc = doc;
      },
      (error) => {
        console.error('Error loading doc:', error);
      }
    );
  }

  loadVersions(docId: string): void {
    this.docService.getDocVersions(docId).subscribe(
      (versions) => {
        this.versions = versions;
      },
      (error) => {
        console.error('Error loading versions:', error);
      }
    );
  }

  loadComments(docId: string): void {
    this.commentService.getCommentsByDocument('doc', docId).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  deleteDoc(): void {
    if (!this.doc?._id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.docService.deleteDoc(this.doc._id).subscribe(
        () => {
          this.router.navigate(['/docs']);
        },
        (error) => {
          console.error('Error deleting doc:', error);
        }
      );
    }
  }

  viewVersion(version: DocVersion): void {
    // Afficher le contenu de la version dans une modale ou un panneau
    console.log('Version content:', version.content);
  }

  restoreVersion(versionId: string): void {
    if (!this.doc?._id) return;

    if (confirm('Êtes-vous sûr de vouloir restaurer cette version ?')) {
      this.docService.restoreDocVersion(this.doc._id, versionId).subscribe(
        (updatedDoc) => {
          this.doc = updatedDoc;
        },
        (error) => {
          console.error('Error restoring version:', error);
        }
      );
    }
  }

  submitComment(): void {
    if (this.commentForm.valid && this.doc?._id) {
      const commentData = {
        ...this.commentForm.value,
        author: this.currentUser,
        documentType: 'doc',
        documentId: this.doc._id
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