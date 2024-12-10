import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-registered-graph',
  standalone: false,
  templateUrl: './registered-graph.component.html',
  styleUrl: './registered-graph.component.scss'
})
export class RegisteredGraphComponent {
  private chart: any;
  registeredUsers: any;
  unregisteredUsers:any;

  constructor(private httpEvents: HttpServiceService, private httpClient: HttpClient){}

  ngOnInit(){
    this.getRegistered()
    this.setupChart()
  }

  getRegistered(){
      const url = this.httpEvents.serverUrl + "scholars/registered/Unregistered/user/view"

      const res = this.httpClient.get(url)

      res.subscribe(
        (value: any) => {
          this.registeredUsers = value.payload.registeredUsers
          this.unregisteredUsers = value.payload.unregisteredUsers
            console.log(this.registeredUsers)
        }
      )


  }


  setupChart() {
    const ctx = document.getElementById('register') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: "bar",
      data: {
       labels: ["registered", "unregistered"],
        datasets: [
          {
            label: 'scholars',
            data: [parseInt(this.registeredUsers),  parseInt(this.unregisteredUsers)],
            barPercentage: 0.5,
            barThickness: 30,
            backgroundColor: ['#00FF00'],
            borderColor: '#041014',
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        
      },
    });
  }

}
