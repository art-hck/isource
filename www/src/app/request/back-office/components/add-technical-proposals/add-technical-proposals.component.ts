import { Component, OnInit, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute, Router } from "@angular/router";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RequestGroup } from "../../../common/models/request-group";
import { RequestPosition } from "../../../common/models/request-position";

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

  selectedTechnicalProposalPositions = [];
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
    this.selectedTechnicalProposalPositions = [];
    this.searchStr = '';

    const technicalProposal = new TechnicalProposal();
    technicalProposal.id = null;
    this.technicalProposal = technicalProposal;

    this.getPositionsListForTp();

    this.showAddTechnicalProposalModal = true;
  }

  onShowEditTechnicalProposalModal(technicalProposal) {
    this.technicalProposalsPositions = [];
    this.getPositionsListForTp();

    this.selectedTechnicalProposalPositions = [];
    this.searchStr = '';

    this.technicalProposal = technicalProposal;

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
    this.selectedTechnicalProposalPositions.map(pos => {
      selectedPositionsArray.push(pos.id);
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
    const technicalProposal = {
      name: this.technicalProposal.name,
      positions: this.selectedTechnicalProposalPositions,
    };

    console.log(technicalProposal);
    this.technicalProposalsService.updateTechnicalProposal(this.requestId, technicalProposal).subscribe(() => {
      this.getTechnicalProposals();
    });
    this.showAddTechnicalProposalModal = false;
  }


  onSearch() {
    console.log(this.searchStr);
    this.technicalProposalsPositions.splice(this.technicalProposalsPositions.findIndex(e => e.name !== this.searchStr), 1);
  }


  getPositionsListForTp() {
    this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId).subscribe(
      (positions: RequestPositionList[]) => {
        this.technicalProposalsPositions = positions;
      }
    );
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
  }

  checkIfPositionIsChecked() {
    this.technicalProposalsPositions.map(pos => {
      if (this.selectedTechnicalProposalPositions.indexOf(pos) > -1) {
        console.log('есть');
        return true;
      } else {
        console.log('нет');
        return false;
      }
    });
  }




  /**
   * Функция проверяет, находится ли модальное окно в режиме редактирования или в режиме создания нового ТП
   * @param technicalProposal
   */
  tpModalInEditMode(technicalProposal): boolean {
    return technicalProposal.id !== null;
  }

}
