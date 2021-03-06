import { ActivatedRoute, Router, UrlTree } from "@angular/router";
import { getCurrencySymbol } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { PositionStatusesLabels } from "../../dictionaries/position-statuses-labels";
import { Request } from "../../models/request";
import { RequestGroup } from "../../models/request-group";
import { RequestPosition } from "../../models/request-position";
import { RequestPositionList } from "../../models/request-position-list";
import { RequestService } from "../../../customer/services/request.service";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { PositionStatus } from "../../enum/position-status";
import { PermissionType } from "../../../../auth/enum/permission-type";
import { RequestPositionStatusService } from "../../services/request-position-status.service";
import { StateStatus } from "../../models/state-status";
import { debounceTime } from "rxjs/operators";
import { UxgModalComponent, UxgPopoverContentDirection } from "uxg";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { User } from "../../../../user/models/user";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnChanges {
  @ViewChild('editRequestNameModal') editRequestNameModal: UxgModalComponent;
  @ViewChild('addDocumentsModal') addDocumentsModal: UxgModalComponent;
  @ViewChild('rejectPositionModal') rejectPositionModal: UxgModalComponent;

  @Input() request: Request;
  @Input() positions: RequestPositionList[];
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Input() status: StateStatus;
  @Input() positionsStatus: StateStatus;
  @Output() addGroup = new EventEmitter();
  @Output() addPosition = new EventEmitter();
  @Output() changeStatus = new EventEmitter();
  @Output() addResponsiblePositions = new EventEmitter<{ positions: RequestPosition[], user: User }>();
  @Output() addResponsibleRequest = new EventEmitter<User>();
  @Output() createTemplate = new EventEmitter();
  @Output() publish = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() publishPositions = new EventEmitter();
  @Output() approvePositions = new EventEmitter();
  @Output() rejectPositions = new EventEmitter();
  @Output() attachDocuments = new EventEmitter();
  @Output() saveRequestName = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();

  readonly popoverDir = UxgPopoverContentDirection;
  readonly permissionType = PermissionType;
  readonly PositionStatusesLabels = PositionStatusesLabels;
  readonly PositionStatus = PositionStatus;
  readonly getCurrencySymbol = getCurrencySymbol;
  flatPositions: RequestPosition[] = [];
  form: FormGroup;
  editedPosition: RequestPosition;
  checkedPositions: RequestPosition[] = [];
  isDraft: boolean;
  isOnApproval: boolean;
  groups: RequestGroup[];
  canChangeStatuses: boolean;
  canPublish: boolean;
  invalidUploadDocument: boolean;

  requestNameForm = new FormGroup({
    requestName: new FormControl('', [CustomValidators.requiredNotEmpty, Validators.maxLength(250)]),
  });

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

  canEditRequestName(): boolean {
    return (this.featureService.authorize('editRequestNameCustomer') && ['DRAFT', 'NEW', 'ON_CUSTOMER_APPROVAL'].indexOf(this.request.status) !== -1) ||
           (this.featureService.authorize('editRequestNameBackoffice') && ['NEW', 'IN_PROGRESS'].indexOf(this.request.status) !== -1);
  }

  everyPositionHasStatus(positions: RequestPosition[], statuses: PositionStatus[]): boolean {
    return positions.every(position => statuses.includes(position.status));
  }

  someOfPositionsHasStatus(positions: RequestPosition[], statuses: PositionStatus[]): boolean {
    return positions.some(position => statuses.includes(position.status));
  }

  showCheckbox(positions: RequestPosition[]) {
    return this.user.isCustomer() ||
      this.user.isBackofficeBuyer() ||
      this.user.isSeniorBackoffice() ||
      (this.user.isCustomerApprover() && positions.some(position => position.status === PositionStatus.PROOF_OF_NEED));
  }

  someOfPositionsAreInProcedure(): boolean {
    return this.checkedPositions.some(position => position.isInProcedure === true);
  }

  everyPositionIsNotDraftEntity(): boolean {
    return this.checkedPositions.every(position => position.isDraftEntity === false);
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
      this.isOnApproval = this.featureService.authorize("approveRequest") && this.hasOnApprovalPositions.length > 0;
    }

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

  isNotActualOrOnApprove(position: RequestPosition): boolean {
    return position.status === PositionStatus.CANCELED || position.status === PositionStatus.NOT_RELEVANT ||
      (position.status === PositionStatus.PROOF_OF_NEED && this.user.isCustomer());
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
        !!c.get("positions") === (type === "groups")
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

  onPublishPositions() {
    const positionIds = this.checkedPositions.map(item => item.id);

    this.publishPositions.emit(positionIds);
  }

  onApprovePositions() {
    const positionIds = this.checkedPositions.map(item => item.id);

    this.approvePositions.emit(positionIds);
  }

  onRejectPositions(rejectionMessage?: string) {
    const positionIds = this.checkedPositions.map(item => item.id);

    this.rejectPositions.emit({positionIds, rejectionMessage});
  }

  onAttachDocumentsToPositions() {
    const files = this.form.get('documents').value;
    const positionIds = this.checkedPositions.map(item => item.id);

    if (files?.length) {
      this.attachDocuments.emit({positionIds, files});
      this.addDocumentsModal.close();
    } else {
      this.invalidUploadDocument = true;
    }
  }

  openFileUploadToPositionsModal() {
    this.form.get('documents').setValue(null);
    this.invalidUploadDocument = false;
    this.addDocumentsModal.open();
  }

  openRequestNameEditModal() {
    this.requestNameForm.get('requestName').setValue(this.request.name);
    this.editRequestNameModal.open();
  }

  onSaveRequestName() {
    if (this.requestNameForm.valid) {
      this.saveRequestName.emit(this.requestNameForm.get('requestName').value);
      this.editRequestNameModal.close();
    }
  }

  onDragAndDropDocumentsToPosition(positionId, files: File[]) {
    const positionIds = [positionId];

    if (files.filter(f => f.type).length) {
      this.attachDocuments.emit({ positionIds, files: files.filter(f => f.type) });
    }
  }

  resetSelectedPositions() {
    this.formPositionsFlat.filter(formGroup => formGroup.get("checked").setValue(false));
  }

  private fetchForm(positions: RequestPositionList[], position?: RequestPositionList) {
    const formGroup = this.fb.group({ checked: false, folded: false, documents: null });

    if (positions) {
      formGroup.addControl("positions", this.fb.array(
        positions.map(p => this.fetchForm((p as RequestGroup).positions, p))
      ));
    }

    if (position) {
      formGroup.addControl("position", this.fb.control(position));
      if (this.asPosition(position) && this.isNotActualOrOnApprove(this.asPosition(position))) {
        formGroup.get("checked").disable();
      }
    }

    return formGroup;
  }

  clickRejectPositions() {
    this.user.isCustomerApprover() ? this.onRejectPositions() : this.rejectPositionModal.open();
  }

  trackByFormPositionId = (i, c: AbstractControl) => c.get("position").value.id;
}
