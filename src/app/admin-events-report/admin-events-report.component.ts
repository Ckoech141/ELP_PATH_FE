import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-admin-events-report',
  templateUrl: './admin-events-report.component.html',
  styleUrl: './admin-events-report.component.scss'
})
export class AdminEventsReportComponent {
  DateForm!: FormGroup;
  eventUrl!: string;
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

  this.loading = true;

  setTimeout(()=>{
    this.loading = false;
  },2000);
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
}
