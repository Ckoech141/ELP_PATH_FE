import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-view-event-for-approval',
 
  templateUrl: './admin-view-event-for-approval.component.html',
  styleUrl: './admin-view-event-for-approval.component.scss'
})
export class AdminViewEventForApprovalComponent {

  event:any
  constructor(
    @Inject(MAT_DIALOG_DATA) private data:any,
    public http: HttpServiceService,
    private dialogRef:MatDialogRef<AdminViewEventForApprovalComponent>
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const data = this.data.data
    if (data) {
      this.event = data
      console.log(data.eventImages);
      
    }
  }
}
