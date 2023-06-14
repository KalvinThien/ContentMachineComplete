import { Injectable } from '@angular/core';
import axios from 'axios';
import { FireAuthRepository } from '../repository/firebase/fireauth.repo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private errorSubject = new Subject<string>();

  errorObservable$ = this.errorSubject.asObservable();

  constructor(private fireAuthRepo: FireAuthRepository) {
    /** */
  }

  createContent(
    promptValue: string,
    imageValue: string,
    frequencyValue: string
  ) {
    const userId = this.fireAuthRepo.currentSessionUser?.uid;
    if (userId === undefined || userId === '') {
      this.errorSubject.next('User is not logged in');
      return;
    }

    const inputData = {
      userUuid: userId,
      content: promptValue,
      image: imageValue,
      frequency: frequencyValue,
    };

    axios
      .post('http://localhost:5000/api/schedule-text-posts', inputData)
      .then((response) => {
        // Handle the response from the Flask API
        console.log('Response:', response.data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
      });
  }
}
