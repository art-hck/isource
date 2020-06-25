import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { PositionStatusesLabels } from "../../dictionaries/position-statuses-labels";
import { Request } from "../../models/request";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestService } from "../../../customer/services/request.service";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { RequestStatus } from "../../enum/request-status";
import { PositionStatus } from "../../enum/position-status";
import { PermissionType } from "../../../../auth/enum/permission-type";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { StateStatus } from "../../models/state-status";
import { debounceTime } from "rxjs/operators";
import { UxgPopoverContentDirection } from "uxg";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnChanges {
  @Input() request: Request;
  @Input() positions: RequestPositionList[];
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Input() status: StateStatus;
  @Input() positionsStatus: StateStatus;
  @Output() addGroup = new EventEmitter();
  @Output() addPosition = new EventEmitter();
  @Output() changeStatus = new EventEmitter();
  @Output() addResponsible = new EventEmitter();
  @Output() publish = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();

  readonly popoverDir = UxgPopoverContentDirection;
  readonly permissionType = PermissionType;
  readonly PositionStatusesLabels = PositionStatusesLabels;
  flatPositions: RequestPosition[] = [];
  form: FormGroup;
  editedPosition: RequestPosition;
  checkedPositions: RequestPosition[] = [];
  isDraft: boolean;
  isOnApproval: boolean;
  groups: RequestGroup[];
  canChangeStatuses: boolean;
  canPublish: boolean;

  get formPositions(): FormArray {
    return this.form.get("positions") as FormArray;
  }

  private get formPositionsFlat(): FormGroup[] {
    return this.formPositions.controls
      .reduce((arr, formGroup) => {
        if (formGroup && formGroup.get("positions") && formGroup.get("positions").value.length > 0) {
          return [...arr, ...(formGroup.get("positions") as FormArray).controls];
        }
        return [...arr, formGroup];
      }, [])
      .filter(formGroup => this.asPosition(formGroup.get("position").value));
  }

  private get draftPositions(): RequestPositionList[] {
    return this.positions.filter(function getRecursive(position) {
      const isDraft: boolean = position instanceof RequestPosition &&  position.status === PositionStatus.DRAFT;
      const isGroupHasDrafts: boolean = position instanceof RequestGroup && position.positions.filter(getRecursive).length > 0;
      return isDraft || isGroupHasDrafts;
    });
  }

  private get hasOnApprovalPositions(): RequestPositionList[] {
    return this.flatPositions.filter(position => position.status === PositionStatus.ON_CUSTOMER_APPROVAL);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private statusService: RequestPositionStatusService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    public user: UserInfoService,
    public featureService: FeatureService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.positions) {
      this.form = this.fetchForm(this.positions);
      this.flatPositions = this.requestService.getRequestPositionsFlat(this.positions);
      this.checkedPositions = [];
      this.groups = this.positions.filter(position => this.asGroup(position)) as RequestGroup[];
      this.isDraft = this.draftPositions.length > 0;
      this.isOnApproval = this.featureService.authorize("approveRequest") &&
        (this.request.status === RequestStatus.ON_CUSTOMER_APPROVAL || this.hasOnApprovalPositions.length > 0);
    }
    console.log("ngOnChanges", this);

    this.formPositions.valueChanges.pipe(debounceTime(10)).subscribe(value => {
      this.checkedPositions = this.formPositionsFlat
        .filter(formGroup => formGroup.get("checked").value)
        .map(formGroup => formGroup.get("position").value)
      ;

      this.canChangeStatuses = this.checkedPositions.length && this.checkedPositions.every(
        position => position.status === this.checkedPositions[0].status
      );

      this.canPublish = this.checkedPositions.length && this.checkedPositions.every(
        position => position.status === PositionStatus.DRAFT
      );
      this.cd.detectChanges();
    });
  }

  asGroup(positionList: RequestPositionList): RequestGroup | null {
    return positionList.entityType !== "GROUP" ? null : positionList as RequestGroup;
  }

  asPosition(positionList: RequestPositionList): RequestPosition | null {
    return positionList.entityType !== "POSITION" ? null : positionList as RequestPosition;
  }

  navigateToPosition(position: RequestPositionList, e: MouseEvent): void {
    if (!(e.target instanceof HTMLInputElement) && !e.ctrlKey && !e.shiftKey) {
      this.router.navigateByUrl(this.getPositionUrl(position));
      e.preventDefault();
    }
  }

  isNotActual(position: RequestPosition): boolean {
    return position.status === PositionStatus.CANCELED || position.status === PositionStatus.NOT_RELEVANT;
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
        c.get("positions") && this.asFormArray(c.get("positions")).controls.length > 0 === (type === "groups")
      ));
    }
  }

  toggleGroups(folded: boolean) {
    this.formPositions.controls
      .filter(c => c.get("positions") && this.asFormArray(c.get("positions")).controls.length > 0)
      .forEach(c => c.get("folded").setValue(folded));
  }

  asFormArray(control: AbstractControl) {
    return control as FormArray;
  }

  private fetchForm(positions: RequestPositionList[], position?: RequestPositionList) {
    const formGroup = this.fb.group({ checked: false, folded: false });

    if (positions) {
      formGroup.addControl("positions", this.fb.array(
        positions.map(p => this.fetchForm((p as RequestGroup).positions, p))
      ));
    }

    if (position) {
      formGroup.addControl("position", this.fb.control(position));
      if (this.asPosition(position) && this.isNotActual(this.asPosition(position))) {
        formGroup.get("checked").disable();
      }
    }

    return formGroup;
  }

  trackByFormPositionId = (i, c: AbstractControl) => c.get("position").value.id;
}
