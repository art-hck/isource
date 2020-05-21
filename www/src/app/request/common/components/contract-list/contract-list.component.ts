import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService as BackofficeRequestService } from "../../../back-office/services/request.service";
import { RequestService as CustomerRequestService } from "../../../customer/services/request.service";
import { Observable } from "rxjs";
import { Request } from "../../models/request";
import { flatMap, map, publishReplay, refCount, tap } from "rxjs/operators";
import { Contract } from "../../models/contract";
import { ContragentWithPositions } from "../../models/contragentWithPositions";
import { ContractService } from "../../services/contract.service";
import { RequestPosition } from "../../models/request-position";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { RequestOfferPosition } from "../../models/request-offer-position";
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { ContractStatus } from "../../enum/сontract-status";

@Component({
  selector: 'app-request-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  public request$: Observable<Request>;
  public contracts$: Observable<Contract[]>;
  public contragentsWithPositions$: Observable<ContragentWithPositions[]>;
  public showModal = false;
  public ContractStatus = ContractStatus;
  public attachedFiles: { file: File, contract: Contract }[] = [];

  contragent: ContragentInfo;
  contractSignLoader = false;
  contragentInfoModalOpened = false;

  constructor(
    public featureService: FeatureService,
    public userInfoService: UserInfoService,
    private bc: UxgBreadcrumbsService,
    private router: Router,
    private route: ActivatedRoute,
    private backofficeRequestService: BackofficeRequestService,
    private customerRequestService: CustomerRequestService,
    private contractService: ContractService,
    private getContragentService: ContragentService,
  ) {
  }

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');

    if (this.userInfoService.isBackOffice()) {
      this.request$ = this.backofficeRequestService.getRequest(requestId);
    }

    if (this.userInfoService.isCustomer()) {
      this.request$ = this.customerRequestService.getRequest(requestId);
    }

    this.request$ = this.request$.pipe(
        tap(request => {
          this.bc.breadcrumbs = [
            { label: "Заявки", link: this.router.createUrlTree(["../.."], { relativeTo: this.route }).toString() },
            { label: `Заявка №${request.number }`, link: this.router.createUrlTree([".."], { relativeTo: this.route }).toString() }
          ];
        }),
        publishReplay(1), refCount()
      );

    this.contragentsWithPositions$ = this.contractService.getContragentsWithPositions(requestId)
      .pipe(publishReplay(1), refCount());

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
  public attachFileToContract([file]: File[], contract: Contract): void {
    this.attachedFiles = [...this.attachedFiles, {file, contract}];
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
        g[offerPosition.currency] = g[offerPosition.currency] || {total: 0, offerPositions: []};
        g[offerPosition.currency].total += offerPosition.priceWithoutVat * offerPosition.quantity;
        g[offerPosition.currency].offerPositions.push(offerPosition);
        return g;
      }, {});
  }

  public changeStatus(contract: Contract, contractStatus: ContractStatus): void {
    contract.status = contractStatus;

    this.request$.pipe(
      flatMap(request => {
          switch (contractStatus) {
            case ContractStatus.ON_APPROVAL:
              return this.contractService.onApproval(request.id, contract.id);
            case ContractStatus.APPROVED:
              return this.contractService.approve(request.id, contract.id);
            case ContractStatus.REJECTED:
              return this.contractService.reject(request.id, contract.id);
          }
        }
      )).subscribe();
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

  /**
   * Скачивает сгенерированный шаблон договора
   * @param request
   * @param contract
   */
  onGenerateContract(request: Request, contract: Contract) {
    this.contractService.generateContract(request.id, contract.id);
  }

  /**
   * Помечает договор как подписанный
   * @param request
   * @param contract
   */
  onSignContract(contract: Contract) {
    this.contractSignLoader = true;

    this.contractService.sign(contract.id).subscribe(
      (data: Contract) => {
        contract.status = ContractStatus.SIGNED;
        this.contractSignLoader = false;
      },
      () => {
        this.contractSignLoader = false;
      }
    );
  }

  /**
   * Нужно ли отображать кнопку скачивания шаблона договора
   * @param contract
   */
  isShowGenerateContractButton(contract: Contract) {
    return ([
      ContractStatus.APPROVED.valueOf(),
      ContractStatus.SIGNED.valueOf()
    ].indexOf(contract.status) === -1) && this.userInfoService.isBackOffice();
  }

  /**
   * Нужно ли отображать кнопку подписания договора
   * @param contract
   */
  isShowSignContractButton(contract: Contract) {
    return contract.status === ContractStatus.APPROVED && this.userInfoService.isBackOffice();
  }
}

export class GroupedPositionsByCurrency { [name: string]: {total: number, offerPositions: RequestOfferPosition[] }; }