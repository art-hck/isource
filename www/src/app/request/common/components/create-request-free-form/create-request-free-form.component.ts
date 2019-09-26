import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FreeFormRequestItem } from "../../models/free-form-request-item";
import { CreateRequestService } from "../../services/create-request.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-request-free-form',
  templateUrl: './create-request-free-form.component.html',
  styleUrls: ['./create-request-free-form.component.css']
})
export class CreateRequestFreeFormComponent implements OnInit {

  freeFormRequestDataForm: FormGroup;
  requestItem: FreeFormRequestItem;
  requestName = "";

  constructor(
    private formBuilder: FormBuilder,
    private createRequestService: CreateRequestService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.freeFormRequestDataForm = this.formBuilder.group({
      name: [''],
      documents: [null],
      comments: [''],
    });
  }

  onRequestNameChange(value) {
    this.requestName = value.trim();
  }

  onFreeFormDocumentSelected(documents: File[], form: FormGroup) {
    form['controls'].documents.setValue(documents);
  }

  onSendFreeFormRequest() {
    this.requestItem = this.freeFormRequestDataForm.value;
    return this.createRequestService.addFreeFormRequest(this.requestItem).subscribe(
      (data: any) => {
        Swal.fire({
          width: 400,
          html: '<p class="text-alert">' + 'Заявка отправлена</br></br>' + '</p>' +
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
      }
    );
  }

  checkCanSendRequest(value: any): boolean {
    if (value.documents && value.name) {
      return !((value.documents.length === 0) || value.name.trim().length === 0);
    }
    return false;
  }
}
