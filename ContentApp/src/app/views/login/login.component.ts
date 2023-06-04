import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../service/session.service';
import { NavigationService } from '../../service/navigation.service';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterContentInit {

  // ui = new firebaseui.auth.AuthUI(firebase.auth());
  provider = new GoogleAuthProvider();
  auth = getAuth();

  errorMessage = '';
  hasError = false;
  isLoading = false;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sessionService.getErrorObserver().subscribe((error) => {
      alert(error);
    });
  }

  ngAfterContentInit(): void {
    // this.sessionService.checkForAuthLoginRedirect();
  }

  onSubmit() {
    // if (this.loginForm.valid) {
    //   // Perform login actions. Call to service for API interaction
    // }
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.sessionService.verifyEmail(user);
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
        // ...
      });
  }

  get f() {
    return this.loginForm.controls;
  }

  goToHome() {
    this.sessionService.checkForAuthLoginRedirect();
  }

  uiShownCallback() {
    /** */
  }
}
