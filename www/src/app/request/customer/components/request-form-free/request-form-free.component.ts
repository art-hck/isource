import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { flatMap, mapTo } from "rxjs/operators";

@Component({
  selector: 'app-request-form-free',
  templateUrl: './request-form-free.component.html',
  styleUrls: ['./request-form-free.component.scss']
})
export class RequestFormFreeComponent implements OnInit {

  @Output() cancel = new EventEmitter();

  freeFormRequestDataForm: FormGroup;
  requestItem: Partial<Request>;
  requestName = "";

  constructor(
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private store: Store,
    protected router: Router
  ) {
  }

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
    return this.requestService.addFreeFormRequest(this.requestItem)
      .pipe(flatMap((request) => this.requestService.publishRequest(request.id).pipe(mapTo(request))))
      .subscribe(({id}) => {
        this.router.navigateByUrl(`requests/customer/${id}`);
        this.store.dispatch(new ToastActions.Success("Заявка опубликована"));
      });
  }

  checkCanSendRequest(value: any): boolean {
    if (value.documents && value.name) {
      return !((value.documents.length === 0) || value.name.trim().length === 0);
    }
    return false;
  }

  onCancel() {
    this.freeFormRequestDataForm.reset();
    this.cancel.emit();
  }
}