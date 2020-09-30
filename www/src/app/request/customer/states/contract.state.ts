import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { Contract } from "../../common/models/contract";
import { ContractService } from "../services/contract.service";
import { ContractActions } from "../actions/contract.actions";
import { patch, updateItem } from "@ngxs/store/operators";
import { catchError, switchMap, tap } from "rxjs/operators";
import { saveAs } from 'file-saver/src/FileSaver';
import { iif, of, throwError } from "rxjs";
import Fetch = ContractActions.Fetch;
import Reject = ContractActions.Reject;
import Approve = ContractActions.Approve;
import Upload = ContractActions.Upload;
import Download = ContractActions.Download;
import { ToastActions } from "../../../shared/actions/toast.actions";

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

  @Action(Reject) reject({ setState, dispatch }: Context, { contract, files, comment }: Reject) {
    setState(patch<Model>({status: "updating"}));
    return dispatch(!!files ? new Upload(contract, files, comment) : []).pipe(
      switchMap(() => this.rest.reject(contract.id)),
      tap(c => setState(patch({ contracts: updateItem(({ id }) => c.id === id, c) }))),
      tap(() => setState(patch<Model>({ status: "received" }))),
      tap(() => dispatch([new ToastActions.Success('Договор отправлен на доработку')])),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Approve) approve({ setState, dispatch }: Context, { contract }: Approve) {
    setState(patch<Model>({status: "updating"}));
    return this.rest.approve(contract.id).pipe(
      tap(c => setState(patch<Model>({
        contracts: updateItem(({ id }) => c.id === id, c),
        status: "received"
      }))),
      tap(() => dispatch([new ToastActions.Success('Договор согласован')])),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Upload) upload({ setState }: Context, { contract, files, comment}: Upload) {
    return this.rest.upload(contract.id, files, comment);
  }

  @Action(Download) download({ setState }: Context, { contract }: Download) {
    return this.rest.download(contract.id).pipe(tap(data => saveAs(data, `Договор c ${ contract.supplier.shortName }.docx`)));
  }
}
