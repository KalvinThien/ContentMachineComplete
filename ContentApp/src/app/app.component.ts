import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationService } from './service/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  items: MenuItem[];

  title = 'Content Machine';

  constructor(
    private navigationService: NavigationService,
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

  onCalendarClick() {
    this.navigationService.navigateToCalendar();
  }
  onAccountsClick() {
    throw new Error('Method not implemented.');
  }
  onLogoutClick() {
    this.navigationService.navigateToLogin();
  }
}
