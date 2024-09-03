import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CreateWorkItem } from '../types/workitem-create';
import { WorkItemResponse } from '../types/workitem-response';
import { UpdateWorkItem } from '../types/workitem-update';

@Injectable({
  providedIn: 'root'
})
export class WorkitemService {

  constructor(private httpClient: HttpClient) { }

  getAllWorkItems(): Observable<WorkItemResponse[]> {
    return this.httpClient
               .get<WorkItemResponse[]>(`${environment.apiBaseUrl}/workitem`);
  }

  addWorkItem(createWorkItem: CreateWorkItem): Observable<WorkItemResponse> {
    return this.httpClient
               .post<WorkItemResponse>(`${environment.apiBaseUrl}/workitem`, createWorkItem);
  }

  updateWorkItem(workItemId: string, updateWorkItem: UpdateWorkItem): Observable<WorkItemResponse> {
    return this.httpClient
               .put<WorkItemResponse>(`${environment.apiBaseUrl}/workitem/id/${workItemId}`, updateWorkItem);
  }

  deleteWorkItem(workItemId: string): Observable<boolean>{
    return this.httpClient
               .delete<boolean>(`${environment.apiBaseUrl}/workitem/id/${workItemId}`);
  }
}
