import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  constructor(private http: HttpClient, private toast: ToastrService, private httpService: HttpServiceService) {}

   // Method to get all feedback
   getAllFeedback(): Observable<any[]> {
    const getAllFeedbackUrl = `${this.httpService.serverUrl}feedback/all`;
    
    return this.http.get<any[]>(getAllFeedbackUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.toast.error('Error fetching feedback');

        return throwError(error); // Return a new Observable with the error to propagate it to the subscriber
      })
    );
  }

  postFeedback(data: any, userId: number): Observable<any> {
    const postFeedbackUrl = `${this.httpService.serverUrl}feedback/${userId}/create`;
    console.log(data)
    console.log(userId)

    return this.http.post<any>(postFeedbackUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.toast.error('Error creating feedback');

        if (error.status === 500) {
          this.toast.error('Feedback creation failed. Please check the provided data.');
        }

        return throwError(error); // Return a new Observable with the error to propagate it to the subscriber
      })
    );
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    const url = `${this.httpService.serverUrl}feedback/${feedbackId}/deleting`; 
    return this.http.delete(url);
  }
}
