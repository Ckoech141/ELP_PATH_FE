import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpServiceService } from '../services/http-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternsService {

  constructor(private httpClient: HttpClient, private httpService: HttpServiceService) { }

  saveInternInfo(intern: any): Observable<any>{
    return this.httpClient.post<any>(this.httpService.serverUrl+'intern/new', intern);
  }

  getSchools(): Observable<any> {
    return this.httpClient.get<any>(this.httpService.serverUrl+'schools/all')
  }

  getBranches(): Observable<any> {
    return this.httpClient.get<any>(this.httpService.serverUrl+'branch/all')
  }
}
