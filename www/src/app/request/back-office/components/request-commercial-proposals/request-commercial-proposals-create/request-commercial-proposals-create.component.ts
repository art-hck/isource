import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fromEvent, merge, Observable } from "rxjs";
import { auditTime, flatMap, map } from "rxjs/operators";
import { OffersService } from "../../../services/offers.service";
import { RequestPosition } from "../../../../common/models/request-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { RequestOfferPosition } from "../../../../common/models/request-offer-position";
import * as moment from "moment";

@Component({
  selector: 'app-request-commercial-proposals-create',
  templateUrl: './request-commercial-proposals-create.component.html',
  styleUrls: ['./request-commercial-proposals-create.component.scss']
})
export class RequestCommercialProposalsCreateComponent implements OnInit, AfterViewInit {

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() create = new EventEmitter();
  @Output() cancel = new EventEmitter();

  @Input() request = { id: 'ed293061-3e82-4649-b29f-d5dd3d89c133' };
  @Input() position =  {
    "id": "f9d9d311-2c76-4801-8acb-285f776f1864",
    "request": {
      "id": "ed293061-3e82-4649-b29f-d5dd3d89c133",
      "name": "Заявка",
      "number": 48
    },
    "userId": "790f24e6-3841-4663-8a93-e5c15f054f02",
    "contragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
    "type": null,
    "name": "Молоко",
    "productionDocument": "ГОСТ 6543",
    "measureUnit": "шт",
    "quantity": 1,
    "deliveryDate": "2019-11-28T00:00:00+00:00",
    "isDeliveryDateAsap": false,
    "deliveryBasis": "Москва",
    "startPrice": 34534,
    "currency": "RUB",
    "paymentTerms": "30 банковских дней по факту поставки",
    "comments": null,
    "isDesignRequired": false,
    "isShmrRequired": false,
    "isPnrRequired": false,
    "isInspectionControlRequired": false,
    "createdDate": "2019-11-18T12:30:29+00:00",
    "status": "PROPOSALS_PREPARATION",
    "statusLabel": "Подготовка КП",
    "statusChangedDate": "2019-11-21T12:56:18+00:00",
    "statusExpectedDate": null,
    "documents": [],
    "manufacturingDocuments": [],
    "linkedOffers": [
      {
        "id": "dec77b80-1ea7-4b79-9cbb-3a2074efb57e",
        "requestPositionId": "f9d9d311-2c76-4801-8acb-285f776f1864",
        "requestId": "ed293061-3e82-4649-b29f-d5dd3d89c133",
        "requestLotId": null,
        "userId": "870087dd-9a75-4b6e-9ee1-e32626587544",
        "customerContragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
        "supplierContragentId": "52d98828-4272-4e20-9894-c491f80beda2",
        "supplierContragentName": "ПАО \"ЧТПЗ\"",
        "priceWithVat": 46,
        "priceWithoutVat": 46,
        "vatPercent": 0,
        "currency": "RUB",
        "quantity": 1,
        "measureUnit": "шт",
        "deliveryDate": "2020-01-18T21:00:00+00:00",
        "paymentTerms": "30 дней по факту поставки",
        "comments": null,
        "createdDate": "2020-01-15T15:40:50+00:00",
        "documents": [],
        "technicalProposals": [],
        "status": "DRAFT",
        "isWinner": false
      },
      {
        "id": "03f852a2-3fed-45f3-81f2-b9a16159deeb",
        "requestPositionId": "f9d9d311-2c76-4801-8acb-285f776f1864",
        "requestId": "ed293061-3e82-4649-b29f-d5dd3d89c133",
        "requestLotId": null,
        "userId": "870087dd-9a75-4b6e-9ee1-e32626587544",
        "customerContragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
        "supplierContragentId": "9096b8d3-25c4-4463-a46d-75b786b21050",
        "supplierContragentName": "ООО ы",
        "priceWithVat": 424,
        "priceWithoutVat": 424,
        "vatPercent": 0,
        "currency": "RUB",
        "quantity": 51,
        "measureUnit": "шт",
        "deliveryDate": "2020-03-26T21:00:00+00:00",
        "paymentTerms": "60 дней по факту поставки",
        "comments": null,
        "createdDate": "2020-01-15T15:23:23+00:00",
        "documents": [],
        "technicalProposals": [],
        "status": "DRAFT",
        "isWinner": false
      },
      {
        "id": "4df97339-1971-4cba-bbea-a29c5dad68f5",
        "requestPositionId": "f9d9d311-2c76-4801-8acb-285f776f1864",
        "requestId": "ed293061-3e82-4649-b29f-d5dd3d89c133",
        "requestLotId": null,
        "userId": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
        "customerContragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
        "supplierContragentId": "7be8c222-5d4b-4f8b-ba16-2d400ab51b5b",
        "supplierContragentName": "ООО «В Контакте»",
        "priceWithVat": 4234,
        "priceWithoutVat": 4234,
        "vatPercent": 0,
        "currency": "RUB",
        "quantity": 1,
        "measureUnit": "шт",
        "deliveryDate": "2019-11-28T00:00:00+00:00",
        "paymentTerms": "30 банковских дней по факту поставки",
        "comments": null,
        "createdDate": "2019-11-21T12:58:19+00:00",
        "documents": [],
        "technicalProposals": [],
        "status": "DRAFT",
        "isWinner": false
      },
      {
        "id": "eda147d5-f594-4c7d-b691-6fa51985cd41",
        "requestPositionId": "f9d9d311-2c76-4801-8acb-285f776f1864",
        "requestId": "ed293061-3e82-4649-b29f-d5dd3d89c133",
        "requestLotId": null,
        "userId": "ffb02f77-66a1-44ac-b19d-64596239f3e4",
        "customerContragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
        "supplierContragentId": "22e2344f-0794-4de5-b6ac-d6cee489029c",
        "supplierContragentName": "ООО \"Меркурий\"",
        "priceWithVat": 2342,
        "priceWithoutVat": 2342,
        "vatPercent": 0,
        "currency": "RUB",
        "quantity": 1,
        "measureUnit": "шт",
        "deliveryDate": "2019-11-28T00:00:00+00:00",
        "paymentTerms": "30 банковских дней по факту поставки",
        "comments": null,
        "createdDate": "2019-11-21T13:13:51+00:00",
        "documents": [],
        "technicalProposals": [],
        "status": "DRAFT",
        "isWinner": false
      },
      {
        "id": "4d3e620b-468c-41cf-bde2-5b367e2140a1",
        "requestPositionId": "f9d9d311-2c76-4801-8acb-285f776f1864",
        "requestId": "ed293061-3e82-4649-b29f-d5dd3d89c133",
        "requestLotId": null,
        "userId": "870087dd-9a75-4b6e-9ee1-e32626587544",
        "customerContragentId": "c993a482-7024-451a-bd5f-8c0b032d4906",
        "supplierContragentId": "7be8c222-5d4b-4f8b-ba16-2d400ab51b5b",
        "supplierContragentName": "ООО «В Контакте»",
        "priceWithVat": 234,
        "priceWithoutVat": 234,
        "vatPercent": 0,
        "currency": "RUB",
        "quantity": 234,
        "measureUnit": "шт",
        "deliveryDate": "2020-01-29T21:00:00+00:00",
        "paymentTerms": "30 банковских дней по факту поставки",
        "comments": null,
        "createdDate": "2020-01-15T15:58:25+00:00",
        "documents": [],
        "technicalProposals": [],
        "status": "DRAFT",
        "isWinner": false
      }
    ],
    "groupId": "aeac4619-3cca-4b43-b5df-d1aa1fb27ad7",
    "responsibleUserId": null,
    "responsibleUser": null,
    "isEditingByAnotherUser": false,
    "updatedDate": "2020-01-15T15:58:25+00:00",
    "isDraftEntity": false,
    "entityType": "POSITION",
    "hasProcedure": false,
    "procedureId": null,
    "procedureStartDate": null,
    "procedureEndDate": null,
    "acceptedTpCount": 0
  };

  @ViewChild('contragentName', { static: false }) contragentName: ElementRef;
  isLoading: boolean;

  newCommercialProposalModalOpen = true;
  newCommercialProposalForm: FormGroup;

  quantityNotEnough = false;
  dateIsLaterThanNeeded = false;

  selectedContragentId: Uuid;

  get formDocuments() {
    return this.newCommercialProposalForm.get('documents') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
  ) { }

  ngOnInit() {
    this.newCommercialProposalForm = this.formBuilder.group({
      contragentName: [null, Validators.required],
      supplierContragentId: [null, Validators.required],
      contragent: [null, Validators.required],
      priceWithVat: [null, Validators.required],
      currency: ['RUB', Validators.required],
      quantity: [null, Validators.required],
      measureUnit: [null, Validators.required],
      deliveryDate: [null, Validators.required],
      paymentTerms: ['30 дней по факту поставки', Validators.required],
      documents: this.formBuilder.array([]),
    });
  }

  ngAfterViewInit() {
    // // @TODO: uxg-autocomplete!
    merge(
      this.newCommercialProposalForm.get("contragent").valueChanges,
      fromEvent(this.contragentName.nativeElement, "blur"),
    )
      .pipe(auditTime(100))
      .subscribe(() => {
        const value = this.newCommercialProposalForm.get("contragent").value;

        this.newCommercialProposalForm.get("contragentName").setValue(value ? value[0].shortName : null, { emitEvent: false });
        this.newCommercialProposalForm.get("contragentName").updateValueAndValidity();

        this.selectedContragentId = value ? value[0].id : null;
        this.newCommercialProposalForm.get("supplierContragentId").setValue(value ? value[0].id : null, { emitEvent: false });
        this.newCommercialProposalForm.get("supplierContragentId").updateValueAndValidity();
      });
  }

  filesDropped(files: FileList): void {
    Array.from(files).forEach(
      file => this.formDocuments.push(this.formBuilder.control(file))
    );
  }

  filesSelected(e) {
    this.filesDropped(e.target.files);
    e.target.value = '';
  }

  submit() {
    this.isLoading = true;
    this.newCommercialProposalForm.disable();

    const body = <RequestOfferPosition>{
      supplierContragentId: this.newCommercialProposalForm.get("supplierContragentId").value,
      priceWithVat: this.newCommercialProposalForm.get("priceWithVat").value,
      currency: this.newCommercialProposalForm.get("currency").value,
      quantity: this.newCommercialProposalForm.get("quantity").value,
      measureUnit: this.newCommercialProposalForm.get("measureUnit").value,
      deliveryDate: this.newCommercialProposalForm.get("deliveryDate").value,
      paymentTerms: this.newCommercialProposalForm.get("paymentTerms").value,
      documents: this.newCommercialProposalForm.get("documents").value,
    };

    // Отправляем КП
    const cp$: Observable<any> = this.offersService.addOffer(this.request.id, this.position.id, body);

    cp$.subscribe(tp => {
      this.visibleChange.emit(false);
      this.create.emit(tp);
      this.newCommercialProposalForm.reset(); // todo нужно очищение, а не ресет
    });
  }



  isSupplierOfferExist(positionWithOffers: any, supplierId: Uuid): boolean {
    if (!supplierId) {
      return false;
    }

    const ids = [];

    for (const linkedOffer of positionWithOffers.linkedOffers) {
      ids.push(linkedOffer.supplierContragentId);
    }

    if (ids.indexOf(supplierId) !== -1) {
      return true;
    } else {
      return false;
    }
  }


  checkQuantity(position, value) {
    if (!value || value === '') {
      this.quantityNotEnough = false;
    } else {
      this.quantityNotEnough = value < position.startPrice;
    }
  }

  checkDeliveryDate(position, enteredDate) {
    if (!moment(enteredDate, 'DD.MM.YYYY', true).isValid()) {
      this.dateIsLaterThanNeeded = false;
    } else {
      const controlDate = moment(moment(position.deliveryDate).format('DD.MM.YYYY'), 'DD.MM.YYYY');
      const validationDate = moment(enteredDate, 'DD.MM.YYYY');

      this.dateIsLaterThanNeeded = controlDate.isBefore(validationDate);
    }
  }

}
