import { Component, Input, OnInit } from '@angular/core';
import { SocialAccountService } from 'src/app/service/socialaccount.service';


@Component({
  selector: 'app-account-hub',
  templateUrl: './accounthub.component.html',
  styleUrls: ['./accounthub.component.css']
})
export class AccounthubComponent implements OnInit {
  
  constructor(
    private socialAuthService: SocialAccountService
  ) { /** */ }
  
  
  ngOnInit(): void {
    
  }

  onFacebookLogin() {
    this.socialAuthService.signInWithFacebook();
  }
  
  onTwitterLogin() {
    this.socialAuthService.signInWithTwitter();
  }
}


