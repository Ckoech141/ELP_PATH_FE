import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserDialogInfoComponent } from '../user-dialog-info/user-dialog-info.component';

@Component({
  selector: 'app-admin-tvet-scholars',
  templateUrl: './admin-tvet-scholars.component.html',
  styleUrl: './admin-tvet-scholars.component.scss'
})
export class AdminTvetScholarsComponent {
  loading : boolean = false;
  year:any;
  selectedYear = ''
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpServiceService
  ) {}

  // Sort functionality
  @ViewChild(MatSort) empTbSort = new MatSort();

  // Paginator functionality
  @ViewChild(MatPaginator) paginator!: MatPaginator; //  '!' to indicate that it will be initialized later
  url!: string;
  displayedColumns: string[] = [
    'name',
    'applicationStatus',
    'dateOfAwarding',
    'branch',
    'button',
  ];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.getSelectedYear();
   
  }

  getSelectedYear(): void {
    this.route.queryParams.subscribe(params => {
      this.year = params['year'];
    });
    this.getTvetScholars();
  }  
     
  openDialog(scholarId: any){
    this.dialog.open(
      UserDialogInfoComponent,{        
        data: {
          data: scholarId
        },
          }
    )

  }
  

  // Method to apply filters to the table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // After view initialization, set the sorting and pagination functionality for the table
  ngAfterViewInit() {
    this.dataSource.sort = this.empTbSort;
    this.dataSource.paginator = this.paginator;
  }

  getTvetScholars(){
    if(this.selectedYear == 'all'){
      this.url =this.http.serverUrl+'scholars/tvet/scholars-view?ignoreCondition=true'
    }else{
      this.url =this.http.serverUrl+'scholars/tvet/scholars-view?year=' + this.year +'&ignoreCondition=false'
    }
     this.http.getData(this.url).subscribe(
      (response: any)=>{
        console.log('Tvet Scholars',response.payload)
        console.log('selected year', this.year)
        this.dataSource.data= response.payload
      },
  
     )
  }


  // application form dialog
  // applicationDialog(): void {
  //   // Open the dialog using the MatDialog service
  //   const dialogRef: MatDialogRef<AdminApplicationFormComponent> =
  //     this.dialog.open(AdminApplicationFormComponent, {
  //       width: '50%',
  //       // Set the width of the dialog

  //       data: { data: 'john' }, // You can pass data to the dialog component using the `data` property
  //     });

  //   // Handle the dialog result (if needed)
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     this.ngOnInit();
  //   });
  // }
  // profile dialog
  // profileDialog(id: string): void {
  //   // Open the dialog using the MatDialog service
  //   const dialogRef: MatDialogRef<UserProfileComponent> = this.dialog.open(
  //     UserProfileComponent,
  //     {
  //       width: '70%',
  //       // Set the width of the dialog

  //       data: { data: id }, // You can pass data to the dialog component using the `data` property
  //     }
  //   );

  //   // Handle the dialog result (if needed)
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  // journey dialog
  // journeyDialog(id: string): void {
  //   // Open the dialog using the MatDialog service
  //   const dialogRef: MatDialogRef<AdminJourneyComponent> = this.dialog.open(
  //     AdminJourneyComponent,
  //     {
  //       width: '80%',
  //       // Set the width of the dialog

  //       data: { data: id }, // You can pass data to the dialog component using the `data` property
  //     }
  //   );

  //   // Handle the dialog result (if needed)
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }


}
