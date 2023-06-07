import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '../../service/socialauth.service';

@Component({
  selector: 'fb-redirects',
  templateUrl: './redirects.component.html',
  styleUrls: ['./redirects.component.css']
})
export class FacebookRedirectComponent implements OnInit {

  facebookToken: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.facebookToken = this.route.snapshot.queryParams["code"];
    if (this.facebookToken !== undefined && this.facebookToken !== '') {
      console.log("🚀 ~ file: facebookredirect.component.ts:22 ~ FacebookRedirectComponent ~ ngOnInit ~ facebookToken:", this.facebookToken)
      this.socialAuthService.signInWithFacebook(this.facebookToken);
    } 
  }

}
