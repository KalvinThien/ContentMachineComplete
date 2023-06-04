import { Injectable } from "@angular/core";
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SocialAccountService {

  private facebookAuthSubject = new Subject<boolean>();
  private mediumAuthSubject = new Subject<boolean>();
  private twitterAuthSubject = new Subject<boolean>();
  private youtubeAuthSubject = new Subject<boolean>();
  private linkedinAuthSubject = new Subject<boolean>();

  constructor(
    private socialAuthService: SocialAuthService
  ) { 
    this.socialAuthService.authState.subscribe((user) => {
      console.log("🚀 ~ file: socialaccount.service.ts:24 ~ SocialAccountService ~ this.socialAuthService.authState.subscribe ~ user:", user)
      // this.socialUser = user;
      // this.isLoggedin = user != null;
    });
  }

  getFacebookAuthObservable() { return this.facebookAuthSubject.asObservable(); }
  getMediumAuthObservable() { return this.mediumAuthSubject.asObservable(); }
  getTwitterAuthObservable() { return this.twitterAuthSubject.asObservable(); }
  getYoutubeAuthObservable() { return this.youtubeAuthSubject.asObservable(); }
  getLinkedinAuthObservable() { return this.linkedinAuthSubject.asObservable(); }

  signInWithFacebook() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithMedium() {
    // this.socialAuthService.signIn(MediumLoginProvider.PROVIDER_ID);
  }

  signInWithTwitter() {
    // this.socialAuthService.signIn(TwitterLoginProvider.PROVIDER_ID);
  }

  signInWithYoutube() {
    // this.socialAuthService.signIn(YoutubeLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedin() {
    // this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }
}
