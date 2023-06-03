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

  sessionUser?: FirebaseUser;
  user$;

  private userSubject: Subject<FirebaseUser> = new Subject<FirebaseUser>();

  constructor(
    private fireAuth: Auth
  ) {
    this.user$ = user(this.fireAuth);
    
    this.user$.subscribe((user: any) => {
      if (user) {
        console.log(
          '🚀 ~ file: fireauth.repo.ts:28 ~ FireAuthRepository ~ this.angularFireAuth.authState.subscribe ~ user:',
          user
        );
        this.sessionUser = user;
        this.userSubject.next(user);
      } else {
        this.sessionUser = undefined;
      }
    });
  }

  getUserAuthObservable(): Observable<FirebaseUser> {
    return this.userSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return of(this.sessionUser === undefined ? false : true);
  }

  isFirstTimeUser(): Observable<boolean> {
    return of(this.sessionUser?.isVirgin === true);
  }

  // Sign out
  signOut(): Promise<void> {
    this.sessionUser = undefined;
    return this.fireAuth.signOut();
  }
}
