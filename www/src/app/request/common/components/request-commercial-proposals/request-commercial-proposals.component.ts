import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-commercial-proposals',
  templateUrl: './request-commercial-proposals.component.html',
  styleUrls: ['./request-commercial-proposals.component.scss']
})
export class RequestCommercialProposalsComponent implements OnInit {

  form: FormGroup;
  requestId: Uuid;

  @Input() requestPositions: RequestPosition[] = [];
  @Input() suppliers: ContragentList[];
  @Output() sentForAgreement = new EventEmitter<{requestId: Uuid, selectedPositions: RequestPosition[]}>();

  supplier: ContragentList;

  get formPositions() {
    return this.form.get('positions') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      checked: false,
      positions: this.fb.array([], CustomValidators.oneOrMoreSelected)
    });

    this.requestPositions.map(position => this.formPositions.push(
      this.createFormGroupPosition(position)));
  }

  createFormGroupPosition(position: RequestPositionList) {
    return this.fb.group({
      checked: false,
      position: position
    });
  }

}
