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

@Component({
  selector: 'app-message-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() contextId: Uuid;
  @Input() contextType: MessageContextTypes;
  @Input() conversationId: number;
  @Output() sendMessage = new EventEmitter<{ text: string, attachments: Attachment[] }>();
  @ViewChild('scrollContainer') private scrollContainerEl: ElementRef;
  @ViewChildren('messagesList') messagesList: QueryList<any>;

  private scrollContainer: any;
  /**  Для первой загрузки быстро перематываем сообщения, дальше делаем плавную перемотку */
  private firstScroll = true;

  public messages$: Observable<Message[]>;
  public state: StateStatus = 'pristine';
  files: { file: File, status: StateStatus }[] = [];

  public form = new FormGroup({
    text: new FormControl(null, Validators.required),
    files: new FormControl(),
    attachments: new FormArray([])
  });
  readonly destroy$ = new Subject();

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
            map(message => [...messages, message])
          )),
          shareReplay(1)
        );
      }
    }
  }

  public pushFiles(files: File[]) {
    this.files = [...this.files, ...files.map(file => ({file, status: 'fetching' as StateStatus}))];

    merge(...files.map(f => this.attachmentsService.upload(f).pipe(tap(() => {
      const i = this.files.findIndex(({ file }) => file === f);
      this.files[i].status = "received";
    })))).pipe(takeUntil(this.destroy$)).subscribe(
      attachment => {
        (this.form.get("attachments") as FormArray).push(new FormControl(attachment));
      }
    );
  }

  public deleteFiles(files: File[]) {
    this.files
      .filter(({ file }) => files.indexOf(file) === -1)
      .forEach((file, index) => {
        this.files.splice(index, 1);
        (this.form.get("attachments") as FormArray).removeAt(index);
      });
  }

  public isOwnMessage(message: Message) {
    return message.author.id === this.userInfoService.getUserInfo().id;
  }

  getFiles(stateStatus: StateStatus): File[] {
    return this.files.filter(({ status }) => status === stateStatus).map(({ file }) => file);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.sendMessage.emit(this.form.value);
    this.files = [];
    this.form.reset();
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

  public downloadFile(attachment: Attachment) {
    this.attachmentsService.download(attachment).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
