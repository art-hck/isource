import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { expand, map, shareReplay, take, takeUntil, tap } from "rxjs/operators";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { merge, Observable, Subject } from "rxjs";
import { MessageContextToEventTypesMap, MessageContextTypes } from "../message-context-types";
import { UserInfoService } from "../../user/service/user-info.service";
import { Uuid } from "../../cart/models/uuid";
import { MessagesService } from "../services/messages.service";
import { Message } from "../models/message";
import { StateStatus } from "../../request/common/models/state-status";
import { AttachmentsService } from "../services/attachments.service";
import { Attachment } from "../models/attachment";
import { AppFile } from "../../shared/components/file/file";
import { RequestPositionList } from "../../request/common/models/request-position-list";
import { RequestPosition } from "../../request/common/models/request-position";
import { RequestGroup } from "../../request/common/models/request-group";

@Component({
  selector: 'app-message-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() contextId: Uuid;
  @Input() contextType: MessageContextTypes;
  @Input() conversationId: number;
  @Input() selectedRequestsItem: any;
  @Output() sendMessage = new EventEmitter<{ text: string, attachments: Attachment[] }>();
  @ViewChild('scrollContainer') private scrollContainerEl: ElementRef;
  @ViewChildren('messagesList') messagesList: QueryList<any>;

  private scrollContainer: any;
  /**  Для первой загрузки быстро перематываем сообщения, дальше делаем плавную перемотку */
  private firstScroll = true;

  public messages$: Observable<Message[]>;
  public state: StateStatus = 'pristine';
  files: { appFile: AppFile, status: StateStatus }[] = [];

  public form = new FormGroup({
    text: new FormControl(null, Validators.required),
    attachments: new FormArray([])
  });
  readonly destroy$ = new Subject();
  readonly change$ = new Subject();

  get formAttachments() {
    return this.form.get("attachments") as FormArray;
  }

  constructor(
    public attachmentsService: AttachmentsService,
    private messagesService: MessagesService,
    private userInfoService: UserInfoService,
  ) {
  }

  get wsEvent() {
    return MessageContextToEventTypesMap[this.contextType] + '.' + this.contextId;
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollContainerEl.nativeElement;
    // после каждого обновления списка элементов делаем скролл вниз
    this.messagesList.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.onItemElementsChanged());
  }

  ngOnChanges({ contextId, conversationId }: SimpleChanges) {
    if ((contextId || conversationId) && this.contextId) {
      this.form.reset();
      this.files = [];
      this.messages$ = null;
      this.state = "pristine";
      this.change$.next();
      if (this.conversationId) {
        this.state = "fetching";
        this.messagesService.markSeen({ conversationId: this.conversationId });
        const newMessages$ = this.messagesService.onNew(this.conversationId);

        this.messages$ = this.messagesService.get(this.conversationId).pipe(
          tap(() => this.firstScroll = true),
          tap(() => this.state = "received"),
          expand(messages => newMessages$.pipe(
            take(1),
            tap(({ id }) => this.messagesService.markSeen({ messageId: id })),
            map(message => [...messages, message]),
            takeUntil(this.change$)
          )),
          takeUntil(this.change$),
          shareReplay(1)
        );
      }
    }
  }

  public pushFiles(files: File[]) {
    const appFiles = files.map(file => ({appFile: new AppFile(file), status: 'fetching' as StateStatus}));
    this.files = [...this.files, ...appFiles];

    appFiles.filter(({ appFile: { invalid } }) => invalid).forEach(f => f.status = 'error');

    merge(...appFiles.filter(({ appFile: { valid } }) => valid).map(
      fileWithStatus => this.attachmentsService.upload(fileWithStatus.appFile.file).pipe(tap(() => fileWithStatus.status = "received"))
    )).pipe(takeUntil(this.destroy$)).subscribe(
      attachment => this.formAttachments.push(new FormControl(attachment))
    );
  }

  // @TODO: Удалять файлы с сервера
  public deleteFile(fileWithStatus: { appFile: AppFile, status: StateStatus }, i) {
    this.files.splice(i, 1);
    const formIndex = this.formAttachments.controls.findIndex(({ value }) => value === fileWithStatus.appFile.file);
    if (formIndex !== -1) {
      this.formAttachments.removeAt(formIndex);
    }
  }

  public isOwnMessage(message: Message) {
    return message.author.uid === this.userInfoService.getUserInfo().id;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.sendMessage.emit(this.form.value);
    this.files = [];
    this.form.reset();
    while ((this.form.get("attachments") as FormArray).length !== 0) {
      (this.form.get("attachments") as FormArray).removeAt(0);
    }
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      // новые сообщения перематываем плавно
      behavior: this.firstScroll ? 'auto' : 'smooth'
    });

    // включаем плавную перемотку
    if (this.firstScroll) {
      this.firstScroll = false;
    }
  }

  getRequestItemStatus(item: RequestPositionList) {
    if (item instanceof RequestPosition) {
      return item.status;
    } else if (item instanceof RequestGroup) {
      return null;
    }
  }

  public downloadFile(attachment: Attachment) {
    this.attachmentsService.download(attachment).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
