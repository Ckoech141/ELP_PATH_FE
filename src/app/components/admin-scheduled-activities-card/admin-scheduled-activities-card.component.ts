import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-scheduled-activities-card',
  templateUrl: './admin-scheduled-activities-card.component.html',
  styleUrls: ['./admin-scheduled-activities-card.component.scss'],
})
export class AdminScheduledActivitiesCardComponent {
  constructor(public http: HttpServiceService,
    public snackBar:MatSnackBar
  ) {}

  activityCount!: number;

  ngOnInit() {
    this.getActivity();
  }

  // method to get scheduled activity
  getActivity() {
    const getActivityUrl =
      // this.http.serverUrl + 'activities/count-scheduled-activities';
      this.http.serverUrl + 'v2/events/count-scheduled-events'

    this.http.getData(getActivityUrl).subscribe({
      next: (response) => {
        console.log('ttttttttttt', response);
        this.activityCount = response.payload;
      },
      error: (error) => {
        this.snackBar.open(error.error.message)
      },
      complete: () => {},
    });
  }
}
