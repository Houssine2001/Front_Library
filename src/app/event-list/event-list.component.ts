import { Component, OnInit } from '@angular/core';
import { EventService} from '../services/event.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Event } from '../models/Event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  showAddForm: boolean = false;
  showModifyForm: boolean = false;
  newEvent: Event = {
    id: 0,
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: 0,
    currentParticipants: 0
  };
  selectedEvent: Event | null = null;
  responseMessage: string = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load events. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  goToEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.showModifyForm = false;
    this.responseMessage = '';
    this.resetForm();
  }

  addEvent(): void {
    console.log('Sending event:', this.newEvent);
    this.eventService.addEvent(this.newEvent).subscribe({
      next: (response) => {
        // Remplacer le message texte par SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'Event added successfully!',
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#6a11cb',
          background: '#fff',
          iconColor: '#6a11cb',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        
        this.events.push(response);
        this.showAddForm = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Full error:', error);
        Swal.fire({
          title: 'Error!',
          text: `${error.status} - ${error.error?.message || 'Failed to add event'}`,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        this.responseMessage = `Error: ${error.status} - ${error.error?.message || 'Failed to add event'}`;
      }
    });
  }

  cancel(): void {
    this.showAddForm = false;
    this.showModifyForm = false;
    this.responseMessage = '';
    this.resetForm();
  }

  private resetForm(): void {
    this.newEvent = {
      id: 0,
      title: '',
      description: '',
      date: '',
      location: '',
      maxParticipants: 0,
      currentParticipants: 0
    };
    this.selectedEvent = null;
  }

  deleteEvent(eventId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this event?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6a11cb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            this.events = this.events.filter(event => event.id !== eventId);
            Swal.fire({
              title: 'Deleted!', 
              text: 'The event has been deleted.',
              icon: 'success',
              confirmButtonColor: '#6a11cb'
            });
          },
          error: (error) => {
            console.error('Delete error:', error);
            Swal.fire('Error!', 'Failed to delete the event has participants.', 'error');
          }
        });
      }
    });
  }

  modifyEvent(event: Event): void {
    this.selectedEvent = { ...event };
    this.showModifyForm = true;
    this.showAddForm = false;
    this.responseMessage = '';
  }

  updateEvent(): void {
    if (this.selectedEvent) {
      console.log('Updating event:', this.selectedEvent);
      this.eventService.updateEvent(this.selectedEvent).subscribe({
        next: (response) => {
          // Remplacer le message texte par SweetAlert
          Swal.fire({
            title: 'Success!',
            text: 'Event updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#6a11cb'
          });
          
          const index = this.events.findIndex(e => e.id === response.id);
          if (index !== -1) {
            this.events[index] = response;
          }
          this.showModifyForm = false;
          this.selectedEvent = null;
        },
        error: (error) => {
          console.error('Update error:', error);
          Swal.fire({
            title: 'Error!',
            text: `${error.status} - ${error.error?.message || 'Failed to update event'}`,
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
          this.responseMessage = `Error: ${error.status} - ${error.error?.message || 'Failed to update event'}`;
        }
      });
    }
  }
}