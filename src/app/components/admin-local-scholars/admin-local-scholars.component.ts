import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserDialogInfoComponent } from '../user-dialog-info/user-dialog-info.component';


@Component({
  selector: 'app-admin-local-scholars',
  templateUrl: './admin-local-scholars.component.html',
  styleUrl: './admin-local-scholars.component.scss'
})
export class AdminLocalScholarsComponent {
  loading: boolean =false;
  year:any;
  selectedYear =''; 
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private http: HttpServiceService
  ) {
    
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
      this.selectedYear = params['year'];
    });
    this.getLocalScholars()
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

  getLocalScholars(){
    if(this.selectedYear == 'all'){
      this.url =this.http.serverUrl+'scholars/local/scholars-view?ignoreCondition=true'
    }else{
      this.url =this.http.serverUrl+'scholars/local/scholars-view?year=' + this.selectedYear +'&ignoreCondition=false'
    }
     this.http.getData(this.url).subscribe(
      (response: any)=>{
        console.log('Local Scholars',response.payload)
        console.log('selected year', this.year)
        this.dataSource.data= response.payload
      },
  
     )
  }

 }
