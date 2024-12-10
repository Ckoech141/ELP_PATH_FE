import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpServiceService } from 'src/app/services/http-service.service';
@Component({
  selector: 'app-admin-wtfs-graph',
  templateUrl: './admin-wtfs-graph.component.html',
  styleUrls: ['./admin-wtfs-graph.component.scss'],
})
export class AdminWtfsGraphComponent implements OnInit, OnChanges {
  @Input() year: string = '';
  private chart: any;
  urlGetApplicationCount!: string;
  applicationCountData: any;
  list: string[] = [];
  totalList: string[] = [];
  wtf!: any;

  constructor(private http: HttpServiceService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year'] && changes['year'].previousValue != undefined) {
      this.year = changes['year'].currentValue
      this.list = []
      this.totalList = []
      this.ngOnInit()
    }else{
      this.year = '2021'
    }
  }

  

  ngOnInit() {
    this.retrieveScholarData(this.year);
  }

  retrieveScholarData(year: string) {
    let url = '';
    if(year == 'all'){
      url = this.http.serverUrl+'scholars/scholar-stats/?ignoreCondition=true'
    }else{
      url = this.http.serverUrl+'scholars/scholar-stats/?year='+year+'&ignoreCondition=false'

    }
    this.http.getData(url).subscribe({
      next: (response) => {
        this.calculateAndPushData(
          response.payload.localScholars || 0,
          'Local University'
        );
        this.calculateAndPushData(
          response.payload.tvetScholars || 0,
          'Local Tvets'
        );
        this.calculateAndPushData(
          response.payload.regionalScholars || 0,
          'Regional Uni'
        );
        this.calculateAndPushData(
          response.payload.globalScholars || 0,
          'Global Varsities'
        );

        this.setupChart(this.list, this.totalList); // Set up chart once data is processed
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }

  calculateAndPushData(total: any, label: string) {
    this.totalList.push(total);
    this.list.push(label);
  }

  private setupChart(labelList: string[], totalCountList: string[]): void {
    // data for the chart
    let ctx;
    if (this.chart) {
      this.chart.destroy();
      ctx = null;
    }
  
    ctx = document.getElementById('wtfs') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labelList,
        datasets: [
          {
            data: totalCountList,
            backgroundColor: ['#2596be', '#be4d25', '#a32a29', '#041014'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  //=====================================end of method functions=============================================
}
