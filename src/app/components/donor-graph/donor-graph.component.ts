import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-donor-graph',
  standalone: true,
  imports: [],
  templateUrl: './donor-graph.component.html',
  styleUrls: ['./donor-graph.component.scss']
})
export class DonorGraphComponent {
  alumni: any;
  current: any;
  @Input() year: any
  private chart: any;

  constructor(private http: HttpServiceService) {}

  urlGetDonorData!: string;
  dataAlumniCurrent: number[] = [];
  donorData: number[]  = [];

  ngOnInit() {
    this.getGenderStats();
    console.log("Alumni Data",this.alumni)
  }

  setupChart() {
    const ctx = document.getElementById('expenses') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      
      type: 'doughnut',
      data: {
       labels: ["Alumni", "Current"],
        datasets: [
          {
            label: 'scholars',
            data: [this.alumni, this.current],
            backgroundColor: ['#2596be', '#be4d25'],
            hoverOffset: 4,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // scales: {
        //   y: {
        //     beginAtZero: true,
        //   },
        // },
      },
    });
  }

  getGenderStats() {
    this.urlGetDonorData = this.http.serverUrl + 'scholars/scholar-stats/?year=all&ignoreCondition=true';
    this.http.getData(this.urlGetDonorData).subscribe({
      next: (response: any) => {
        this.alumni = response.payload.alumni
        this.current = response.payload.currentscholar
        
        //this.donorData = response.payload.majorDonors.map((item: any) => item.count);
        //this.donorList = response.payload.majorDonors.map((item: any) => item.donor);
        console.log("Response PAYLOAD",response.payload)
        this.setupChart();
      },
      error: (error: any) => {},
      complete: () => {}
    })
  }
}
