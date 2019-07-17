import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  OnDestroy
} from '@angular/core';
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
export class MessagesComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {

  @Input() requestPosition: RequestPosition;

  @ViewChild('messagesList', {static: false}) private myScrollContainer: ElementRef;

  messages: Message[];
  sendMessageForm: FormGroup;
  uploadedFiles: File[] = [];
  updateInterval = 15 * 1000;
  updateTask: number|null = null;

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private userInfoService: UserInfoService
  ) {
    this.sendMessageForm = this.formBuilder.group({
      message: [null, [Validators.required]],
      files: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getMessages();
    this.formReset();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.startUpdateMessages();
  }

  ngOnDestroy() {
    this.stopUpdateMessages();
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

  startUpdateMessages(): void {
    if (this.updateTask) {
      return;
    }
    this.updateMessages();
  }

  stopUpdateMessages(): void {
    if (this.updateTask) {
      window.clearTimeout(this.updateTask);
      this.updateTask = null;
    }
  }

  updateMessages(): void {
    this.updateTask = window.setTimeout(() => {
      this.messageService.getList(this.requestPosition)
        .subscribe((messages: Message[]) => {
          if (messages.length > this.messages.length) {
            this.messages = messages;
          }
          this.updateMessages();
        });
    }, this.updateInterval);
  }
}
