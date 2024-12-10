import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminAddActivityFormComponent } from '../admin-add-activity-form/admin-add-activity-form.component';
import { AdminAddEventFormComponent } from '../admin-add-event-form/admin-add-event-form.component';
import { ActivatedRoute } from '@angular/router';
import { AdminChapterEventsComponent } from '../admin-chapter-events/admin-chapter-events.component';
import { AdminChapterActivitiesComponent } from '../admin-chapter-activities/admin-chapter-activities.component';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-chapter-home',
  templateUrl: './admin-chapter-home.component.html',
  styleUrls: ['./admin-chapter-home.component.scss'],
})
export class AdminChapterHomeComponent {
  chapter:any;
  @ViewChild(AdminChapterEventsComponent)
  eventsComponent!: AdminChapterEventsComponent;
  @ViewChild(AdminChapterActivitiesComponent)
  activitiesComponent!: AdminChapterActivitiesComponent;
  chapterId = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpServiceService,
    public dialog: MatDialog
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.chapterId = params['chapterId'];
      console.log("params",params['chapterId']);
      if (this.chapterId) {
        this.getChapterDetails()
      }
      
    })
  }

  getChapterDetails(){

    const url = `${this.http.serverUrl}v2/chapters/${this.chapterId}/view`
    this.http.getData(url).subscribe(
      ((res) => {
        console.log(res.payload);
        this.chapter = res.payload
      }),
      ((e) => {
        console.error(e);
        
      }),
      () => {

      }
    )

  }

  // add event form dialog
  addEventDialog(): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddEventFormComponent> =
      this.dialog.open(AdminAddEventFormComponent, {
        width: '50%',

        // Set the width of the dialog

        data: { data: this.chapterId }, // You can pass data to the dialog component using the `data` property
      });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.eventsComponent.ngOnInit();
    });
  }

  // add activity form dialog
  addActivityDialog(): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddActivityFormComponent> =
      this.dialog.open(AdminAddActivityFormComponent, {
        width: '50%',

        // Set the width of the dialog

        data: { data: this.chapterId }, // You can pass data to the dialog component using the `data` property
      });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.activitiesComponent.ngOnInit();
    });
  }
}
