import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {

  formattedPhoneNumber: string;

  constructor(
  ) {}

  @HostListener('change', ['$event'])
  onChange(event) {
    this.processEvent(event);
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    event.target.value = this.formattedPhoneNumber;
  }

  processEvent(event) {
    const trimmed = event.target.value.replace(/\D+/, '');
    const arr = trimmed.match(/^(\+?7|8)?[\- ]?(\(?\d{3}\)?)?(\d{3})(\d{2})(\d{2})$/);

    if (arr) {
      const formattedPhone = '+7 (' + arr[2] + ') ' + arr[3] + '-' + arr[4] + '-' + arr[5];
      this.formattedPhoneNumber = formattedPhone;
      console.log(formattedPhone);
    }
  }

}
