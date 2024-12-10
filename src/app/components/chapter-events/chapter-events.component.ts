import { Component, OnInit } from '@angular/core';
import { EventsServiceService } from 'src/app/services/events-service.service';

@Component({
  selector: 'app-chapter-events',
  standalone: false,
  templateUrl: './chapter-events.component.html',
  styleUrl: './chapter-events.component.scss'
})
export class ChapterEventsComponent implements OnInit{

  showWhat: Boolean = false
  chapterEvents: any[] = []
  chapterData: any[] = []
  userData:any

  constructor(private httpEvents: EventsServiceService){}

  ngOnInit(){
    this.userData = localStorage.getItem('user')
    console.log(this.userData)
    this.getChapterEvents(5)
  }

  joinEvent(data: any){

  }

  getChapterEvents(chapterId: any){
    const res = this.httpEvents.getChapterEvents(chapterId);

    res.subscribe(
      (value: any)=>{
        this.chapterData = value.payload
        if(this.chapterData.length > 0){
            this.showWhat = true
        }
      }
    )

  }

}
