import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from './service/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Content Machine';
  items: MenuItem[];

  accountsVisible = false;

  constructor(private navigationService: NavigationService) {
    this.items = [
      {
        icon: 'pi pi-angle-left',
      },
      {
        icon: 'pi pi-angle-right',
      },
    ];
  }

  onCalendarClick() {
    this.navigationService.navigateToCalendar();
  }
  onAccountsClick() {
    this.accountsVisible = true;
  }
  onLogoutClick() {
    this.navigationService.navigateToLogin();
  }

  onMediumAuthClick() {
    throw new Error('Method not implemented.');
  }
  onFacebookAuthClick() {
    throw new Error('Method not implemented.');
  }
  onTwitterAuthClick() {
    throw new Error('Method not implemented.');
  }
  onYoutubeAuthClick() {
    throw new Error('Method not implemented.');
  }
  onLinkedInAuthClick() {
    throw new Error('Method not implemented.');
  }
}
