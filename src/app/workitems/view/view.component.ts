import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { WorkItem } from '../../types/workitem';
import { CustomClickHandler } from '../../types/custom-click-handler';
import { ConfirmationComponent } from "../../common/confirmation/confirmation.component";
import { ConfirmationDetails } from '../../types/confirmation-details';
import { WorkitemService } from '../../services/workitem.service';
import { ConfirmResponse } from '../../types/confirm-response';

@Component({
  selector: 'app-workitems-list',
  standalone: true,
  imports: [CommonModule, ConfirmationComponent],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnChanges {

  constructor() {}

  workItemService = inject(WorkitemService);

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
            console.log(error);
          }
        })
  }
}
