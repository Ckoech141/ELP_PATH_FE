import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
})
export class EventDialogComponent implements OnInit {
  events: any[]=[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.events = history.state.events || [];
  }
}