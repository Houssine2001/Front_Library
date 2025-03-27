import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  mobileMenuOpen = false;
  cartItemCount = 0;
  
  constructor(private cartService: CartService) {}
  
  ngOnInit(): void {
    // Uncomment this when you're ready to display the cart item count
    // this.updateCartItemCount();
  }
  
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
  
  // Uncomment and implement this method when you're ready to display the cart item count
  // updateCartItemCount(): void {
  //   const userId = 1; // Replace with your authentication logic when implemented
  //   this.cartService.getCart(userId).subscribe(items => {
  //     this.cartItemCount = items.length;
  //   });
  // }
}