import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  selectedBook: Book | null = null;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe(
      (books) => {
        this.books = books;
      },
      (error) => {
        console.error('Error loading books:', error);
      }
    );
  }

  selectBook(book: Book): void {
    this.selectedBook = book;
  }

  deleteBook(id: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(
        () => {
          this.books = this.books.filter(book => book._id !== id);
          if (this.selectedBook?._id === id) {
            this.selectedBook = null;
          }
        },
        (error) => {
          console.error('Error deleting book:', error);
        }
      );
    }
  }
} 