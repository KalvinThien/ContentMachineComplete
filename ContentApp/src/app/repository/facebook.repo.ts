import { Injectable } from "@angular/core";
import axios from 'axios';
import { Observable, from, map, tap } from 'rxjs';
import { FacebookPage } from "../model/facebookpage.model";

@Injectable({
  providedIn: 'root',
})
export class FacebookRepository {
  private apiUrl = 'https://graph.facebook.com/v15.0';

  constructor() {
    /** */
  }

  getFacebookUserId(userAccessToken: string): Observable<string> {
    const url = `${this.apiUrl}/me`;

    return from(axios.get(url, {
      params: {
        fields: 'id',
        access_token: userAccessToken
      }
    })).pipe(
      map((response: any) => response.data.id)
    );
  }

  exchangeAuthCodeForAccessToken(facebookAuthCode: string): Observable<any> {
    return from(
      axios.get<{message: string, data: any}>('http://localhost:5000/api/facebook/callback', {
        params: {
          authCode: facebookAuthCode,
        }
      })
    ).pipe(
      map((response) => {
        console.log("🚀 ~ file: facebookauth.repo.ts:23 ~ map ~ response:", response)
        if (response.data.message !== 'success') {
          throw new Error('🔥 Failed to exchange auth code for access token');
        }
        return response.data.data;
      })
    );
  }

  getFacebookPages(userId: string, userAccessToken: string): Observable<FacebookPage[]> {
    if (userId === undefined || userId === '' || userAccessToken === undefined || userAccessToken === '') {
      throw new Error('🔥 Failed to get Facebook pages');
    }
    const url = `${this.apiUrl}/${userId}/accounts`;

    return from(axios.get(url, {
      params: {
        access_token: userAccessToken
      }
    })).pipe(
      map((response: { data: FacebookPage[] }) => response.data)
    );
  }
}
