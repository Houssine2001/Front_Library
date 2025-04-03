import { Component } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-author-import-export',
  templateUrl: './author-import-export.component.html',
  styleUrls: ['./author-import-export.component.css']
})
export class AuthorImportExportComponent {

  constructor(private authorService: AuthorService) { }

  // Exporter en CSV
  exportToCSV(): void {
    this.authorService.exportToCSV().subscribe({
      next: (blob) => {
        saveAs(blob, 'authors.csv');
      },
      error: (err) => {
        console.error('Erreur lors de l\'exportation CSV :', err);
      }
    });
  }

  // Exporter en PDF
  exportToPDF(): void {
    this.authorService.exportToPDF().subscribe({
      next: (blob) => {
        saveAs(blob, 'authors.pdf');
      },
      error: (err) => {
        console.error('Erreur lors de l\'exportation PDF :', err);
      }
    });
  }

  // Importer depuis CSV
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = reader.result as string;
        this.authorService.importFromCSV(csvData).subscribe({
          next: () => {
            alert('Importation réussie !');
            // Recharger la liste des auteurs si nécessaire
            window.location.reload(); // Simple rechargement pour l'instant
          },
          error: (err) => {
            console.error('Erreur lors de l\'importation CSV :', err);
            alert('Erreur lors de l\'importation : ' + err.message);
          }
        });
      };
      reader.readAsText(file);
    }
  }
}