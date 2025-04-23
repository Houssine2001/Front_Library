import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryService } from '../../../services/summary.service';
import { Summary } from '../../../models/summary.model';

@Component({
  selector: 'app-summary-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Résumés</h2>
        <a routerLink="/summaries/new" class="btn btn-primary">Nouveau Résumé</a>
      </div>

      <div class="row">
        <div class="col-md-4 mb-4" *ngFor="let summary of summaries">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ summary.title }}</h5>
              <p class="card-text">{{ summary.content | slice:0:200 }}...</p>
              <p class="card-text">
                <small class="text-muted">
                  Par {{ summary.author }} - {{ summary.createdAt | date }}
                </small>
              </p>
              <p class="card-text">
                <small class="text-muted">
                  👍 {{ summary.likes }}
                </small>
              </p>
            </div>
            <div class="card-footer">
              <div class="btn-group w-100">
                <a [routerLink]="['/summaries', summary._id]" class="btn btn-outline-primary">Voir</a>
                <a [routerLink]="['/summaries', summary._id, 'edit']" class="btn btn-outline-secondary">Modifier</a>
                <button (click)="deleteSummary(summary._id!)" class="btn btn-outline-danger" [disabled]="!summary._id">Supprimer</button>
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
export class SummaryListComponent implements OnInit {
  summaries: Summary[] = [];

  constructor(private summaryService: SummaryService) {}

  ngOnInit(): void {
    this.loadSummaries();
  }

  loadSummaries(): void {
    this.summaryService.getAllSummaries().subscribe(
      (summaries) => {
        this.summaries = summaries;
      },
      (error) => {
        console.error('Error loading summaries:', error);
      }
    );
  }

  deleteSummary(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce résumé ?')) {
      this.summaryService.deleteSummary(id).subscribe(
        () => {
          this.summaries = this.summaries.filter(summary => summary._id !== id);
        },
        (error) => {
          console.error('Error deleting summary:', error);
        }
      );
    }
  }
} 