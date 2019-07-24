import {Injectable} from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {
  }

  toast(message, type, timer) {
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
