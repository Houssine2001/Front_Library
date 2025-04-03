import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import introJs from 'intro.js';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  isAuthorManagementRoute = false;
  shouldStartTutorial = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEndEvent = event as NavigationEnd;
        this.isAuthorManagementRoute = navigationEndEvent.urlAfterRedirects === '/ListAuthors';
        console.log('Route active :', navigationEndEvent.urlAfterRedirects);
        console.log('isAuthorManagementRoute :', this.isAuthorManagementRoute);
        if (this.isAuthorManagementRoute) {
          this.shouldStartTutorial = true;
          // Lancer le tutoriel après que la vue est initialisée
          this.startTutorialIfReady();
        } else {
          this.shouldStartTutorial = false;
        }
      });
  }

  ngAfterViewInit(): void {
    // Lancer le tutoriel si la route est /ListAuthors
    this.startTutorialIfReady();
  }

  startTutorialIfReady(): void {
    if (this.shouldStartTutorial) {
      console.log('Lancement du tutoriel...');
      this.startTutorial();
    }
  }

  startTutorial(): void {
    const hasSeenTutorial = sessionStorage.getItem('hasSeenTutorial'); // Utiliser sessionStorage
    if (!hasSeenTutorial) {
      // Attendre un court délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        const intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: 'Bienvenue sur BookHaven ! Suivez ce tutoriel pour découvrir les fonctionnalités.'
            },
            {
              element: '.navbar',
              intro: 'Utilisez la barre de navigation pour explorer les livres ou gérer votre panier.'
            },
            {
              element: '.toolbar-actions',
              intro: 'Ici, vous pouvez exporter la liste des auteurs en CSV ou PDF, ou importer de nouveaux auteurs depuis un fichier CSV.'
            },
            {
              element: '.mat-table',
              intro: 'Cette table affiche la liste des auteurs. Vous pouvez modifier ou supprimer un auteur.'
            },
            {
              element: '.fab-button',
              intro: 'Cliquez sur ce bouton pour ajouter un nouvel auteur.'
            }
          ],
          showProgress: true,
          showBullets: true,
          exitOnOverlayClick: false,
          doneLabel: 'Terminer',
          nextLabel: 'Suivant',
          prevLabel: 'Précédent',
          skipLabel: 'Passer'
        });

        intro.oncomplete(() => {
          sessionStorage.setItem('hasSeenTutorial', 'true'); // Utiliser sessionStorage
        });

        intro.onexit(() => {
          sessionStorage.setItem('hasSeenTutorial', 'true'); // Utiliser sessionStorage
        });

        intro.start();
      }, 500); // Délai de 500ms pour s'assurer que le DOM est prêt
    }
  }
}