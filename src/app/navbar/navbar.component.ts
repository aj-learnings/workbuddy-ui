import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../services/shared/search.service';
import { SearchType } from '../enums/search-type';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  searchService = inject(SearchService);

  searchControl: FormControl = new FormControl<string>('');

  ngOnInit(): void {
      this.searchControl
          .valueChanges
          .subscribe((value: string) => {
            this.searchService.publishSearchValue({ value: value, type: SearchType.WorkItemList });
          });
  }

}
