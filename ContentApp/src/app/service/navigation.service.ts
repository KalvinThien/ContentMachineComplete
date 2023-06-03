import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(private router: Router) {
    /** */
  }
  
  navigateToDashboard() {
    this.router.navigate(['dashboard']);
  }
  
  // navigateToCopyCat() {
  //   this.router.navigate(['maker/copycat']);
  // }

  // navigateToExtractDetails(id: string = '') {
  //   if (id === '') {
  //     this.router.navigate(['maker/copycat/details']);
  //   } else {
  //     // localStorage.setItem('detailsId', id); for page refresh mid-edit
  //     this.router.navigate(['maker/copycat/details', id]);
  //   }
  // }
}
