import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-view-news',
  standalone: true,
  imports: [],
  templateUrl: './admin-view-news.component.html',
  styleUrl: './admin-view-news.component.scss'
})
export class AdminViewNewsComponent {
  newsContent:any = ""
   constructor(@Inject
    (MAT_DIALOG_DATA) public data:any,
   public dialog:MatDialogRef<AdminViewNewsComponent>
   ){
    this.newsContent = data?.news
    console.log("news",this.newsContent)
   }
//close the dialog box
closeNewsDialog():void {
  this.dialog.close()
}

}
