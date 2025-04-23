export interface CollaborativeDoc {
  _id?: string;
  title: string;
  content: string;
  author: string;
  collaborators: string[];
  createdAt?: Date;
  updatedAt?: Date;
  versions?: DocVersion[];
}

export interface DocVersion {
  _id?: string;
  content: string;
  createdAt: Date;
  author: string;
} 