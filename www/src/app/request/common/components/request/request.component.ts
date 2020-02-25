import * as moment from 'moment';
import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { Observable, of } from "rxjs";
import { Request } from "../../models/request";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestService } from "../../../customer/services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { RequestWorkflowSteps } from "../../enum/request-workflow-steps";
import { RequestPositionWorkflowSteps } from "../../enum/request-position-workflow-steps";
import { PermissionType } from "../../../../auth/enum/permission-type";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  requestId: Uuid;
  @Input() request: Request;
  @Input() positions: RequestPositionList[];
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() addGroup = new EventEmitter();
  @Output() addPosition = new EventEmitter();
  @Output() addResponsible = new EventEmitter();
  @Output() publish = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();
  flatPositions$: Observable<RequestPosition[]>;
  permissionType = PermissionType;

  form: FormGroup;

  get checkedPositions(): RequestPosition[] {
    return this.formPositionsFlat
      .filter(formGroup => formGroup.get("checked").value)
      .map(formGroup => formGroup.get("position").value)
    ;
  }

  get formPositions(): FormArray {
    return this.form.get('positions') as FormArray;
  }

  get formPositionsFlat() {
    return this.formPositions.controls
      .reduce((arr, formGroup) => {
        if (formGroup && formGroup.get("positions").value.length > 0) {
          return [...arr, ...(formGroup.get("positions") as FormArray).controls];
        }
        return [...arr, formGroup];
      }, [])
      .filter(formGroup => this.asPosition(formGroup.get("position").value));
  }

  get isDraft(): boolean {
    return this.request.status === RequestWorkflowSteps.DRAFT || this.draftPositions.length > 0;
  }

  get draftPositions(): RequestPositionList[] {
    return this.positions.filter(function getRecursive(position) {
      const isDraft: boolean = position instanceof RequestPosition &&  position.status === RequestPositionWorkflowSteps.DRAFT;
      const isGroupHasDrafts: boolean = position instanceof RequestGroup && position.positions.filter(getRecursive).length > 0;
      return isDraft || isGroupHasDrafts;
    });
  }

  get isOnApproval(): boolean {
    return this.request.status === RequestWorkflowSteps.ON_CUSTOMER_APPROVAL || this.hasOnApprovalPositions.length > 0;
  }

  get hasOnApprovalPositions(): RequestPositionList[] {
    return this.positions.filter(function getRecursive(position) {
      const isOnApproval: boolean = position instanceof RequestPosition &&  position.status === RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL;
      const isGroupHasOnApproval: boolean = position instanceof RequestGroup && position.positions.filter(getRecursive).length > 0;
      return isOnApproval || isGroupHasOnApproval;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    public user: UserInfoService,
    public featureService: FeatureService
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.form = this.positionsToForm(this.positions);
    this.flatPositions$ = this.requestService.getRequestPositionsFlat(of(this.positions));
  }

  asGroup(positionList: RequestPositionList): RequestGroup | null {
    return positionList.entityType !== 'GROUP' ? null : positionList as RequestGroup;
  }

  asPosition(positionList: RequestPositionList): RequestPosition | null {
    return positionList.entityType !== 'POSITION' ? null : positionList as RequestPosition;
  }

  navigateToPosition(position: RequestPositionList, e: MouseEvent): void {
    if (!(e.target instanceof HTMLInputElement) && !e.ctrlKey && !e.shiftKey) {
      this.router.navigateByUrl(this.getPositionUrl(position));
      e.preventDefault();
    }
  }

  getPositionUrl(position: RequestPositionList): UrlTree {
    return this.router.createUrlTree([position.id], { relativeTo: this.route });
  }

  select(type: "all" | "none" | "groups" | "positions") {
    if (["all", "none"].indexOf(type) >= 0) {
      this.form.get("checked").setValue(type === "all");
    }
    if (["groups", "positions"].indexOf(type) >= 0) {
      this.formPositions.controls.forEach(c => c.get("checked").setValue(
        this.asFormArray(c.get("positions")).controls.length > 0 === (type === "groups")
      ));
    }
  }

  toggleGroups(folded: boolean) {
    this.formPositions.controls
      .filter(c => this.asFormArray(c.get("positions")).controls.length > 0)
      .forEach(c => c.get("folded").setValue(folded));
  }

  private positionsToForm(positions: RequestPositionList[], position?: RequestPositionList) {
    const formGroup = new FormGroup({
      checked: new FormControl(false),
      folded: new FormControl(false),
      positions: new FormArray(
        positions.map(p => this.positionsToForm(this.asGroup(p) ? this.asGroup(p).positions : [], p))
      )
    });

    if (position) {
      formGroup.addControl("position", new FormControl(position));
      if (this.user.isCustomer() && this.asPosition(position) && this.asPosition(position).status !== RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL ) {
        formGroup.get("checked").disable();
      }
    }


    return formGroup;
  }

  asFormArray(control: AbstractControl) {
    return control as FormArray;
  }

  canChangeStatuses() {
    let firstStatus = null;
    return this.checkedPositions.length && this.checkedPositions.every((item: RequestPosition) => {
      if (firstStatus === null) {
        firstStatus = item.status;
      }
      return item.status === firstStatus;
    });
  }

  onChangePositionStatuses() {
    // todo после этой эмита обновляются все позиции. Потом переделать на редакс.
    this.addPosition.emit();
  }
}
