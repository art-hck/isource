import { AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { RequestPosition } from "../../models/request-position";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserInfoService } from "../../../../auth/services/user-info.service";
import { WebsocketService } from "../../../../websocket/websocket.service";
import { EventTypes } from "../../../../websocket/event-types";
import { MessageContextTypes } from "../../../../message/message-context-types";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewChecked, OnChanges {

  @Input() requestPosition: RequestPosition;

  @ViewChild('messagesList', {static: false}) private myScrollContainer: ElementRef;

  messages: Message[];
  sendMessageForm: FormGroup;
  uploadedFiles: File[] = [];
  loading: boolean;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private userInfoService: UserInfoService,
    private wsService: WebsocketService
  ) {
    this.sendMessageForm = this.formBuilder.group({
      message: [null, [Validators.required]],
      files: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getMessages();
    this.formReset();

    this.wsService.on<any>(EventTypes.REQUEST_POSITION_MESSAGE_NEW.valueOf() + '.' + this.requestPosition.id)
      .subscribe((message: Message) => {
        console.log(message);
        if (message.user.id !== this.userInfoService.getUserInfo().id) {
          this.messages.push(message);
        }
      });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getMessages() {
    this.loading = true;
    this.messageService.getList(MessageContextTypes.REQUEST_POSITION, this.requestPosition.id)
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        this.loading = false;
      });
  }

  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  isOwnMessage(message: Message) {
    return message.user.id === this.userInfoService.getUserInfo().id;
  }

  onCreateClick(customerData) {
    this.messageService.addMessage(
      customerData.message,
      MessageContextTypes.REQUEST_POSITION,
      this.requestPosition.id,
      customerData.files
    ).subscribe((newMessage: Message) => {
      this.messages.push(newMessage);
    });

    this.formReset();
  }

  onFileSelected(files: File[]) {
    this.sendMessageForm.get('files').setValue(files);
  }

  formReset() {
    this.sendMessageForm.reset();
    this.uploadedFiles = [];
  }
}
