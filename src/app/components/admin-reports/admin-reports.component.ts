import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from '../../services/http-service.service';
import * as moment from 'moment';


@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.scss'
})
export class AdminReportsComponent {
// panelOpenState:boolean = false;
reports!: any [];
searchText: string = '';

reportsForm!: FormGroup;
DateForm!: FormGroup;

allScolarsUrl!: string;
globalUrl!:string;
usersUrl!: string;
hubsUrl!: string;
jobUrl!: string;
eventUrl!: string;
chaptersUrl!: string;

Scholars!: string;
Users!: string;
year!: string;
gender!: string;
branch!: string;
scholarType!: string;
ignoreCondition!: boolean;
all!: string;
dateFrom!: string;
dateTo!: string;

yearOptions: any[] = [
  'All','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015',
  '2014','2013','2012','2011','2010','2009','2008','2007','2006','2005','2004','2003','2002','2001','2000',
  '1999','1998'
];
branchOptions: any[] = []

constructor(
  private http: HttpServiceService
){
  this.reportsForm = new FormGroup({
    gender: new FormControl(''),
    branch: new FormControl(''),
    year: new FormControl(''),
    scholarType: new FormControl('')
  })

  this.DateForm = new FormGroup({
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
  })
}

ngOnInit(){

}  
// Scholars report
// Download Scholars Button
processValues(){
  // http://52.15.152.26:5555/reports/scholar-report?year=2017&gender=All&branch=All&scholarType=All&ignoreCondition=true

  this.year = this.reportsForm.value.year,
  this.gender = this.reportsForm.value.gender,
  this.scholarType = this.reportsForm.value.scholarType,
  // this.branch = this.reportsForm.value.branch
  this.branch = "Naivasha"

  this.globalUrl = `${this.http.serverUrl}reports/scholar-report?year=${this.year}&gender=${this.gender}&branch=${this.branch}&scholarType=${this.scholarType}/true`
   const globalUrl = `${this.http.serverUrl}reports/scholar-report?year=${this.year}&gender=${this.gender}&scholarType=${this.scholarType}`
   
   if (this.year== 'All' && this.gender == 'All' && this.scholarType == 'All' && this.branch == 'All' && this.ignoreCondition == true) {
    const url = `${this.http.serverUrl}reports/scholar-report`
    this.getReport(url);
   } else if(this.year== 'All' && this.gender == 'All' && this.scholarType == 'Local' && this.branch == 'All' && this.ignoreCondition == true ) {
    const url = `${this.http.serverUrl}reports/scholar-report&scholarType=${this.scholarType}&scholarType=${this.scholarType}`
    this.getReport(url);
   }
  this.getReport(this.globalUrl);
  }

  // Method to get scholars report
getReport(url:string) {
  console.log(url);
  
  this.http.getScholarsreport(url).subscribe((blob: Blob) => {
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

// Users Report
// Download users Button
pullUsers(){
  // http://52.15.152.26:5555/reports/generate-users-Report

  this.usersUrl = `${this.http.serverUrl}reports/generate-users-Report`
  this.getuserReport(this.usersUrl)
}

 // Method to get users report
getuserReport(url: string){
  console.log("Downloading report from:", url);

  this.http.getUsersreport(url).subscribe((blob: Blob) => {
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

// Hubs Report
// Download Hubs Button
pullHubs(){
  // http://52.15.152.26:5555/reports/generate-report-on-hubs
  //  'http://52.15.152.26:5555/reports/generate-report-on-hubs' \

  this.hubsUrl = `${this.http.serverUrl}reports/generate-report-on-hubs`
  this.getHubsReport(this.hubsUrl)
}

// Method to get Hubs report
getHubsReport(url: string){
  console.log("Downloading report from:", url);

  this.http.getHubsReport(url).subscribe((blob: Blob) => {
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
// Job Opportunity Report
// Download Job Opportunity Button
pullJobOpportunity(){
  // http://52.15.152.26:5555/reports/generate-job-opportunity-report?startDate=10%2F01%2F2023&endDate=10%2F01%2F2024

  this.dateFrom =  moment(this.DateForm.value.dateFrom).format('YYYY-MM-DD'); 
  this.dateTo =  moment(this.DateForm.value.dateTo).format('YYYY-MM-DD');

 
  
  this.jobUrl = `${this.http.serverUrl}reports/generate-job-opportunity-report?startDate=${this.dateFrom}&endDate=${this.dateTo}`
  this.getJobOpportunityReport(this.jobUrl)
}

// Method to get Job report
getJobOpportunityReport(url: string){
  console.log("Downloading report from:", url);

  this.http.getJobOpportunitiesReport(url).subscribe((blob: Blob) => {
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

// Event Report
 // Download Event Button
pullEvents(){
  // http://52.15.152.26:5555/reports/generate-events-report?startDate=01%2F01%2F2024&endDate=01%2F03%2F2024

  this.dateFrom =  moment(this.DateForm.value.dateFrom).format('YYYY-MM-DD'); 
  this.dateTo =  moment(this.DateForm.value.dateTo).format('YYYY-MM-DD');

  this.eventUrl = `${this.http.serverUrl}reports/generate-events-report?startDate=${this.dateFrom}&endDate=${this.dateTo}`
  this.getEventsReport(this.eventUrl)
}

// Method to get event end point
getEventsReport(url: string){
  console.log("Downloading report from:", url);

  this.http.getEventReport(url).subscribe((blob: Blob) => {
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

// Chapters Report
pullChapters(){
  // http://52.15.152.26:5555/reports/generate-chapter-report

  this.chaptersUrl = `${this.http.serverUrl}reports/generate-chapter-report`
  this.getChaptersReport(this.chaptersUrl)
}

// Method to get chapters endpoint
getChaptersReport(url: string){
  console.log("Downloading report from:", url);

  this.http.getChapterReport(url).subscribe((blob: Blob) => {
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


