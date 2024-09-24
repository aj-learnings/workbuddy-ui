import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { WorkItem } from '../../types/workitem';
import { CustomClickHandler } from '../../types/custom-click-handler';
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { ConfirmationDetails } from '../../types/confirmation-details';
import { WorkitemService } from '../../services/workitem.service';
import { ConfirmResponse } from '../../types/confirm-response';
import { AlertService } from '../../services/shared/alert.service';
import { UserService } from '../../services/shared/user.service';
import { UserDetails } from '../../types/user-details';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-workitems-list',
  standalone: true,
  imports: [CommonModule, ConfirmationComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit, OnChanges {

  constructor() {}

  workItemService = inject(WorkitemService);
  alertService = inject(AlertService);
  userService = inject(UserService);
  errorHandlerService = inject(ErrorHandlerService);

  @Input() workItems: WorkItem[] = [];
  @Input() selectedWorkItem?: WorkItem;
  @Output() itemClickedEmitter = new EventEmitter<CustomClickHandler>();
  @Output() deleteWorkItemEmitter = new EventEmitter<string>();

  deleteConfirmationDetails: ConfirmationDetails = {
    id: '',
    message: '',
    heading: 'Delete Workitem',
    warningMessage: 'All comments will also be deleted',
    successAction: 'Delete',
    successClass: 'danger',
  }
  showDeleteWorkItemSection: boolean = false;
  deletingWorkItem: boolean = false;
  userDetails?: UserDetails;

  ngOnInit(): void {
    this.userService
        .user$
        .subscribe((userDetails: UserDetails) => {
          this.userDetails = userDetails;
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  deleteItemHandler(item: WorkItem, event: MouseEvent) {
    event.stopPropagation();
    this.deleteConfirmationDetails.id = item.id;
    this.deleteConfirmationDetails.message = item.title;
    this.showDeleteWorkItemSection = true;
  }

  deleteConfirmHandler(event: ConfirmResponse) {
    this.showDeleteWorkItemSection = false;
    if (event.confirm) {
      this.deleteItem(event.id ?? '' );
    }
  }

  addItemHandler() {
    if (!this.userDetails?.loggedIn) {
      this.alertService
          .publishAlertValue({ 
            title: 'Oops!', 
            message: `Please login to add a workitem`, 
            class: 'danger', 
            show: true 
          });
      return;
    }
    if (this.userDetails?.loggedIn && !this.userDetails?.isVerified) {
      this.alertService
          .publishAlertValue({ 
            title: 'Pending!', 
            message: `Please verify your email`, 
            class: 'warning', 
            show: true 
          });
      return;
    }
    this.itemClickedEmitter.emit({ exist: false })
  }

  itemClickedHandler(item: WorkItem) {
    this.itemClickedEmitter.emit({ exist: true, itemId: item.id });
  }

  deleteItem(itemId: string) {
    this.deletingWorkItem = true;
    this.workItemService
        .deleteWorkItem(itemId)
        .subscribe({
          next: (response: boolean) => {
            this.deleteWorkItemEmitter.emit(itemId);
            this.deletingWorkItem = false;
          }, error: (error) => {
            this.deletingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        })
  }
}
