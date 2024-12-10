import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {

  constructor(private http:HttpClient, private service: HttpServiceService) { }

  confirmPArticipation(userId: any, eventId:any, data:any): Observable<any>{
    const url = this.service.serverUrl + "v2/events/" + userId + "/participate/" + eventId

    return this.http.post(url, null)
      
  }

  getChapterEvents(chapterId: any){
    const url = this.service.serverUrl +  "v2/events/" + chapterId + "/display-chapter-events"
    return this.http.get(url)
  }
}
