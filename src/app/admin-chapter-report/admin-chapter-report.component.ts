import { Component } from '@angular/core';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-admin-chapter-report',
  templateUrl: './admin-chapter-report.component.html',
  styleUrl: './admin-chapter-report.component.scss'
})
export class AdminChapterReportComponent {
  chaptersUrl!: string;
  panelOpenState: boolean = false;
  loading: boolean = false;

  constructor(
    private http: HttpServiceService
  ){}
  
  // Chapters Report
pullChapters(){
  // http://52.15.152.26:5555/reports/generate-chapter-report

  this.chaptersUrl = `${this.http.serverUrl}reports/generate-chapter-report`
  this.getChaptersReport(this.chaptersUrl)
}

// Method to get chapters endpoint
getChaptersReport(url: string){

  this.loading = true;
  setTimeout(()=>{
    this.loading = false
  },2000);
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
