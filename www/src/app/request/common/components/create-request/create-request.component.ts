import { Component, OnInit } from '@angular/core';
import { CreateRequestService } from "../../services/create-request.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UxgBreadcrumbsService } from "uxg";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(
    private createRequestService: CreateRequestService,
    private bc: UxgBreadcrumbsService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/customer" },
      { label: `Заполнить вручную`, link: "/requests/customer/create" }
    ];
  }

  onSendExcelFile(requestData: { files: File[], requestName: string }): void {
    this.createRequestService.addRequestFromExcel(requestData.files, requestData.requestName)
      .subscribe((data: any) => {
        Swal.fire({
          width: 400,
          html: '<p class="text-alert">' + 'Черновик заявки создан</br></br>' + '</p>' +
            '<button id="submit" class="btn btn-primary">' +
            'ОК' + '</button>',
          showConfirmButton: false,
          onBeforeOpen: () => {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);

            const submit = $('#submit');
            submit.addEventListener('click', () => {
              this.router.navigateByUrl(`requests/customer/${data.id}`);
              Swal.close();
            });
          }
        });
      }, (error: any) => {
        let msg = 'Ошибка в шаблоне';
        if (error && error.error && error.error.detail) {
          msg = `${msg}: ${error.error.detail}`;
        }
        alert(msg);
      });
  }
}
