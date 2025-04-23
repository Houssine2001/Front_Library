import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Modal } from 'bootstrap';

interface Document {
  _id: string;
  title: string;
  content: string;
  bookId: string;
  ownerId: string;
  collaborators: Array<{
    userId: string;
    permission: 'read' | 'write' | 'admin';
  }>;
}

interface DocumentVersion {
  _id: string;
  documentId: string;
  version: number;
  content: string;
}

@Component({
  selector: 'app-collaborative-docs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Collaborative Documents</h2>
      
      <!-- Document Creation Form -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Create New Document</h5>
          <form (ngSubmit)="createDoc()">
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" [(ngModel)]="newDoc.title" name="title" required>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">Content</label>
              <textarea class="form-control" id="content" [(ngModel)]="newDoc.content" name="content" required></textarea>
            </div>
            <div class="mb-3">
              <label for="bookId" class="form-label">Book ID</label>
              <input type="text" class="form-control" id="bookId" [(ngModel)]="newDoc.bookId" name="bookId" required>
            </div>
            <div class="mb-3">
              <label for="collaborators" class="form-label">Collaborators (comma-separated user IDs)</label>
              <input type="text" class="form-control" id="collaborators" [(ngModel)]="newDoc.collaborators" name="collaborators">
            </div>
            <button type="submit" class="btn btn-primary">Create Document</button>
          </form>
        </div>
      </div>

      <!-- Documents List -->
      <div class="row">
        <div class="col-md-6 mb-4" *ngFor="let doc of docs">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{doc.title}}</h5>
              <p class="card-text">{{doc.content}}</p>
              <div class="mb-2">
                <small class="text-muted">Collaborators: {{doc.collaborators.length || 0}}</small>
              </div>
              <div class="btn-group">
                <button class="btn btn-sm btn-primary" (click)="editDoc(doc)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="deleteDoc(doc._id)">Delete</button>
                <button class="btn btn-sm btn-info" (click)="downloadPdf(doc._id)">Download PDF</button>
              </div>
              <div class="mt-2">
                <button class="btn btn-sm btn-outline-primary" (click)="showVersions(doc._id)">
                  View Versions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Versions Modal -->
      <div class="modal fade" id="versionsModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Document Versions</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div *ngFor="let version of versions" class="mb-2">
                <div class="card">
                  <div class="card-body">
                    <h6>Version {{version.version}}</h6>
                    <p class="small">{{version.content}}</p>
                    <button class="btn btn-sm btn-primary" (click)="restoreVersion(version)">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
    }
    .btn-group {
      margin-top: 1rem;
    }
  `]
})
export class CollaborativeDocsComponent implements OnInit {
  docs: Document[] = [];
  versions: DocumentVersion[] = [];
  newDoc: Partial<Document> = {
    title: '',
    content: '',
    bookId: '',
    ownerId: 'current-user-id', // TODO: Replace with actual user ID from auth service
    collaborators: []
  };
  private modal: Modal | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDocs();
  }

  loadDocs() {
    this.apiService.getDocs().subscribe({
      next: (data: Document[]) => this.docs = data,
      error: (error: Error) => console.error('Error loading documents:', error)
    });
  }

  createDoc() {
    if (!this.newDoc.ownerId) {
      console.error('Owner ID is required');
      return;
    }

    const collaboratorIds = (this.newDoc.collaborators as unknown as string)?.split(',') || [];
    const docData = {
      ...this.newDoc,
      collaborators: collaboratorIds.map((id: string) => ({
        userId: id.trim(),
        permission: 'read' as const
      }))
    };
    
    this.apiService.createDoc(docData).subscribe({
      next: (data: Document) => {
        this.docs.unshift(data);
        this.newDoc = {
          title: '',
          content: '',
          bookId: '',
          ownerId: 'current-user-id', // TODO: Replace with actual user ID from auth service
          collaborators: []
        };
      },
      error: (error: Error) => console.error('Error creating document:', error)
    });
  }

  editDoc(doc: Document) {
    // Implement edit functionality
    console.log('Edit document:', doc);
  }

  deleteDoc(id: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.apiService.deleteDoc(id).subscribe({
        next: () => {
          this.docs = this.docs.filter(doc => doc._id !== id);
        },
        error: (error: Error) => console.error('Error deleting document:', error)
      });
    }
  }

  showVersions(id: string) {
    this.apiService.getDocVersions(id).subscribe({
      next: (data: DocumentVersion[]) => {
        this.versions = data;
        const modalElement = document.getElementById('versionsModal');
        if (modalElement) {
          this.modal = new Modal(modalElement);
          this.modal.show();
        }
      },
      error: (error: Error) => console.error('Error loading versions:', error)
    });
  }

  restoreVersion(version: DocumentVersion) {
    this.apiService.restoreDocVersion(version.documentId, version._id).subscribe({
      next: (data: Document) => {
        const docIndex = this.docs.findIndex(d => d._id === version.documentId);
        if (docIndex !== -1) {
          this.docs[docIndex] = data;
        }
        if (this.modal) {
          this.modal.hide();
        }
      },
      error: (error: Error) => console.error('Error restoring version:', error)
    });
  }

  downloadPdf(id: string) {
    this.apiService.downloadDocPdf(id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `doc-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: Error) => console.error('Error downloading PDF:', error)
    });
  }
} 