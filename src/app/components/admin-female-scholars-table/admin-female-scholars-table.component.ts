import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { UserDialogInfoComponent } from '../user-dialog-info/user-dialog-info.component';

@Component({
  selector: 'app-admin-female-scholars-table',
  templateUrl: './admin-female-scholars-table.component.html',
  styleUrl: './admin-female-scholars-table.component.scss'
})
export class AdminFemaleScholarsTableComponent {

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
      //http://52.15.152.26:5555/scholars/scholar-females?ignoreCondition=false
      url =this.http.serverUrl+'scholars/scholar-females?ignoreCondition=true'
    }else{
      //http://52.15.152.26:5555/scholars/scholar-females?year=2012&ignoreCondition=false
      url = `${this.http.serverUrl}scholars/scholar-females?year=${this.selectedYear}&ignoreCondition=false`
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
