import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
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
export class MessagesComponent implements AfterViewChecked, OnChanges, OnDestroy {

  @Input() contextId: Uuid;
  @Input() contextType: string;
  @ViewChild('messagesList', { static: false }) private messagesList: ElementRef;

  public messages$: Observable<Message[]>;
  public form = new FormGroup({
    text: new FormControl(null, Validators.required),
    files: new FormControl()
  });

  private subscription = new Subscription();
  private outgoingMessagesSubject = new Subject();
  private scrollToBottom: boolean;

  constructor(
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private wsService: WebsocketService
  ) {
  }

  get wsEvent() {
    return MessageContextToEventTypesMap[this.contextType] + '.' + this.contextId;
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.contextId || changes.contextType) && this.contextId && this.contextType) {
      this.form.reset();
      const receivedMessages$ = this.wsService.on<any>(this.wsEvent);
      const sentMessages$ = this.outgoingMessagesSubject.pipe(tap(() => this.scrollToBottom = true));
      const newMessages$ = merge(receivedMessages$, sentMessages$);

      this.messages$ = this.messageService.getList(this.contextType, this.contextId).pipe(
        tap(() => this.scrollToBottom = true),
        expand(messages => newMessages$.pipe(
          take(1),
          map(message => [...messages, message]),
        ))
      );
    }
  }

  ngAfterViewChecked() {
    if (this.scrollToBottom) {
      this.scrollToBottom = false;
      this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
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
}
