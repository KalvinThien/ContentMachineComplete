import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { Observable, Subject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ContentRepository } from '../repository/content.repo';
import { EventColor } from 'calendar-utils';
@Injectable({
  providedIn: 'root',
})
export class ContentService {

  private errorSubject = new Subject<string>();
  errorObservable$ = this.errorSubject.asObservable();

  private calendarEventsSubject = new Subject<CalendarEvent[]>();
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
    private contentRepo: ContentRepository
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
      this.calendarEventsSubject.next([]);
      return;

      this.contentRepo.createBulkContent(inputData).subscribe({
        next: (postResponse: {}[]) => {

          const calendarEvents: CalendarEvent[] = [];
          for (const post of postResponse) {
            let event = this.convert_post_to_event(post);
            console.log('🚀 ~ file: content.service.ts:88 ~ ContentService ~ .then ~ event:', event);
            calendarEvents.push(event);
          }
          this.calendarEventsSubject.next(calendarEvents);
        },
        error: (error) => {
          console.log("🔥 ~ file: content.service.ts:75 ~ ContentService ~ this.contentRepo.createBulkContent ~ error:", error)
          this.errorSubject.next(error);
        }
      })
  }

  convert_post_to_event(
    post: any
  ): CalendarEvent {
    console.log('🚀 ~ file: content.service.ts:84 ~ post:', post);

    switch (post.post_type) {
      case 'facebook':
        post = {
          post_date: post.post_date,
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
          post_date: post.post_date,
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
          post_date: post.post_date,
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
          post_date: post.post_date,
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

    return {
      start: new Date(post.post_date),
      title: post.title,
      color: {
        primary: post.color,
        secondary: post.accent_color,
      },
      meta: {
        ...post
      },
    };
  }

  getPostData() {
    return this.contentRepo.newlyCreatedPostData;
  }
}
