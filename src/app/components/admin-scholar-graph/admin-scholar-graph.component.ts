import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chart }  from 'chart.js/auto';
import { HttpServiceService } from 'src/app/services/http-service.service';
@Component({
  selector: 'app-admin-scholar-graph',
  templateUrl: './admin-scholar-graph.component.html',
  styleUrls: ['./admin-scholar-graph.component.scss'],
})
export class AdminScholarGraphComponent implements OnInit, OnChanges,OnDestroy {
  @Input() year: string = ''

  private chart: any;
  urlGetApplicationCount!: string;
  applicationCountData: any;
  labelList: string[] = [];
  totalCountList: string[] = [];

  wtf!: any;

  constructor(private http: HttpServiceService) {}

  

  ngOnDestroy(): void {
    // Ensure the chart is destroyed when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['year'] && changes['year'].previousValue != undefined){
      console.log("PREVIOUS VALUE", )
      this.year = changes['year'].currentValue
      this.labelList = []
      this.totalCountList = []
      this.ngOnInit()
    }

  }

  ngOnInit() {
    this.retrieveScholarData(this.year);
  }

  retrieveScholarData(year : string) {
    let url = ''
    if(year == 'all'){
     
        url = this.http.serverUrl+'scholars/scholar-stats/?ignoreCondition=true'
    }else{
      url = this.http.serverUrl+'scholars/scholar-stats/?year='+year+'&ignoreCondition=false'
    }
    const graphUrl = `${this.http.serverUrl}education/count-education-levels`
    //http://52.15.152.26:5555/education/count-education-levels
    this.http.getData(graphUrl).subscribe({
      next: (response) => {
        const i = response.payload.forEach((e: any) => {
          console.log(e);
          this.calculateAndPushData(
            e.count || 0,
            e.courseLevel
          );          
        })
        // Set up chart once data is processed
        this.setupChart(this.labelList, this.totalCountList);
      },
      error: (error) => {
        console.log('Error:', error);
       // this.setupChart(this.labelList, this.totalCountList); // Setup chart with available data
      },
      complete: () => {},
    });
  }

  calculateAndPushData(total: any, label: string) {
    this.totalCountList.push(total);
    this.labelList.push(label);
  }

  private setupChart(labelList: string[], totalCountList: string[]): void {
    let ctx;

  // Destroy existing chart if it exists
  if (this.chart) {
    this.chart.destroy();
    ctx = null
  }

  ctx = document.getElementById('scholars') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labelList,
        datasets: [
          {
            data: totalCountList,
            label: 'scholars Education Levels',
            barThickness: 25,  
            backgroundColor: '#a32a29',
            barPercentage:1,
            borderColor: '#a32a29',
            
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  //=====================================end of method functions============================================
}
