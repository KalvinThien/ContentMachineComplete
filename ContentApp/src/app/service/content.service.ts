import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { FirestoreRepository } from '../repository/firebase/firestore.repo';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private errorSubject = new Subject<string>();
  private calendarEventsSubject = new Subject<CalendarEvent[]>();

  errorObservable$ = this.errorSubject.asObservable();
  calendarEventsObservable$ = this.calendarEventsSubject.asObservable();

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
          console.log("🚀 ~ file: content.service.ts:51 ~ .then ~ post_type, post:", post_type, post)
          
          for (const [iso_date, post_data] of Object.entries(post as any)) {
            const key = Object.keys(post_data as any)[0]; // Get the first key in the object
            const value = (post_data as any)[key];
            console.log("🚀 ~ file: content.service.ts:54 ~ .then ~ iso_date, post_data:", iso_date, post_data)
            let event = this.convert_post_to_event(
              post_type,
              key,
              value
            );
            calendarEvents.push(event);
          }
        }
        this.calendarEventsSubject.next(calendarEvents);
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
    console.log("🚀 ~ file: content.service.ts:84 ~ post:", post)
    console.log("🚀 ~ file: content.service.ts:84 ~ iso_date:", iso_date)
    console.log("🚀 ~ file: content.service.ts:84 ~ post_type:", post_type)
    let primary_color_by_type: string;
    let accent_color_by_type: string;
    switch (post_type) {
      case 'facebook':
        primary_color_by_type = '#3b5998';
        accent_color_by_type = '#8b9dc3';
        break;
      case 'twitter':
        primary_color_by_type = '#1DA1F2';
        accent_color_by_type = '#AAB8C2';
        break;
      case 'instagram':
        primary_color_by_type = '#C13584';
        accent_color_by_type = '#E1306C';
        break;
      case ' blog':
        primary_color_by_type = '#FF0000';
        accent_color_by_type = '#C13584';
        break;
      default:
        primary_color_by_type = '#000000';
        accent_color_by_type = '#000000';
    }

    switch (post_type) {
      case 'facebook':
        post = {
          title: post.message.slice(0, 12),
          content: post.message,
          image_url: post.url,
          media_type: post.media_type,
          set_to_publish: post.published,
          color: primary_color_by_type,
          accent_color: accent_color_by_type,
        };
        break;
      case 'twitter':
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
          color: primary_color_by_type,
          accent_color: accent_color_by_type,
        };
        break;
      case 'instagram':
        post = {
          title: post.caption.slice(0, 12),
          content: post.caption,
          image_url: post.image_url,
          media_type: 'IMAGE',
          set_to_publish: post.published,
          color: primary_color_by_type,
          accent_color: accent_color_by_type,
        };
        break;
      case 'blog':
        post = {
          title: post.title,
          content: post.content,
          image_url: '',
          media_type: 'NONE',
          set_to_publish: true,
          color: primary_color_by_type,
          accent_color: accent_color_by_type,
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
      },
    };
    return event;
  }
}
