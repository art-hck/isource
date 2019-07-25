import { Injectable } from '@angular/core';
import Swal, { SweetAlertType } from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
  }

  toast(message, type: SweetAlertType = 'success', timer = 3000) {
    Swal.fire({
      toast: true,
      position: 'top',
      type: type,
      html: '<p class="text-alert">' + message + '</p>',
      showConfirmButton: false,
      timer: timer
    });
  }
}
