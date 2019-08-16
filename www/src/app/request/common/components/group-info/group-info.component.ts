import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { ClrTabLink } from "@clr/angular";
import { RequestPosition } from "../../models/request-position";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestGroup } from "../../models/request-group";
import { RequestPositionList } from "../../models/request-position-list";
import { FormControl, Validators } from "@angular/forms";
import { GroupService } from "../../services/group.service";
import { NotificationService } from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.scss']
})
export class GroupInfoComponent implements OnInit {

  @ViewChildren(ClrTabLink) tabLinks: QueryList<ClrTabLink>;

  @Input() opened: boolean;
  @Output() openedChange = new EventEmitter<boolean>();

  @Input() requestGroup: RequestPositionList;
  @Input() groupInfoEditable: boolean;
  @Output() requestPositionChanged = new EventEmitter<RequestPosition>();
  @Output() requestGroupChanged = new EventEmitter<RequestGroup>();

  @Output() groupInfoEditableChange = new EventEmitter<boolean>();

  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  @Input() fullScreen = false;
  @Output() fullScreenChange = new EventEmitter<boolean>();

  @Output() changeRequestInfo = new EventEmitter<boolean>();

  groupName = new FormControl('', Validators.required);


  constructor(
    private groupService: GroupService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
  }

  onSaveGroup(groupName) {
    this.groupService.saveGroup(this.requestId, groupName)
      .subscribe((data: RequestGroup) => {
        this.requestGroupChanged.emit(data);
        this.groupInfoEditable = false;
        this.groupName.reset();
        this.groupInfoEditableChange.emit(this.groupInfoEditable);
        this.notificationService.toast('Группа создана');
      });
  }

  onWindowClose() {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  onWindowFull(flag: boolean) {
    this.fullScreen = flag;
    this.fullScreenChange.emit(this.fullScreen);
  }

  isNewGroup() {
    return !this.requestGroup.id;
  }
}
