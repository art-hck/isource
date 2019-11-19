import { Component, Input } from '@angular/core';
import { RequestPosition } from "../../../common/models/request-position";
import { QualityService } from "../../services/quality.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { ClrLoadingState } from "@clr/angular";
import { delay } from "rxjs/operators";
import { of, Subscription } from "rxjs";

@Component({
  selector: 'app-quality-component',
  templateUrl: 'quality.component.html',
  styleUrls: ['./quality.component.scss']
})

export class QualityComponent {
  @Input() positions: RequestPosition[];
  public stars = [false, false, false, false, false];
  public loadingState: ClrLoadingState;
  private subscription = new Subscription();

  get rate() {
    return this.stars.reverse().findIndex(Boolean) + 1;
  }

  constructor(
    private qualityService: QualityService,
    private notificationService: NotificationService
  ) {
  }

  activate(count): void {
    this.stars.forEach((star, i) => this.stars[i] = i === count);
  }

  cancel(): void {
    this.qualityService.addPositionIdWithQualityRating(this.positions);
  }

  submit(): void {
    this.loadingState = ClrLoadingState.LOADING;
    this.subscription.add(
      of(null).pipe(delay(600)).subscribe(() => {
        this.loadingState = ClrLoadingState.SUCCESS;
        this.qualityService.addPositionIdWithQualityRating(this.positions);
        this.notificationService.toast("Большое спасибо!");
      })
    );
  }

}
