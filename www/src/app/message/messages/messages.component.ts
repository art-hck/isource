import { AfterViewChecked, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from "../../request/common/models/message";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserInfoService } from "../../core/services/user-info.service";
import { WebsocketService } from "../../websocket/websocket.service";
import { MessageService } from "./message.service";
import { Uuid } from "../../cart/models/uuid";
import { MessageContextToEventTypesMap } from "../message-context-types";
import { DocumentUploadListComponent } from "../../shared/components/document-upload-list/document-upload-list.component";
import * as moment from 'moment';

@Component({
  selector: 'app-message-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewChecked, OnChanges {

  @Input() contextId: Uuid;
  @Input() contextType: string;

  @ViewChild('messagesList', {static: false}) private myScrollContainer: ElementRef;
  @ViewChild('documentUploadList', {static: false}) private documentUploadList: DocumentUploadListComponent;

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
    this.formReset();

    if (this.contextType && this.contextId) {
      this.getMessages();

      this.wsService.on<any>(MessageContextToEventTypesMap[this.contextType] + '.' + this.contextId)
        .subscribe((message: Message) => {
          console.log(message);
          if (message.user.id !== this.userInfoService.getUserInfo().id) {
            this.messages.push(message);
          }
        });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getMessages() {
    this.loading = true;
    this.messageService.getList(this.contextType, this.contextId)
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
      this.contextType,
      this.contextId,
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

  onUploadFileClick() {
    this.documentUploadList.open();
  }

  /**
   * Если дата сегодняшняя, то возвращает время, иначе дату без времени
   * @param createdDate
   */
  getMessageDate(createdDate: string) {
    return moment(new Date()).isSame(createdDate, 'date') ?
      moment(createdDate).format('HH:mm') :
      moment(createdDate).format('YYYY.MM.DD');
  }
}
