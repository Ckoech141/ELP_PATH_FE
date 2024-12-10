import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Observable, map, forkJoin, catchError, startWith, finalize } from 'rxjs';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAddEventFormComponent } from '../admin-add-event-form/admin-add-event-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { PostFormComponent } from '../post-form/post-form.component';
import { UserEventsApprovalComponent } from '../user-events-approval/user-events-approval.component';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
})
export class HubComponent implements OnInit{
  countMembers!: number;
  hubData: any;
  hubDescription!: string;
  hubName:string[] = [];
  hubJoin!:FormGroup
  //nnnnnnnn
  panelOpenState = false;
  chapters:any[]=[]
  userInfo: any;
  members: any;
  userHubs:any;
  events:any;
  serverUrl: string =' '
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
option: any;
  activehub: any;
createhubAMA: any;
  userhub: { id: number; }[] | undefined;
  loadinghubFeedsData: boolean | undefined;
  hubFeedsData: any;
  hubInfo: any;
hub: any;



  constructor(private http:HttpServiceService,public dialog: MatDialog,private snackBar: MatSnackBar,
    ){
      this.hubJoin = new FormGroup({
        hub : new FormControl("")
      })
    }

  ngOnInit(): void {
    this.getHub()
    const userData = localStorage.getItem('userData'); // Check if user data is available in local storage
    if (userData) {
      this.userInfo = JSON.parse(userData);
       // Fetch feeds when user data is available
       console.log("user",this.userInfo);
       
    }

    this.getUserhub()
   
    this.serverUrl = this.http.serverUrl
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  joinHub(id:string){
       this.http.joinHubs(this.userInfo.id, id).subscribe(
      ((res) =>{
        console.log(res);
      }),
      ((err) => {
        console.error(err);
      }),
      () =>{
        this.hubJoin.reset;
        this.snackBar.open(`${this.userInfo.firstName}, Your membership request to join the hub has been sent for approval"`, 'Close', { duration: 3600 });
        this.getUserhub()
        
      }
    )

  }
  leavehub(id:string){
    this.http.leavehub(this.userInfo.id, id).subscribe(
   ((res) =>{
     console.log(res);
   }),
   ((err) => {
     console.error(err);
   }),
   () =>{
     this.snackBar.open(`${this.userInfo.firstName} You have successfully left the hub`, 'Close', { duration: 3600 });
     this.getUserhub()
   }
 )

}


 


  getHub() {
    const getHubUrl = this.http.serverUrl + 'v2/hubs/all';

    this.http.getData(getHubUrl).subscribe({
      next: (response) => {
        this.hubData = response.payload;
        console.log("inf",this.hubData);
        
        // const items: any[] = []
        // response.payload.forEach((e: { hubName: any; }) =>{
        //   items.push(e.hubName)
        // })
        // this.options = items
        console.log('hub info', this.hubName);
        this.hubDescription = response.hubDescription;
        this.hubName = response?.payload?.hubName;
        console.log("qwert", this.hubName);
       // this.getHubMembers();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        const hubname = this.hubData?.forEach(function(e:any[]){
          return e
        });
        
        console.log("12345678", hubname);
      },
    });
  }
  // method to get hub members
  // getHubMembers() {
  //   const getHubMembers =
  //     this.http.serverUrl + 'v2/hubs/' + this.hubid + '/display-hub-members';
  //   this.http.getData(getHubMembers).subscribe({
  //     next: (response) => {
  //       console.log('members', response.length);
  //       this.countMembers = response.payload.length;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {},
  //   });
  // }

  getUserhub(){
    this.http.getUserHubs(this.userInfo.id).subscribe(
      ((res) =>{
        console.log(res.payload);
        this.userHubs = res.payload
        this.activehub = res.payload[0]
        this.gethubEvents(res.payload[0].id)
      }),
      ((e) => {

      }),
      () =>{}
    )
  }
  selecthub(hub:any){
    this.activehub = hub
    this.gethubEvents(hub.id)
  }

  createhubEvent(id:number){
        // Open the dialog using the MatDialog service
        const dialogRef: MatDialogRef<AdminAddEventFormComponent> =
        this.dialog.open(AdminAddEventFormComponent, {
          width: '50%',
  
          // Set the width of the dialog
  
          data: { data: id, type: 'hubEvent' }, // You can pass data to the dialog component using the `data` property
        });
        dialogRef.afterClosed().subscribe(
          ((res) =>{
            this.gethubEvents(id)
          })
        )
  }

  //get hub events
  gethubEvents(id:number){
    console.log("fggdgd", id);
    
    this.http.gethubEvents(id).subscribe(
      ((res: { payload: any; }) => {
        if (res) {
          this.events = res.payload
          console.log(res);
        }
 
        
      })
    )
  }

  confirmAttendance(id:string){
    if (id  && this.userInfo.id) {
      this.http.eventSubscribe(this.userInfo.id, id).subscribe(
        ((res) =>{
          console.log(res);
          
        }),
        ((e) =>{
          console.log(e);
          
        }),
        () => {
          this.snackBar.open(`${this.userInfo.firstName} You have successfully confirmed attendance to this event`, 'Close', { duration: 2000 });
        }
        )
        
    }
}
approveHubEvents(id:number) {
  alert("hello")
  this.dialog.open(UserEventsApprovalComponent,{
    width:"90%",
    height:"85%",
    data:{
      eventType:"Hub",
      chapterId:id
    }
  })
}

}


