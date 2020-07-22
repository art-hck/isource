import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { expand, map, take, tap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { merge, Observable, Subject, Subscription } from "rxjs";
import { MessageContextToEventTypesMap, MessageContextTypes } from "../message-context-types";
import { UserInfoService } from "../../user/service/user-info.service";
import { Uuid } from "../../cart/models/uuid";
import { MessagesService } from "../services/messages.service";
import { Message } from "../models/message";
import { StateStatus } from "../../request/common/models/state-status";

@Component({
  selector: 'app-message-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() contextId: Uuid;
  @Input() contextType: MessageContextTypes;
  @Input() conversationId: number;
  @Output() sendMessage = new EventEmitter<{ text: string, files: File[] }>();
  @ViewChild('scrollContainer') private scrollContainerEl: ElementRef;
  @ViewChildren('messagesList') messagesList: QueryList<any>;

  private scrollContainer: any;
  /**  Для первой загрузки быстро перематываем сообщения, дальше делаем плавную перемотку */
  private firstScroll = true;

  public messages$: Observable<Message[]>;
  public state: StateStatus = 'pristine';

  public form = new FormGroup({
    text: new FormControl(null, Validators.required),
    files: new FormControl()
  });

  private subscription = new Subscription();
  private outgoingMessagesSubject = new Subject<Message>();

  constructor(
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
    this.messagesList.changes.subscribe(() => this.onItemElementsChanged());
  }

  ngOnChanges({ contextId, conversationId }: SimpleChanges) {
    if ((contextId || conversationId) && this.contextId) {
      this.form.reset();
      this.messages$ = null;
      this.state = "pristine";
      if (this.conversationId) {
        this.state = "fetching";
        const receivedMessages$ = this.messagesService.onNew(this.conversationId);
        const sentMessages$ = this.outgoingMessagesSubject;
        const newMessages$ = merge<Message>(receivedMessages$, sentMessages$);

        this.messages$ = this.messagesService.get(this.conversationId).pipe(
          tap(() => this.firstScroll = true),
          tap(() => this.state = "received"),
          expand(messages => newMessages$.pipe(
            take(1),
            map(message => [...messages, message]),
          ))
        );
      }
    }
  }

  public setFiles(files: File[]) {
    this.form.get("files").setValue([...this.form.get("files").value || [], ...files]);
  }

  public isOwnMessage(message: Message) {
    return message.author.id === this.userInfoService.getUserInfo().id;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.sendMessage.emit(this.form.value);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
