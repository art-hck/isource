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
      documents: [null],
      comments: [''],
    });
  }

  onFreeFormDocumentSelected(documents: File[], form: FormGroup) {
    console.log(form);
    form['controls'].documents.setValue(documents);
  }

  onSendFreeFormRequest() {
    this.requestItem = this.freeFormRequestDataForm.value;
    return this.createRequestService.addFreeFormRequest(this.requestItem).subscribe(
      (data: any) => {
        this.router.navigateByUrl(`requests/customer/${data.id}`);
      }
    );
  }


  checkCanSendRequest(value: any) {
    console.log(value);
    if (value.documents) {
      return !(value.documents.length === 0);
    }
    return false;
  }

}
