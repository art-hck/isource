import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Uuid} from "../../../../cart/models/uuid";
import {Request} from "../../../common/models/request";
import {RequestService} from "../../services/request.service";
import {DesignDocumentationService} from "../../services/design-documentation.service";
import {DesignDocumentationList} from "../../../common/models/design-documentationList";

@Component({
  selector: 'app-add-design-documentation',
  templateUrl: './add-design-documentation.component.html',
  styleUrls: ['./add-design-documentation.component.scss']
})
export class AddDesignDocumentationComponent implements OnInit {

  requestId: Uuid;
  request: Request;

  designDocumentations: DesignDocumentationList[];

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private designDocumentationService: DesignDocumentationService
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getDesignDocumentationList();
  }

  onRequestsClick(): void {
    this.router.navigateByUrl(`requests/backoffice`).then(r => {});
  }

  onRequestClick(): void {
    this.router.navigateByUrl(`requests/backoffice/${this.request.id}`).then(r => {});
  }

  protected updateRequestInfo(): void {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  getDesignDocumentationList(): void {
    this.designDocumentationService.getDesignDocumentationList(this.requestId).subscribe(
      (data: DesignDocumentationList[]) => {
        this.designDocumentations = data;
      }
    );
  }

  isRkdAgreementStatus(designDoc: DesignDocumentationList): boolean {
    return designDoc.position.status === 'RKD_AGREEMENT';
  }
}
