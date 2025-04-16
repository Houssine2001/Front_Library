import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any = {};
  isParticipating: boolean = false;
  userId: string = '';
  userPhoneNumber: string = '';
  responseMessage: string = '';
  error: string = '';
  
  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails(eventId);
    // Removed checkParticipationStatus call
  }

  loadEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (data) => {
        this.event = data;
      },
      error: (error) => {
        console.error('Error fetching event:', error);
        this.error = 'Error loading event details';
      }
    });
  }

  // Removed checkParticipationStatus method

  registerForEvent(): void {
    // Removed isParticipating check since we're not checking for existing registration
    
    Swal.fire({
      title: 'Register for Event',
      html: `
        <div class="form-group">
          <label for="userName">Your Name</label>
          <input id="userName" class="swal2-input" placeholder="Enter your name">
        </div>
        <div class="form-group">
          <label for="userPhone">Phone Number</label>
          <input id="userPhone" class="swal2-input" placeholder="Enter your phone number">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Register',
      confirmButtonColor: '#6a11cb',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const userName = (document.getElementById('userName') as HTMLInputElement).value;
        const userPhone = (document.getElementById('userPhone') as HTMLInputElement).value;
        
        if (!userName || !userPhone) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        
        return { userId: userName, userPhoneNumber: userPhone };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.submitRegistration(this.event.id, result.value.userId, result.value.userPhoneNumber);
      }
    });
  }

  submitRegistration(eventId: number, userId: string, userPhoneNumber: string): void {
    this.eventService.reserveEvent(eventId, userId, userPhoneNumber).subscribe({
      next: (response) => {
        this.event.currentParticipants = response.currentParticipants;
        this.isParticipating = true; // Still set this flag for UI purposes
        
        Swal.fire({
          title: 'Registration Successful!',
          text: 'You have been registered for this event.',
          icon: 'success',
          confirmButtonColor: '#6a11cb'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Registration Failed',
          text: error.error?.message || 'Unable to register for this event',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}