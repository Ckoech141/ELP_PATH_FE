import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../../services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogInfoComponent } from '../user-dialog-info/user-dialog-info.component';

@Component({
  selector: 'app-admin-view-sholars-table',
  templateUrl: './admin-view-sholars-table.component.html',
  styleUrl: './admin-view-sholars-table.component.scss'
})
export class AdminViewSholarsTableComponent{
  selectedYear : any
  loading: boolean = false;
  url: string = '';
  constructor(
    private route: ActivatedRoute,
    private http : HttpServiceService,
    public dialog : MatDialog
  ){}
//sort functionality
  @ViewChild(MatSort) empTBSort = new MatSort();

  // paginator functionality
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'name',
    'applicationStatus',
    'dateOfAwarding',
    'branch',
    'button',
  ];

  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedYear = params['year']
    })
    console.log("Yeeeeeeeeeeeeeeeeeeeeee",this.selectedYear)
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

  applyFilter(e:Event){
    const filterValue = (e.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase()
  }
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  ngAfterViewInit(): void {
    this.dataSource.sort = this.empTBSort;
    this.dataSource.paginator = this.paginator;
    
  }

  getSelectedYear(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedYear = params['year'];
    });
    this.getScholarsByYear()
  }
  getScholarsByYear() {
    let url = ''
    this.loading = true;

    if(this.selectedYear == 'all'){
      url =this.http.serverUrl+'scholars/annual/scholars-view?ignoreCondition=true'
    }else{
      url =this.http.serverUrl+'scholars/annual/scholars-view?year=2021&ignoreCondition=false'
    }
    console.log(url);
    this.http.getData(url).subscribe(
    
      
      (response) => { 
        console.table( response.payload);
        this.dataSource.data = response.payload;
        console.log("yoooooooooooo", response.payload)
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching Users', error);
        this.loading = false;
      }
    );
  }

}