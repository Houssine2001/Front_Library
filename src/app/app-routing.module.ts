import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderCancelComponent } from './order-cancel-component/order-cancel-component.component';  // Ajoute l'import
import { AuthorListComponent } from './components/author-list/author-list.component';
import { AuthorFormComponent } from './components/author-form/author-form.component';
import { BookEditComponent } from './book-edit/book-edit.component'; // Ajoute l'import
import { BookComponent } from './book/book.component';
import { EventListComponent } from './event-list/event-list.component'; // Add this import
import { EventDetailsComponent } from './event-details/event-details.component';
import {QuotesComponent} from "./quotes/quotes.component"; // Add this import
const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'order/:id', component: OrderComponent },
  { path: 'books', component: BooksComponent },
  { path: 'QuotesList', component: QuotesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-cancel', component: OrderCancelComponent },
  { path: 'create', component: AuthorFormComponent },
  { path: 'edit/:id', component: AuthorFormComponent },
  { path: 'ListAuthors', component: AuthorListComponent },
  { path: 'edit-book/:id', component: BookEditComponent },
  { path: 'book', component: BookComponent },
  { path: 'ListEvents', component: EventListComponent },
  { path: 'event/:id', component: EventDetailsComponent }
  // Ajoute cette route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
