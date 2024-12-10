import { Component, Input } from '@angular/core';
import { EducationFormComponent } from '../education-form/education-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent {

status: any;
N: any;
  constructor(public dialog: MatDialog,
    public snackBar:MatSnackBar,
     public http: HttpServiceService) {}
  userId!: any;
  url!: string;
  rowData!: any[];
  @Input() userIdadmin!: string;
  @Input() viewer!: string;
  ngOnInit() {
    const storedData = localStorage.getItem('userData');
    if (this.userIdadmin) {
      console.log('useridadmin', this.userIdadmin.toString());
      this.userId = this.userIdadmin.toString();
    } else if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.userId = parsedData.id;
    }
    // Use the parsed data in your application
    this.url = this.http.serverUrl + 'education/' + this.userId + '/view';

    this.http.getData(this.url).subscribe({
      next: (response) => {
        this.rowData = response.payload;
        console.log('POST request successful:', response);

        // Handle the response data here
        // localStorage.setItem('token', JSON.stringify(response));
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {},
    });
  }

  // open eduaction form dialog
  eformDialog(editAdd: string): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<EducationFormComponent> = this.dialog.open(
      EducationFormComponent,
      {
        width: '45%',
       // height: '80%', // Set the width of the dialog

        data: { action: editAdd }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }
  EditformDialog(editAdd:string, data:any){
    const dialogRef: MatDialogRef<EducationFormComponent> = this.dialog.open(
      EducationFormComponent,
      {
        width: '45%',
       // height: '80%', // Set the width of the dialog

        data: { action: editAdd, edu:data }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }
  //http://52.15.152.26:5555/education/130/4/delete
  DformDialog(id:number){
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);
    console.log(id)
  
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.http.deleteEducation(this.userId, id).subscribe({
          next: () => {
            console.log('Skill deleted successfully');
  
            // Find the deleted item index in the 'rowData' array
            const deletedIndex = this.rowData.findIndex(item => item.id === id);
  
            // Remove the deleted item from the 'rowData' array locally
            if (deletedIndex !== -1) {
              this.rowData.splice(deletedIndex, 1);
            }
  
            this.snackBar.open('Skill deleted successfully', 'Close', { duration: 2000 });
            // You can perform additional actions after successful deletion
          },
          error: (error: any) => {
            console.error('Error deleting skill', error);
            // Handle error as needed
          }
        });
      } else {
        // User clicked 'No', do nothing
        console.log('Deletion cancelled by the user.');
      }
    });
  }
}
