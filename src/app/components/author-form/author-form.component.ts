import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit {
  authorForm: FormGroup;
  authorId: number | null = null;
  imageLoadError = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService
  ) {
    this.authorForm = this.fb.group({
      name: ['', Validators.required],
      biography: ['', Validators.required],
      photoUrl: ['']
    });
  }

  ngOnInit(): void {
    this.authorId = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id')! : null;
    if (this.authorId) {
      this.authorService.getAuthorById(this.authorId).subscribe({
        next: (author) => {
          this.authorForm.patchValue(author);
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'auteur :', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.authorForm.valid) {
      const authorData = this.authorForm.value;
      if (this.authorId) {
        // Mise à jour
        this.authorService.updateAuthor(this.authorId, authorData).subscribe({
          next: () => {
            this.router.navigate(['/ListAuthors']);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour :', err);
          }
        });
      } else {
        // Création
        this.authorService.createAuthor(authorData).subscribe({
          next: () => {
            this.router.navigate(['/ListAuthors']);
          },
          error: (err) => {
            console.error('Erreur lors de la création :', err);
          }
        });
      }
    }
  }

  onPhotoUrlChange(): void {
    this.imageLoadError = false; // Réinitialiser l'erreur lors d'un changement d'URL
  }

  onImageError(): void {
    this.imageLoadError = true; // Afficher un message d'erreur si l'image ne se charge pas
  }
}