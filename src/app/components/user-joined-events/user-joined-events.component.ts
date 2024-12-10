import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { EventsServiceService } from 'src/app/services/events-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-user-joined-events',
  templateUrl: './user-joined-events.component.html',
  styleUrl: './user-joined-events.component.scss'
})
export class UserJoinedEventsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private service: EventsServiceService){
    console.log(data)
  }

  confirmJoin(eventId:any){
    const res = this.service.confirmPArticipation(1, eventId, null)
    res.subscribe(
      (value) => {
        console.log(value)

      }
    )
  }

}
