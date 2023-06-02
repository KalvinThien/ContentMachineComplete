import { Injectable } from '@angular/core';
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
} from 'firebase/auth';
import { Observable, Subject, from, map, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FirebaseUser } from '../../model/user/user.model';
import { PURCHASED_USERS_COL, USERS_COL } from './firebase.constants';
import { NavigationService } from '../../service/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class FireAuthRepository {

 sessionUser?: FirebaseUser;
  private userSubject: Subject<FirebaseUser> = new Subject<FirebaseUser>();

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {
    this.angularFireAuth.authState.subscribe((user: any) => {
      if (user) {
        console.log("🚀 ~ file: fireauth.repo.ts:28 ~ FireAuthRepository ~ this.angularFireAuth.authState.subscribe ~ user:", user)
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
    return from(this.angularFirestore.collection(PURCHASED_USERS_COL).doc(email).get().toPromise()).pipe(
      map((doc) => {
        if (doc !== undefined && doc.exists) {
          console.debug("🚀 ~ file: fireauth.repo.ts:53 ~ FireAuthRepository ~ verifyPurchaseEmail ~ doc.data():", doc.data())
          return true;
        } else {
          console.debug("No such document!");
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
    const existingUserRef = this.angularFirestore.doc(`${USERS_COL}/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isVirgin: user.isVirgin
    };
  
    // Check if the user document exists
    const snapshot = await existingUserRef.get().toPromise();
    if (snapshot?.exists) {
      // User exists, update the existing user data
      userData.isVirgin = false;
      return existingUserRef.set(this.removeUndefinedProperties(userData), { merge: true });
    } else {
      // User doesn't exist, create a new user document
      return existingUserRef.set(this.removeUndefinedProperties(userData));
    }
  }
  
  // Sign out
  signOut(): Promise<void> {
    this.sessionUser = undefined;
    return this.angularFireAuth.signOut();
  }

  private removeUndefinedProperties(obj: any): any {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (typeof value === 'undefined') {
        return undefined; // Remove the property
      }
      return value;
    }));
  }
}
