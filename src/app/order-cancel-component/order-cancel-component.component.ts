import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-cancel',
  templateUrl: './order-cancel-component.component.html',
  styleUrls: ['./order-cancel-component.component.css']
})
export class OrderCancelComponent {
  constructor(private router: Router) {}

  retryPayment(): void {
    // Redirige l'utilisateur vers la page du panier
    this.router.navigate(['/cart']);
  }
  
  navigateToBooks(): void {
    // Redirige l'utilisateur vers la page des livres
    this.router.navigate(['/books']);
  }
}