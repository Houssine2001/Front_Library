import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/summary.model';

@Component({
  selector: 'app-summaries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summaries.component.html',
  styleUrls: ['./summaries.component.css']
})
export class SummariesComponent implements OnInit {
  summaries: Summary[] = [];
  newSummary: Partial<Summary> = {
    title: '',
    content: '',
    author: '',
    likes: 0
  };

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

  createSummary(): void {
    if (this.newSummary.title && this.newSummary.content && this.newSummary.author) {
      this.summaryService.createSummary(this.newSummary as Summary).subscribe(
        (summary) => {
          this.summaries.unshift(summary);
          this.newSummary = {
            title: '',
            content: '',
            author: '',
            likes: 0
          };
        },
        (error) => {
          console.error('Error creating summary:', error);
        }
      );
    }
  }
} 