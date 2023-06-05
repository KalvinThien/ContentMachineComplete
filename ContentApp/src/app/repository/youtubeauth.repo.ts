import { Injectable } from '@angular/core';
import { Observable, catchError, of, map, concatMap, from, Subject } from 'rxjs';
import { YOUTUBE_CLIENT_ID } from '../../../appsecrets';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class YoutubeAuthRepository {
  [x: string]: any;

  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private readonly UPDATE_URL = 'https://www.googleapis.com/youtube/v3/channels';

  private identityTokenClient: any;

  private tokenResponseSubject = new Subject<string>();
  tokenResponseObserver$ = this.tokenResponseSubject.asObservable();

  constructor() { this.initTokenClient(); }

  getRequestToken() { this.identityTokenClient.requestAccessToken(); }

  initTokenClient() {
    console.log(
      '🚀 ~ file: youtube.service.ts:24 ~ YoutubeService ~ initTokenClient ~ initTokenClient:'
    );
    //@ts-ignore
    this.identityTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: YOUTUBE_CLIENT_ID,
      scope:
        'https://www.googleapis.com/auth/youtube.readonly \
        https://www.googleapis.com/auth/youtube',
      ux_mode: 'popup',
      // @ts-ignore
      callback: (tokenResponse) => {
        console.log(
          '🚀 ~ file: auth.service.ts:49 ~ tokenClientInit ~ tokenResponse:',
          tokenResponse
        );
        this.tokenResponseSubject.next(tokenResponse.access_token);
      },
      error_callback: (error: any) => {
        console.log(
          '🚀 ~ file: auth.service.ts:55 ~ AuthService ~ tokenClientInit ~ e:',
          error
        );
        return of(this.tokenResponseSubject.error(error));
      },
    });
  }

  getChannels(accessToken: string): Observable<any> {
    const headers = { 'Authorization': `Bearer ${accessToken}` };
    return of(axios.get(`${this.BASE_URL}/channels?part=snippet&mine=true`, {
      headers,
    }));
  }
}
