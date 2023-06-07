import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../views/common/confirmationdialog.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<any> {

  constructor(
    // private dialog: MatDialog
    ) {}
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }

  // canDeactivate(component: any): Observable<boolean> | boolean {
  //   console.log("🚀 ~ file: deactivate.guard.ts:15 ~ CanDeactivateGuard ~ canDeactivate ~ component:", component)
  //   if (component.isCurrentVideoPresent()) {
  //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //       width: '400px'
  //     });

  //     return dialogRef.afterClosed();
  //   }
  //   return true;
  // }
}
