export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: string;
  lastLogin: string;
  creationTime: string;
  lastRefreshAt: string;
  idToken: string;

  isVirgin: boolean;
}
