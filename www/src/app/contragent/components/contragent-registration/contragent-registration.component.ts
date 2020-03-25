import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DadataConfig, DadataType } from "@kolkov/ngx-dadata";
import { GpnmarketConfigInterface } from "../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import * as moment from "moment";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { ContragentService } from "../../services/contragent.service";
import { ContragentRegistrationRequest } from "../../models/contragent-registration-request";
import {Observable, Subscription} from "rxjs";
import { NotificationService } from "../../../shared/services/notification.service";
import { finalize } from "rxjs/operators";
import { ContragentShortInfo } from "../../models/contragent-short-info";
import {UserService} from "../../../user/service/user.service";
import {User} from "../../../user/models/user";
import {EmployeeService} from "../../../employee/services/employee.service";
import {EmployeeItem} from "../../../employee/models/employee-item";

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

  constructor(
    private fb: FormBuilder,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface,
    private contragentService: ContragentService,
    private notificationService: NotificationService,
    private employeeService: EmployeeService
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
        postIndex: ['', [Validators.required, CustomValidators.index]],
        locality: ['', CustomValidators.cyrillicNotRequired]
      }),
      contragentBankRequisite: this.fb.group({
        account: ['', [Validators.required, CustomValidators.bankAccount]],
        correspondentAccount: ['', [Validators.required, CustomValidators.corrAccount]],
        bik: ['', [Validators.required, CustomValidators.bik]],
        name: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }),
      contragentContact: this.fb.group({
        email: ['', CustomValidators.emailNotRequired],
        phone: ['', CustomValidators.phoneNotRequired],
        responsible: ['', Validators.required]
      })
    });

    this.seniorBackofficeUsers$ = this.employeeService.getEmployeeList('SENIOR_BACKOFFICE');
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

    const body: ContragentRegistrationRequest = this.form.value;

    this.subscription.add(
      this.contragentService.registration(body).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(
        contragent => {
          this.contragentCreated.emit(contragent);
          this.form.reset();
          this.autofillAlertShown = false;
          this.notificationService.toast("Контрагент успешно создан!");
        },
        (err) => {
          this.notificationService.toast('Ошибка регистрации! ' + err.error.detail, "error");
        }
      )
    );
  }
}
