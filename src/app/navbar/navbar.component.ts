import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../services/shared/search.service';
import { SearchType } from '../enums/search-type';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  showLoginSection: boolean = false;

  searchService = inject(SearchService);

  searchControl: FormControl = new FormControl<string>('');

  ngOnInit(): void {
      this.searchControl
          .valueChanges
          .subscribe((value: string) => {
            this.searchService.publishSearchValue({ value: value, type: SearchType.WorkItemList });
          });
  }

  login() {
    this.showLoginSection = true;
  }

  closeLoginSection(event: boolean) {
    if (event) {
      this.showLoginSection = false;
    }
  }

}
