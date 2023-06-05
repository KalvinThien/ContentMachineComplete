import { Injectable } from "@angular/core";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, OAuthCredential, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { Observable, Subject } from "rxjs";
import { FirestoreRepository } from "../repository/firebase/firestore.repo";
import { firebase } from "firebaseui-angular";
import { USER_SOCIAL_MEDIA_HANDLES_DOC, USER_OAUTH_2_KEYS_DOC, PostingPlatform } from "../repository/firebase/firestore.repo";
import { ACCESS_TOKEN, LAST_LOGIN_AT, CREATION_TIME, REFRESH_TOKEN, SCOPE as SCOPES } from "../repository/firebase/firestore.repo";

@Injectable({
  providedIn: 'root',
})
export class SocialAccountService {

  private auth = getAuth();
  private googleProvider = new GoogleAuthProvider();
  private facebookProvider = new FacebookAuthProvider();
  private twitterProvider = new TwitterAuthProvider();

  private facebookAuthSubject = new Subject<boolean>();
  private mediumAuthSubject = new Subject<boolean>();
  private twitterAuthSubject = new Subject<boolean>();
  private youtubeAuthSubject = new Subject<boolean>();
  private linkedinAuthSubject = new Subject<boolean>();

  private errorSubject = new Subject<string>();

  private googleScopes = [];
  private facebookScopes = [];
  private mediumScopes = [];
  private twitterScopes = [];
  private youtubeScopes = [];

  constructor(
    private firestoreRepo: FirestoreRepository
  ) { 
    this.facebookProvider.addScope('user_birthday');
    this.facebookProvider.setCustomParameters({
      'display': 'popup'
    });
  }

  getFacebookAuthObservable() { return this.facebookAuthSubject.asObservable(); }
  getMediumAuthObservable() { return this.mediumAuthSubject.asObservable(); }
  getTwitterAuthObservable() { return this.twitterAuthSubject.asObservable(); }
  getYoutubeAuthObservable() { return this.youtubeAuthSubject.asObservable(); }
  getLinkedinAuthObservable() { return this.linkedinAuthSubject.asObservable(); }

  getErrorObservable() { return this.errorSubject.asObservable(); }

  signInWithGoogle(): Observable<any> {
    return new Observable((subscriber) => {
      signInWithPopup(this.auth, this.googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        const sessionUser = {
          ...user,
          google_credentials: credential,
        }
        subscriber.next(sessionUser);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        subscriber.error(credential);
        // ...
      });
    });
  }

  /**
   * This is not working except in HTTPS published
   */
  signInWithFacebook() {
    signInWithPopup(this.auth, this.facebookProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log("🚀 ~ file: socialaccount.service.ts:39 ~ SocialAccountService ~ .then ~ user:", user)

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);

    if (credential !== null) {
      const accessToken = credential.accessToken;
      console.log("🚀 ~ file: socialaccount.service.ts:48 ~ SocialAccountService ~ .then ~ accessToken:", accessToken)

      // If we have credentials we will sign in explicityly to Facebook so we can get a long-lived token
      // If you need to continuously use the Facebook API, use option 2 as Firebase does not manage OAuth 
      //tokens after they expire. If you just need Facebook data on sign-in, then use option 1.
      firebase.auth().signInWithCredential(credential).then((userCredential) => {
        console.log("🚀 ~ file: socialaccount.service.ts:51 ~ SocialAccountService ~ firebase.auth ~ userCredential:", userCredential)
      }).catch((error) => {
        console.log("🚀 ~ file: socialaccount.service.ts:53 ~ SocialAccountService ~ firebase.auth ~ error:", error)
      });
    }

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);
    // ...
  });
  }

  signInWithMedium() {
    // this.socialAuthService.signIn(MediumLoginProvider.PROVIDER_ID);
  }

  signInWithTwitter() {

    signInWithPopup(this.auth, this.twitterProvider)
      .then((result) => {
        const resultUser = result.user;
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        if (credential !== null) {
          const token = credential.accessToken;
          const secret = credential.secret;

          this.firestoreRepo.updateCurrentUserDocument({
            [USER_SOCIAL_MEDIA_HANDLES_DOC]: {
              [PostingPlatform.TWITTER]: resultUser?.displayName || '',
            },
          });

          const oAuth2Payload = {
            [ACCESS_TOKEN]: token,
            [REFRESH_TOKEN]: secret,
            [SCOPES]: this.twitterScopes,
            [LAST_LOGIN_AT]: resultUser.metadata.lastSignInTime,
            [CREATION_TIME]: resultUser.metadata.creationTime,
          };

          this.firestoreRepo.updateCurrentUserCollectionDocument(
            USER_OAUTH_2_KEYS_DOC,
            PostingPlatform.TWITTER,
            oAuth2Payload
          );
        } else {
          console.log("🚀 ~ file: socialaccount.service.ts:126 ~ SocialAccountService ~ .then ~ oAuth2Payload:", 'credential error')
          this.errorSubject.next('Twitter Auth Error');
        }

        // The signed-in user info.
        const user = result.user;
        console.log("🚀 ~ file: socialaccount.service.ts:134 ~ SocialAccountService ~ .then ~ user:", user)
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        // ...
      });
  }

  signInWithYoutube() {
    // this.socialAuthService.signIn(YoutubeLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedin() {
    // this.socialAuthService.signIn(LinkedinLoginProvider.PROVIDER_ID);
  }
}
