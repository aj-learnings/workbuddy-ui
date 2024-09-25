import { Component, inject, OnInit } from '@angular/core';
import { ViewComponent as WorkItemsListComponent } from '../workitems/view/view.component';
import { CommonModule } from '@angular/common';
import { AddComponent as WorkItemAddComponent } from '../workitems/add/add.component';
import { EditComponent as WorkItemEditComponent } from '../workitems/edit/edit.component';
import { WorkItem } from '../types/workitem';
import { WorkitemService } from '../services/workitem.service';
import { WorkItemResponse } from '../types/workitem-response';
import { CustomClickHandler } from '../types/custom-click-handler';
import { SearchService } from '../services/shared/search.service';
import { SearchDetails } from '../types/search-details';
import { SearchType } from '../enums/search-type';
import { AlertService } from '../services/shared/alert.service';
import { AlertDetails } from '../types/alert-details';
import { AuthService } from '../services/auth.service';
import { VerifyUserResponse } from '../types/verify-user-response';
import { UserService } from '../services/shared/user.service';
import { UserDetails } from '../types/user-details';
import { ErrorHandlerService } from '../services/error-handler.service';
import { OtpComponent } from '../common/otp/otp.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    WorkItemsListComponent,
    CommonModule,
    WorkItemAddComponent,
    WorkItemEditComponent,
    OtpComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  searchService = inject(SearchService);
  alertService = inject(AlertService);
  workItemService = inject(WorkitemService);
  authService = inject(AuthService);
  userService = inject(UserService);
  errorHandlerService = inject(ErrorHandlerService);

  searchTextValue: string = '';
  alertDetails: AlertDetails = {
    title: '',
    message: '',
    class: '',
    show: false
  }
  userDetails?: UserDetails;

  fetchingWorkItems: boolean = false;

  showAddItem: boolean = false;
  showEditItem: boolean = false;
  leftPanelWidth: number = 100;

  showOtpSection: boolean = false;

  workItems: WorkItem[] = [];
  filteredWorkItems: WorkItem[] = [];
  selectedWorkItem?: WorkItem;

  temp: string = '';

  ngOnInit(): void {
    this.fetchingWorkItems = true;
    this.verify();
    this.fetchAllWorkItems();
    this.searchService
        .search$
        .subscribe((searchDetails: SearchDetails) => {
          if (searchDetails.type === SearchType.WorkItemList) {
            this.searchTextValue = searchDetails.value.trim();
            this.filterWorkItems();
          }
        });
    this.alertService
        .alert$
        .subscribe((alertDetails: AlertDetails) => {
          this.alertDetails = alertDetails;
        });
    this.userService
        .user$
        .subscribe((userDetails: UserDetails) => {
          this.userDetails = userDetails;
          if (this.userDetails?.loggedIn && !this.userDetails?.isVerified) {
            this.alertService
                .publishAlertValue({ 
                  title: 'Pending!', 
                  message: `Please verify your email`, 
                  class: 'warning', 
                  show: true 
                });
          }
        });
  }

  fetchAllWorkItems() {
    this.workItemService
        .getAllWorkItems()
        .subscribe({
          next: (response: WorkItemResponse[]) => {
            this.workItems = response;
            this.filterWorkItems();
            this.fetchingWorkItems = false;
          },
          error: (error) => {
            this.fetchingWorkItems = false;
            this.errorHandlerService
                .handleError(error.error);
          },
        });
  }

  verify() {
    this.authService
        .verify()
        .subscribe({
          next: (response: VerifyUserResponse) => {
            this.userService
                .publishUserDetails({ 
                  loggedIn: true, 
                  username: response.username,
                  isVerified: response.isVerified 
                });
          },
          error: (error) => {
            this.userService
                .publishUserDetails({ loggedIn: false, username: '' });
          }
        })
  }

  itemClickedHandler(event: CustomClickHandler) {
    if (event.exist) {
      this.showAddItem = false;
      this.showEditItem = true;
      this.selectedWorkItem = this.workItems.find((workItem) => workItem.id === event.itemId);
    } else {
      this.showEditItem = false;
      this.showAddItem = true;
    }
    this.leftPanelWidth = 50;
  }

  addWorkItemHandler(workItem: WorkItem) {
    this.workItems = [workItem, ...this.workItems];
    this.itemClickedHandler({ exist: true, itemId: workItem.id });
    this.filterWorkItems();
  }

  updateWorkItemHandler(updateWorkItem: WorkItem) {
    this.workItems = this.workItems.filter((workItem) => workItem.id !== updateWorkItem.id);
    this.workItems = [updateWorkItem, ...this.workItems];
    this.selectedWorkItem = updateWorkItem;
    this.filterWorkItems();
  }

  deleteWorkItemHandler(itemId: string) {
    if (this.selectedWorkItem?.id === itemId) {
      this.closeEditHandler();
    }
    this.workItems = this.workItems.filter((workItem) => workItem.id !== itemId);
    this.filterWorkItems();
  }

  filterWorkItems() {
    this.filteredWorkItems = this.workItems
                                 .filter(workItem => 
                                          workItem.title.toLowerCase().includes(this.searchTextValue.toLowerCase()) 
                                          || workItem.description?.toLowerCase()?.includes(this.searchTextValue.toLowerCase()));
  }

  closeAddHandler() {
    this.showAddItem = false;
    this.leftPanelWidth = 100;
  }

  closeEditHandler() {
    this.showEditItem = false;
    this.selectedWorkItem = undefined;
    this.leftPanelWidth = 100;
  }

  closeAlert() {
    this.alertDetails.show = false;
  }

  handleEmailVerification() {
    this.showOtpSection = true;
  }

  closeOtpSection(event: boolean) {
    if (event) {
      this.showOtpSection = false;
    }
  }
}
