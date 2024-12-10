import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpServiceService } from 'src/app/services/http-service.service';

export interface UserData {
  id: string;
  hubName: string;
  firstName: string;
  lastName: string;
  userEmail: string;
  joiningDate: string;
}
@Component({
  selector: 'app-admin-hub-join-requests',
  templateUrl: './admin-hub-join-requests.component.html',
  styleUrl: './admin-hub-join-requests.component.scss'
})

export class AdminHubJoinRequestsComponent {
  requests:any[] = [];
  displayedColumns: string[] = ['index','HubName','firstName', 'LastName', 'Email', 'requestDate', 'actions'];
  dataSource!: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject (MAT_DIALOG_DATA) private data:any,
   private dialogref:MatDialogRef<AdminHubJoinRequestsComponent>,
  private http:HttpServiceService,
  private snack:MatSnackBar
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getHubJoinRequests()
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getHubJoinRequests(){
    this.http.getHubApprovalRequsts().subscribe(
      ((res) =>{
        console.log("12345", res.payload);
        
        this.requests = res.payload
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    )
  }
  actOnRequest(state:boolean, id:number){
    console.log("state",state);
    this.http.ActOnHubJoinReq(id,state).subscribe(
      ((res) => {
        
      }),
      ((e) => {}),
      () => {
        this.getHubJoinRequests()
        if (state == true) {
          this.snack.open("user membership approved successfully", 'Close', {duration:3600})
        }else{
          this.snack.open("user membership declined successfully", 'Close', {duration:3600})
        }
       
      }
    )
    
  }
}
