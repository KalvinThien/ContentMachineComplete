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
    private fireAuth: Auth,
    private firestoreRepo: FirestoreRepository
  ) {
    this.user$ = user(this.fireAuth);
    this.user$.subscribe((user: any) => {
      if (user) {
        console.log(
          '🚀 ~ file: fireauth.repo.ts:28 ~ FireAuthRepository ~ this.angularFireAuth.authState.subscribe ~ user:',
          user
        );
        this.sessionUser = user;
        this.setUserData(user);
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

  verifyPurchaseEmail(email: string): Observable<boolean> {
    return this.firestoreRepo.getUsersDocument(PURCHASED_USERS_COL, email).pipe(
      map((doc) => {
        if (doc !== undefined) {
          return true;
        } else {
          console.debug('No such document!');
          return false;
        }
      })
    );
  }

  /* Setting up user data when sign in with username/password,
   * sign up with username/password and sign in with social auth
   * provider in Firestore database using AngularFirestore + AngularFirestoreDocument service
   */
  async setUserData(user: any) {
    // const existingUserRef = this.angularFirestore.doc(
    //   `${USERS_COL}/${user.uid}`
    // );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isVirgin: user.isVirgin,
    };

    // Check if the user document exists
    this.firestoreRepo.getUsersDocument<DocumentReference>(USERS_COL, user.uid).subscribe((doc) => {
      if (doc !== undefined) {
        // User exists, update the existing user data
        userData.isVirgin = false;
        this.firestoreRepo.updateUsersDocument(USERS_COL, user.uid, userData);
      } else {
        // User doesn't exist, create a new user document
        this.firestoreRepo.createUsersDocument(USERS_COL, userData, user.uid);
      }
    });
  }

  // Sign out
  signOut(): Promise<void> {
    this.sessionUser = undefined;
    return this.fireAuth.signOut();
  }
}
