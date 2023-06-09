import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(
    private router: Router,
    private fireAuthRepo: FireAuthRepository
  ) {
    /** */
  }


  navigateToRoot() {
    this.router.navigate(['']);
  }

  navigateToLogin() {
    this.fireAuthRepo.signOut().then(() => {
      this.router.navigate(['login']);
    });
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
