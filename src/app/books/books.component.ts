import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book } from '../models/Book';
import { CartService } from '../services/cart.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(private bookService: BookService, private cartService: CartService) { }

  ngOnInit(): void {
    this.loadBooks();
  }
  
  loadBooks(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.bookService.getBooks().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(
      books => {
        console.log('Livres récupérés depuis l\'API:', books);
        this.books = books;
      },
      error => {
        console.error('Erreur lors de la récupération des livres:', error);
        this.errorMessage = 'Impossible de charger les livres. Veuillez réessayer plus tard.';
      }
    );
  }

  addToCart(bookId: number): void {
    // Using a default userId of 1 for demonstration
    const userId = 1;
    const quantity = 1;
    
    this.cartService.addToCart(userId, bookId, quantity).subscribe(
      response => {
        console.log('Livre ajouté au panier:', response);
        // You could show a success notification here
      },
      error => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        // You could show an error notification here
      }
    );
  }
}