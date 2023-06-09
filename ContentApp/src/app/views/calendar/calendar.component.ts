import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ContentService } from 'src/app/service/content.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  events: CalendarEvent[] = [ /** */ ];

  constructor(
    private contentService: ContentService
  ) { /** */ }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onCreateClick(): void {
    this.contentService.createEvent();
  }
}
