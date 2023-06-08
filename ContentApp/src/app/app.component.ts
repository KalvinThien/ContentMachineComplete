import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from './service/navigation.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SocialAuthService } from './service/socialauth.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

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
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
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
    this.confirmationService.confirm({
      message: 'You are about to log out of the app.  Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have been logged out.' });
          this.navigationService.navigateToLogin();
      },
      reject: (type: any) => {
          // switch (type) {
          //     case ConfirmEventType.REJECT:
          //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          //         break;
          //     case ConfirmEventType.CANCEL:
          //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
          //         break;
          // }
      }
  });
  }
}
