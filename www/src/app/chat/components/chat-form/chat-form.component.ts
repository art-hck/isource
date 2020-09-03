import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { merge, Subject, throwError } from "rxjs";
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { AttachmentsService } from "../../services/attachments.service";
import { UxgModalComponent } from "uxg";
import { ChatAttachment } from "../../models/chat-attachment";

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnDestroy, OnChanges {
  @ViewChild('attachmentModal') attachmentModal: UxgModalComponent;
  @Output() send = new EventEmitter<{ text: string, attachments: ChatAttachment[] }>();
  @Input() disabled: boolean;

  isLoading: boolean;

  readonly destroy$ = new Subject();
  readonly form: FormGroup = this.fb.group({
    text: null,
    attachments: this.fb.array([])
  });

  get attachments() {
    return this.form.get('attachments') as FormArray;
  }

  ngOnChanges() {
    if (this.disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  constructor(private store: Store, private fb: FormBuilder, private attachmentsService: AttachmentsService) {}

  selectFiles(files: File[]) {
    this.attachmentModal.open();
    this.isLoading = true;

    merge(...files.map(file => this.attachmentsService.upload(file))).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      catchError(err => {
        this.attachmentModal.close();
        this.store.dispatch(new ToastActions.Error('Ошибка загрузки!'));
        return throwError(err);
      }), takeUntil(this.destroy$)
    ).subscribe(attachment => this.attachments.push(this.fb.control(attachment)));
  }

  submit(e?: Event) {
    e?.preventDefault();
    if (this.form.disabled) { return; }
    this.send.emit(this.form.value);
    this.reset();
  }

  reset() {
    this.form.get('text').reset();
    while (this.attachments.length !== 0) {
      this.attachments.removeAt(0);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
