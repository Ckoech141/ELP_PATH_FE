import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-action',
  templateUrl: './admin-action.component.html',
  styleUrl: './admin-action.component.scss'
})
export class AdminActionComponent {
infoContent:any = ""
constructor(@Inject
  (MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialogRef<AdminActionComponent>
){
  this.infoContent=data?.content
  console.log("info",this.infoContent)
}
// close the dialog box
closeInfoDialog() :void {
  this.dialog.close()
}

}