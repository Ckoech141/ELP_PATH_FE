import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AdminDeleteFormComponent } from '../admin-delete-form/admin-delete-form.component';
import { LexerTokenType } from '@angular/compiler';
import { AdminActionComponent } from '../admin-users/admin-user-view/admin-action.component';
import { AdminUserViewComponent } from '../admin-user-view/admin-user-view.component';



@Component({
  selector: 'app-admin-users-table',
  templateUrl: './admin-users-table.component.html',
  styleUrl: './admin-users-table.component.scss'
})
export class AdminUsersTableComponent implements OnInit, AfterViewInit {
isLoading  : boolean = false
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) empTbSort = new MatSort();
  @ViewChild(MatPaginator) paginator!: MatPaginator; //  '!' to indicate that it will be initialized later


  constructor(
    private http: HttpServiceService,
    public dialog: MatDialog, 
    private roleService: RoleService) {}
 
  url!: string;
  userId: any;
  displayedColumns: string[] = [
    'No',
    'firstName',
    'lastName',
    'userEmail',
    // 'roleName',
    'button',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.empTbSort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');
    
    this.getAllUsers();
    
  }
  getAllUsers() {
    this.isLoading = true
    this.roleService.getAllUsers().subscribe(
      (response: { payload: any; }) => {
        console.log('All Users', response);
        this.dataSource.data = response.payload;
      this.isLoading = false
      },
      (error: any) => {
        console.error('Error fetching Users', error);
      this.isLoading = false
      }
    );
  }

  infoContent(contentId: any){
    let filteredcontent = this.dataSource.data.find(data => data.id===contentId);
    this.dialog.open(AdminActionComponent, {
      data :{
        content : filteredcontent
      }
    })
  }

  deleteAdminDialog(userId: any) {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminDeleteFormComponent> = this.dialog.open(
      AdminDeleteFormComponent,
      {
        width: '50%',
        // Set the width of the dialog

        data: { data: userId}, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewUserInfo(userId:any){
    let user = this.dataSource.data.find((item)=> item.id === userId)
    console.log(user)
    this.dialog.open(AdminUserViewComponent, {
      data: {
        userInfo : user
      }
    })

  }

  generateReport(): void {
    this.http.generateReport().subscribe((blob: Blob) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement('a');
      // Set the href attribute of the link to the URL of the blob
      a.href = url;
      // Set the download attribute of the link to specify the filename
      a.download = 'report.pdf';
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link to trigger the download
      a.click();
      // Remove the link from the body
      document.body.removeChild(a);
      // Revoke the URL to release the resources
      window.URL.revokeObjectURL(url);
    });
  }

}


