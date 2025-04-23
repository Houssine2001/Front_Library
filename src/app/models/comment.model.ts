export interface Comment {
  _id?: string;
  content: string;
  author: string;
  documentType: 'note' | 'summary' | 'doc';
  documentId: string;
  parentId?: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
  replies?: Comment[];
} 