import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./content-dialog.component.scss']
})
export class ContentDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog:MatDialog ) {}

  ondialogClose() {
    
  }
}
