import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-user-view',
  templateUrl: './admin-user-view.component.html',
  styleUrl: './admin-user-view.component.scss'
})
export class AdminUserViewComponent {
  userData:any=''
  constructor(@Inject 
    (MAT_DIALOG_DATA) public data:any,
       public dialogRef: MatDialogRef<AdminUserViewComponent>)
       {
    this.userData = data?.userInfo
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}


