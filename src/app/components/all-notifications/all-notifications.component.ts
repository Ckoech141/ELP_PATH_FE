import { Component,Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-all-notifications',
  standalone: false,
  templateUrl: './all-notifications.component.html',
  styleUrl: './all-notifications.component.scss'
})
export class AllNotificationsComponent implements OnInit {
  notificationData: any;

  hidden:boolean = true;

  constructor(private dialogRef:MatDialogRef<AllNotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  
  }

  ngOnInit() {
    this.notificationData =this.data.notifications
  console.log('current notification', this.notificationData);
  }
  
  closeDialog() {
    this.dialogRef.close()
  }

  onDisappear() {
    this.hidden = false
    console.log('clicked');
  }

}
