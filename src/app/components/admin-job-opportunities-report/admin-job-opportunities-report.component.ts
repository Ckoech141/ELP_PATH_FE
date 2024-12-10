import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-admin-job-opportunities-report',
  templateUrl: './admin-job-opportunities-report.component.html',
  styleUrl: './admin-job-opportunities-report.component.scss'
})
export class AdminJobOpportunitiesReportComponent {
  DateForm!: FormGroup;
  jobUrl!: string;
  panelOpenState: boolean = false;
  loading: boolean = false;

  dateFrom!: string;
  dateTo!: string;

  constructor(
    private http: HttpServiceService
  ){this.DateForm = new FormGroup({
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
    })
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

  this.loading = true;

  setTimeout(()=>{
    this.loading=false
  },2000);
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
}
