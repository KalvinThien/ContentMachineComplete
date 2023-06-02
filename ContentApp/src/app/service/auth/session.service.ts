import { Injectable } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { Observable, Subject, catchError, of } from 'rxjs';
import { FirebaseUser } from '../../model/user/user.model';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { FireAuthRepository } from '../../repository/firebase/fireauth.repo';

const LANGUAGE_PREF = 'language';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private errorSubject = new Subject<string>();
  
  constructor(
    private fireAuthRepo: FireAuthRepository,
    private navService: NavigationService
    ) {
      /** */
    }

  checkForAuthLoginRedirect() {
    // if (this.fireAuthRepo.sessionUser !== null) {
    //   this.navService.navigateToList();
    //   return;
    // }

    // this.fireAuthRepo.getUserAuthObservable().subscribe({
    //   next: (user) => {
    //     if (user !== null) {
    //       this.navService.navigateToList();
    //     }
    //   },
    //   error: (error) => {
    //     console.log('🔥' + error);
    //     this.errorSubject.next(error);
    //   }
    // });
  }

  checkForAuthLogoutRedirect() {
    // if (this.fireAuthRepo.sessionUser === null) {
    //   console.log("🚀 ~ file: session.service.ts:35 ~ SessionService ~ this.fireAuthRepo.getUserAuthObservable ~ user:", this.fireAuthRepo.sessionUser)
    //   this.navService.navigateToLander();
    //   return;
    // } else {
    //   this.navService.navigateToList();
    // }
  }

  getErrorObserver(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  storeLanguagePref(lang: string): void {
    localStorage.setItem(LANGUAGE_PREF, lang);
  }

  getProfilePic(): string {
    return (
      this.fireAuthRepo.sessionUser?.photoURL ?? 'https://placehold.co/48x48'
    );
  }

  getLanguagePref(): string | null {
    return localStorage.getItem(LANGUAGE_PREF);
  }

  getAuthStateObserver(): Observable<FirebaseUser> {
    return this.fireAuthRepo.getUserAuthObservable();
  }

  verifyEmail(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    const email = signinSuccessData.authResult.user?.email;
    const isFirstTimeUser = signinSuccessData.authResult.additionalUserInfo?.isNewUser;

    if (email !== undefined && email !== '') {
      this.fireAuthRepo.verifyPurchaseEmail(email!!).subscribe({
        next: (userExists) => {
          if (userExists) {
            console.log("🚀 ~ file: session.service.ts:104 ~ SessionService ~ this.fireAuthRepo.verifyPurchaseEmail ~ userExists:", userExists)
            this.fireAuthRepo.setUserData(
              {
                ...signinSuccessData.authResult.user?.toJSON(),
                isVirgin: isFirstTimeUser
              }
            );
            this.navService.navigateToList();
          } else {
            this.fireAuthRepo.signOut();
            this.errorSubject.next(
              'You are not authorized to use this application. Please contact us.'
            );
          }
        },
        error: (error) => {
          console.debug('🔥' + error);
          this.fireAuthRepo.signOut();
          this.errorSubject.next(error);
        },
      });
    } else {
      this.errorSubject.next(
        "We couldn't create your account. Please contact us."
      );
    }
  }
}
