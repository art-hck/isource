import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { DesignDocumentationList } from "../../models/design-documentationList";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { DesignDocumentationService } from "../../../back-office/services/design-documentation.service";
import { Request } from "../../models/request";

@Component({
  selector: 'app-design-documentation-edit',
  templateUrl: './design-documentation-edit.component.html',
  styleUrls: ['./design-documentation-edit.component.scss']
})
export class DesignDocumentationEditComponent implements OnInit {
  @Input() request: Request;
  @Input() designDocumentationList: DesignDocumentationList;
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() designDocumentationListChange = new EventEmitter<DesignDocumentationList>();

  public form: FormGroup;

  get designDocs() {
    return this.form.get('designDocs') as FormArray;
  }

  constructor(private designDocumentationService: DesignDocumentationService) {
  }


  ngOnInit() {
    this.form = new FormGroup({
      designDocs: new FormArray(this.designDocumentationList.designDocs.map(designDoc => new FormGroup({
          name: new FormControl(designDoc.name, [Validators.required, CustomValidators.simpleText]),
          adjustmentDate: new FormControl(designDoc.adjustmentDate, Validators.required),
          receivingDate: new FormControl(designDoc.receivingDate, Validators.required),
          documents: new FormArray(designDoc.documents.map(document => new FormControl(document)))
        })
      ))
    });
  }

  public addDesignDoc(): void {
    this.designDocs.push(new FormGroup({
      name: new FormControl(""),
      adjustmentDate: new FormControl(5),
      receivingDate: new FormControl(15),
      documents: new FormArray([])
    }));
  }

  public submit(): void {
    this.designDocumentationList.designDocs = this.designDocs.value.map(
      (designDoc, i) => ({...this.designDocumentationList.designDocs[i], ...designDoc})
    );

    this.designDocumentationListChange.emit(this.designDocumentationList);

    this.designDocumentationService.edit(this.request.id, this.designDocumentationList)
      .subscribe(data => this.designDocumentationListChange.emit(data));

    this.openChange.emit(false);
  }
}
