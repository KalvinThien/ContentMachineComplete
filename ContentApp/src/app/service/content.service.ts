import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { Observable, Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { FirestoreRepository } from '../repository/firebase/firestore.repo';
import { EventColor } from 'calendar-utils';
@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private errorSubject = new Subject<string>();
  private calendarEventsSubject = new Subject<CalendarEvent[]>();

  errorObservable$ = this.errorSubject.asObservable();
  calendarEventsObservable$: Observable<CalendarEvent[]> = this.calendarEventsSubject.asObservable();

  colors: Record<string, EventColor> = {
    facebook: {
      primary: '#3b5998',
      secondary: '#8b9dc3',
    },
    twitter: {
      primary: '#1DA1F2',
      secondary: '#AAB8C2',
    },
    instagram: {
      primary: '#C13584',
      secondary: '#E1306C',
    },
    blog: {
      primary: '#FF0000',
      secondary: '#C13584',
    },
    linkedin: {
      primary: '#0077B5',
      secondary: '#0077B5',
    },
    default: {
      primary: '#000000',
      secondary: '#000000',
    },
  };

  constructor(
    private fireAuthRepo: FireAuthRepository,
    private firestoreRepo: FirestoreRepository
  ) {
    /** */
  }

  createContent(
    promptValue: string,
    imageValue: string,
    frequencyValue: string
  ) {
    const userId = this.fireAuthRepo.currentSessionUser?.uid;
    if (userId === undefined || userId === '') {
      this.errorSubject.next('User is not logged in');
      return;
    }

    const inputData = {
      userUuid: userId,
      content: promptValue,
      image: imageValue,
      frequency: frequencyValue,
    };

    axios
      .post('http://localhost:8000/api/schedule-text-posts', inputData)
      .then((response) => {
        // Handle the response from the Flask API
        console.log('Response:', response.data);

        const calendarEvents: CalendarEvent[] = [];

        if (response === undefined || response.data.length === 0) {
          this.errorSubject.next('Something went wrong.');
          return;
        }

        for (const [post_type, post] of Object.entries(response.data)) {
          console.log(post_type, post);
          for (const [key, post_data] of Object.entries(post as any)) {
            console.log("🚀 ~ file: content.service.ts:86 ~ ContentService ~ .then ~ post_data:", post_data)
            const key = Object.keys(post_data as any)[0]; // Get the first key in the object
            const value = (post_data as any)[key];
            let event = this.convert_post_to_event(post_type, key, value);
            console.log("🚀 ~ file: content.service.ts:88 ~ ContentService ~ .then ~ event:", event)
            calendarEvents.push(event);
          };
        }
        this.calendarEventsSubject.next(calendarEvents);
        console.log("🚀 ~ file: content.service.ts:93 ~ ContentService ~ .then ~ calendarEvents:", calendarEvents)
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
      });
  }

  convert_post_to_event(
    post_type: string,
    iso_date: string,
    post: any
  ): CalendarEvent {
    console.log('🚀 ~ file: content.service.ts:84 ~ post:', post);
    console.log('🚀 ~ file: content.service.ts:84 ~ iso_date:', iso_date);
    console.log('🚀 ~ file: content.service.ts:84 ~ post_type:', post_type);

    switch (post_type) {
      case 'facebook':
        post = {
          title: post.message.slice(0, 12),
          content: post.message,
          image_url: post.url,
          media_type: post.media_type,
          set_to_publish: post.published,
          color: this.colors['facebook'].primary,
          accent_color: this.colors['facebook'].secondary,
        };
        break;
      case 'tweet':
        let image_media = 'NONE';
        if (post.media_url !== '') {
          image_media = 'IMAGE';
        }
        post = {
          title: post.tweet.slice(0, 12),
          content: post.tweet,
          image_url: post.media_url,
          media_type: image_media,
          set_to_publish: true,
          color: this.colors['twitter'].primary,
          accent_color: this.colors['twitter'].secondary,
        };
        break;
      case 'instagram':
        post = {
          title: post.caption.slice(0, 12),
          content: post.caption,
          image_url: post.image_url,
          media_type: 'IMAGE',
          set_to_publish: post.published,
          color: this.colors['instagram'].primary,
          accent_color: this.colors['instagram'].secondary,
        };
        break;
      case 'blog':
        post = {
          title: post.title,
          content: post.content,
          image_url: '',
          media_type: 'NONE',
          set_to_publish: true,
          color: this.colors['blog'].primary,
          accent_color: this.colors['blog'].secondary,
        };
        break;
      default:
        break;
    }
    const event: CalendarEvent = {
      start: new Date(iso_date),
      title: post.title,
      color: {
        primary: post.color,
        secondary: post.accent_color,
      },
      meta: {
        post_type: post_type,
        post_date: iso_date,
        post_data: post,
      }
    };
    return event;
  }
}
