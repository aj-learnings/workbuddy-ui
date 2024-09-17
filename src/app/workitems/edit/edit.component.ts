import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Output, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkItem } from '../../types/workitem';
import { QuillModule } from 'ngx-quill';
import { Comment } from '../../types/comment';
import { WorkitemService } from '../../services/workitem.service';
import { WorkItemResponse } from '../../types/workitem-response';
import { UpdateWorkItem } from '../../types/workitem-update';
import { CommentService } from '../../services/comment.service';
import { CommentResponse } from '../../types/comment-response';
import { CreateComment } from '../../types/comment-create';
import { UpdateComment } from '../../types/comment-update';
import { ConfirmationDetails } from '../../types/confirmation-details';
import { ConfirmResponse } from '../../types/confirm-response';
import { ConfirmationComponent } from '../../common/confirmation/confirmation.component';
import { AlertService } from '../../services/shared/alert.service';
import { UserDetails } from '../../types/user-details';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-workitem-edit',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FormsModule, QuillModule, ConfirmationComponent ],
  providers: [ DatePipe ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {

  workItemService = inject(WorkitemService);
  commentService = inject(CommentService);
  alertService = inject(AlertService);
  errorHandlerService = inject(ErrorHandlerService);

  @Input() workItem?: WorkItem;
  @Input() userDetails?: UserDetails;
  @Output() closeEditEmitter = new EventEmitter();
  @Output() updatedWorkItemEmitter = new EventEmitter<WorkItem>();

  @ViewChild('titleInput') titleInput!: ElementRef;

  updatingWorkItem: boolean = false;

  titleControl: FormControl = new FormControl('');
  descriptionControl: FormControl = new FormControl('');

  isTitleEditing = false;
  isDescriptionEditing = false;

  expandDescriptionSection: boolean = true;
  expandDateSection: boolean = true;
  expandCommentsSection: boolean = true;

  loadingComments: boolean = false;
  showAddCommentSection: boolean = false;
  newComment?: string = '';

  deleteConfirmationDetails: ConfirmationDetails = {
    id: '',
    message: '',
    heading: 'Delete Comment',
    successAction: 'Delete',
    successClass: 'danger',
  }
  showDeleteCommentSection: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.isTitleEditing = false;
    this.isDescriptionEditing = false;
    this.titleControl.setValue(this.workItem?.title);
    this.descriptionControl.setValue(this.workItem?.description);
    this.fetchAllComments();
  }

  updateWorkItemDetails(updateWorkItem: UpdateWorkItem) {
    this.updatingWorkItem = true;
    this.workItemService
        .updateWorkItem(this.workItem?.id ?? '', updateWorkItem)
        .subscribe({
          next: (response: WorkItemResponse) => {
            this.workItem = response;
            this.updatedWorkItemEmitter.emit(response);
            this.updatingWorkItem = false;
          }, error: (error) => {
            this.updatingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  fetchAllComments() {
    this.loadingComments = true;
    this.commentService
        .getAllCommentsPerWorkItem(this.workItem?.id ?? '')
        .subscribe({
          next: (response: CommentResponse[]) => {
            this.workItem!.comments = response;
            this.loadingComments = false;
          }, error: (error) => {
            this.loadingComments = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  editTitle() {
    if (this.workItem?.createdBy !== this.userDetails?.userName) {
      return;
    }
    this.isTitleEditing = true;
    setTimeout(() => {
      if (this.titleInput) {
        this.titleInput.nativeElement.focus();
      }
    }, 0);
  }

  saveTitle() {
    const title = this.titleControl.value?.trim() ?? '';
    if (title.length && title !== this.workItem?.title) {
      const updatedWorkItemDetails: UpdateWorkItem = {
        title: title,
        description: this.workItem?.description ?? ''
      };
      this.updateWorkItemDetails(updatedWorkItemDetails);
    }
    this.isTitleEditing = false;
  }

  openDescriptionEditor() {
    if (this.workItem?.createdBy !== this.userDetails?.userName) {
      return;
    }
    this.isDescriptionEditing = true;
  }

  saveDescription() {
    const description = this.descriptionControl.value?.trim() ?? '';
    if (description !== this.workItem?.description) {
      const updatedWorkItemDetails: UpdateWorkItem = {
        title: this.workItem?.title ?? '',
        description: description,
      };
      this.updateWorkItemDetails(updatedWorkItemDetails);
    }
    this.isDescriptionEditing = false;
  }

  closeDescriptionEditor() {
    this.descriptionControl.setValue(this.workItem?.description ?? '');
    this.isDescriptionEditing = false;
  }

  descriptionExpansionHandler() {
    this.expandDescriptionSection = !this.expandDescriptionSection;
  }

  dateExpansionHandler() {
    this.expandDateSection = !this.expandDateSection;
  }

  commentsExpansionHandler() {
    this.expandCommentsSection = !this.expandCommentsSection;
  }

  toggleCommentExpansion(comment: Comment) {
    comment.notExpanded = !comment.notExpanded;
  }

  openAddCommentPanel() {
    if (!this.userDetails?.loggedIn) {
      this.alertService
          .publishAlertValue({ 
            title: 'Oops!', 
            message: `Please login to add a comment`, 
            class: 'danger', 
            show: true 
          });
      return;
    }
    this.showAddCommentSection = true;
  }
  
  addComment() {
    if (!this.newComment?.length) {
      return;
    }
    this.updatingWorkItem = true;
    const createComment: CreateComment = {
      text: this.newComment,
    };
    this.commentService
        .addComment(this.workItem?.id ?? '', createComment)
        .subscribe({
          next: (response: CommentResponse) => {
            this.workItem!.comments?.push(response);
            this.workItem!.updated = response.updated;
            this.newComment = '';
            this.closeAddCommentPanel();
            this.updatedWorkItemEmitter.emit(this.workItem);
            this.updatingWorkItem = false;
          }, error: (error) => {
            this.updatingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  closeAddCommentPanel() {
    this.showAddCommentSection = false;
  }

  openEditCommentPanel(comment: Comment) {
    this.newComment = comment.text;
    comment.editing = true;
  }

  saveComment(comment: Comment) {
    if (!this.newComment?.length || this.newComment === comment.text) {
      this.closeEditCommentPanel(comment);
      return;
    }
    this.updatingWorkItem = true;
    const updateComment: UpdateComment = {
      text: this.newComment,
    };
    this.commentService
        .updateComment(this.workItem?.id ?? '', comment.id,  updateComment)
        .subscribe({
          next: (response: CommentResponse) => {
            this.closeEditCommentPanel(comment);
            const index = this.workItem?.comments?.findIndex(comment => comment.id === response.id);
            this.workItem!.comments![index!] = response;
            this.workItem!.updated = response.updated;
            this.newComment = '';
            this.updatedWorkItemEmitter.emit(this.workItem);
            this.updatingWorkItem = false;
          }, error: (error) => {
            this.updatingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  closeEditCommentPanel(comment: Comment) {
    this.newComment = '';
    comment.editing = false;
  }

  deleteCommentHandler(item: Comment) {
    this.deleteConfirmationDetails.id = item.id;
    this.deleteConfirmationDetails.message = item.text;
    this.showDeleteCommentSection = true;
  }

  deleteConfirmHandler(event: ConfirmResponse) {
    this.showDeleteCommentSection = false;
    if (event.confirm) {
      this.deleteComment(event.id ?? '' );
    }
  }

  deleteComment(id: string) {
    this.updatingWorkItem = true;
    this.commentService
        .deleteComment(this.workItem?.id ?? '', id)
        .subscribe({
          next: (response: boolean) => {
            this.workItem!.comments = this.workItem?.comments?.filter(comment => comment.id !== id);
            this.workItem!.updated = new Date().toISOString();
            this.updatedWorkItemEmitter.emit(this.workItem);
            this.updatingWorkItem = false;
          }, error: (error) => {
            this.updatingWorkItem = false;
            this.errorHandlerService
                .handleError(error.error);
          }
        });
  }

  onClose() {
    this.closeEditEmitter.emit();
  }

}
