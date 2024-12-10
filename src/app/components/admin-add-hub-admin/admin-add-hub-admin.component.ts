import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-add-hub-admin',
  templateUrl: './admin-add-hub-admin.component.html',
  styleUrl: './admin-add-hub-admin.component.scss'
})
export class AdminAddHubAdminComponent {
  hubId:any;
  hubMembers:any; 
  hubAdmin!:FormGroup;
  isSubmitting:boolean = false

  constructor(private http:HttpServiceService,
     @Inject(MAT_DIALOG_DATA) private data:any,
     private snack:MatSnackBar, 
     private dialogRef:MatDialogRef<AdminAddHubAdminComponent>){
      this.hubAdmin = new FormGroup({
        adminId: new FormControl('')
      })
     }
  
     ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      const id = this.data.data
       if (id) {
        this.hubId = id
       } 
      this.getHubMembers()
     }

  getHubMembers(){
    this.http.getHubMembers(this.hubId).subscribe(
      ((res: { payload: any; }) => {
        this.hubMembers = res.payload
        console.log("qwert",res.payload);
        
      }),
      ((e: { message: any; }) => {
        this.snack.open(`there was an error${e.message}`, "Close", {duration:3600})
      }),
      () => {

      }
    )
  }
  //set hub Admin
  setHubAdmin(){
    console.log("burrrr",this.hubAdmin.value.adminId);
    
    this.isSubmitting = true;
    if (this.hubAdmin.value.adminId == null || this.hubAdmin.value.adminId == '') {
      this.isSubmitting = false
      this.snack.open(`Hub admin name is required`, "Close", {duration:3600})
    } else {

      this.http.setHubAdmin(this.hubId, this.hubAdmin.value.adminId).subscribe(
        ((res: any) => {
          
        }),
        ((e: { message: any; }) => {
          this.snack.open(`there was an error${e.message}`, "Close", {duration:3600})
          this.isSubmitting = false
        }),
        () => {
          this.snack.open(`Hub admin set successfully`, "Close", {duration:3600})

          this.isSubmitting = false
          this.dialogRef.close();
        }
      )
    }
  }

}
