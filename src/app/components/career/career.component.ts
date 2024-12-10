import { Component, Input } from '@angular/core';
import { CareerFormComponent } from '../career-form/career-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { CareerUpdateComponent } from '../career-update/career-update.component';
@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
})
export class CareerComponent {
  career: any;
item: any;
id: any;
  constructor(public dialog: MatDialog, public http: HttpServiceService, private snackBar:MatSnackBar) {}
  url!: string;
  rowData!: any[];
  userId!: string;
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

    console.log(this.userId)

    // Use the parsed data in your application
    this.url = this.http.serverUrl + 'career/' + this.userId + '/view';
    
    this.http.getData(this.url).subscribe({
      next: (response) => {
        this.rowData = response.payload;
        console.log('POST request successful:', response);
        console.log(response.payload)

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

  // open career form dialog
  cformDialog(row: any): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<CareerUpdateComponent> = this.dialog.open(
      CareerUpdateComponent,
      {
        width: '45%', // Set the width of the dialog

        // data: { data: this.userId }, // You can pass data to the dialog component using the `data` property
        data: { data: row }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }
   // open career form dialog
   aformDialog(row: any): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<CareerFormComponent> = this.dialog.open(
      CareerFormComponent,
      {
        width: '45%', // Set the width of the dialog

        // data: { data: this.userId }, // You can pass data to the dialog component using the `data` property
        data: { data: row }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }

  deleteCareer(id: any): void {
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.http.deleteCareer(id, this.userId).subscribe({
          next: () => {
            console.log('Career deleted successfully');
  
            // Find the deleted item index in the 'rowData' array
            const deletedIndex = this.rowData.findIndex(item => item.id === id);
  
            // Remove the deleted item from the 'rowData' array locally
            if (deletedIndex !== -1) {
              this.rowData.splice(deletedIndex, 1);
            }
  
            this.snackBar.open('Career deleted successfully', 'Close', { duration: 1000 });
            // You can perform additional actions after successful deletion
          },
          error: (error: any) => {
            console.error('Error deleting career', error);
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
