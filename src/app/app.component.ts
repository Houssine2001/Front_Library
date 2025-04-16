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
  isEventListRoute = false;
  isEventDetailsRoute = false;
  shouldStartTutorial = false;
  currentRoute = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigationEndEvent = event as NavigationEnd;
        this.currentRoute = navigationEndEvent.urlAfterRedirects;
        this.isAuthorManagementRoute = this.currentRoute === '/ListAuthors';
        this.isEventListRoute = this.currentRoute === '/ListEvents';
        this.isEventDetailsRoute = this.currentRoute.startsWith('/event/');
        
        console.log('Route active :', this.currentRoute);
        
        if (this.isAuthorManagementRoute) {
          this.shouldStartTutorial = true;
          // Lancer le tutoriel après que la vue est initialisée
          this.startTutorialIfReady('author');
        } else if (this.isEventListRoute) {
          this.shouldStartTutorial = true;
          this.startTutorialIfReady('event-list');
        } else if (this.isEventDetailsRoute) {
          this.shouldStartTutorial = true;
          this.startTutorialIfReady('event-details');
        } else {
          this.shouldStartTutorial = false;
        }
      });
  }

  ngAfterViewInit(): void {
    // Lancer le tutoriel en fonction de la route actuelle
    if (this.isAuthorManagementRoute) {
      this.startTutorialIfReady('author');
    } else if (this.isEventListRoute) {
      this.startTutorialIfReady('event-list');
    } else if (this.isEventDetailsRoute) {
      this.startTutorialIfReady('event-details');
    }
  }

  startTutorialIfReady(tutorialType: string): void {
    if (this.shouldStartTutorial) {
      console.log(`Lancement du tutoriel ${tutorialType}...`);
      this.startTutorial(tutorialType);
    }
  }

  startTutorial(tutorialType: string): void {
    const tutorialKey = `hasSeenTutorial_${tutorialType}`;
    const hasSeenTutorial = sessionStorage.getItem(tutorialKey);
    
    if (!hasSeenTutorial) {
      // Attendre un court délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        const intro = introJs();
        
        switch(tutorialType) {
          case 'author':
            this.setAuthorTutorialSteps(intro);
            break;
          case 'event-list':
            this.setEventListTutorialSteps(intro);
            break;
          case 'event-details':
            this.setEventDetailsTutorialSteps(intro);
            break;
        }

        intro.oncomplete(() => {
          sessionStorage.setItem(tutorialKey, 'true');
        });

        intro.onexit(() => {
          sessionStorage.setItem(tutorialKey, 'true');
        });

        intro.start();
      }, 500);
    }
  }

  setAuthorTutorialSteps(intro: any): void {
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
  }

  setEventListTutorialSteps(intro: any): void {
    intro.setOptions({
      steps: [
        {
          intro: 'Bienvenue dans la gestion des événements ! Suivez ce tutoriel pour découvrir comment gérer les événements.'
        },
        {
          element: '.header',
          intro: 'Cet en-tête affiche le titre de la section et vous permet d\'ajouter de nouveaux événements.'
        },
        {
          element: '.add-button',
          intro: 'Cliquez sur ce bouton pour ajouter un nouvel événement.'
        },
        {
          element: '.event-cards',
          intro: 'Cette section affiche tous les événements à venir. Cliquez sur un événement pour voir ses détails.'
        },
        {
          element: '.event-card',
          intro: 'Chaque carte représente un événement avec son titre, sa date et son nombre maximum de participants.'
        },
        {
          element: '.card-actions',
          intro: 'Utilisez ces boutons pour modifier ou supprimer un événement.'
        },
        {
          element: '.modify-icon',
          intro: 'Cliquez sur ce crayon pour modifier les détails d\'un événement.'
        },
        {
          element: '.delete-icon',
          intro: 'Cliquez sur cette icône pour supprimer un événement. Une confirmation vous sera demandée.'
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
  }

  setEventDetailsTutorialSteps(intro: any): void {
    intro.setOptions({
      steps: [
        {
          intro: 'Bienvenue dans les détails de l\'événement ! Cette page vous présente toutes les informations sur l\'événement sélectionné.'
        },
        {
          element: '.back-btn',
          intro: 'Utilisez ce bouton pour revenir à la liste des événements.'
        },
        {
          element: '.event-header',
          intro: 'L\'en-tête affiche les informations principales : le titre, la date et le lieu de l\'événement.'
        },
        {
          element: '.event-description',
          intro: 'Cette section présente la description détaillée de l\'événement.'
        },
        {
          element: '.event-meta',
          intro: 'Ces statistiques montrent le nombre maximum de participants, les participants actuels et les places disponibles.'
        },
        {
          element: '.participation-status',
          intro: 'Cette barre d\'état indique si l\'événement est complet, presque complet ou s\'il reste beaucoup de places.'
        },
        {
          element: '.participate-btn',
          intro: 'Cliquez sur ce bouton pour vous inscrire à l\'événement. Un formulaire s\'ouvrira pour saisir vos coordonnées.'
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
  }
}