import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateUserReaction } from '../types/user-reaction-create';
import { UserReactionResponse } from '../types/user-reaction-response';
import { UpdateUserReaction } from '../types/user-reaction-update';

@Injectable({
  providedIn: 'root'
})
export class UserReactionService {

  constructor(private httpClient: HttpClient) { }

  addUserReactionForComment(commentId: string, createUserReaction: CreateUserReaction): Observable<UserReactionResponse> {
    return this.httpClient
               .post<UserReactionResponse>(`${environment.apiBaseUrl}/comment/id/${commentId}/reaction`, createUserReaction);
  }

  updateUserReaction(userReactionId: string, updateUserReaction: UpdateUserReaction): Observable<UserReactionResponse> {
    return this.httpClient
               .put<UserReactionResponse>(`${environment.apiBaseUrl}/reaction/id/${userReactionId}`, updateUserReaction);
  }

  deleteUserReaction(userReactionId: string): Observable<boolean> {
    return this.httpClient
               .delete<boolean>(`${environment.apiBaseUrl}/reaction/id/${userReactionId}`);
  }
}
