import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../back-office/services/request.service";
import { Observable } from "rxjs";
import { Request } from "../../models/request";
import { map, publishReplay, refCount, tap } from "rxjs/operators";
import { Contract } from "../../models/contract";
import { ContragentWithPositions } from "../../models/contragentWithPositions";
import { ContractService } from "../../services/contract.service";
import { RequestPosition } from "../../models/request-position";

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
  public attachedFiles: { file: File, contract: Contract }[] = [];

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private contractService: ContractService,
  ) {
  }

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');
    this.request$ = this.requestService.getRequestInfo(requestId);

    this.contragentsWithPositions$ = this.contractService.getContragentsWithPositions(requestId)
      .pipe(publishReplay(1), refCount())
    ;

    this.contracts$ = this.contractService.getContracts(requestId).pipe(
      tap(contracts => this.updateContragentsWithPositions(contracts)), // @TODO Скорее всего не понадобится, когда будет REST
      publishReplay(1), refCount()
    );
  }

  // Добавляем контракт и обновляем позиции
  public addContract(contract: Contract): void {
    this.updateContragentsWithPositions([contract]);
    this.contracts$ = this.contracts$
      .pipe(map(contracts => [contract, ...contracts]));
  }

  // Проверяем есть ли доступные позиции для добавления договора
  public isAvailableToCreate(contragentsWithPositions: ContragentWithPositions[]): boolean {
    return contragentsWithPositions
      .map(contragentsWithPosition => contragentsWithPosition.positions)
      .reduce((prev, curr) => [...prev, ...curr])
      .length > 0;
  }

  // Прикрепление (не загрузка) файла к контракту
  public attachFileToContract(files: FileList, contract: Contract) {
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

  // Убираем все позиции, которые есть в передаваемых функции котнрактах
  private updateContragentsWithPositions(contracts: Contract[]) {
    this.contragentsWithPositions$ = this.contragentsWithPositions$.pipe(
      map(contragentsWithPositions => contragentsWithPositions.map(contragentsWithPosition => {
          contragentsWithPosition.positions = contragentsWithPosition.positions
            .filter(position => contracts // массив контрактов
              .map(contract => contract.winners.map(winner => winner.offerPosition.requestPosition)) // получаем массив массивов позиций контрактов
              .reduce((prev, curr) => [...prev, ...curr]) // переводим их в один массив
              .map(contractPosition => contractPosition.id) // получаем массив из id позиций
              .indexOf(position.id) < 0 // true, если позиция контрагента не найдена в массиве
            );

          return contragentsWithPosition;
        })
      ))
    ;
  }
}
