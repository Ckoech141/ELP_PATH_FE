import { Component, Input } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { UserJoinedEventsComponent } from '../user-joined-events/user-joined-events.component';
import { ViewEventInforComponent } from '../view-event-infor/view-event-infor.component';

@Component({
  selector: 'app-admin-chapter-events',
  templateUrl: './admin-chapter-events.component.html',
  styleUrls: ['./admin-chapter-events.component.scss'],
})
export class AdminChapterEventsComponent {
  userType = false;
  isLoading: boolean = false;
  constructor(
    public http: HttpServiceService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  @Input() chapterid!: string;
  userInfo: any;
  userSubscribedEvents: any[] = [];
  eventsData: any[] = [];
  getEventsUrl!: string;
  userId!: string;
  subscribedEvents: any[] = [];
   // Array to keep track of subscribed events

  ngOnInit() {
    const userData = localStorage.getItem('userData'); // Check if user data is available in local storage
    if (userData) {
      this.userInfo = JSON.parse(userData);
      // Fetch feeds when user data is available
      console.log("user", this.userInfo);

    }
    this.getEvents();
  }

  toggleSubscription(event: any): void {
    if (this.isSubscribed(event)) {
      this.unsubscribeFromEvent(event);
    } else {
      this.subscribeToEvent(event);
    }
  }

  isSubscribed(event: any): boolean {
    return this.subscribedEvents.some((e) => e.id === event.id);
  }

  subscribeToEvent(event: any): void {
    // http://52.15.152.26:5555/v2/events/10/participate/12
    // Call API endpoint to subscribe to event
    const eventId = event.eventId; // Assuming eventId is the unique identifier of the event

    const endpoint = `http://52.15.152.26:5555/v2/events/${eventId}/participate/12`;


    console.log('Subscribing to event:', event);
    // After successful subscription, add the event to the subscribedEvents array
    this.subscribedEvents.push(event);
    // You can also show a success message
  }

  unsubscribeFromEvent(event: any): void {
    // http://52.15.152.26:5555/v2/events/10/cancel-participation/12
    // Call API endpoint to unsubscribe from event
    // This is a placeholder. Replace it with your actual API call.
    console.log('Unsubscribing from event:', event);
    // After successful unsubscription, remove the event from the subscribedEvents array
    const index = this.subscribedEvents.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      this.subscribedEvents.splice(index, 1);
    }
    // You can also show a success message
  }

  getEvents() {
    this.checkUserEventSbscription()
    this.isLoading = true
    this.getEventsUrl = this.http.serverUrl + 'v2/events/all';

    this.http.getData(this.getEventsUrl).subscribe({
      next: (response) => {
        this.eventsData = response.payload.map((event: { id: any; }) => ({
          ...event,
          eventSubscription: this.userSubscribedEvents.some((subscribedEvent: { id: any; }) => subscribedEvent.id === event.id)
        }));
        // let events: any[] = []

        // const i = response.payload.forEach((element: any) => {
        //   console.log("123456", element);
        //   console.log("sub id", this.userSubscribedEvents.id);

        //   if (element.id === this.userSubscribedEvents.id) {
        //     const item = {
        //       ...element,
        //       eventSubscriptionStatus:true
        //     }
        //     events.push(item)
        //   } else {
        //     const item = {
        //       ...element,
        //       eventSubscriptionStatus:false
        //     }
        //     events.push(item)
        //   }
        // });
        // this.eventsData = events
        console.log(this.eventsData);

        // .map((item: any) => ({
        //   eventTitle: item.eventName,
        //   description: item.eventDescription,
        //   imageUrls: item.eventImages,
        //   organizer: item.organizer,
        //   location: item.location,
        //   link: item.eventLink,
        //   eventDate: item.eventDate,
        //   eventId: item.id,
        // }));
      },
      error: (error) => {
        this.isLoading = false
        this.snackBar.open(error.error.message)
      },
      complete: () => {
        this.isLoading = false
      },
    });
  }

  deleteEvent(eventId: any): void {
    console.log('Event ID', eventId);
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.http.deleteEvent(eventId).subscribe({
          next: () => {
            console.log('Event deleted successfully');

            const deletedIndex = this.eventsData.findIndex(
              (item) => item.id === eventId
            );

            if (deletedIndex !== -1) {
              this.eventsData.splice(deletedIndex, 1);
            }

            this.snackBar.open('Event deleted successfully', 'Close', {
              duration: 2000,
            });
          },
          error: (error: any) => {
            console.error('Error deleting event', error);
          },
        });
      } else {
        console.log('Deletion cancelled by the user.');
      }
    });
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
          this.getEvents()
        }
      )

    }
  }
  checkUserEventSbscription() {
    const url = `${this.http.serverUrl}v2/events/get-events-subscribed/${this.userInfo.id}`
    this.http.getData(url).subscribe(
      ((res) => {
        let item: any[] = []
        const i = res.payload.forEach((element: any) => {
          item.push(element?.event)
        });
        this.userSubscribedEvents = item
      }),
      ((error) => {
        this.snackBar.open(error.error.massage, "Close", { duration: 3600 })
      }),
      () => { }
    )
  }

  cancelAttendance(id: number) {
    //http://52.15.152.26:5555/v2/events/12/cancel-participation/123
    const url = `${this.http.serverUrl}v2/events/${this.userInfo.id}/cancel-participation/${id}`
    this.http.postData(url, '').subscribe(
      ((res) => {
        console.log(res);
      }),
      ((error) => {
        this.snackBar.open(error.error.message1, "Close", { duration: 3600 })
      }),
      () => { 
        this.snackBar.open(`${this.userInfo.firstName} You have successfully Cancelled attendance to this event`, 'Close', { duration: 3600 });
        this.getEvents()
      }
    )
  }

  //view event informaion
  viewEventInfor(id:number){
    this.dialog.open(ViewEventInforComponent, {
      width:'80%',
      height:'80%',
      data:{
        eventId:id
      }
    })
  }
}
