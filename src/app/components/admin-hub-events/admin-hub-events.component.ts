import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-hub-events',
  templateUrl: './admin-hub-events.component.html',
  styleUrls: ['./admin-hub-events.component.scss'],
})
export class AdminHubEventsComponent {
  constructor(public http: HttpServiceService,
    public snackBar:MatSnackBar,
  ) {}

  @Input() hubid!: string;

  eventsData: any[] = [];
  getEventsUrl!: string;
  isLoading:boolean = false;
  ngOnInit() {
    if (this.hubid !== undefined) {
      console.log('hubid in event', this.hubid);
    } else {
      console.log('hubid in event', this.hubid);
    }
    this.getEvents();
  }

  // method to get events by chapter id or all events
  getEvents() {
    this.isLoading = true
    if (this.hubid !== undefined) {
      console.log('hubid in event', this.hubid);
      this.getEventsUrl =
        this.http.serverUrl + 'v2/events/' + this.hubid + '/display-hub-events';
    } else {
      this.getEventsUrl = this.http.serverUrl + 'v2/events/all';
    }

    // ====================================get method=======================================

    this.http.getData(this.getEventsUrl).subscribe({
      next: (response) => {
        console.log(response);
        this.eventsData = response.payload
       
        console.log("events",this.eventsData);
        
      },
      error: (error) => {
        this.snackBar.open(error.error.message, "Close", {duration:3600})
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false
      },
    });

    // ============================================================================
  }
}
