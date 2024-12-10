import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminHubJoinRequestsComponent } from '../admin-hub-join-requests/admin-hub-join-requests.component';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-hubs',
  templateUrl: './admin-hubs.component.html',
  styleUrls: ['./admin-hubs.component.scss'],
})
export class AdminHubsComponent {
  hubJoinReq:any
  constructor(public http: HttpServiceService,
    private dialog:MatDialog,
    private snackBar:MatSnackBar
  ) {}

  hubData: any[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.getAllHubs();
    this.getHubJoinReq()
  }

  // method to get all chapters
  getAllHubs() {
    const getHubsUrl = this.http.serverUrl + 'v2/hubs/all';
    this.loading = true;

    //===================get method ========================
    this.http.getData(getHubsUrl).subscribe({
      next: (response) => {
        console.log("hello",response);
        this.hubData = response.payload.map((item: any) => ({
          hubName: item.hubName,
          hubDescription: item.hubDescription,
          imageUrl: item.hubImage !== null ? item.hubImage : null,
          hubId: item.id.toString(),
        }));
        this.loading = false;

        console.log(this.hubData);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
    //==========================================================================================
  }
  getHubJoinReq(){
    this.http.getHubApprovalRequsts().subscribe(
      ((res) => {
        if (res) {
        
          this.hubJoinReq = res.payload
        }
      }),
      ((e) => {

      }),
      () => {}
    )
  }
  hubJoinRequests(){
  
   
        this.dialog.open(AdminHubJoinRequestsComponent,{
          width:"60%",
          height:"70%",
          data:{
            requests:this.hubJoinReq
          }
  })
}

  deleteHub(hubId:number){
    const dialogRef:MatDialogRef<AdminAddSpotlightDeleteComponent> = this.dialog.open(AdminAddSpotlightDeleteComponent);
      dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.http.deleteHub(hubId).subscribe(
          ((response)=>{
            console.log("mary", response.payload)
          }),
          ((e) =>{
            console.error(e);
            this.snackBar.open('There was an error deleting this achievement', 'Close', { duration: 2000 });
          }),
          () => {
            this.snackBar.open('Achievement deleted successfully', 'Close', { duration: 2000 });
            this.ngOnInit()
          }
    
    
        )
      }

  })}
  }

