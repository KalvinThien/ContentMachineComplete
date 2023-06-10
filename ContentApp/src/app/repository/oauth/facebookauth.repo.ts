import { Injectable } from "@angular/core";
import axios from 'axios';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacebookAuthRepository {

  constructor() {
    /** */
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
}
