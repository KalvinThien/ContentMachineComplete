import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from './service/navigation.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SocialAuthService } from './service/socialauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Content Machine';
  items: MenuItem[];

  /**
   * 0 = twitter
   * 1 = facebook
   * 2 = medium
   * 3 = youtube
   * 4 = linkedin
   */
  focusedAccount = 0;
  accountsVisible = false;

  constructor(
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService
  ) {
    this.items = [
      {
        icon: 'pi pi-angle-left',
      },
      {
        icon: 'pi pi-angle-right',
      },
    ];
  }

  ngOnInit() {
    this.socialAuthService.getFacebookAuthObservable$.subscribe((success) => {
      if (success) {
        this.accountsVisible = true;
        this.focusedAccount = 1;
      }
    })
    this.socialAuthService.getLinkedinAuthObservable$.subscribe((success) => {
      if (success) {
        this.accountsVisible = true;
        this.focusedAccount = 4;
      }
    })
  }

  onCalendarClick() {
    this.navigationService.navigateToRoot();
  }
  onAccountsClick() {
    this.accountsVisible = true;
  }
  onLogoutClick() {
    this.navigationService.navigateToLogin();
  }
}
