import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoginComponent } from './views/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { ConfirmationDialogComponent } from './views/common/confirmationdialog.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { HomeComponent } from './views/home/home.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DividerModule } from 'primeng/divider';
import { SocialLoginModule, 
  SocialAuthServiceConfig, 
  FacebookLoginProvider 
} from '@abacritt/angularx-social-login';
import { TabViewModule } from 'primeng/tabview';
import { AccounthubComponent } from './views/accounthub/accounthub.component';

firebase.initializeApp(environment.firebaseConfig);

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
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
    CalendarComponent,
    PageNotFoundComponent,
    HomeComponent,
    AccounthubComponent
  ],
  imports: [
    TabViewModule,
    DividerModule,
    ScrollPanelModule,
    MenubarModule,
    DialogModule,
    ButtonModule,
    CardModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [ 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('883874189493049'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
