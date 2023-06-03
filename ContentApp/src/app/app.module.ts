import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './views/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { ConfirmationDialogComponent } from './views/common/confirmationdialog.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';

firebase.initializeApp(environment.firebaseConfig);

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // {
    //   scopes: [
    //     'instagram_basic',
    //     'instagram_manage_comments',
    //     'instagram_manage_insights',
    //     'instagram_content_publish',
    //     'publish_video',
    //     'page_events',
    //     'pages_read_engagement',
    //     'pages_manage_metadata',
    //     'pages_read_user_content',
    //     'pages_manage_ads',
    //     'pages_manage_posts',
    //     'pages_manage_engagement',
    //   ],
    //   customParameters: {
    //     'auth_type': 'reauthenticate'
    //   },
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    // },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    }
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    DashboardComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    HammerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [ /** */ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
