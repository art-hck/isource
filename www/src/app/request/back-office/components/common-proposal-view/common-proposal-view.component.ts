// import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
// import { Observable, of } from "rxjs";
// import { StateStatus } from "../../../common/models/state-status";
// import { Request } from "../../../common/models/request";
// import { ProposalsView } from "../../../../shared/models/proposals-view";
// import { ProposalGroup } from "../../../common/models/proposal-group";
// import { ProcedureSource } from "../../enum/procedure-source";
// import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
// import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
// import { ActivatedRoute, Router } from "@angular/router";
// import { UxgBreadcrumbsService, UxgPopoverComponent } from "uxg";
// import { RequestService } from "../../services/request.service";
// import { Actions, Select, Store } from "@ngxs/store";
// import { FeatureService } from "../../../../core/services/feature.service";
// import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";
// import { ScrollPositionService } from "../../../../shared/services/scroll-position.service";
// import { AppComponent } from "../../../../app.component";
// import { Title } from "@angular/platform-browser";
// import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
// import { map } from "rxjs/operators";
// import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
// import { Procedure } from "../../models/procedure";
// import { CommonProposal, CommonProposalItem } from "../../../common/models/common-proposal";
// import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
// import { GridSupplier } from "../../../../shared/components/grid/grid-supplier";
// import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
//
// @Component({
//   selector: 'app-common-proposal-view',
//   templateUrl: './common-proposal-view.component.html',
//   styleUrls: ['./common-proposal-view.component.scss']
// })
// export class CommonProposalViewComponent implements OnInit {
//   @ViewChildren('viewPopover') viewPopover: QueryList<UxgPopoverComponent>;
//   @Input() status$: Observable<StateStatus>;
//   @Input() requestStatus$: Observable<StateStatus>;
//   @Input() request$: Observable<Request>;
//   @Input() group$: Observable<ProposalGroup>;
//   @Input() source: ProcedureSource; // ?
//   procedures$: Observable<Procedure[]>;
//   proposals$: Observable<CommonProposal[]>;
//
//
//
//
//   @Output() downloadTemplate = new EventEmitter();
//   @Output() uploadTemplate = new EventEmitter();
//   @Output() downloadAnalyticalReport = new EventEmitter();
//   @Output() publishPositions = new EventEmitter();
//   @Output() updateProcedures = new EventEmitter();
//   @Output() rollback = new EventEmitter();
//
//   view: ProposalsView = "grid";
//   form: FormGroup;
//   showForm: boolean;
//   stickedPosition: boolean;
//   addSupplierDisabled$: Observable<boolean>;
//   suppliers$: Observable<GridSupplier[]>;
//   positionProposalsItems$: Observable<CommonProposalItem[]>;
//
//   procedureModalPayload: unknown;
//
//   get selectedPositions(): TechnicalCommercialProposalByPosition[] {
//     return (this.form.get('items') as FormArray).controls?.filter(c => c.value.checked).map(c => c.value.item);
//   }
//
//   constructor(
//     private route: ActivatedRoute,
//     private bc: UxgBreadcrumbsService,
//     private requestService: RequestService,
//     private actions: Actions,
//     private fb: FormBuilder,
//     private cd: ChangeDetectorRef,
//     public featureService: FeatureService,
//     public store: Store,
//     public router: Router,
//     public helper: TechnicalCommercialProposalHelperService,
//     public scrollPositionService: ScrollPositionService,
//     private app: AppComponent,
//     public title: Title,
//     public service: TechnicalCommercialProposalService,
//   ) {
//   }
//
//   ngOnInit(): void {
//
//     this.addSupplierDisabled$ = of([] as any[]).pipe(
//       map(items => items.every(
//         item => item.data.length > 0 ? this.isOnReview(item) || this.isReviewed(item) : false
//       ))
//     );
//
//     this.suppliers$ = this.proposals$.pipe(map(proposals => proposals.reduce(
//       (suppliers: GridSupplier[], proposal) => {
//         [false, true]
//           .filter(hasAnalogs => proposal.items.some(({ isAnalog }) => isAnalog === hasAnalogs) || proposal.items.length === 0 && !hasAnalogs)
//           .forEach(hasAnalogs => suppliers.push({ ...proposal.supplier, hasAnalogs }));
//         return suppliers;
//       }, [])
//     ));
//   }
//
//   switchView(view: ProposalsView) {
//     this.view = view;
//     this.app.noHeaderStick = this.app.noContentPadding = view !== "list";
//     this.viewPopover?.first.hide();
//   }
//
//   isReviewed(items: any[]): boolean {
//     return items.some((item) => ['APPROVED', 'REJECTED'].includes(item.status)) && items.length > 0;
//   }
//
//   isOnReview(items: any[]): boolean {
//     return items.every(item => ['SENT_TO_REVIEW'].includes(item.status)) && items.length > 0;
//   }
//
// }
