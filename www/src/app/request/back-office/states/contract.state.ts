import { ContragentList } from "../../../contragent/models/contragent-list";
import { StateStatus } from "../../common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { insertItem, patch } from "@ngxs/store/operators";
import { Contract } from "../../common/models/contract";
import { tap } from "rxjs/operators";
import { ContractService } from "../../common/services/contract.service";
import { ContractActions } from "../actions/contract.actions";
import GetContragents = ContractActions.GetContragents;
import { ContragentWithPositions } from "../../common/models/contragentWithPositions";
import AddContract = ContractActions.AddContract;

export interface ContractStateModel {
  contragents: ContragentWithPositions[];
  contracts: Contract[];
  status: StateStatus;
}

type Model = ContractStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeContract',
  defaults: { contragents: null, contracts: null, status: "pristine" }
})
@Injectable()
export class ContractState {
  cache: { [requestId in Uuid]: Contract[] } = {};

  constructor(
    private rest: ContractService
  ) {
  }

  @Selector()
  static contragents({contragents}: Model) {
    return contragents;
  }

  @Selector()
  static contracts({contracts}: Model) {
    return contracts;
  }

  @Selector()
  static status({status}: Model) {
    return status;
  }

  @Action(GetContragents)
  getContragents({setState, dispatch}: Context, {requestId}: GetContragents) {
    setState(patch({status: "updating"} as Model));

    return this.rest.getContragentsWithPositions(requestId).pipe(
      tap(contragents => setState(patch({contragents, status: "received"} as Model)))
    );
  }

  @Action(AddContract)
  addContract({setState, dispatch}: Context, {requestId, contragentId, positions}: AddContract) {
    setState(patch({status: "updating"} as Model));

    return this.rest.create(requestId, contragentId, positions).pipe(
      tap(contract => setState(patch<Model>({contracts: insertItem(contract), status: "received"})))
    );
  }
}
