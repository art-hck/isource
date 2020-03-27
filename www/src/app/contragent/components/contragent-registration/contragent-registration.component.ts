import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DadataConfig, DadataType } from "@kolkov/ngx-dadata";
import { GpnmarketConfigInterface } from "../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import * as moment from "moment";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { ContragentService } from "../../services/contragent.service";
import { ContragentRegistrationRequest } from "../../models/contragent-registration-request";
import { Observable, Subscription } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { ContragentShortInfo } from "../../models/contragent-short-info";
import { EmployeeService } from "../../../employee/services/employee.service";
import { EmployeeItem } from "../../../employee/models/employee-item";
import { Uuid } from "../../../cart/models/uuid";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { ContragentInfo } from "../../models/contragent-info";
import { UxgBreadcrumbsService } from "uxg";
import { Store } from "@ngxs/store";
import {User} from "../../../user/models/user";

@Component({
  selector: 'app-contragent-registration',
  templateUrl: './contragent-registration.component.html',
  styleUrls: ['./contragent-registration.component.scss']
})
export class ContragentRegistrationComponent implements OnInit {
  @Output() contragentCreated = new EventEmitter<ContragentShortInfo>();
  form: FormGroup;
  autofillAlertShown = false;
  configParty: DadataConfig;
  configBank: DadataConfig;
  isLoading = false;
  seniorBackofficeUsers$: Observable<EmployeeItem[]>;
  subscription = new Subscription();
  contragentId: Uuid;
  contragent$: Observable<ContragentInfo>;

  get isEditing(): boolean {
    return !!this.contragentId;
  }

  get responsiblePlaceholder() {
    const responsible: User = this.form.get('contragentContact').get('responsible').value;
    return responsible && responsible.fullName || 'Выберите ответственного';
  }

  constructor(
    private fb: FormBuilder,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface,
    private contragentService: ContragentService,
    private store: Store,
    private employeeService: EmployeeService,
    protected route: ActivatedRoute,
    private getContragentService: ContragentService,
    private bc: UxgBreadcrumbsService,
    protected router: Router
  ) {
    this.configParty = {
      apiKey: appConfig.dadata.apiKey,
      type: DadataType.party
    };

    this.configBank = {
      apiKey: appConfig.dadata.apiKey,
      type: DadataType.bank
    };
  }

  ngOnInit() {
    this.contragentId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      contragent: this.fb.group({
        fullName: ['', [Validators.required, CustomValidators.simpleText]],
        shortName: ['', [Validators.required, CustomValidators.simpleText]],
        inn: ['', [Validators.required, CustomValidators.inn]],
        kpp: ['', [Validators.required, CustomValidators.kpp]],
        ogrn: ['', [Validators.required, CustomValidators.ogrn]],
        taxAuthorityRegistrationDate: ['', [Validators.required, CustomValidators.pastDate()]],
        role: ['customer']
      }),
      contragentAddress: this.fb.group({
        country: ['', [Validators.required, CustomValidators.cyrillic]],
        region: ['', [Validators.required, CustomValidators.cyrillic]],
        city: ['', [Validators.required, CustomValidators.cyrillic]],
        address: ['', [Validators.required, CustomValidators.simpleText]],
        postIndex: ['', [Validators.required, CustomValidators.index]]
      }),
      contragentBankRequisite: this.fb.group({
        account: ['', [Validators.required, CustomValidators.bankAccount]],
        correspondentAccount: ['', [Validators.required, CustomValidators.corrAccount]],
        bik: ['', [Validators.required, CustomValidators.bik]],
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }),
      contragentContact: this.fb.group({
        email: ['', CustomValidators.emailOptional],
        phone: ['', CustomValidators.phoneOptional],
        responsible: ['', Validators.required]
      })
    });

    this.seniorBackofficeUsers$ = this.employeeService.getEmployeeList('SENIOR_BACKOFFICE');
    if (this.isEditing) {
      this.getContragentInfo();
      this.form.get('contragent').get('ogrn').disable();
      this.form.get('contragent').get('inn').disable();
    }

    this.form.get('contragent').get('role').disable();
  }

  onPartySuggestionSelected(event): void {
    const data = event.data;
    this.autofillAlertShown = true;
    const registrationDate = data.state.registration_date ?
      moment(new Date(data.state.registration_date)).format('DD.MM.YYYY') : '';

    this.form.get('contragent').patchValue({
      fullName: data.name.full_with_opf || '',
      shortName: data.name.short_with_opf || '',
      inn: data.inn || '',
      kpp: data.kpp || '',
      ogrn: data.ogrn || '',
      taxAuthorityRegistrationDate: registrationDate,
    });

    this.form.get('contragentAddress').patchValue({
      country: data.address.data.country || '',
      region: data.address.data.region || '',
      city: data.address.data.city || '',
      postIndex: data.address.data.postal_code || '',
      locality: data.address.data.settlement || '',
      address: data.address.value || '',
    });

    this.form.markAllAsTouched();
  }

  onBankSuggestionSelected(event): void {
    const data = event.data;
    this.autofillAlertShown = true;

    this.form.get('contragentBankRequisite').patchValue({
      bik: data.bic || '',
      correspondentAccount: data.correspondent_account || '',
      name: data.name.payment || '',
      address: data.address.value || '',
    });

    this.form.markAllAsTouched();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const body: ContragentRegistrationRequest = this.form.getRawValue();
    if (!this.isEditing) {
      this.subscription.add(
        this.contragentService.registration(body).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(
          contragent => {
            this.contragentCreated.emit(contragent);
            this.router.navigateByUrl(`contragents/list`);
            this.store.dispatch(new ToastActions.Success("Контрагент " + contragent.shortName + " успешно создан!"));
          },
          (err) => {
            this.store.dispatch(new ToastActions.Error('Ошибка регистрации! ' + err.error.detail));
          }
        )
      );
    } else {
      this.subscription.add(
        this.contragentService.editContragent(this.contragentId, body).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(
          contragent => {
            this.store.dispatch(new ToastActions.Success("Контрагент " + contragent.shortName + " успешно отредактирован!"));
            this.router.navigateByUrl(`contragents/list`);
          },
          (err) => {
            this.store.dispatch(new ToastActions.Error('Ошибка редактирования! ' + err.error.detail));
          }
        )
      );
    }
  }

  getContragentInfo(): void {
    this.contragent$ = this.getContragentService.getContragentInfo(this.contragentId).pipe(
      tap(contragent => {
        this.bc.breadcrumbs = [
          {label: "Контрагенты", link: "/contragents/list"},
          {label: contragent.shortName, link: `/contragents/${this.contragentId}/info`},
          {label: "Редактировать", link: '`/contragents/${this.contragentId}/edit`'}
        ];
      }),
      tap(contragent => {
        this.form.get('contragent').patchValue(contragent);
        this.form.get('contragentAddress').patchValue(contragent.addresses[0]);
        this.form.get('contragentBankRequisite').patchValue(contragent.bankRequisites[0] || {});
        this.form.get('contragentContact').patchValue(contragent);
        this.form.get('contragentContact').get('responsible').patchValue(contragent.responsible);
        this.form.get('contragent').get('taxAuthorityRegistrationDate').patchValue(
          moment(new Date(contragent.taxAuthorityRegistrationDate)).format('DD.MM.YYYY'));
      })
    );
  }
}
