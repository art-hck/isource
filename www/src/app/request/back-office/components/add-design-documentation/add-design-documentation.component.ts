import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../../common/models/request";
import {RequestService} from "../../services/request.service";
import {DesignDocumentationService} from "../../services/design-documentation.service";
import {DesignDocumentationList} from "../../../common/models/design-documentationList";
import {RequestPosition} from "../../../common/models/request-position";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../../shared/forms/custom.validators";
import {DesignDocumentation} from "../../../common/models/design-documentation";
import {element} from "protractor";

@Component({
  selector: 'app-add-design-documentation',
  templateUrl: './add-design-documentation.component.html',
  styleUrls: ['./add-design-documentation.component.scss']
})
export class AddDesignDocumentationComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  positions: RequestPosition[] = [];

  designDocumentations: DesignDocumentationList[] = [];
  documentationList: DesignDocumentation[];

  showDesignDocumentationListModal = false;
  addDocumentationForm: FormGroup;
  selectedPositions: RequestPosition[] = [];
  existingPositions: RequestPosition[] = [];
  pos: RequestPosition[] = [];

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
    })
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.getPositionList();
    this.updateRequestInfo();
    this.getDesignDocumentationList();

    this.addDocumentationListFormGroup();
  }

  onRequestsClick(): void {
    this.router.navigateByUrl(`requests/backoffice`).then(r => {});
  }

  onRequestClick(): void {
    this.router.navigateByUrl(`requests/backoffice/${this.request.id}`).then(r => {});
  }

  protected updateRequestInfo(): void {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  onAddNext() {
    this.addDocumentationListForm.push(this.addDocumentationListFormGroup());
  }

  deleteItem(i): void {
    this.addDocumentationListForm.removeAt(i);
  }

  addDocumentationListFormGroup(): FormGroup {
    const addDocumentationListForm = this.formBuilder.group({
      name: ['', Validators.required],
      adjustmentLimit: [10, Validators.required],
      receivingLimit: [10, Validators.required]
    });
    return addDocumentationListForm;
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
    )
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
    )
  }

  onCloseAddDesignDocumentationModal() {
    this.addDocumentationForm.reset();
    this.selectedPositions = [];
    this.showDesignDocumentationListModal = false;
  }
}
