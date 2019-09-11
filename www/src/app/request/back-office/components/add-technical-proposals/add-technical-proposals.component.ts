import { Component, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { RequestPositionList } from "../../../common/models/request-position-list";

@Component({
  selector: 'app-add-technical-proposals',
  templateUrl: './add-technical-proposals.component.html',
  styleUrls: ['./add-technical-proposals.component.scss']
})
export class AddTechnicalProposalsComponent implements OnInit {

  requestId: Uuid;
  request: Request;
  technicalProposals: TechnicalProposal[];

  technicalProposal: TechnicalProposal;
  technicalProposalsPositions: RequestPositionList[];

  selectedTechnicalProposalPositions = [];
  searchStr: string;

  showAddTechnicalProposalModal = false;

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService
  ) { }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.updateRequestInfo();
    this.getTechnicalProposals();
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/back-office`).then(r => {});
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/back-office/${this.request.id}`).then(r => {});
  }



  onShowAddTechnicalProposalModal() {
    this.selectedTechnicalProposalPositions = [];
    this.searchStr = '';

    const technicalProposal = new TechnicalProposal();
    technicalProposal.id = null;
    this.technicalProposal = technicalProposal;

    this.getPositionsListForTp();

    this.showAddTechnicalProposalModal = true;
  }

  onShowEditTechnicalProposalModal(technicalProposal) {
    this.selectedTechnicalProposalPositions = [];
    this.searchStr = '';

    this.getPositionsListForTp();

    // todo Получить список отмеченных позиций для этого техпредложения

    this.technicalProposal = technicalProposal;

    this.showAddTechnicalProposalModal = true;
  }




  isReadyToSendForApproval(technicalProposal) {
    if (technicalProposal) {
      if (technicalProposal.documents.length > 0) {
         return true;
      } else {
        return false;
      }
    }
  }


  onSendForApproval() {
    console.log('Отправлено на согласование заказчику');
    // this.technicalProposalsService.sendToAgreement().subscribe(
    //   (data: TechnicalProposal) => {
    //     console.log(data);
    //     this.technicalProposals = data;
    //   }
    // );
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }

  protected getTechnicalProposals() {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId).subscribe(
      (data: TechnicalProposal[]) => {
        this.technicalProposals = data;
      }
    );
  }


  updateTpPositionManufacturingName(tpPosition, value) {
    const tpPositionInfo = {
      position: {
        id: tpPosition.id
      },
      manufacturingName: value
    };

    this.technicalProposalsService.updateTpPositionManufacturingName(
      this.requestId,
      tpPosition.id,
      tpPositionInfo
    ).subscribe(() => {});
  }


  onAddTechnicalProposal() {
    // this.technicalProposalsService.addTechnicalProposal();
  }

  onSaveTechnicalProposal() {

  }


  onSearch() {
    console.log(this.searchStr);
    this.technicalProposalsPositions.splice(this.technicalProposalsPositions.findIndex(e => e.name !== this.searchStr), 1);
  }


  getPositionsListForTp() {
    this.technicalProposalsPositions = [
      {
        id: '1',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Сапог'
      },
      {
        id: '2',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ручка'
      },
      {
        id: '3',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ёжик'
      },
      {
        id: '4',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Сапог'
      },
      {
        id: '5',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ручка'
      },
      {
        id: '6',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ёжик'
      },
      {
        id: '7',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Сапог'
      },
      {
        id: '8',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ручка'
      },
      {
        id: '9',
        entityType: 'POSITION',
        createdDate: '22.05.1993 00:00:00',
        requestId: '9',
        name: 'Ёжик'
      },
    ];

    // this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId).subscribe(
    //   (positions: RequestPositionList[]) => {
    //     this.technicalProposalsPositions = positions;
    //   }
    // );
  }

  onTechnicalProposalPositionSelected(position) {
    if (this.selectedTechnicalProposalPositions.indexOf(position) > -1) {
      for (let i = 0; i < this.selectedTechnicalProposalPositions.length; i++) {
        if (this.selectedTechnicalProposalPositions[i] === position) {
          this.selectedTechnicalProposalPositions.splice(i, 1);
        }
      }
    } else {
      this.selectedTechnicalProposalPositions.push(position);
    }

    // this.selectedTechnicalProposalPositions.push(positionId);
    console.log(this.selectedTechnicalProposalPositions);
  }




  tpModalInEditMode(technicalProposal) {
    return technicalProposal.id !== null;
  }

}
