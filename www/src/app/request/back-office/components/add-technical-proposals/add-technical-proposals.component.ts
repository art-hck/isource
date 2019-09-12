import { Component, OnInit } from '@angular/core';
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

  tpSupplierName: string;

  selectedTechnicalProposalPositionsIds = [];
  searchStr: string;

  showAddTechnicalProposalModal = false;

  files: File[] = [];

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
    this.selectedTechnicalProposalPositionsIds = [];
    this.searchStr = '';

    const technicalProposal = new TechnicalProposal();
    technicalProposal.id = null;
    this.technicalProposal = technicalProposal;

    this.getPositionsListForTp();

    this.showAddTechnicalProposalModal = true;
  }

  onShowEditTechnicalProposalModal(technicalProposal) {
    this.selectedTechnicalProposalPositionsIds = [];
    this.technicalProposalsPositions = [];
    this.getPositionsListForTp();

    this.technicalProposal = technicalProposal;

    this.technicalProposal.positions.map(e => {
      this.selectedTechnicalProposalPositionsIds.push(e.position.id);
    });

    this.searchStr = '';

    this.showAddTechnicalProposalModal = true;
  }

  isReadyToSendForApproval(technicalProposal) {
    if (technicalProposal) {
      return (technicalProposal.documents.length > 0);
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

  /**
   * Создание технического предложения
   */
  onAddTechnicalProposal(): void {
    const selectedPositionsArray = [];
    this.selectedTechnicalProposalPositionsIds.map(posId => {
      selectedPositionsArray.push(posId);
    });

    const technicalProposal = {
      name: this.tpSupplierName,
      positions: selectedPositionsArray,
    };

    this.technicalProposalsService.addTechnicalProposal(this.requestId, technicalProposal).subscribe(() => {
      this.getTechnicalProposals();
    });
    this.showAddTechnicalProposalModal = false;
    this.tpSupplierName = "";
  }

  /**
   * Редактирование Технического предложения
   */
  onSaveTechnicalProposal(): void {
    const selectedPositionsArray = [];
    this.selectedTechnicalProposalPositionsIds.map(posId => {
      selectedPositionsArray.push(posId);
    });

    const technicalProposal = {
      id: this.technicalProposal.id,
      name: this.tpSupplierName,
      positions: selectedPositionsArray,
    };

    this.technicalProposalsService.updateTechnicalProposal(this.requestId, technicalProposal).subscribe(() => {
      this.getTechnicalProposals();
    });
    this.showAddTechnicalProposalModal = false;
  }

  // onSearch() {
  //   console.log(this.searchStr);
  //   this.technicalProposalsPositions.splice(this.technicalProposalsPositions.findIndex(e => e.name !== this.searchStr), 1);
  // }

  getPositionsListForTp() {
    this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId).subscribe(
      (positions: RequestPositionList[]) => {
        this.technicalProposalsPositions = positions;
      }
    );
  }

  onTechnicalProposalPositionSelected(position) {
    if (this.selectedTechnicalProposalPositionsIds.indexOf(position.id) > -1) {
      for (let i = 0; i < this.selectedTechnicalProposalPositionsIds.length; i++) {
        if (this.selectedTechnicalProposalPositionsIds[i] === position.id) {
          this.selectedTechnicalProposalPositionsIds.splice(i, 1);
        }
      }
    } else {
      this.selectedTechnicalProposalPositionsIds.push(position.id);
    }
  }

  checkIfPositionIsChecked(technicalProposalPosition) {
    console.log(technicalProposalPosition.id);
    console.log(this.selectedTechnicalProposalPositionsIds);

    if (this.selectedTechnicalProposalPositionsIds.indexOf(technicalProposalPosition.id) > -1) {
      return true;
    }
    return false;
  }

  /**
   * Функция проверяет, находится ли модальное окно в режиме редактирования или в режиме создания нового ТП
   * @param technicalProposal
   */
  tpModalInEditMode(technicalProposal): boolean {
    return technicalProposal.id !== null;
  }
}
