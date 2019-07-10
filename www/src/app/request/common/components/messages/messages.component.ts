import {AfterViewChecked, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { RequestPosition } from "../../models/request-position";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserInfoService } from "../../../../core/services/user-info.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewChecked {

  @Input() requestPosition: RequestPosition;

  @ViewChild('messagesList', {static: false}) private myScrollContainer: ElementRef;

  messages: Message[];
  sendMessageForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private userInfoService: UserInfoService
  ) {
    this.sendMessageForm = this.formBuilder.group({
      message: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.getMessages();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getMessages();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getMessages() {
    this.messageService.getList(this.requestPosition)
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      });
  }
  scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  isOwnMessage(message: Message) {
    return message.user.id === this.userInfoService.getUserInfo().id;
  }

  onCreateClick(customerData) {
    const message = new Message();
    message.message = customerData.message;

    this.messageService.addMessage(this.requestPosition, message)
      .subscribe((newMessage: Message) => {
        this.messages.push(newMessage);
      });

    this.sendMessageForm.reset();
  }
}
