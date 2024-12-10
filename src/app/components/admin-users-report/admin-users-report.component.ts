import { Component } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-admin-users-report',
  templateUrl: './admin-users-report.component.html',
  styleUrl: './admin-users-report.component.scss'
})
export class AdminUsersReportComponent {
  usersUrl!: string;
  Users!: string;
  panelOpenState:boolean = false;
  loading: boolean = false;

  constructor(private http: HttpServiceService){}

  // Users Report
// Download users Button
pullUsers(){
 
  // http://52.15.152.26:5555/reports/generate-users-Report

  this.usersUrl = `${this.http.serverUrl}reports/generate-users-Report`
  this.getuserReport(this.usersUrl)
}

 // Method to get users report
getuserReport(url: string){
  this.loading = true;

  setTimeout(()=> {
    this.loading = false;
  },2000);
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
}
