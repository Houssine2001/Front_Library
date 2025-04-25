import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quote } from "../models/Quote";
import { QuoteService } from "../services/QuotesService/quotes.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  showModal: boolean = false;
  quoteForm: FormGroup;
  responseMessage: string = '';
  userId: number = 1; // You might want to get this from auth service
  isGenerateMode: boolean = false;

  constructor(private quoteService: QuoteService, private fb: FormBuilder) {
    this.quoteForm = this.fb.group({
      text: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(category?: string): void {
    this.quoteService.getAllQuotes(category).subscribe({
      next: (data) => {
        this.quotes = data;
      },
      error: (error) => {
        console.error('Error fetching quotes:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load quotes. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  toggleModal(isGenerateMode: boolean = false): void {
    this.showModal = !this.showModal;
    this.isGenerateMode = isGenerateMode;
    this.responseMessage = '';
    if (!this.showModal) {
      this.resetForm();
    } else if (isGenerateMode) {
      this.fetchRandomQuote();
    }
  }

  fetchRandomQuote(): void {
    this.quoteService.getRandomQuote().subscribe({
      next: (quote) => {
        this.quoteForm.patchValue({
          text: quote.text,
          author: quote.author,
          category: quote.category
        });
      },
      error: (error) => {
        console.error('Error fetching random quote:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch random quote. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  addQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const newQuote: Quote = this.quoteForm.value;
    this.quoteService.addQuote(newQuote, this.userId).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Quote added successfully!',
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#6a11cb',
          background: '#fff',
          iconColor: '#6a11cb',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        this.quotes.push(response);
        this.showModal = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Full error:', error);
        Swal.fire({
          title: 'Error!',
          text: `${error.status} - ${error.error?.message || 'Failed to add quote'}`,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        this.responseMessage = `Error: ${error.status} - ${error.error?.message || 'Failed to add quote'}`;
      }
    });
  }

  deleteQuote(quoteId: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this quote?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6a11cb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.quoteService.deleteQuote(quoteId).subscribe({
          next: () => {
            this.quotes = this.quotes.filter(quote => quote.id !== quoteId);
            Swal.fire({
              title: 'Deleted!',
              text: 'The quote has been deleted.',
              icon: 'success',
              confirmButtonColor: '#6a11cb'
            });
          },
          error: (error) => {
            console.error('Delete error:', error);
            Swal.fire('Error!', 'Failed to delete the quote.', 'error');
          }
        });
      }
    });
  }

  cancel(): void {
    this.showModal = false;
    this.responseMessage = '';
    this.resetForm();
  }

  private resetForm(): void {
    this.quoteForm.reset({
      text: '',
      author: '',
      category: ''
    });
    this.isGenerateMode = false;
  }
}
