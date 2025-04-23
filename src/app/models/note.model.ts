export interface Note {
  _id?: string;
  title: string;
  content: string;
  author: string;
  createdAt?: Date;
  updatedAt?: Date;
  versions?: NoteVersion[];
}

export interface NoteVersion {
  _id?: string;
  content: string;
  createdAt: Date;
  author: string;
} 