import { Injectable } from '@angular/core';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  TwitterAuthProvider,
} from 'firebase/auth';
import {
  catchError,
  concat,
  concatMap,
  from,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import {
  DISPLAY_NAME,
  FirestoreRepository,
  HANDLE,
  PAGE,
  PLATFORM,
  SCOPE,
  USER_ID,
  USERS_COL,
} from '../repository/firebase/firestore.repo';
import { firebase } from 'firebaseui-angular';
import {
  PERSONAL_ACCTS_DOC,
  PostingPlatform,
} from '../repository/firebase/firestore.repo';
import {
  ACCESS_TOKEN,
  LAST_LOGIN_AT,
  CREATION_TIME,
  REFRESH_TOKEN,
  SCOPE as SCOPES,
} from '../repository/firebase/firestore.repo';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { YoutubeAuthRepository } from '../repository/oauth/youtubeauth.repo';
import { LinkedinAuthRepository } from '../repository/oauth/linkedinauth.repo';
import { FacebookRepository } from '../repository/facebook.repo';
import { NavigationService } from './navigation.service';
import { SocialAccount } from '../model/socialaccount.model';
import { FacebookPage } from '../model/facebookpage.model';

@Injectable({
  providedIn: 'root',
})
export class SocialAuthService {

  private auth = getAuth();

  private googleProvider = new GoogleAuthProvider();
  private twitterProvider = new TwitterAuthProvider();

  private userPersonalAccounts = new Subject<SocialAccount[]>();
  private userFacebookPages = new Subject<FacebookPage[]>();
  private userInstagramLinkSuccess = new Subject<boolean>();

  private mediumAuthSubject = new Subject<boolean>();
  private twitterAuthSubject = new Subject<boolean>();
  private facebookAuthSubject = new Subject<boolean>();
  private linkedinAuthSubject = new Subject<boolean>();

  private conectionsLoadingSubject = new Subject<boolean>();
  private errorSubject = new Subject<string>();

  private googleScopes = [];
  private mediumScopes = [];
  private twitterScopes = [
    'tweet.read',
    'tweet.write',
    'tweet.delete',
    'follows.write',
  ];

  constructor(
    private navigationService: NavigationService,
    private fireAuthRepo: FireAuthRepository,
    private firestoreRepo: FirestoreRepository,
    private youtubeAuthRepo: YoutubeAuthRepository,
    private linkedinAuthRepo: LinkedinAuthRepository,
    private facebookRepo: FacebookRepository
  ) {
    /** */
  }

  getPersonalAccountsObservable$ = this.userPersonalAccounts.asObservable();
  getFacebookPagesObservable$ = this.userFacebookPages.asObservable();
  getInstagramLinkSuccessObservable$ = this.userInstagramLinkSuccess.asObservable();

  getMediumAuthObservable$ = this.mediumAuthSubject.asObservable();
  getTwitterAuthObservable$ = this.twitterAuthSubject.asObservable();
  getFacebookAuthObservable$ = this.facebookAuthSubject.asObservable();
  getLinkedinAuthObservable$ = this.linkedinAuthSubject.asObservable();

  getConnectionLoadingObservable$ =
    this.conectionsLoadingSubject.asObservable();
  getErrorObservable$ = this.errorSubject.asObservable();

  getYoutubeAuthObservable$: Observable<boolean> =
    this.youtubeAuthRepo.tokenResponseObserver$.pipe(
      map((tokenResponse) => {
        const oAuth2Payload = {
          [PLATFORM]: PostingPlatform.YOUTUBE,
          [ACCESS_TOKEN]: tokenResponse,
          [SCOPES]: this.youtubeAuthRepo.youtubeScopes,
        };

        this.firestoreRepo.updateCurrentUserCollectionDocument(
          PERSONAL_ACCTS_DOC,
          PostingPlatform.YOUTUBE,
          oAuth2Payload
        );

        this.conectionsLoadingSubject.next(false);
        return tokenResponse !== null;
      })
    );

  getFacebookPages() {
    this.firestoreRepo
      .getDocumentAsUser<SocialAccount>(
        PERSONAL_ACCTS_DOC,
        PostingPlatform.FACEBOOK
      )
      .pipe(
        concatMap((facebookAccount: SocialAccount) => 
          this.facebookRepo.getFacebookPages(
            facebookAccount.user_id ?? '',
            facebookAccount.access_token
          )
        )
      ).subscribe({
        next: (facebookPages) => {
          console.log("🚀 ~ file: socialauth.service.ts:135 ~ SocialAuthService ~ getFacebookPages ~ facebookPages:", facebookPages)
          this.userFacebookPages.next(facebookPages);
        },
        error: (error) => {
          console.log("🚀 ~ file: socialauth.service.ts:139 ~ SocialAuthService ~ getFacebookPages ~ error:", error)
          this.errorSubject.next(error);
        }
      });
  }

  getAssociatedInstagramAccounts(page: FacebookPage) {
    // TODO error hadling if page does not have instagram account
    from(this.firestoreRepo.updateCurrentUserCollectionDocument(
      PERSONAL_ACCTS_DOC,
      PostingPlatform.FACEBOOK,
      {
        [PAGE]: page
      }
    )).pipe(
      concatMap(() => this.facebookRepo.getAssociatedInstagramAccounts(page)),
      concatMap((instagramAccounts) => {
        return from(this.firestoreRepo.updateCurrentUserCollectionDocument(
          PERSONAL_ACCTS_DOC,
          PostingPlatform.INSTAGRAM,
          instagramAccounts
      ))
    })).subscribe({
      next: (success) => {
        this.userInstagramLinkSuccess.next(success);
      },
      error: (error) => {
        this.errorSubject.next(error);
      }
    })
  }

  getPersonalAccounts() {
    this.firestoreRepo
      .getUserCollection<SocialAccount>(PERSONAL_ACCTS_DOC)
      .subscribe({
        next: (personalAccounts) => {
          this.userPersonalAccounts.next(personalAccounts);
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

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
          };
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
  signInWithFacebook(authCode: string) {
    this.facebookRepo
      .exchangeAuthCodeForAccessToken(authCode)
      .pipe(
        concatMap((accessTokenObj: { accessToken: string }) =>{
          console.log(accessTokenObj);
          return this.facebookRepo.getFacebookUserId(accessTokenObj.accessToken).pipe(
            map((user_id: string) => {
              return {
                [USER_ID]: user_id,
                [ACCESS_TOKEN]: accessTokenObj.accessToken,
              };
            })
          )}
        ),
        concatMap((accessTokenObj: { user_id: string; access_token: string }) =>
          this.firestoreRepo.updateCurrentUserCollectionDocument(
            PERSONAL_ACCTS_DOC,
            PostingPlatform.FACEBOOK,
            {
              [PLATFORM]: PostingPlatform.FACEBOOK,
              ...accessTokenObj,
            }
          )
        )
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.navigationService.navigateToRoot();
            this.facebookAuthSubject.next(true);
          } else {
            this.errorSubject.next('LinkedIn Auth Error');
          }
        },
        error: (error) => {
          this.navigationService.navigateToRoot();
          this.errorSubject.next(error);
        },
      });
  }

  signInWithMedium(mediumAccessToken: string) {
    from(
      this.firestoreRepo.updateCurrentUserCollectionDocument(
        PERSONAL_ACCTS_DOC,
        PostingPlatform.MEDIUM,
        {
          [PLATFORM]: PostingPlatform.MEDIUM,
          [ACCESS_TOKEN]: mediumAccessToken,
        }
      )
    ).subscribe({
      next: (result) => {
        if (result) {
          this.mediumAuthSubject.next(true);
        } else {
          this.errorSubject.next('Medium Auth Error');
        }
      },
      error: (error) => {
        this.errorSubject.next(error);
      },
    });
  }

  signInWithTwitter() {
    this.conectionsLoadingSubject.next(true);
    from(signInWithPopup(this.auth, this.twitterProvider))
      .pipe(
        map((result) => {
          const resultUser = result.user;
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          if (credential !== null) {
            const token = credential.accessToken;
            const secret = credential.secret;

            const oAuth2Payload = {
              [PLATFORM]: PostingPlatform.TWITTER,
              [HANDLE]: resultUser?.displayName || 'error',
              [ACCESS_TOKEN]: token,
              [REFRESH_TOKEN]: secret,
              [SCOPE]: this.twitterScopes,
              [LAST_LOGIN_AT]: resultUser.metadata.lastSignInTime,
              [CREATION_TIME]: resultUser.metadata.creationTime,
            };

            this.firestoreRepo.updateCurrentUserCollectionDocument(
              PERSONAL_ACCTS_DOC,
              PostingPlatform.TWITTER,
              oAuth2Payload
            );
          } else {
            this.errorSubject.next('Twitter Auth Error');
          }

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }),
        concatMap((result) => {
          const currentUser = this.fireAuthRepo.currentSessionUser;
          if (currentUser === undefined) {
            throw new Error('No current user');
          }
          return this.firestoreRepo.getUserInfoAsDocument(
            USERS_COL,
            currentUser?.uid
          );
        }),
        concatMap((userDoc: any) => {
          const constidToken = userDoc?.idToken;
          // Build Firebase credential with the Google ID token.
          const credential = GoogleAuthProvider.credential(constidToken);
          return signInWithCredential(this.auth, credential);
        })
      )
      .subscribe({
        next: (result) => {
          this.conectionsLoadingSubject.next(false);
        },
        error: (error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);

          this.twitterAuthSubject.next(true);
          this.conectionsLoadingSubject.next(false);
          this.errorSubject.next(errorMessage);
        },
      });
  }

  signInWithYoutube() {
    this.conectionsLoadingSubject.next(true);
    this.youtubeAuthRepo.getRequestToken();
  }

  getLinkedInCredentials() {
    return this.linkedinAuthRepo.authCodeParams;
  }

  getLinkedInAccessToken(authCode: string) {
    this.conectionsLoadingSubject.next(true);
    this.linkedinAuthRepo
      .exchanceAuthCodeForAccessToken(authCode)
      .pipe(
        concatMap((accessTokenObj: { message: string; data: any }) => {
          console.log(
            '🚀 ~ file: socialauth.service.ts:255 ~ SocialAuthService ~ concatMap ~ accessTokenObj:',
            accessTokenObj
          );
          return this.firestoreRepo.updateCurrentUserCollectionDocument(
            PERSONAL_ACCTS_DOC,
            PostingPlatform.LINKEDIN,
            {
              [PLATFORM]: PostingPlatform.LINKEDIN,
              ...accessTokenObj,
            }
          );
        })
      )
      .subscribe({
        next: (result) => {
          this.conectionsLoadingSubject.next(false);
          console.log(
            '🚀 ~ file: socialaccount.service.ts:233 ~ SocialAccountService ~ .subscribe ~ result',
            result
          );
          if (result) {
            this.linkedinAuthSubject.next(true);
          } else {
            this.errorSubject.next('LinkedIn Auth Error');
          }
          this.navigationService.navigateToRoot();
        },
        error: (error) => {
          this.conectionsLoadingSubject.next(false);
          this.errorSubject.next(error);
          console.log(
            '🔥 ~ file: socialaccount.service.ts:235 ~ SocialAccountService ~ .subscribe ~ error',
            error
          );
          this.navigationService.navigateToRoot();
        },
      });
  }
}
