import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  events: CalendarEvent[] = [ /** */ ];

  constructor() { /** */ }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
