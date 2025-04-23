export interface Summary {
  _id?: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
  versions?: SummaryVersion[];
}

export interface SummaryVersion {
  _id?: string;
  content: string;
  createdAt: Date;
  author: string;
} 