import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/forms/custom.validators';
import { RequestPosition } from 'src/app/request/common/models/request-position';
import { ClrWizard } from '@clr/angular';
import { RequestDocument } from 'src/app/request/common/models/request-document';
import { ContragentList } from 'src/app/contragent/models/contragent-list';
import { Observable } from 'rxjs';
import { PublishProcedureInfo } from '../../models/publish-procedure-info';
import { Request } from 'src/app/request/common/models/request';
import { ProcedureBasicDataPage } from '../../models/procedure-basic-data-page';

/**
 * Мастер создания процедуры
 *
 * Необходимо передать контрагентов либо явно, либо через функцию загрузки контрагентов
 *
 * Явно:
 *
 * ```
 * <app-wizard-create-procedure
 *   #createProcedureWizard
 *   [request]="request"
 *   [requestPositions$]="requestPositions$"
 *   [contragents$]="contragentList$"         <!-- <=== явное указание списка конрагентов -->
 *   [allowOpenedProcedure]="true"
 *   (publishProcedure)="onPublishProcedure($event)"
 * >
 * </app-wizard-create-procedure>
 * ```
 *
 * Через функцию загрузки контрагентов:
 *
 * ```html
 * <app-wizard-create-procedure
 *   #createProcedureWizard
 *   [request]="request"
 *   [requestPositions$]="requestPositions$"
 *   [allowOpenedProcedure]="true"
 *   (publishProcedure)="onPublishProcedure($event)"
 * >
 * </app-wizard-create-procedure>
 * ```
 *
 * ```ts
 * class AddOffersComponent {
 *   @ViewChild("createProcedureWizard", {static: false}) wizard: WizardCreateProcedureComponent;
 *   onWizardOpen(): void {
 *     this.wizard.open();
 *     this.wizard.setContragentLoader((procedureBasicDataPage: ProcedureBasicDataPage) => {
 *       const list: ContragentList[] = [];
 *       return Observable.of(list); // return Observable<ContragentList[]>
 *     });
 *   }
 * }
 * ```
 */
@Component({
  selector: 'app-wizard-create-procedure',
  templateUrl: './wizard-create-procedure.component.html',
  styleUrls: ['./wizard-create-procedure.component.scss']
})
export class WizardCreateProcedureComponent implements OnInit {

  @Input() requestPositions$: Observable<RequestPosition[]>;
  @Input() contragents$?: Observable<ContragentList[]>;
  @Input() request: Request;
  @Input() allowOpenedProcedure: boolean;

  @ViewChild("wizard", {static: false}) wizard: ClrWizard;
  @ViewChild('searchPositionInput', {static: false}) searchPositionInput: ElementRef;
  @ViewChild('openedProcedureRadioButton', {static: false}) openedProcedureRadioButton: ElementRef;
  @ViewChild('closedProcedureRadioButton', {static: false}) closedProcedureRadioButton: ElementRef;

  @Output() publishProcedure = new EventEmitter<PublishProcedureInfo>();

  procedureBasicDataForm: FormGroup;
  procedurePropertiesForm: FormGroup;

  selectedProcedurePositions: RequestPosition[] = [];
  selectedProcedureDocuments: RequestDocument[] = [];
  selectedProcedureLotDocuments: RequestDocument[] = [];

  positionSearchValue = "";

  showPrivateAccessContragents: boolean | null = null;
  selectedPrivateAccessContragents: ContragentList[] = [];

  protected contragentLoader?: (procedureBasicData: ProcedureBasicDataPage) => Observable<ContragentList[]>;

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initProcedureBasicDataForm();
    this.initProcedurePropertiesForm();
  }

  resetWizardForm(): void {
    this.wizard.reset();
    this.procedureBasicDataForm.reset();
    this.procedurePropertiesForm.reset();

    this.selectedProcedurePositions = [];
    this.selectedProcedureDocuments = [];
    this.selectedProcedureLotDocuments = [];
  }

  isDataFieldValid(field: string): boolean {
    return this.procedureBasicDataForm.get(field).errors
      && (this.procedureBasicDataForm.get(field).touched
        || this.procedureBasicDataForm.get(field).dirty);
  }

  onPositionSearchInputChange(value: string): void {
    this.positionSearchValue = value;
  }

  getPositionSearchValue(): string {
    if (this.searchPositionInput) {
      return this.searchPositionInput.nativeElement.value;
    }
    return this.positionSearchValue;
  }

  /**
   * Функция проверяет, должна ли быть отмечена позиция в списке в модальном окне
   * @param requestPosition
   */
  checkIfPositionIsChecked(requestPosition: RequestPosition): boolean {
    return this.selectedProcedurePositions.indexOf(requestPosition) > -1;
  }

  onPositionSelect(requestPosition: RequestPosition): void {
    this.updateArray(this.selectedProcedurePositions, requestPosition);
  }

  onSelectPrivateAccessContragent(contragent: ContragentList): void {
    this.updateArray(this.selectedPrivateAccessContragents, contragent);
  }

  onPublishProcedure(): void {
    this.publishProcedure.emit({
      requestId: this.request.id,
      procedureInfo: this.procedureBasicDataForm.value,
      procedureProperties: this.procedurePropertiesForm.value,
      selectedProcedurePositions: this.selectedProcedurePositions,
      selectedProcedureDocuments: this.selectedProcedureDocuments,
      selectedProcedureLotDocuments: this.selectedProcedureLotDocuments,
      selectedPrivateAccessContragents: this.selectedPrivateAccessContragents
    });
  }

  onSelectProcedureDocument(document: RequestDocument): void {
    this.updateArray(this.selectedProcedureDocuments, document);
  }

  isDocumentsExists(positions: RequestPosition[]): boolean {
    for (const position of positions) {
      if (position.documents.length) {
        return true;
      }
    }

    return false;
  }

  onSelectProcedureLotDocument(document: RequestDocument): void {
    this.updateArray(this.selectedProcedureLotDocuments, document);
  }

  open(): void {
    this.wizard.open();
  }

  reset(): void {
    this.wizard.reset();
  }

  /**
   * Отображение страницы 2: ProcedureProperties - Свойства процедуры
   */
  onShowProcedurePropertiesPage(): void {
    if (this.showPrivateAccessContragents !== null) {
      return;
    }

    if (!this.allowOpenedProcedure) {
      // запрещено создание открытой процедуры
      this.openedProcedureRadioButton.nativeElement.disabled = true;
      this.closedProcedureRadioButton.nativeElement.checked = true;
      this.showPrivateAccessContragents = true;
    } else {
      // разрешение создание открытой процедуры
      this.openedProcedureRadioButton.nativeElement.checked = true;
      this.showPrivateAccessContragents = false;
    }
  }

  getContragents(): Observable<ContragentList[]> {
    if (this.contragents$) {
      return this.contragents$;
    }
    if (this.contragentLoader) {
      const procedureBasicDataPage: ProcedureBasicDataPage = {
        procedureInfo: this.procedureBasicDataForm.value,
        selectedProcedurePositions: this.selectedProcedurePositions
      };
      this.contragents$ = this.contragentLoader(procedureBasicDataPage);
    } else {
      throw new Error('contragents$ and contragentLoader undefined');
    }
    return this.contragents$;
  }

  setContragentLoader(loader: (procedureBasicData: ProcedureBasicDataPage) => Observable<ContragentList[]>): void {
    this.contragentLoader = loader;
  }

  /**
   * Инициация формы на странице 1
   */
  protected initProcedureBasicDataForm(): void {
    this.procedureBasicDataForm = this.formBuilder.group({
      procedureTitle: ['', Validators.required],
      dishonestSuppliersForbidden: [false],
      dateEndRegistration: ['', [Validators.required, CustomValidators.futureDate]],
      summingupDate: ['', [Validators.required, CustomValidators.customDate('dateEndRegistration')]],
    });

    this.procedureBasicDataForm.get('summingupDate').disable();
    this.procedureBasicDataForm.get('dateEndRegistration').valueChanges.subscribe(value => {
      if (value) {
        this.procedureBasicDataForm.get('summingupDate').enable();
      } else {
        this.procedureBasicDataForm.get('summingupDate').disable();
      }
    });
  }

  /**
   * Инициация формы на странице 2
   */
  protected initProcedurePropertiesForm(): void {
    this.procedurePropertiesForm = this.formBuilder.group({
      manualEndRegistration: [false],
      positionsRequiredAll: [false],
      positionsEntireVolume: [false],
      positionsAnalogs: [false],
      positionsAllowAnalogsOnly: [false],
      prolongateEndRegistration: [10, Validators.min(1)],
      positionsSuppliersVisibility: ['NameHidden'],
      positionsBestPriceType: ['LowerStartPrice'],
      positionsApplicsVisibility: ['PriceAndRating']
    });
  }

  protected updateArray(array: Array<Object>, item: Object): void {
    const index = array.indexOf(item);

    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
  }
}
