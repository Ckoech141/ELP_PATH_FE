// email.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from '../models/survey.model';

// interface Survey {
//   id: number;
//   hubId: number;
//   title: string;
//   questionId: number;
//   question: string;
//   chapterId: number;
// }
@Injectable({
  providedIn: 'root',
})
export class surveyService {
  private url = 'http://192.168.88.40:8080'; 

  constructor(private http: HttpClient) { }

  sendSurvey(data: any): Observable<any> {
    
    console.log(data)
    return this.http.post(`${this.url}/survey/add`, data);
  }

  getSurvey(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.url}/survey/get/all-surveys-questions`);
  }
}

