import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Procedure } from "../../models/procedure";
import moment from "moment";
import { RequestPosition } from "../../../common/models/request-position";
import { AppComponent } from "../../../../app.component";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OkatoRegion } from "../../../../shared/models/okato-region";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { startWith } from "rxjs/operators";

@Component({
  selector: 'app-procedure-grid',
  templateUrl: './procedure-grid.component.html',
  styleUrls: ['./procedure-grid.component.scss']
})
export class ProcedureGridComponent implements OnInit {
  @Input() procedure: Procedure;
  @Output() bargain = new EventEmitter();
  @Output() prolong = new EventEmitter();

  form: FormGroup;
  procedurePositions: RequestPosition[];

  constructor(@Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
              private  fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: ''
    });

    this.form.get('search').valueChanges.pipe(
      startWith(<{}>this.form.get('search').value)).subscribe(() => {
      this.procedurePositions = this.procedure.positions.map(procedurePosition => procedurePosition.requestPosition).filter(requestPosition =>
        requestPosition.name.toLowerCase().indexOf(this.form.get('search').value.toLowerCase()) >= 0);
      }
    );
  }

  finished(procedure: Procedure): boolean {
    return moment(procedure?.dateEndRegistration).isBefore();
  }

  link(procedure: Procedure): string {
    return this.appConfig.procedure.url + procedure.procedureId;
  }

  resultLink(procedure: Procedure): string {
    return this.appConfig.procedure.resultUrl + procedure.lotId;
  }
}
