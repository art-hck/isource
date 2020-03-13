import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy, QueryList,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import { expand, map, take, tap } from "rxjs/operators";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { merge, Observable, Subject, Subscription } from "rxjs";
import { Message } from "../../request/common/models/message";
import { MessageContextToEventTypesMap } from "../message-context-types";
import { MessageService } from "./message.service";
import { UserInfoService } from "../../user/service/user-info.service";
import { Uuid } from "../../cart/models/uuid";
import { WebsocketService } from "../../websocket/websocket.service";

@Component({
  selector: 'app-message-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() contextId: Uuid;
  @Input() contextType: string;
  @ViewChild('scrollContainer', { static: false }) private scrollContainerEl: ElementRef;
  @ViewChildren('messagesList') messagesList: QueryList<any>;

  private scrollContainer: any;
  /**  Для первой загрузки быстро перематываем сообщения, дальше делаем плавную перемотку */
  private firstScroll = true;

  public messages$: Observable<Message[]>;
  public form = new FormGroup({
    text: new FormControl(null, Validators.required),
    files: new FormControl()
  });

  private subscription = new Subscription();
  private outgoingMessagesSubject = new Subject();

  constructor(
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private wsService: WebsocketService
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

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.contextId || changes.contextType) && this.contextId && this.contextType) {
      this.form.reset();
      const receivedMessages$ = this.wsService.on<any>(this.wsEvent);
      const sentMessages$ = this.outgoingMessagesSubject;
      const newMessages$ = merge(receivedMessages$, sentMessages$);

      this.messages$ = this.messageService.getList(this.contextType, this.contextId).pipe(
        tap(() => this.firstScroll = true),
        expand(messages => newMessages$.pipe(
          take(1),
          map(message => [...messages, message]),
        ))
      );
    }
  }

  public setFiles(files: File[]) {
    this.form.get("files").setValue([...this.form.get("files").value || [], ...files]);
  }

  public isOwnMessage(message: Message) {
    return message.user.id === this.userInfoService.getUserInfo().id;
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { text, files } = this.form.value;

    const message: Message = {
      user: this.userInfoService.getUserInfo(),
      message: text,
      isSending: true,
      documents: [],
      contextId: null,
      contextType: null,
      requestId: null
    };

    this.outgoingMessagesSubject.next(message);
    this.form.reset();
    this.subscription.add(
      this.messageService.addMessage(text, this.contextType, this.contextId, files)
        .subscribe(_message => {
          message.id = _message.id;
          message.isSending = false;
          message.documents = _message.documents;
        })
    );
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
