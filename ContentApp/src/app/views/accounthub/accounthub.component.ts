import { Component, Input, OnInit } from '@angular/core';
import { SocialAuthService } from '../../service/socialauth.service';
import { SocialAccount } from 'src/app/model/socialaccount.model';
import { MessageService } from 'primeng/api';
import { PostingPlatform } from 'src/app/repository/firebase/firestore.repo';

@Component({
  selector: 'app-account-hub',
  templateUrl: './accounthub.component.html',
  styleUrls: ['./accounthub.component.css']
})
export class AccounthubComponent implements OnInit {

  @Input() parentFocusedConnection = 0

  personalAccounts: SocialAccount[] = [];
  
  isAccountsLoading = true;
  isLoading = false;

  twitterConnected = false;
  youtubeConnected = false;
  linkedinConnected = false;
  facebookConnected = false;
  mediumConnected = false;
  
  mediumIntegKey: string = '';
  
  constructor(
    private socialAuthService: SocialAuthService,
    private messageService: MessageService,
  ) { /** */ }
    
    ngOnInit(): void {
      this.setupObservers();
      this.socialAuthService.getPersonalAccounts();
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

    onMediumSubmit() {
      this.socialAuthService.signInWithMedium(this.mediumIntegKey);
    }

    private setupObservers() {
      this.socialAuthService.getPersonalAccountsObservable$.subscribe({
        next: (accounts) => {
          console.log("🚀 ~ file: accounthub.component.ts:74 ~ AccounthubComponent ~ setupObservers ~ accounts:", accounts)
          this.isAccountsLoading = false;
          this.personalAccounts = accounts;
          this.personalAccounts.forEach((account) => {
            if (account.platform === PostingPlatform.FACEBOOK) {
              this.facebookConnected = true;
            } else if (account.platform === PostingPlatform.LINKEDIN) {
              this.linkedinConnected = true;
            } else if (account.platform === PostingPlatform.MEDIUM) {
              this.mediumConnected = true;
            } else if (account.platform === PostingPlatform.YOUTUBE) {
              this.youtubeConnected = true;
            } else if (account.platform === PostingPlatform.TWITTER) {
              this.twitterConnected = true;
            } else {
              this.messageService.add({ severity: 'danger', summary: 'Opps! Sorry about that.', detail: `Unknown platform: ${account.platform}` });
            }
          });
        },
        error: (error) => {
          this.isAccountsLoading = false;
          this.messageService.add({ severity: 'danger', summary: 'Opps! Sorry about that.', detail: `${error}` });
        }
      });
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
        this.isLoading = isLoading;
      });
      this.socialAuthService.getErrorObservable$.subscribe((error) => {
        this.messageService.add({ severity: 'danger', summary: 'Opps! Sorry about that.', detail: `${error}` });
      });
      this.socialAuthService.getMediumAuthObservable$.subscribe((isConnected) => {
        this.mediumConnected = isConnected;
      });
    }
}


