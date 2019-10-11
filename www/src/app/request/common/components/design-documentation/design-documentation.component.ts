import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";
import { Request } from "../../models/request";
import { RequestService } from "../../../back-office/services/request.service";
import { DesignDocumentationService } from "../../../back-office/services/design-documentation.service";
import { DesignDocumentationList } from "../../models/design-documentationList";
import { RequestPosition } from "../../models/request-position";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DesignDocumentation } from "../../models/design-documentation";
import { finalize } from "rxjs/operators";
import { DesignDocumentationStatus } from "../../enum/design-documentation-status";
import { ClrLoadingState } from "@clr/angular";
import { Observable } from "rxjs";
import { DesignDocumentationType } from "../../enum/design-documentation-type";

@Component({
  selector: 'app-design-documentation',
  templateUrl: './design-documentation.component.html',
  styleUrls: ['./design-documentation.component.scss']
})
export class DesignDocumentationComponent implements OnInit {

  requestId: Uuid;
  request$: Observable<Request>;
  positions: RequestPosition[] = [];
  routeData: {
    isBackoffice?: boolean,
    isCustomer?: boolean
  } = {};

  designDocumentations: DesignDocumentationList[] = [];
  documentationList: DesignDocumentation[];

  showDesignDocumentationListModal = false;
  addDocumentationForm: FormGroup;
  selectedPositions: RequestPosition[] = [];
  existingPositions: RequestPosition[] = [];
  pos: RequestPosition[] = [];
  designDocStatus = DesignDocumentationStatus;
  clrLoadingState = ClrLoadingState;

  private loadingDesignDocs: DesignDocumentation[] = [];
  private sendingForApproval: DesignDocumentationList[] = [];

  get addDocumentationListForm() {
    return this.addDocumentationForm.get('addDocumentationListForm') as FormArray;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private designDocumentationService: DesignDocumentationService,
    private formBuilder: FormBuilder
  ) {
    this.addDocumentationForm = this.formBuilder.group({
      'addDocumentationListForm': this.formBuilder.array([
        this.addDocumentationListFormGroup()
      ])
    });
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.routeData = this.route.snapshot.data;
    this.request$ = this.requestService.getRequestInfo(this.requestId);

    this.getPositionList();
    this.getDesignDocumentationList();

    this.addDocumentationListFormGroup();
  }

  onRequestsClick(): void {
    this.router.navigateByUrl(`requests/backoffice`).then(r => {});
  }

  onRequestClick(): void {
    this.router.navigateByUrl(`requests/backoffice/${this.requestId}`).then(r => {});
  }

  onAddNext() {
    this.addDocumentationListForm.push(this.addDocumentationListFormGroup());
  }

  deleteItem(i): void {
    this.addDocumentationListForm.removeAt(i);
  }

  addDocumentationListFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      adjustmentLimit: [10, Validators.required],
      receivingLimit: [10, Validators.required]
    });
  }

  onSelectPosition(position: RequestPosition) {
    const index = this.selectedPositions.indexOf(position);

    if (index === -1) {
      this.selectedPositions.push(position);
    } else {
      this.selectedPositions.splice(index, 1);
    }
  }

  isFieldInvalid(i, field: string) {
    return this.addDocumentationListForm.at(i).get(field).errors
      && (this.addDocumentationListForm.at(i).get(field).touched
        || this.addDocumentationListForm.at(i).get(field).dirty);
  }

  getPositionList() {
    this.designDocumentationService.getPositionList(this.requestId).subscribe(
      (positions: RequestPosition[]) => {
        this.positions = positions;
      }
    );
  }

  getPositions() {
    this.existingPositions = this.designDocumentations.map(element => {
      return element.position;
    });
    return this.positions.filter((x: RequestPosition) => {
      const foundPositions = this.existingPositions.filter((y: RequestPosition) => y.id === x.id);
      return foundPositions.length === 0;
    });
  }

  getDesignDocumentationList(): void {
    this.designDocumentationService.getDesignDocumentationList(this.requestId).subscribe(
      (data: DesignDocumentationList[]) => {
        this.designDocumentations = data;
        this.getPositions();
      }
    );
  }

  isRkdAgreementStatus(designDoc: DesignDocumentationList): boolean {
    return designDoc.position.status === 'RKD_AGREEMENT';
  }

  onShowDesignDocumentationListModal() {
    this.showDesignDocumentationListModal = true;
  }

  onAddDesignDocumentationList() {
    this.documentationList = this.addDocumentationListForm.value;
    this.designDocumentationService.addDesignDocumentationList(this.requestId,
      this.documentationList, this.selectedPositions).subscribe(
      (data: DesignDocumentationList[]) => {
        this.onCloseAddDesignDocumentationModal();
        this.designDocumentations = [...this.designDocumentations, ...data];
        this.getPositions();
      }
    );
  }

  onCloseAddDesignDocumentationModal() {
    this.addDocumentationForm.reset();
    this.selectedPositions = [];
    this.showDesignDocumentationListModal = false;
  }

  isLoadingDesignDoc(designDoc: DesignDocumentation): boolean {
    return this.loadingDesignDocs.filter(doc => doc === designDoc).length > 0;
  }

  isSendingForApproval(designDocumentationList: DesignDocumentationList): boolean {
    return this.sendingForApproval
      .filter(_designDocumentationList => designDocumentationList === _designDocumentationList).length > 0;
  }

  canUploadDocuments(designDoc: DesignDocumentation, designDocumentationList: DesignDocumentationList) {
    // Если мы бэкофис и загрузка еще не началась и не отправляем на согласование и можем отправить на согласование
    return this.routeData.isBackoffice
      && !this.isLoadingDesignDoc(designDoc)
      && !this.isSendingForApproval(designDocumentationList)
      && this.canSendOnApprove(designDocumentationList)
    ;
  }

  canSendOnApprove(designDoc: DesignDocumentationList) {
    return [DesignDocumentationStatus.NEW, DesignDocumentationStatus.REJECTED].includes(designDoc.status);
  }

  onSelectDocument(files: File[], designDoc: DesignDocumentation) {
    this.loadingDesignDocs.push(designDoc);
    const subscription = this.designDocumentationService
      .uploadDocuments(this.requestId, designDoc.id, files)
      .pipe(
        finalize(() => this.loadingDesignDocs = this.loadingDesignDocs.filter(doc => doc !== designDoc))
      )
      .subscribe(documents => {
        designDoc.documents = documents;
        subscription.unsubscribe();
      })
    ;
  }

  sendForApproval(designDocumentationList: DesignDocumentationList) {
    if (this.isSendingForApproval(designDocumentationList)) {
      return;
    }

    if (![DesignDocumentationStatus.NEW, DesignDocumentationStatus.REJECTED].includes(designDocumentationList.status)) {
      return;
    }

    // По добавляем перечень из массив отправленных на согласование
    this.sendingForApproval.push(designDocumentationList);

    const subscription = this.designDocumentationService.sendForApproval(this.requestId, designDocumentationList.id)
      .pipe(
        finalize(() => {
          // По окончанию убираем перечень из массива отправленных на согласование
          this.sendingForApproval = this.sendingForApproval.filter(
            _designDocumentationList => designDocumentationList !== _designDocumentationList
          );
        })
      ).subscribe((_designDocumentationList: DesignDocumentationList) => {
        this.updateDesignDoc(designDocumentationList, _designDocumentationList);
        subscription.unsubscribe();
      })
    ;
  }

  approval(designDocumentationList: DesignDocumentationList) {
    const subscription = this.designDocumentationService
      .approval(this.requestId, designDocumentationList.id)
      .subscribe((_designDocumentationList: DesignDocumentationList) => {
        this.updateDesignDoc(designDocumentationList, _designDocumentationList);
        subscription.unsubscribe();
      });
  }

  reject(designDocumentationList: DesignDocumentationList, file?: File) {
    const subscription = this.designDocumentationService
      .reject(this.requestId, designDocumentationList.id, file)
      .subscribe((_designDocumentationList: DesignDocumentationList) => {
        this.updateDesignDoc(designDocumentationList, _designDocumentationList);
        subscription.unsubscribe();
      });
  }

  isApprovable(designDocumentationList: DesignDocumentationList) {
    return designDocumentationList.designDocs.filter(designDoc => designDoc.documents.length > 0).length > 0
      && status !== DesignDocumentationStatus.ON_APPROVAL;
  }

  updateDesignDoc(oldDoc: DesignDocumentationList, newDoc: DesignDocumentationList) {
    const i = this.designDocumentations.indexOf(oldDoc);

    if (i !== -1) {
      this.designDocumentations[i] = newDoc;
    }
  }

  getRemark(designDocumentation: DesignDocumentationList) {
    return designDocumentation.designDocs.filter(designDoc => designDoc.type === DesignDocumentationType.REMARK);
  }
}
