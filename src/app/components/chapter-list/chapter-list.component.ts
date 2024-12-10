import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ServiceService } from 'src/app/services/service.service';
import { AdminAddEventFormComponent } from '../admin-add-event-form/admin-add-event-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminEventsApproveRequestsComponent } from '../admin-events-approve-requests/admin-events-approve-requests.component';
import { UserEventsApprovalComponent } from '../user-events-approval/user-events-approval.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrl: './chapter-list.component.scss'
})
export class ChapterListComponent implements OnInit {
  panelOpenState = false;
  chapters: any[] = []
  userInfo: any;
  chapterId: any;
  activeChapter: any
  userChapters: any;
  events: any;
  serverUrl: string = ' '
  scheduledEvents: any;
  pastEvents: any;
  isLoading: boolean = false;
  activeChapterId:string = '';
  members:any;
  showLeftCard = true;
  constructor(
    private http: HttpServiceService,
    private breakpointObserver: BreakpointObserver,
     public dialog: MatDialog, 
     private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData'); // Check if user data is available in local storage
    if (userData) {
      this.userInfo = JSON.parse(userData);
      // Fetch feeds when user data is available
      console.log("user", this.userInfo);

    }
    this.getUserChapter()
    this.serverUrl = this.http.serverUrl
    console.log("this.activeChapter.id", this.activeChapter?.chapterId
  );
  
  this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
    this.showLeftCard = !result.matches;
  });
  }

  toggleLeftCard(): void {
    this.showLeftCard = !this.showLeftCard;
  }
  joinChapter(chapter: any) {
    this.http.joinChapter(this.userInfo.id, chapter?.chapterId
    ).subscribe(
      ((res) => {
        console.log(res);
      }),
      ((err) => {
        console.error(err);
      }),
      (() => {
        console.log("user successifully joined the cahpter");

      })
    )

  }

  getUserChapter() {
    this.http.getUserChapters(this.userInfo.id).subscribe(
      ((response) => {
        this.userChapters = response.payload
        this.activeChapter = response.payload[0]
        this.activeChapterId = response.payload[0].chapterId
        this.getEvents(response.payload[0].chapterId
        )
        console.log('-----', this.userChapters);
        this.chapterId = response.payload[0].chapterId


      }),
      ((error) => {
        this.snackBar.open(error.error.message, "Close", { duration: 3600 })
      }),
      () => {
        this.getChapterMembers()
      }
    )
  }
  selectChapter(chapter: any) {
    //this.events = '';
    this.activeChapter = chapter
    this.activeChapterId = chapter?.chapterId
    this.getEvents(chapter?.chapterId
    )
    this.getChapterMembers()
  }

  createChapterEvent(id: number) {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddEventFormComponent> =
      this.dialog.open(AdminAddEventFormComponent, {
        width: '50%',

        // Set the width of the dialog

        data: { data: id }, // You can pass data to the dialog component using the `data` property
      });
    // dialogRef.afterClosed().subscribe(
    //   ((results) => {
    //     this.getEvents(id)
    //   })
    // )
  }

  //get chapter events
  getEvents(id: number) {
    this.events = '' || null || undefined
    this.isLoading = true
    this.http.getChapterEvents(id).subscribe(
      ((res) => {
        this.events = res.payload
        let past: any[] = [];
        let scheduled: any[] = []
        if (this.events) {
          const i = this.events.forEach((element: any) => {
            if (element.eventStatus = "PAST") {
              past.push(element)
            } else if (element.eventStatus = "Scheduled") {
              scheduled.push(element)
            }
          });
        } else {
          this.snackBar.open('No events Found', "Close", { duration: 3600 })
        }
        this.pastEvents = past || scheduled
        this.scheduledEvents = scheduled
        console.log("eysdyudyusu", this.events);

      }),
      ((error) => {
        this.isLoading = false;
        this.snackBar.open(error.error.message, "Close", { duration: 3600 })
      }),
      () => {
        this.isLoading = false
      }
    )
  }

  confirmAttendance(id: string) {
    if (id && this.userInfo.id) {
      this.http.eventSubscribe(this.userInfo.id, id).subscribe(
        ((res) => {
        }),
        ((error) => {
          this.snackBar.open(`${this.userInfo.firstName} ${error.error.message1}`, 'Close', { duration: 3600 });
        }),
        () => {
          this.snackBar.open(`${this.userInfo.firstName} You have successfully confirmed attendance to this event`, 'Close', { duration: 3600 });
        }
      )

    }
  }

  approveChapterEvents(id:number) {
    alert("hello")
    this.dialog.open(UserEventsApprovalComponent,{
      width:"90%",
      height:"85%",
      data:{
        eventType:"Chapter",
        chapterId:id
      }
    })
  }

  handleError(event: any){
    event.target.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAJFBMVEXQ0NDw8PDj4+Pc3NzU1NTn5+fz8/Pt7e3f39/X19fq6urNzc0EuZL3AAADYElEQVR4nO2bCZajIBRFC0EFs//9tomWpZFRUXj2uxvIv+cPMuXnhxBCCCGEEEIIIYQQQgghhBBCCCHkSShjpNZaGlU6ktMY3faieyP6VpaO5hRKjyZiZvQZgHXkILZ0XQtabGNaOvFN12PayJ3Jx2YwpQM7gLTkZbLBy4357pc/4PpGNU4XIdBmmuzdLmiF5k3MmJpX6QBTMIO9+3+7BkrGPpYXsD422psYrBGgmoCMBqoz1QZkGsqU4VkyT+qZ8DRDkgl9Z6C2AZ4185uhdHxJBJoGqmX8q2YBtmoeh7MvMaWjS2V3MvMH3E7TM9CwRtmEY3/W9Ugr5gWlbS5Qq/8Vo833gO4Qa2zGtNus4M2xDaYd+m66BRB9Uzqa0yipm7ZtGg3aLIQQQgghhBBC/hfwThLdSMBzUQdK9qLFPbXaML3Le4jN/MbwETbLu7wH9M3qjSG8jV5fyoFX2tfdArLNa3dPgmvzstzHwfaN7f4KNTdWF1Ab7XpcgGez733cvnl5H32A2ThrDLDSAi5INr5+mYH5n5G/Xxab0mHGEawxoNyEa2y2AXjIFusCYGNbW3psSofrJar3VzZVT4H9y6i6Kk028b+X6nK3jey7aJu4mVzOxrzPViJtXP/1DNjc9r0xU93E2Fj/TxzFTTbytwfCNupYXu7LzSq+oM1xl3tsNt+MgM0ZlztszHbOem3Oubxtrt3fmO9vhtvmRL8sXGpjic9lk8PlUhvrGsthk8XlQhvHetFqk8nlMhtnfBabbC4X2Xji29lkdLnExvPPoJ1NVpcLbAL7q41NZpfsNsG94somu0tmm4j4FpsLXLLaRO3hZ5tLXDLaeHt/a/M6vH+5ySb6bKVRSWdKJWwS9vDNkf3+nTZJZ15XumSwieyXezhpU5XLSZu0c9UbOLGTvuibcYbDNhW6HLaprF9+OXRyW12/zBw5gTI11tiH9FP1KvtlJjU3Nbuk2sjk+6F7Sbn33J1bVke8jelqdxltHlJjE09yiZOpv18molwA+uXDc2pMxMig1JiIkMHJS1gGKC9BGSiXgEyt+xcHT3LxytS95rfgcykdWzIPyotHBq1f3jzJxSUD6eKQwXSxy4C6WGUqPYMNY80L3Eye2bso3aBikcHFMZoJIYQQQgghpHr+AZZ6NU6cNizeAAAAAElFTkSuQmCC"

  }
  getChapterMembers() {
    //http://52.15.152.26:5555/v2/chapters/12/display-chapter-members
    const getChapterMembers =
      this.http.serverUrl +
      'v2/chapters/' +
      this.activeChapter?.chapterId +
      '/display-chapter-members';
    this.http.getData(getChapterMembers).subscribe({
      next: (response) => {
        this.members = response.payload;
      },
      error: (error) => {
        this.snackBar.open(error.error.message, "Close", {duration:3600})
      },
      complete: () => {},
    });
  }
}


