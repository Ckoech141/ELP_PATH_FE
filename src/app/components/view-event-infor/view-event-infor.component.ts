import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-view-event-infor',
  templateUrl: './view-event-infor.component.html',
  styleUrl: './view-event-infor.component.scss'
})
export class ViewEventInforComponent {
cancelAttendance(arg0: any) {
throw new Error('Method not implemented.');
}
confirmAttendance(arg0: any) {
throw new Error('Method not implemented.');
}
  eventId: number = 0
  eventInfo:any;
  eventAttendants:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public http: HttpServiceService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ViewEventInforComponent>) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const id = this.data.eventId
    if (id) {
      this.eventId = id
    }
    this.getEventInfo()
  }

  //get event info
  //http://52.15.152.26:5555/v2/events/get-event/123
  getEventInfo() {
    const url = `${this.http.serverUrl}v2/events/get-event/${this.eventId}`
    this.http.getData(url).subscribe(
      ((response) => {
        console.log("event info", response.payload);
        this.eventInfo = response.payload
      }),
      ((error) => {
        this.snackBar.open(error.error.message, "Close", {duration:3600})
      }),
      () => {
        //http://52.15.152.26:5555/v2/events/event-subscribers/123
        //Get users who have confirmed attendance to this event
        const url = `${this.http.serverUrl}v2/events/event-subscribers/${this.eventId}`
        this.http.getData(url).subscribe(
          ((res) => {
            console.log("Subscribers", res.payload);   
            this.eventAttendants = res.payload         
          }),
          ((error) => {
            this.snackBar.open(error.error.message, "Close", {duration:3600})
          }),
          () => {}
        )
      }
    )
  }

}
