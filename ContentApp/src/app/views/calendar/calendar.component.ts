import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarEvent } from 'angular-calendar';
import { SessionService } from 'src/app/service/session.service';
import { SocialAccountService } from 'src/app/service/socialaccount.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  viewDate: Date = new Date();
  events: CalendarEvent[] = [ /** */ ];

  linkedInToken: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private socialAccountService: SocialAccountService
  ) { /** */ }

  ngOnInit(): void {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    if (this.linkedInToken !== undefined && this.linkedInToken !== '') {
      this.socialAccountService.getLinkedInAccessToken(this.linkedInToken);
    } else {
      // TODO handle error in the UI
      console.log('🔥 error')
    }
  }
}
