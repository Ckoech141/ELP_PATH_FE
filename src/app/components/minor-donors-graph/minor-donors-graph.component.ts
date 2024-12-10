import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-minor-donors-graph',
  standalone: true,
  imports: [],
  templateUrl: './minor-donors-graph.component.html',
  styleUrls: ['./minor-donors-graph.component.scss']
})
export class MinorDonorsGraphComponent {
  @Input() year: any
  private chart: any;
  courseClusters: string[] = [];
  courseClustersInfo: number[] = [];


  constructor(private http: HttpServiceService) {}

  urlGetDonorData!: string;
  donorList: string[] = [];
  donorData: number[]  = [];

  ngOnInit() {
    this.getCourseClusters()
    

  }

  setupChart() {
    console.log("course clusters", this.courseClusters)
    console.log("course Info", this.courseClustersInfo)

    const ctx = document.getElementById('donors') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.courseClusters,
        datasets: [
          {
            label: 'course cluster scholars',
            barThickness: 25,
            data: this.courseClustersInfo,
            borderColor: '#041014',

            // fill: false,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
      },
    });
  }

  private setupDefaultChart(): void {
    const ctx = document.getElementById('donors') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
     
      data: {
        labels: ['Year 1', 'Year 2'],
        datasets: [
          {
            label: 'Donors',
            data: [0, 0],
            backgroundColor: '#a32a29',
            barPercentage:1,
            borderColor: '#a32a29',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
       
      
      },
    });
  }

  getCourseClusters(){
    const clusterUrl = `${this.http.serverUrl}education/clusters/count/`
    this.http.getData(clusterUrl).subscribe({
      next: (response: any) => {
        
        console.log("course clusters", response.payload)

        if(response.payload.length > 0){
          for(let i = 0; i < response.payload.length; i++){
              let cluster = response.payload[i].name.slice(0, 50)
              let clusterCount = response.payload[i].count
              this.courseClusters.push(cluster)
              //let num = `${i+1}${i+2}${i+3}`
              //let originaml = Math.ceil(num)
              //this.courseClustersInfo.push(parseInt(num))
              this.courseClustersInfo.push(clusterCount)

          }
        }

      },
      error: (error: any) => {

      },
      complete: () => {
        this.setupChart();
      }
    })

  }

  getGenderStats() {
    this.urlGetDonorData = this.http.serverUrl + 'scholars/scholar-stats/?year=' + this.year + '&ignoreCondition=false';
    this.http.getData(this.urlGetDonorData).subscribe({
      next: (response: any) => {
        this.donorData = response.payload.minorDonors.map((item: any) => item.count);
        this.donorList = response.payload.minorDonors.map((item: any) => item.donor);

        this.setupChart();
      },
      error: (error: any) => {},
      complete: () => {}
    })
  }
}
