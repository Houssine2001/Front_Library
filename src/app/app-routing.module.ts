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

const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'order/:id', component: OrderComponent },
  { path: 'books', component: BooksComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order-cancel', component: OrderCancelComponent }, 
  { path: 'create', component: AuthorFormComponent },
  { path: 'edit/:id', component: AuthorFormComponent },
  { path: 'ListAuthors', component: AuthorListComponent }, 
  { path: 'edit-book/:id', component: BookEditComponent },
  { path: 'book', component: BookComponent },
  // Ajoute cette route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
