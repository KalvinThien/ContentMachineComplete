import { AfterContentInit, Component, OnInit } from '@angular/core';
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
} from 'firebaseui-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../service/auth/session.service';
import { NavigationService } from '../../service/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterContentInit {
  errorMessage = '';
  hasError = false;
  isLoading = false;

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private sessionService: SessionService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
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
    if (this.loginForm.valid) {
      // Perform login actions. Call to service for API interaction
    }
  }

  get f() { 
    return this.loginForm.controls; 
  }

  goToHome() {
    // this.sessionService.checkForAuthLoginRedirect();
  }

  uiShownCallback() {
    /** */
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    alert(errorData);
  }

  successCallback(signinSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    this.sessionService.verifyEmail(signinSuccessData);
  }
}
