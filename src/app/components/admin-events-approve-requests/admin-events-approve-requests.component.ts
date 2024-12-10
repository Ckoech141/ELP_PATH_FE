import { HttpSentEvent } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminViewEventForApprovalComponent } from '../admin-view-event-for-approval/admin-view-event-for-approval.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserData {
  id: string;
  eventName: string;
  organizer: string;
  firstName: string;
  lastName: string;
  eventStatus: string;
  recordDate: string;
  eventDate: string;
  
}

@Component({
  selector: 'app-admin-events-approve-requests',

  templateUrl: './admin-events-approve-requests.component.html',
  styleUrl: './admin-events-approve-requests.component.scss'
})
export class AdminEventsApproveRequestsComponent {

  requests:any[] = [];
  displayedColumns: string[] = ['index','eventName','organizer','firstName', 'LastName', 'eventStatus','hub', 'recordDate','eventDate', 'actions'];
  dataSource!: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    public snack:MatSnackBar,
    private http: HttpServiceService,
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getEventsForApproval()
  }
  //filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //http://52.15.152.26:5555/v2/events/get-events-for-approval
  getEventsForApproval(){
    const url = `${this.http.serverUrl}v2/events/get-events-for-approval`
    this.http.getData(url).subscribe(
      ((res) =>{
        console.log("approvals",res);
        this.requests = res.payload
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }),
      ((e) => {
        console.log(e);
        
      }),
      () => {}
    )
  }

  //get event details
  //http://52.15.152.26:5555/v2/events/get-event/12

  getEventById(event:any){
    this.dialog.open(AdminViewEventForApprovalComponent, {
      width:"70%",
      height:"70%",
      data:{
        data:event
      }
    })
  }
  
  actOnRequest(status:boolean, request:any){
    console.log(request);
    //hub events
    //http://52.15.152.26:5555/v2/events/approve-hub-events/12?b=true
    if (request?.hubId) {
      const url = `${this.http.serverUrl}v2/events/approve-hub-events/${request.eventId}?approve=${status}`
      this.http.approveEvents(url).subscribe(
        ((res) => {
          console.log(res);
          
        }),
        ((e) => {
          this.snack.open(e.message, "Close", {duration:3600} )
        }),
        () => {
          if (status == true) {
            this.snack.open("Hub Event approved successfully","Close", {duration:3600})
          } else {
            this.snack.open("Hub Event approval Declined","Close", {duration:3600})
          }
          this.getEventsForApproval()
        }

      )
    } else if(request?.chapterId) {
      //http://52.15.152.26:5555/v2/events/approve-chapter-events/1?b=true
      const url = `${this.http.serverUrl}v2/events/approve-chapter-events/${request.eventId}?b=${status}`
      this.http.approveEvents(url).subscribe(
        ((res) => {
          console.log(res);
          
        }),
        ((e) => {
          this.snack.open(e.message, "Close", {duration:3600} )
        }),
        () => {
          if (status == true) {
            this.snack.open("Chapter Event approved successfully","Close", {duration:3600})
          } else {
            this.snack.open("Chapter Event approval Declined","Close", {duration:3600})
          }
         
          this.getEventsForApproval()
        }

      )
    }

    
  }

}
