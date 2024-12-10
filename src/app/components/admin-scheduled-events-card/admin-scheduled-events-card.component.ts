import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Router } from '@angular/router'; 
import { ViewEventInforComponent } from '../view-event-infor/view-event-infor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-scheduled-events-card',
  templateUrl: './admin-scheduled-events-card.component.html',
  styleUrls: ['./admin-scheduled-events-card.component.scss']
})
export class AdminScheduledEventsCardComponent implements OnInit {
  eventsCount: number = 0;
  currentDate: any;
  events: any[] = []; // Array to store fetched events
  error: string = ''; // To store any error message

  constructor(
    public http: HttpServiceService,
    public dialog:MatDialog,
  ) {
    this.getCurrentDate();
  }

  ngOnInit() {
    this.getEventsCount();
    this.getEvents(); // Call getEvents on initialization as well
  }

  // method to get number of events this month
  getEventsCount() {
    // URL to get events count for this month (replace with your actual endpoint)
    const getEventsCountUrl = this.http.serverUrl + 'v2/events/count-scheduled-events';

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
    const getEventsUrl = this.http.serverUrl + 'v2/events/display-scheduled-events';

    this.http.getData(getEventsUrl).subscribe({
      next: (response: { payload: any[] }) => {
        this.events = response.payload;
      },
      error: (error: any) => {
        this.error = 'No upcoming Events.';
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
    //view event informaion
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
  