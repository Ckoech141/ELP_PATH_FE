import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from '../../services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-donors-view',
  templateUrl: './admin-donors-view.component.html',
  styleUrl: './admin-donors-view.component.scss'
})
export class AdminDonorsViewComponent {
  isLoading:boolean = false;
  year: any;
  selectedYear = ''; 
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
    this.getAlumni()
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

  getAlumni(){
    if(this.selectedYear == 'all'){
      this.url =this.http.serverUrl+ 'scholars/global/scholars-view?ignoreCondition=true'
    }else{
      this.url =this.http.serverUrl+'scholars/global/scholars-view?year=' + this.year +'&ignoreCondition=false'
    }
     this.http.getData(this.url).subscribe(
      (response: any)=>{
        console.log('Alumni scholars',response.payload)
        this.dataSource.data= response.payload
      },
  
     )
  }
  }




