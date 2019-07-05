import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {FreeFormRequestItem} from "../../models/free-form-request-item";
import {CreateRequestService} from "../../services/create-request.service";

@Component({
  selector: 'app-create-request-free-form',
  templateUrl: './create-request-free-form.component.html',
  styleUrls: ['./create-request-free-form.component.css']
})
export class CreateRequestFreeFormComponent implements OnInit {

  freeFormRequestDataForm: FormGroup;
  requestItem: FreeFormRequestItem;

  constructor(
    private formBuilder: FormBuilder,
    private createRequestService: CreateRequestService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.freeFormRequestDataForm = this.formBuilder.group({
      'itemForm': this.formBuilder.group({
          documents: [null],
          comments: ['', [Validators.required]],
        })
      }
    );
  }

  onFreeFormDocumentSelected(documents: File[], form: FormGroup) {
    form.get('documents').setValue(documents);
  }

  onSendFreeFormRequest() {
    this.requestItem = this.freeFormRequestDataForm.value;
    return this.createRequestService.addFreeFormRequest(this.requestItem['itemForm']).subscribe(
      (data: any) => {
        this.router.navigateByUrl(`requests/customer/${data.id}`);
      }
    );
  }


  checkCanSendRequest(form: FormGroup) {
    if (form[0].get('documents').value) {
      return !(form[0].get('documents').value.length === 0);
    }
    return false;
  }

}
