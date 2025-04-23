import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h3>Comments</h3>
      
      <!-- Comment Creation Form -->
      <div class="card mb-4">
        <div class="card-body">
          <form (ngSubmit)="createComment()">
            <div class="mb-3">
              <label for="content" class="form-label">Add a comment</label>
              <textarea class="form-control" id="content" [(ngModel)]="newComment.content" name="content" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post Comment</button>
          </form>
        </div>
      </div>

      <!-- Comments List -->
      <div class="comments-list">
        <div *ngFor="let comment of comments" class="card mb-3">
          <div class="card-body">
            <p class="card-text">{{comment.content}}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">Posted by User {{comment.userId}}</small>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" (click)="likeComment(comment._id)">
                  Like ({{comment.likes || 0}})
                </button>
                <button class="btn btn-sm btn-outline-secondary" (click)="showReplyForm(comment)">
                  Reply
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deleteComment(comment._id)">
                  Delete
                </button>
              </div>
            </div>

            <!-- Reply Form -->
            <div *ngIf="comment.showReplyForm" class="mt-3">
              <form (ngSubmit)="createReply(comment)">
                <div class="mb-3">
                  <textarea class="form-control" [(ngModel)]="newReply.content" name="content" required></textarea>
                </div>
                <button type="submit" class="btn btn-sm btn-primary">Post Reply</button>
                <button type="button" class="btn btn-sm btn-secondary" (click)="cancelReply(comment)">Cancel</button>
              </form>
            </div>

            <!-- Replies -->
            <div *ngIf="comment.replies?.length" class="mt-3 ms-4">
              <div *ngFor="let reply of comment.replies" class="card mb-2">
                <div class="card-body">
                  <p class="card-text">{{reply.content}}</p>
                  <small class="text-muted">Replied by User {{reply.userId}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .comments-list {
      max-width: 800px;
    }
    .card {
      margin-bottom: 1rem;
    }
    .btn-group {
      margin-top: 1rem;
    }
  `]
})
export class CommentsComponent implements OnInit {
  @Input() documentId!: string;
  @Input() documentType!: string;

  comments: any[] = [];
  newComment: any = {
    content: '',
    documentId: '',
    documentType: '',
    userId: '1' // This should come from your auth service
  };
  newReply: any = {
    content: '',
    documentId: '',
    documentType: '',
    userId: '1', // This should come from your auth service
    parentId: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.apiService.getComments(this.documentType, this.documentId).subscribe({
      next: (data) => {
        this.comments = data.map((comment: any) => ({
          ...comment,
          showReplyForm: false
        }));
      },
      error: (error) => console.error('Error loading comments:', error)
    });
  }

  createComment() {
    const commentData = {
      ...this.newComment,
      documentId: this.documentId,
      documentType: this.documentType
    };

    this.apiService.createComment(commentData).subscribe({
      next: (data) => {
        this.comments.unshift({...data, showReplyForm: false});
        this.newComment.content = '';
      },
      error: (error) => console.error('Error creating comment:', error)
    });
  }

  showReplyForm(comment: any) {
    comment.showReplyForm = true;
    this.newReply.parentId = comment._id;
  }

  cancelReply(comment: any) {
    comment.showReplyForm = false;
    this.newReply = {
      content: '',
      documentId: this.documentId,
      documentType: this.documentType,
      userId: '1',
      parentId: ''
    };
  }

  createReply(comment: any) {
    const replyData = {
      ...this.newReply,
      documentId: this.documentId,
      documentType: this.documentType
    };

    this.apiService.createComment(replyData).subscribe({
      next: (data) => {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(data);
        comment.showReplyForm = false;
        this.newReply = {
          content: '',
          documentId: this.documentId,
          documentType: this.documentType,
          userId: '1',
          parentId: ''
        };
      },
      error: (error) => console.error('Error creating reply:', error)
    });
  }

  likeComment(id: string) {
    this.apiService.likeComment(id).subscribe({
      next: (data) => {
        const comment = this.comments.find(c => c._id === id);
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
        }
      },
      error: (error) => console.error('Error liking comment:', error)
    });
  }

  deleteComment(id: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.apiService.deleteComment(id).subscribe({
        next: () => {
          this.comments = this.comments.filter(comment => comment._id !== id);
        },
        error: (error) => console.error('Error deleting comment:', error)
      });
    }
  }
} 