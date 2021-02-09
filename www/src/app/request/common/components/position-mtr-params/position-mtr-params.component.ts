import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RequestPosition } from "../../models/request-position";
import { RequestPositionService } from "../../services/request-position.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MtrPosition } from "../../models/mtr-position";

@Component({
  selector: 'app-position-mtr-params',
  templateUrl: './position-mtr-params.component.html',
  styleUrls: ['./position-mtr-params.component.scss']
})
export class PositionMtrParamsComponent implements OnChanges, OnDestroy {

  @Input() title = 'Параметры МТР из справочника';
  @Input() requestPosition: RequestPosition;
  mtrPositionInfo: MtrPosition;
  readonly destroy$ = new Subject();

  constructor(
    private positionService: RequestPositionService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getPositionMtrParams();
  }

  getPositionMtrParams() {
    this.positionService.getPositionMtrParams(this.requestPosition.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.mtrPositionInfo = data;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
