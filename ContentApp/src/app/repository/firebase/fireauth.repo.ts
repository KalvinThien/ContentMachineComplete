import { Injectable } from '@angular/core';
import { Observable, Subject, from, map, of } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import { PURCHASED_USERS_COL, USERS_COL } from './firestore.repo';
import { FirestoreRepository } from './firestore.repo';
import { FirebaseUser } from '../../model/user/user.model';
import { DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FireAuthRepository {

  currentSessionUser?: FirebaseUser;
  user$;

  private userSubject: Subject<FirebaseUser> = new Subject<FirebaseUser>();
  
  getUserAuthObservable(): Observable<FirebaseUser> {
    return this.userSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return of(this.currentSessionUser === undefined ? false : true);
  }

  isFirstTimeUser(): Observable<boolean> {
    return of(this.currentSessionUser?.isVirgin === true);
  }

  constructor(
    private fireAuth: Auth
  ) {
    this.user$ = user(this.fireAuth);
    
    this.user$.subscribe((user: any) => {
      if (user) {
        // Only our initial user is set for the session variable
        if (user.providerData[0].providerId == 'google.com') {
          console.log('🚀 ~ file: fireauth.repo.ts ~ line 27 ~ FireAuthRepository ~ user', user)
          this.currentSessionUser = user;
          this.userSubject.next(user);
        } else {
          // with poor design this is where we would make an advanced query to get the parent user based on child creds
        }
      } else {
        // reset sessionUser
        console.log('🚀 ~ file: fireauth.repo.ts ~ line 36 ~ FireAuthRepository ~ user', user)
        this.currentSessionUser = undefined;
      }
    });
  }

  // Sign out
  signOut(): Promise<void> {
    this.currentSessionUser = undefined;
    return this.fireAuth.signOut();
  }
}
