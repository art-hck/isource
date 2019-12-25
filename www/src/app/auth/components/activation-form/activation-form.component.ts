import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ActivationErrorCode } from "../../enum/activation-error-code";
import {
  ActivationErrorCodeDescriptions,
  ActivationErrorCodeLabels
} from "../../dictionaries/activation-error-code-labels";
import { ActivationError } from "../../models/activation-error";

@Component({
  selector: 'app-activation-form',
  templateUrl: './activation-form.component.html',
  styleUrls: ['./activation-form.component.scss']
})
export class ActivationFormComponent implements OnInit {

  loading = false;

  titleMessage: string;
  descriptionMessage: string;
  errorCode: string;

  notActivated = false;

  activationToken: string;
  activationErrorCode = ActivationErrorCode;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.activationToken = this.route.snapshot.queryParams.code;

    if (this.route.snapshot.queryParams.activated && this.route.snapshot.queryParams.activated === 'false') {
      this.notActivated = true;

      this.titleMessage = this.getErrorTitleByType(ActivationErrorCode.NOT_ACTIVATED);
      this.descriptionMessage = this.getErrorDescriptionByType(ActivationErrorCode.NOT_ACTIVATED);
      this.errorCode = ActivationErrorCode.NOT_ACTIVATED;
      return;
    } else if (this.activationToken) {
      this.loading = true;

      const subscription = this.authService.activateAccount(this.activationToken).subscribe(
        (data: ActivationError) => {
          this.responseProcessing(data);
          this.loading = false;
          subscription.unsubscribe();
        });
    } else {
      this.titleMessage = 'Ссылка недействительна';
      this.descriptionMessage = 'В ссылке отсутствует код активации';
    }
  }

  resendActivationLink(activationCode: string): void {
    this.loading = true;

    const subscription = this.authService.resendActivationLink(activationCode).subscribe(
      (data: ActivationError) => {
        this.responseProcessing(data, 'resend');
        this.loading = false;
        subscription.unsubscribe();
      });
  }

  responseProcessing(response: ActivationError, requestType: string = null): void {
    if (!response.error && !requestType) {
      this.titleMessage = 'Профиль активирован';
      this.descriptionMessage = 'Ваш профиль успешно активирован';
      this.errorCode = null;
    } else if (!response.error && requestType === 'resend') {
      this.titleMessage = 'Письмо отправлено';
      this.descriptionMessage = 'Мы отправили письмо с активацией на Вашу электронную почту';
      this.errorCode = null;
    } else {
      switch (response.error) {
        case ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN:
          this.titleMessage = this.getErrorTitleByType(ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN);
          this.descriptionMessage = this.getErrorDescriptionByType(ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN);
          this.errorCode = ActivationErrorCode.INCORRECT_ACTIVATION_TOKEN;
          break;

        case ActivationErrorCode.ALREADY_ACTIVATED:
          this.titleMessage = this.getErrorTitleByType(ActivationErrorCode.ALREADY_ACTIVATED);
          this.descriptionMessage = this.getErrorDescriptionByType(ActivationErrorCode.ALREADY_ACTIVATED);
          this.errorCode = ActivationErrorCode.ALREADY_ACTIVATED;
          break;

        case ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED:
          this.titleMessage = this.getErrorTitleByType(ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED);
          this.descriptionMessage = this.getErrorDescriptionByType(ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED);
          this.errorCode = ActivationErrorCode.ACTIVATION_TOKEN_EXPIRED;
          break;

        default:
          this.titleMessage = 'Что-то пошло не так';
          this.descriptionMessage = 'Произошла ошибка. Попробуйте обновить страницу или повторить запрос позднее';
          this.errorCode = 'unexpected-error';
      }
    }
  }

  getErrorTitleByType(type: string): string {
    return ActivationErrorCodeLabels[type];
  }

  getErrorDescriptionByType(type: string): string {
    return ActivationErrorCodeDescriptions[type];
  }

}
