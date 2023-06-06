import { Injectable } from '@angular/core';
import { LINKEDIN_CLIENT_ID } from 'appsecrets';
import axios from 'axios';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkedinAuthRepository {
  private requestTokenUrl = 'https://www.linkedin.com/oauth/v2/authorization'; //?response_type=code&client_id=${your_client_id}&redirect_uri=${your_callback_url}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social'
  // TODO: needs a prod mode redirectUri
  private redirectUri = 'http://localhost:4200/calendar';
  private linkedinScopes = ['r_liteprofile', 'r_emailaddress', 'w_member_social'];

  authCodeParams = {
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: this.redirectUri,
    state: this.createCSRFtoken(),
    scope: this.linkedinScopes.join(' '),
  };

  constructor() {
    /** */
  }

  exchanceAuthCodeForAccessToken(linkedInAuthCode: string): Observable<any> {
    return from(
      axios.get<{message: string, data: any}>('http://localhost:3000/api/main', {
        params: {
          authCode: linkedInAuthCode,
        }
      })
    ).pipe(
      map((response) => {
        if (response.data.message !== 'success') {
          throw new Error('Failed to exchange auth code for access token');
        }
        return response.data.data;
      })
    );
  }

  // requestAuthCode = async () => {
  //   try {
  //     const response = await axios.get(this.requestTokenUrl, {
  //       params: {
  //         response_type: 'code',
  //         client_id: LINKEDIN_CLIENT_ID,
  //         redirect_uri: this.redirectUri,
  //         state: this.createCSRFtoken(),
  //         scope: this.linkedinScopes.join(' ')
  //       }
  //     });
  //     console.log('Post request response:', response.data);
  //     // Handle the response data as needed
  //   } catch (error) {
  //     console.error('Post request error:', error);
  //     // Handle the error
  //   }
  // };

  private createCSRFtoken(): string {
    /**
     * This function generates a random string of letters.
     * It is not required by the Linkedin API to use a CSRF token.
     * However, it is recommended to protect against cross-site request forgery.
     */
    const letters: string = 'abcdefghijklmnopqrstuvwxyz';
    let token: string = '';
    for (let i = 0; i < 20; i++) {
      token += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return token;
  }
}
