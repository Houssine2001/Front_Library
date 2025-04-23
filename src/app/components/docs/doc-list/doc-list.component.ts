import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CollaborativeDocService } from '../../../services/collaborative-doc.service';
import { CollaborativeDoc } from '../../../models/collaborative-doc.model';

@Component({
  selector: 'app-doc-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Documents Collaboratifs</h2>
        <a routerLink="/docs/new" class="btn btn-primary">Nouveau Document</a>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let doc of docs">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ doc.title }}</h5>
              <p class="card-text">{{ doc.content | slice:0:200 }}...</p>
              <p class="card-text">
                <small class="text-muted">
                  Par {{ doc.author }} - {{ doc.createdAt | date }}
                </small>
              </p>
              <p class="card-text">
                <small class="text-muted">
                  {{ doc.collaborators.length }} collaborateur(s)
                </small>
              </p>
            </div>
            <div class="card-footer">
              <div class="btn-group w-100">
                <a [routerLink]="['/docs', doc._id]" class="btn btn-outline-primary">Voir</a>
                <a [routerLink]="['/docs', doc._id, 'edit']" class="btn btn-outline-secondary">Modifier</a>
                <button (click)="deleteDoc(doc._id!)" class="btn btn-outline-danger" [disabled]="!doc._id">Supprimer</button>
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
export class DocListComponent implements OnInit {
  docs: CollaborativeDoc[] = [];

  constructor(private docService: CollaborativeDocService) {}

  ngOnInit(): void {
    this.loadDocs();
  }

  loadDocs(): void {
    this.docService.getAllDocs().subscribe(
      (docs) => {
        this.docs = docs;
      },
      (error) => {
        console.error('Error loading docs:', error);
      }
    );
  }

  deleteDoc(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.docService.deleteDoc(id).subscribe(
        () => {
          this.docs = this.docs.filter(doc => doc._id !== id);
        },
        (error) => {
          console.error('Error deleting doc:', error);
        }
      );
    }
  }
} 