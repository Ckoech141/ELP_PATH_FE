import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-admin-spotlight-view',
  standalone: true,
  imports: [],
  templateUrl: './admin-spotlight-view.component.html',
  styleUrl: './admin-spotlight-view.component.scss'
})
export class AdminSpotlightViewComponent {
  content:any= '';

  constructor(@Inject(
    MAT_DIALOG_DATA) 
    public data:any,
    public dialogRef: MatDialogRef<AdminSpotlightViewComponent>
    ){ 
    this.content = data?.name
    console.log(this.content)
  };
  close(): void {
    this.dialogRef.close();
}
}
