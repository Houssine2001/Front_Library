import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Order } from '../models/order';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  promoCode: string = '';

  // Structure correcte pour stocker les détails du total
  total: { subtotal: number; tax: number; shipping: number; total: number } = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  };

  // Structure pour stocker les détails des articles du panier
  itemsWithDetails: any[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    const userId = 1; // Remplacez par l'ID réel de l'utilisateur

    // Récupérer les articles du panier
    this.cartService.getCart(userId).subscribe(response => {
      console.log('Cart Items:', response);
      this.cartItems = Array.isArray(response) ? response : [];
    });

    // Récupérer le total du panier
  // Remplacez cette partie dans ngOnInit et dans les autres abonnements
this.cartService.calculateTotal(userId).subscribe(response => {
  console.log('Cart Total:', response);
  this.total = {
    subtotal: response.subtotal,
    tax: response.tax,
    shipping: response.shipping,
    total: response.total
  };
  this.itemsWithDetails = response.items || [];
});
  }

  increaseQuantity(item: any): void {
    const newQuantity = item.quantity + 1;
    this.updateCartItem(item.bookId, newQuantity);
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.updateCartItem(item.bookId, newQuantity);
    }
  }

  updateCartItem(bookId: number, quantity: number): void {
    const userId = 1;
    this.cartService.updateQuantity(userId, bookId, quantity).subscribe(() => {
        this.cartService.calculateTotal(userId).subscribe(response => {
            console.log('Updated total:', response);
            this.total = {
                subtotal: response.subtotal || 0,
                tax: response.tax || 0,
                shipping: response.shipping || 0,
                total: response.total || 0
            };
            this.itemsWithDetails = response.items || [];
        });
    });
}


  removeFromCart(bookId: number): void {
    const userId = 1;
    if (!bookId) {
      console.error('Book ID is required');
      return;
    }
    this.cartService.removeItemFromCart(userId, bookId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.book.id !== bookId);
      this.cartService.calculateTotal(userId).subscribe(response => {
        this.total = typeof response.total === 'object' ? response.total : { subtotal: 0, tax: 0, shipping: 0, total: 0 };
        this.itemsWithDetails = response.items || [];
      });
    }, error => {
      console.error('Error removing item from cart:', error);
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.total = { subtotal: 0, tax: 0, shipping: 0, total: 0 };
      this.itemsWithDetails = [];
    });
  }

  applyDiscount(): void {
    const userId = 1;
    this.cartService.applyDiscount(userId, this.promoCode).subscribe(
      (response) => {
        console.log('Total après réduction:', response);
        if (response && response.subtotal !== undefined && response.total !== undefined) {
          this.total = {
            subtotal: response.subtotal,
            tax: response.tax,
            shipping: response.shipping,
            total: response.total
          };
          this.itemsWithDetails = response.items || [];
          this.cdr.detectChanges(); // Force change detection
        } else {
          console.error('Invalid response from server:', response);
        }
      },
      (error) => {
        console.error('Erreur lors de l’application du code promo:', error);
      }
    );
  }
  

  placeOrder(): void {
    const userId = 1; // L'ID de l'utilisateur
    this.orderService.placeOrder(userId).subscribe(
      (response: any) => {
        if (response.sessionUrl) {
          // Rediriger l'utilisateur vers l'URL de la session Stripe pour effectuer le paiement
          window.location.href = response.sessionUrl;
        } else {
          console.error('Erreur lors de la création de la session Stripe');
        }
      },
      error => {
        console.error('Error placing order:', error);
      }
    );
}


}
