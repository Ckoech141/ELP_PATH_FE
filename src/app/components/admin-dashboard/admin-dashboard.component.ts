import { Component, Input, NgModule, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScholarsCardComponent } from '../scholars-card/scholars-card.component';
import { DashboardDataService } from 'src/app/dashboard-data.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

import Chart from 'chart.js/auto';
@Component({
  selector: 'app-admin-dashboard',

  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})

export class AdminDashboardComponent implements OnInit{
  @ViewChild(ScholarsCardComponent)
  totalscholars!: ScholarsCardComponent;
  panelOpenState = false;
  url: any;
  regScolars:any;
  country: string = '';
  region: string = '';
  cluster: string = '';
  branches: string = '';
  gender: string = '';
  urlGetBranches!: any;
  branchOptions!: any;
  urlGetCluster!: any;
  clusterOptions!: any;
  yearOptions: any[] = [
    'all','2028','2027','2026','2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015',
    '2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000',
    '1999','1998'
  ];
  reportsForm!: FormGroup;
  

  labelList: string[] = [];
  totalCountList: string[] = [];
 

  filterstatus: boolean = false;
  scholarStats: any;
  totalSum: any;
  allTime: boolean = true;
  selectedYear: string = 'all'; 
  year: any;
  chart: any;
  wtf: any;

  onYearChange(selectedYear: string) {
    this.selectedYear = selectedYear;
    this.ngOnInit();
    // Add any additional logic you need when the year changes
  }

  
  private getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

  constructor(
    private dashboardData: DashboardDataService,
    private http: HttpServiceService
  ) {
    this.reportsForm = new FormGroup({
      report: new FormControl(''),
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
    })
  }
  ngOnInit() {
    this.getBranches();
    this.getClusters;
    this.getData()
    this.getRegisteredScholars()
    console.log("Scholar statistics", this.scholarStats)
  }

  filterToggle() {
    this.filterstatus = !this.filterstatus;
  }

  applyFilter() {
    this.dashboardData
      .fetchDataWithFilters(
        this.country,
        this.region,
        this.cluster,
        this.branches,
        this.gender
      )
      .subscribe((data) => {
        // Update cards and graphs with new data
      });
    //   this.totalscholars.ngOnInit(
    //     this.country,
    //     this.region,
    //     this.cluster,
    //     this.gender
    //   );
  }


  getBranches() {
    this.urlGetBranches = this.http.serverUrl + 'branch/all'; // URL to fetch insitiutuion data
    this.http.getData(this.urlGetBranches).subscribe({
      next: (response) => {
        this.branchOptions = response; // Set Branch options array
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }

  getClusters() {
    // Set the URL to fetch cluster data
    this.urlGetCluster = this.http.serverUrl + `education/course-clusters/all`;

    // Send an HTTP GET request to fetch cluster data
    this.http.getData(this.urlGetCluster).subscribe({
      next: (response) => {
        // When the request is successful, store the cluster data in the 'clusterOptions' variable
        this.clusterOptions = response.payload;
        console.log('Cluster', this.clusterOptions);
      },
      error: (error) => {
        // Handle and log any errors that occur during the request
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }
  getRegisteredScholars(){
    const url = `${this.http.serverUrl}scholars/registered/Unregistered/user/view`
    const response = this.http.getData(url)
    response.subscribe(
      (value: any) => {
        this.regScolars = value.payload
        console.log("Registered & Unregistered", this.regScolars)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  roundOff(input: any): any{
    return Math.round(input)

  }
getData(){
  if(this.selectedYear == 'all'){
    this.url =this.http.serverUrl+'scholars/scholar-stats/?ignoreCondition=true'
  }else{
    this.url =this.http.serverUrl+'scholars/scholar-stats/?year='+this.selectedYear + '&ignoreCondition=false'
  }
   this.http.getData(this.url).subscribe(
    (response: any)=>{
      console.log('Scholar stats',response.payload)
      this.scholarStats = response.payload
   
    this.totalSum = response['Male'] + response['Female'];

    


    let totalscholars = 0;

    // Iterate over the properties of the object and sum their values
    for (const key in response) {
      if (response.hasOwnProperty(key) && typeof response[key] === 'number') {
        totalscholars += response[key];
      }
    }
    },

   )
}
// downloadReport(): void {
//   this.http.downloadReport(this.selectedYear).subscribe((blob: Blob) => {
//     // Create a URL for the blob
//     const url = window.URL.createObjectURL(blob);
//     // Create a link element
//     const a = document.createElement('a');
//     // Set the href attribute of the link to the URL of the blob
//     a.href = url;
//     // Set the download attribute of the link to specify the filename
//     a.download = 'report.pdf';
//     // Append the link to the body
//     document.body.appendChild(a);
//     // Click the link to trigger the download
//     a.click();
//     // Remove the link from the body
//     document.body.removeChild(a);
//     // Revoke the URL to release the resources
//     window.URL.revokeObjectURL(url);
//   });
// }





}
