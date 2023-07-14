import { MessageService } from 'primeng/api';
import { ContentService } from 'src/app/service/content.service';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Subject, map } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateContentComponent } from '../createcontent/createcontent.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {

  showEventModal = false;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData?: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();
  activeDayIsOpen: boolean = false;
  events: CalendarEvent[] = [ /** */ ];
  
  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fas fa-fw fa-pencil-alt"></i>',
    //   a11yLabel: 'Edit',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent('Edited', event);
    //   },
    // },
    // {
    //   label: '<i class="fas fa-fw fa-trash-alt"></i>',
    //   a11yLabel: 'Delete',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter((iEvent) => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   },
    // },
  ];

  private dialogRef?: DynamicDialogRef;

  constructor(
    private contentService: ContentService,
    private messageService: MessageService,
    public dialogService: DialogService 
  ) {
    /** */
  }

  ngOnInit(): void {
    this.contentService.calendarEventsObservable$.subscribe((events) => {
      this.events = events;
      this.dialogRef?.close(); 

      if (events.length == 0) {
        this.messageService.add({
          severity: 'warning',
          summary: 'Something Went Wrong',
          detail: 'We were unable to schedule your content. Please try again.',
        });
      }

    });
    this.contentService.errorObservable$.subscribe((error) => {
      this.dialogRef?.close(); 
      this.messageService.add({
        severity: 'error',
        summary: 'Oops',
        detail: error,
      });
    });
  }

  onCreateClick(): void {
    this.dialogRef = this.dialogService.open(CreateContentComponent, { width: '75%' })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log(
      '🚀 ~ file: calendar.component.ts:189 ~ CalendarComponent ~ handleEvent ~ modalData:',
      this.modalData
    );
    this.showEventModal = true;
  }

  addEvent(): void {
    // this.events = [
    //   ...this.events,
    //   {
    //     title: 'New event',
    //     start: startOfDay(new Date()),
    //     end: endOfDay(new Date()),
    //     color: colors['red'],
    //     draggable: true,
    //     resizable: {
    //       beforeStart: true,
    //       afterEnd: true,
    //     },
    //   },
    // ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
