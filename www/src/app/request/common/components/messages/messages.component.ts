import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { RequestPosition } from "../../models/request-position";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserInfoService } from "../../../../core/services/user-info.service";
import { WebsocketService } from "../../../../websocket/websocket.service";

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

    this.wsService.on<any>('message.new')
      .subscribe((message: Message) => {
        if (message.user.id !== userInfoService.getUserInfo().id
          && message.requestPositionId === this.requestPosition.id
        ) {
          this.messages.push(message);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getMessages();
    this.formReset();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getMessages() {
    this.loading = true;
    this.messageService.getList(this.requestPosition)
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
    this.messageService.addMessage(this.requestPosition, customerData.message, customerData.files)
      .subscribe((newMessage: Message) => {
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
