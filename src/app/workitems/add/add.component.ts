import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CreateWorkItem } from '../../types/workitem-create';
import { WorkItemType } from '../../enums/workitem';
import { WorkitemService } from '../../services/workitem.service';
import { WorkItemResponse } from '../../types/workitem-response';
import { CommonModule } from '@angular/common';
import { WorkItem } from '../../types/workitem';
import { AlertService } from '../../services/shared/alert.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-workitem-add',
  standalone: true,
  imports: [ ReactiveFormsModule, QuillModule, CommonModule ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {

  workItemService = inject(WorkitemService);
  alertService = inject(AlertService);
  errorHandlerService = inject(ErrorHandlerService);

  addingWorkItem: boolean = false;

  @Output() closeAddEmitter = new EventEmitter();
  @Output() addWorkItemEmitter = new EventEmitter<WorkItem>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: [''],
    });
  }

  add() {
    this.addingWorkItem = true;
    const createWorkItemRequest: CreateWorkItem = {
      title: this.form.value.title.trim(),
      description: this.form.value.description?.trim() ?? '',
      type: WorkItemType.GENERAL
    };
    this.workItemService
        .addWorkItem(createWorkItemRequest)
        .subscribe({
          next: (response: WorkItemResponse) => {
            this.addingWorkItem = false;
            this.addWorkItemEmitter.emit(response);
            this.alertService
                .publishAlertValue({ 
                  title: 'Awesome!', 
                  message: 'Work item has been added', 
                  class: 'success', 
                  show: true 
                });
          },
          error: (error) => {
            this.addingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  onClose() {
    this.closeAddEmitter.emit();
  }
}
