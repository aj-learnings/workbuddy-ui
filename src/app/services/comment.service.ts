import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentResponse } from '../types/comment-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateComment } from '../types/comment-create';
import { UpdateComment } from '../types/comment-update';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  getAllCommentsPerWorkItem(workItemId: string): Observable<CommentResponse[]> {
    return this.httpClient
               .get<CommentResponse[]>(`${environment.apiBaseUrl}/workitem/id/${workItemId}/comment`);
  }

  addComment(workItemId: string, createComment: CreateComment): Observable<CommentResponse> {
    return this.httpClient
               .post<CommentResponse>(`${environment.apiBaseUrl}/workitem/id/${workItemId}/comment`, createComment);
  }

  updateComment(workItemId: string, commentId: string, updateComment: UpdateComment): Observable<CommentResponse> {
    return this.httpClient
               .put<CommentResponse>(`${environment.apiBaseUrl}/workitem/id/${workItemId}/comment/id/${commentId}`, updateComment);
  }

  deleteComment(workItemId: string, commentId: string): Observable<boolean> {
    return this.httpClient
               .delete<boolean>(`${environment.apiBaseUrl}/workitem/id/${workItemId}/comment/id/${commentId}`);
  }
}
