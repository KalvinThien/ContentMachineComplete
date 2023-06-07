import { Component, Input, OnInit } from '@angular/core';
import { SocialAuthService } from '../../service/socialauth.service';

@Component({
  selector: 'app-account-hub',
  templateUrl: './accounthub.component.html',
  styleUrls: ['./accounthub.component.css']
})
export class AccounthubComponent implements OnInit {

  @Input() parentFocusedConnection = 0
  
  isConnectionLoading = false;
  twitterConnected = false;
  youtubeConnected = false;
  linkedinConnected = false;
  
  constructor(
    private socialAuthService: SocialAuthService
  ) { /** */ }
    
    ngOnInit(): void {
      this.socialAuthService.getYoutubeAuthObservable$.subscribe({
        next: (isConnected) => {
          this.youtubeConnected = isConnected;
        },
        error: (error) => {
          console.log("🚀 ~ file: accounthub.component.ts:30 ~ AccounthubComponent ~ ngOnInit ~ error:", error)
        },
      });
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
      // this.socialAuthService.signInWithFacebook();
      const params = {
        client_id: '883874189493049',
        redirect_uri: 'http://localhost:4200/facebook-callback',
        facebookScope: 'email',
      };
    
      window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.facebookScope}`;
    }
    
    onTwitterLogin() {
      this.socialAuthService.signInWithTwitter();
    }
    
    onYoutubeLogin() {
      this.socialAuthService.signInWithYoutube();
    }

    onLinkedinLogin() {
      const linkedInCredentials = this.socialAuthService.getLinkedInCredentials();
      window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${linkedInCredentials.client_id}&redirect_uri=${linkedInCredentials.redirect_uri}&scope=${linkedInCredentials.scope}`;
    }
}


