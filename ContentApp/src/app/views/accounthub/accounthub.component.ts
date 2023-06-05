import { Component, Input, OnInit } from '@angular/core';
import { SocialAccountService } from 'src/app/service/socialaccount.service';


@Component({
  selector: 'app-account-hub',
  templateUrl: './accounthub.component.html',
  styleUrls: ['./accounthub.component.css']
})
export class AccounthubComponent implements OnInit {

  isConnectionLoading = false;
  twitterConnected = false;
  
  constructor(
    private socialAuthService: SocialAccountService
  ) { /** */ }
  
  
  ngOnInit(): void {
    this.socialAuthService.getTwitterAuthObservable$.subscribe((isConnected) => {
      this.twitterConnected = isConnected;
    })
    this.socialAuthService.getConnectionLoadingObservable$.subscribe((isLoading) => {
      this.isConnectionLoading = isLoading;
    });
    this.socialAuthService.getErrorObservable$.subscribe((error) => {
      console.log("🔥 ~ file: accounthub.component.ts:24 ~ AccounthubComponent ~ this.socialAuthService.getErrorObservable$.subscribe ~ error:", error)
    });
  }

  onFacebookLogin() {
    this.socialAuthService.signInWithFacebook();
  }
  
  onTwitterLogin() {
    this.socialAuthService.signInWithTwitter();
  }
}


