import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-admin-scholars-report',
  templateUrl: './admin-scholars-report.component.html',
  styleUrl: './admin-scholars-report.component.scss'
})

export class AdminScholarsReportComponent {
  reportsForm!: FormGroup;
  DateForm!: FormGroup;
  panelOpenState:boolean = false;
  loading:boolean = false;

  allScolarsUrl!: string;
  globalUrl!:string;

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

  // Scholars report
// Download Scholars Button
processValues(){
  this.loading = true;

  setTimeout(()=> {
    this.loading = false;
  },2000);

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

}
