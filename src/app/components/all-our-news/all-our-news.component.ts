import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-all-our-news',
  templateUrl: './all-our-news.component.html',
  styleUrl: './all-our-news.component.scss'
})
export class AllOurNewsComponent {

  allNews:any
  constructor(private http:ServiceService){
   
  }

  ngOnInit(){
    this.getallNews()
  }

  getallNews(){
    this.http.getNewsData().subscribe(
      ((res) =>{

        this.allNews = res.payload
        console.log(res);
        
      }),
      ((err) => {}),
      ()=>{}

)}
}
