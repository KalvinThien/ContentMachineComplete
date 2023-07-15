import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Observable, Subject, concatMap, from, map, of, tap } from 'rxjs';

const contentMachineUrl = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root',
})
export class ContentRepository {
  newlyCreatedPostData: {}[] = [];

  getAllContent(userUuid: string): Observable<any> {
    return from(axios.get(`${contentMachineUrl}/posts/${userUuid}`)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      concatMap((response: AxiosResponse<any, any>) => this.getPostList(response))
    );
  }

  createBulkTextContent(inputData: {
    userUuid: string;
    content: string;
    image: string;
    frequency: string;
  }): Observable<any> {
    return from(axios.post(`${contentMachineUrl}/text-posts`, inputData)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      concatMap((response: AxiosResponse<any, any>) => this.getPostList(response))
    );
  }

  private getPostList(response: AxiosResponse<any, any>) {
    if (response === null || response == undefined || response.data === null) {
      return of([]);
    } else {
      let postBundles = this.mapResponseToPosts(response.data);
      this.newlyCreatedPostData = postBundles;
      return of(postBundles);
    }
  }

  private mapResponseToPosts(responseData: AxiosResponse<any, any>): {}[] {
    const postsList: {}[] = [];

    for (const [post_type, posts] of Object.entries(responseData)) {
      for (const [date_key, post_data] of Object.entries(posts)) {
        let currPostBundle: {} = {
          post_type: post_type,
          post_date: date_key,
          ...(post_data as {}),
        };
        postsList.push(currPostBundle);
      }
    }
    return postsList;
  }
}
