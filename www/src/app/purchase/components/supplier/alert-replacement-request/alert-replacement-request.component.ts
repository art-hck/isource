import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Uuid } from 'src/app/cart/models/uuid';

@Component({
  selector: 'app-purchase-alert-replacement-request',
  templateUrl: './alert-replacement-request.component.html',
  styleUrls: ['./alert-replacement-request.component.css']
})
export class AlertReplacementRequestComponent implements OnInit {

  @Input() purchaseId: Uuid;

  constructor(
    protected router: Router
  ) { }

  ngOnInit() {
  }

  protected onAnswerClick(): void {
    this.router.navigateByUrl(`purchases/supplier/${this.purchaseId}/requests-for-position-offer-change`);
  }

}
