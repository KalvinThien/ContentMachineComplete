import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialAuthService } from '../../service/socialauth.service';

@Component({
  selector: 'li-redirects',
  templateUrl: './redirects.component.html',
  styleUrls: ['./redirects.component.css']
})
export class LinkedinRedirectComponent {

  linkedInToken: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    if (this.linkedInToken !== undefined && this.linkedInToken !== '') {
      this.socialAuthService.getLinkedInAccessToken(this.linkedInToken);
    } 
  }
}
