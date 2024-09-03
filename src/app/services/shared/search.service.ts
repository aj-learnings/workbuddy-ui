import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchDetails } from '../../types/search-details';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSubject = new Subject<SearchDetails>();

  search$ = this.searchSubject.asObservable();

  publishSearchValue(searchDetails: SearchDetails) {
    this.searchSubject.next(searchDetails);
  }

}
