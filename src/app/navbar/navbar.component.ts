import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchService } from '../services/shared/search.service';
import { SearchType } from '../enums/search-type';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/shared/user.service';
import { UserDetails } from '../types/user-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, LoginComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  showLoginSection: boolean = false;
  showLoginButton: boolean = false;

  searchService = inject(SearchService);
  userService = inject(UserService);

  searchControl: FormControl = new FormControl<string>('');
  userName: string = '';

  ngOnInit(): void {
    this.searchControl
        .valueChanges
        .subscribe((value: string) => {
          this.searchService.publishSearchValue({ value: value, type: SearchType.WorkItemList });
        });
    this.userService
        .user$
        .subscribe((userDetails: UserDetails) => {
          this.showLoginButton = !userDetails.loggedIn;
          this.userName = userDetails.userName ?? '';
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
