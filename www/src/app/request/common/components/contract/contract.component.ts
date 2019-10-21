import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../back-office/services/request.service";
import { Observable } from "rxjs";
import { Request } from "../../models/request";
import { map, publishReplay, refCount, tap } from "rxjs/operators";
import { Contract, ContractStatus } from "../../models/contract";
import { ContragentWithPositions } from "../../models/contragentWithPositions";
import { ContractService } from "../../services/contract.service";
import { RequestPosition } from "../../models/request-position";
import { UserInfoService } from "../../../../core/services/user-info.service";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  public request$: Observable<Request>;
  public contracts$: Observable<Contract[]>;
  public contragentsWithPositions$: Observable<ContragentWithPositions[]>;
  public showModal = false;
  public ContractStatus = ContractStatus;
  public attachedFiles: { file: File, contract: Contract }[] = [];

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private contractService: ContractService,
    private userInfoService: UserInfoService,
  ) {
  }

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');
    this.request$ = this.requestService.getRequestInfo(requestId);

    this.contragentsWithPositions$ = this.contractService.getContragentsWithPositions(requestId)
      .pipe(publishReplay(1), refCount())
    ;

    this.contracts$ = this.contractService.getContracts(requestId)
      .pipe(publishReplay(1), refCount());
  }

  // Добавляем контракт и обновляем доступных контрагентов и их позиции
  public addContract(contract: Contract): void {
    this.updateContragentsWithPositions([contract]);
    this.contracts$ = this.contracts$
      .pipe(map(contracts => [contract, ...contracts]));
  }

  // Проверяем есть ли доступные позиции для добавления договора
  public isAvailableToCreate(contragentsWithPositions: ContragentWithPositions[]): boolean {
    return contragentsWithPositions
      .map(contragentsWithPosition => contragentsWithPosition.positions)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .length > 0;
  }

  public isAvailableForApproval(contract: Contract): boolean {
    return this.isAvailableToAttach(contract) && contract.documents.length > 0;
  }

  public isAvailableToAttach(contract: Contract): boolean {
    return [ContractStatus.NEW, ContractStatus.REJECTED].includes(contract.status);
  }

  // Прикрепление (не загрузка) файла к контракту
  public attachFileToContract(files: FileList, contract: Contract): void {
    this.attachedFiles = [...this.attachedFiles, {file: files[0], contract: contract}];
  }

  public removeFile(contract: Contract) {
    this.attachedFiles = this.attachedFiles.filter(files => files.contract.id !== contract.id);
  }

  public getAttachedFiles(contract: Contract): File[] {
    return this.attachedFiles.filter(files => files.contract.id === contract.id).map(files => files.file);
  }

  public getContractPositions(contract: Contract): RequestPosition[] {
    return contract.winners.map(winner => winner.offerPosition.requestPosition);
  }

  public getTotalPrice(contract: Contract): number {
    return contract.winners
      .map(winner => winner.offerPosition.priceWithoutVat)
      .reduce((a, b) => a + b, 0);
  }

  public getCurrencies(contract: Contract): string[] {
    return Object.keys(this.groupPositionsByCurrency(contract));
  }

  public groupPositionsByCurrency(contract: Contract): GroupedPositionsByCurrency {
    return contract.winners
      .map(winner => winner.offerPosition)
      .reduce((g: GroupedPositionsByCurrency, offerPosition) => {
        g[offerPosition.currency] = g[offerPosition.currency] || {total: 0, positions: []};
        g[offerPosition.currency].total += offerPosition.priceWithoutVat;
        g[offerPosition.currency].positions.push(offerPosition.requestPosition);
        return g;
      }, {});
  }

  // Убираем все позиции, которые есть в передаваемых функции котнрактах
  private updateContragentsWithPositions(contracts: Contract[]) {
    this.contragentsWithPositions$ = this.contragentsWithPositions$.pipe(
      map(contragentsWithPositions => contragentsWithPositions.map(contragentsWithPosition => {
          contragentsWithPosition.positions = contragentsWithPosition.positions
            .filter(position => contracts
              // получаем массив массивов позиций контрактов
              .map(contract => contract.winners.map(winner => winner.offerPosition.requestPosition))
              // переводим их в один массив
              .reduce((prev, curr) => [...prev, ...curr], [])
              // получаем массив из id позиций
              .map(contractPosition => contractPosition.id)
              // true, если позиция контрагента не найдена в массиве
              .indexOf(position.id) < 0
            );

          return contragentsWithPosition;
        })
      ))
    ;
  }
}

export class GroupedPositionsByCurrency { [name: string]: {total: number, positions: RequestPosition[] }; }
