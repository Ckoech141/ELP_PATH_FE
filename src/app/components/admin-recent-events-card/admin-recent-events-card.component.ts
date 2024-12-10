import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ViewEventInforComponent } from '../view-event-infor/view-event-infor.component';

@Component({
  selector: 'app-admin-recent-events-card',
  standalone:false,
  templateUrl: './admin-recent-events-card.component.html',
  styleUrl: './admin-recent-events-card.component.scss'
})
export class AdminRecentEventsCardComponent {

  eventsCount: number = 0;
  currentDate: any;
  events: any[] = []; // Array to store fetched events
  error: string = ''; // To store any error message
  allEventsDisplayed: boolean = false; // Flag to track if all events are displayed


  constructor(public http: HttpServiceService, private dialog: MatDialog) {
    this.getCurrentDate();
  }

  ngOnInit() {
    this.getEventsCount();
    this.getEvents(); // Call getEvents on initialization as well
  }

  toggleEventsDisplay() {
    this.allEventsDisplayed = !this.allEventsDisplayed; // Toggle flag
  }
  // method to get number of events this month
  getEventsCount() {
    // URL to get events count for this month (replace with your actual endpoint)
    const getEventsCountUrl = this.http.serverUrl + 'v2/events/count-past-events';

    this.http.getData(getEventsCountUrl).subscribe({
      next: (response: { payload: number }) => {
        this.eventsCount = response.payload;
      },
      error: (error: any) => {
        console.log(error);
        // Handle error gracefully (e.g., display an error message)
      },
      complete: () => {},
    });
  }

  // method to get recent events
  getEvents() {
    // URL to get recent events (replace with your actual endpoint)
    const getEventsUrl = this.http.serverUrl + 'v2/events/display-past-events';

    this.http.getData(getEventsUrl).subscribe({
      next: (response: { payload: any[] }) => {
        this.events = response.payload;
      },
      error: (error: any) => {
        this.error = 'No past events to show.';
        console.error(error);
      },
      complete: () => {},
    });
  }

  // method to get current date (unchanged)
  getCurrentDate() {
    const today = new Date();
    this.currentDate = today.toISOString(); // Example format, you can change it as needed
  }

  viewEventInfor(id:number){
    this.dialog.open(ViewEventInforComponent, {
      width:'80%',
      height:'80%',
      data:{
        eventId:id
      }
    })
  }
}