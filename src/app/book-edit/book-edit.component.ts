import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book } from '../models/Book';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  book: Book = {
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
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(+id).subscribe(
        (data) => this.book = data,
        (error) => this.showError('Error loading book')
      );
    }
  }

  updateBook(): void {
    if (this.book.id === null) {
      this.showError('Invalid book id');
      return;
    }
  
    // Validate ISBN: must contain exactly 13 digits.
    if (!/^\d{13}$/.test(this.book.isbn)) {
      this.showError("L'ISBN doit contenir 13 chiffres");
      return;
    }
  
    this.bookService.updateBook(this.book.id, this.book).subscribe(
      () => {
        this.router.navigate(['/books']);
        this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
      },
      (error) => this.showError('Error updating book')
    );
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}