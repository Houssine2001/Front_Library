import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'biography', 'actions'];
  dataSource = new MatTableDataSource<Author>();

  constructor(private authorService: AuthorService) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAllAuthors().subscribe({
      next: (authors) => {
        console.log('Auteurs récupérés :', authors);
        this.dataSource.data = authors;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des auteurs :', err);
      }
    });
  }

  deleteAuthor(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet auteur ?')) {
      this.authorService.deleteAuthor(id).subscribe(() => {
        this.loadAuthors();
      });
    }
  }
}