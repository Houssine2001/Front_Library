import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  paymentStatus: string | null = null;
  orderStatus: string = 'Chargement...';
  orderId: number = 0;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        
        if (!id || isNaN(+id)) {
          this.router.navigate(['/error'], { 
            state: { error: 'ID de commande invalide' } 
          });
          return throwError(() => new Error('ID invalide'));
        }
        
        this.orderId = +id;
        return this.orderService.getOrderStatus(this.orderId);
      })
    ).subscribe({
      next: status => this.orderStatus = status,
      error: () => this.router.navigate(['/books'])
    });
  
    // Gestion du statut de paiement
    this.route.queryParamMap.subscribe(params => {
      this.paymentStatus = params.get('payment');
    });
  }

 
  private loadOrderStatus(): void {
    this.orderService.getOrderStatus(this.orderId).subscribe(
      status => this.orderStatus = status,
      error => {
        console.error('Erreur:', error);
        this.router.navigate(['/books']);
      }
    );
  }

  downloadInvoice(): void {
    this.orderService.downloadInvoice(this.orderId).subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture_commande_${this.orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Erreur de téléchargement:', error);
        alert('Échec du téléchargement de la facture');
      }
    });
  }

  cancelOrder(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande?')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: (response) => {
          // response est maintenant une chaîne de caractères
          alert(response); // ou utilisez un toast/notification plus élégant
          this.orderStatus = 'CANCELLED'; // Mettre à jour le statut côté client
        },
        error: (error) => {
          console.error('Erreur d\'annulation:', error);
          alert('Une erreur est survenue lors de l\'annulation de la commande.');
        }
      });
    }
  }
}