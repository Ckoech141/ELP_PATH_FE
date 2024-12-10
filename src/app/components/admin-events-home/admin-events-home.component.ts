import { Component, ViewChild } from '@angular/core';
import { AdminAddEventFormComponent } from '../admin-add-event-form/admin-add-event-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminChapterEventsComponent } from '../admin-chapter-events/admin-chapter-events.component';
import { AdminEventsApproveRequestsComponent } from '../admin-events-approve-requests/admin-events-approve-requests.component';
import { HttpServiceService } from 'src/app/services/http-service.service';
@Component({
  selector: 'app-admin-events-home',
  templateUrl: './admin-events-home.component.html',
  styleUrls: ['./admin-events-home.component.scss'],
})
export class AdminEventsHomeComponent {
  requests:any;
  @ViewChild(AdminChapterEventsComponent)
  eventsComponent!: AdminChapterEventsComponent;
  constructor(public dialog: MatDialog,
    private http: HttpServiceService

  ) {}

  ngOnInit() {
    this.getEventsForApproval()
  }
  // add event form dialog
  addEventDialog(): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddEventFormComponent> =
      this.dialog.open(AdminAddEventFormComponent, {
        width: '50%',

        // Set the width of the dialog

        data: { data: '' }, // You can pass data to the dialog component using the `data` property
      });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.eventsComponent.ngOnInit();
    });
  }
  hubJoinRequests() {
    this.dialog.open(AdminEventsApproveRequestsComponent, {
      width: '80%',
      height:'80%'
    })

    }

      //http://52.15.152.26:5555/v2/events/get-events-for-approval
  getEventsForApproval(){
    const url = `${this.http.serverUrl}v2/events/get-events-for-approval`
    this.http.getData(url).subscribe(
      ((res) =>{
        console.log("approvals",res);
        this.requests = res.payload
      }),
      ((e) => {
        console.log(e);
        
      }),
      () => {}
    )
  }
}
