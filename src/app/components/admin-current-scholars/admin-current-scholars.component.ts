import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserDialogInfoComponent } from '../user-dialog-info/user-dialog-info.component';

@Component({
  selector: 'app-admin-current-scholars',
  templateUrl: './admin-current-scholars.component.html',
  styleUrl: './admin-current-scholars.component.scss'
})
export class AdminCurrentScholarsComponent {
  loading:boolean = false
  year: any;
  selectedYear = 'all'; 
  
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

  openDialog(scholarId: any){
    this.dialog.open(
      UserDialogInfoComponent,{        
        data: {
          data: scholarId
        },
          }
    )

  }

  getSelectedYear(): void {
    this.route.queryParams.subscribe(params => {
      this.year = params['year'];
    });
    this.getCurrent()
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

  
  getCurrent(){
    if(this.selectedYear == 'all'){
      this.url =this.http.serverUrl+ 'scholars/current-scholars/view?ignoreCondition=true'
    }else{
      this.url =this.http.serverUrl+'scholars/current-scholars/view?year=' + this.year +'&ignoreCondition=false'
    }
     this.http.getData(this.url).subscribe(
      (response: any)=>{
        console.log('Current scholars',response.payload)
        this.dataSource.data= response.payload
      },
  
     )
  }

}
