import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      description: [''],
      publishedYear: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      available: [true]
    });
  }

  ngOnInit(): void {
    if (this.book) {
      this.bookForm.patchValue(this.book);
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;
      
      if (this.book?._id) {
        this.bookService.updateBook(this.book._id, bookData).subscribe(
          () => {
            alert('Book updated successfully!');
          },
          (error) => {
            console.error('Error updating book:', error);
          }
        );
      } else {
        this.bookService.createBook(bookData).subscribe(
          () => {
            alert('Book created successfully!');
            this.bookForm.reset();
          },
          (error) => {
            console.error('Error creating book:', error);
          }
        );
      }
    }
  }
} 