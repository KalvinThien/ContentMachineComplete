import { Component } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [ /** */ ];

  constructor() { /** */ }
}
