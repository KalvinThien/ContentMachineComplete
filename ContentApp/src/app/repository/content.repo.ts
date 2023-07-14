import { Injectable } from "@angular/core";
import axios, { AxiosResponse } from 'axios';
import { Observable, Subject, concatMap, from, map, of, tap } from 'rxjs';
import { FacebookPage } from "../model/facebookpage.model";

const contentMachineUrl = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root',
})
export class ContentRepository {
  
  newlyCreatedPostData: {}[] = [];

  createBulkContent(inputData: { userUuid: string; content: string; image: string; frequency: string; }): Observable<any> {

    return from(axios.post(`${contentMachineUrl}/schedule-text-posts`, inputData)).pipe(
      tap((response: AxiosResponse<any, any>) => {
        console.log('Response:', response.data);
      }),
      concatMap((response: AxiosResponse<any, any>) => {
        if (response === undefined || response.data.length === 0) {
          throw new Error('response === undefined || response.data.length === 0');
        } 

        const postBundles: {}[] = []

        // the post response at this point is { blog: {}[], etc }
        for (const [post_type, posts] of Object.entries(response.data)) {
          console.log("🚀 ~ file: content.repo.ts:30 ~ ContentRepository ~ concatMap ~ post_type, posts:", post_type, posts)
          for (const post of posts as {}[]) { 
            console.log("🚀 ~ file: content.repo.ts:32 ~ ContentRepository ~ concatMap ~ post:", post)
            for (const [key, post_data] of Object.entries(post)) {
              console.log("🚀 ~ file: content.repo.ts:33 ~ ContentRepository ~ concatMap ~ key, post_data:", key, post_data)
              
              let currPostBundle: {} = {
                post_type: post_type,
                post_date: key,
                ...post_data as {}
              };
              console.log("🚀 ~ file: content.repo.ts:41 ~ ContentRepository ~ concatMap ~ currPostBundle:", currPostBundle)
              postBundles.push(currPostBundle);
            }
          }
        }
        this.newlyCreatedPostData = postBundles;
        return of(postBundles);
      })
    )
  }
}
