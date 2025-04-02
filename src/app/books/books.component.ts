import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../models/Book';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  displayedColumns: string[] = ['title', 'author', 'genre', 'isbn', 'price', 'quantity', 'actions'];
  books: Book[] = [];
  sortDirection = 'asc';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  newBook: Book = {
    id: null,
    title: '',
    author: '',
    genre: '',
    isbn: '',
    description: '',
    price: 0,
    quantity: 0
  };

  constructor(
    private bookService: BookService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooksSortedByPrice(this.sortDirection, this.minPrice, this.maxPrice).subscribe(
      (data) => this.books = data,
      (error) => this.showError('Error loading books')
    );
  }

  applySortAndFilter(): void {
    this.loadBooks();
  }

  addBook(): void {
    this.bookService.createBook(this.newBook).subscribe(
      () => {
        this.loadBooks();
        this.snackBar.open('Book added - Email sent to users', 'Close', { duration: 3000 });
        this.resetNewBook();
      },
      (error) => this.showError('Error adding book')
    );
  }

  editBook(id: number): void {
    this.router.navigate(['/edit-book', id]);
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(
        () => {
          this.loadBooks();
          this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
        },
        (error) => this.showError('Error deleting book')
      );
    }
  }

  private resetNewBook(): void {
    this.newBook = {
      id: null,
      title: '',
      author: '',
      genre: '',
      isbn: '',
      description: '',
      price: 0,
      quantity: 0
    };
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}