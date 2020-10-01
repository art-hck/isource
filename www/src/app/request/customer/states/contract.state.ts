import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { Contract } from "../../common/models/contract";
import { ContractService } from "../services/contract.service";
import { ContractActions } from "../actions/contract.actions";
import { patch, updateItem } from "@ngxs/store/operators";
import { switchMap, tap } from "rxjs/operators";
import { saveAs } from 'file-saver/src/FileSaver';
import { iif, of } from "rxjs";
import Fetch = ContractActions.Fetch;
import Reject = ContractActions.Reject;
import Approve = ContractActions.Approve;
import Upload = ContractActions.Upload;
import Download = ContractActions.Download;

export interface ContractStateStateModel {
  contracts: Contract[];
  status: StateStatus;
}

type Model = ContractStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerContract',
  defaults: { contracts: null, status: "pristine" }
})
@Injectable()
export class ContractState {
  constructor(private rest: ContractService) {}

  @Selector() static status({status}: Model) { return status; }

  static contracts(statuses?: Contract['status'][]) {
    return createSelector([ContractState], ({ contracts }: Model) => {
      return contracts.filter(c => !statuses || statuses.includes(c.status));
    });
  }

  @Action(Fetch) fetch({ setState }: Context, { requestId }: Fetch) {
    setState(patch<Model>({ status: 'fetching', contracts: null }));

    return this.rest.list(requestId).pipe(
      tap(contracts => setState(patch<Model>({ contracts, status: 'received' })))
    );
  }

  @Action(Reject) reject({ setState, dispatch }: Context, { requestId, contractId, file, comment }: Reject) {
    setState(patch<Model>({status: "updating"}));
    return iif(() => !!file, dispatch(new Upload(requestId, contractId, file, comment)), of(0)).pipe(switchMap(
      () => this.rest.reject(requestId, contractId).pipe(
        tap(contract => setState(patch<Model>({
          contracts: updateItem(({ id }) => contract.id === id, contract),
          status: "received"
        })))
      )
    ));
  }

  @Action(Approve) approve({ setState }: Context, { requestId, contractId }: Approve) {
    setState(patch<Model>({status: "updating"}));
    return this.rest.approve(requestId, contractId).pipe(
      tap(contract => setState(patch<Model>({
        contracts: updateItem(({ id }) => contract.id === id, contract),
        status: "received"
      })))
    );
  }

  @Action(Upload) upload({ setState }: Context, { requestId, contractId, file, comment}: Upload) {
    return this.rest.upload(requestId, contractId, file, comment);
  }

  @Action(Download) download({ setState }: Context, { requestId, contractId }: Download) {
    return this.rest.download(requestId, contractId).pipe(tap(data => saveAs(data, 'Договор.docx')));
  }
}
