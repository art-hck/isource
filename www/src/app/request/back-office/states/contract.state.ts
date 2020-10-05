import { saveAs } from 'file-saver/src/FileSaver';
import { StateStatus } from "../../common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";
import { Contract } from "../../common/models/contract";
import { catchError, switchMap, tap } from "rxjs/operators";
import { ContractActions } from "../actions/contract.actions";
import { ContragentWithPositions } from "../../common/models/contragentWithPositions";
import { ContractService } from "../services/contract.service";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { ContractStatusLabels } from "../../common/dictionaries/contract-status-labels";
import { ContractStatus } from "../../common/enum/contract-status";
import { ContractFilter } from "../../common/models/contract-filter";
import FetchSuppliers = ContractActions.FetchSuppliers;
import Create = ContractActions.Create;
import Fetch = ContractActions.Fetch;
import Send = ContractActions.Send;
import Upload = ContractActions.Upload;
import Download = ContractActions.Download;
import Sign = ContractActions.Sign;
import Rollback = ContractActions.Rollback;
import Delete = ContractActions.Delete;
import Filter = ContractActions.Filter;
import FetchAvailibleFilters = ContractActions.FetchAvailibleFilters;

export interface ContractStateModel {
  suppliers: ContragentWithPositions[];
  contracts: Contract[];
  availibleFilters?: ContractFilter;
  status: StateStatus;
}

type Model = ContractStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeContract',
  defaults: { suppliers: null, contracts: null, availibleFilters: {}, status: "pristine" }
})
@Injectable()
export class ContractState {

  constructor(private rest: ContractService) {}

  @Selector() static suppliers({ suppliers }: Model) { return suppliers; }
  @Selector() static contracts({ contracts }: Model) { return contracts; }
  @Selector() static availibleFilters({ availibleFilters }: Model) { return availibleFilters; }
  @Selector() static status({ status }: Model) { return status; }

  @Action([Fetch, Filter])
  fetch({ setState, dispatch }: Context, { requestId, filter }: Fetch & Filter) {
    setState(patch<Model>(!filter ? { status: 'fetching', contracts: null } : { status: 'updating'}));

    return this.rest.list(requestId, filter).pipe(tap(contracts => setState(patch<Model>({ contracts, status: "received" }))));
  }

  @Action(FetchAvailibleFilters)
  fetchAvailibleFilters({ setState }: Context, { requestId }: FetchAvailibleFilters) {
    // @TODO: получать список доступных фильтров отдельным методом
    return this.rest.list(requestId).pipe(
      tap(contracts => setState(patch<Model>({
        availibleFilters: {
          statuses: Object.keys(ContractStatusLabels).filter(status => contracts.some(c => c.status === status)) as ContractStatus[],
          suppliers: contracts.map(({ supplier }) => supplier).filter((v, i, a) => a.findIndex(({ id }) => v.id === id) === i)
        }
      }))),
    );
  }

  @Action(FetchSuppliers)
  fetchSuppliers({ setState, dispatch }: Context, { requestId }: FetchSuppliers) {
    setState(patch({ suppliers: null }));
    return this.rest.suppliers(requestId).pipe(tap(suppliers => setState(patch({ suppliers }))));
  }

  @Action(Create)
  addContract({ setState, dispatch }: Context, { requestId, contragentId, positions }: Create) {
    setState(patch<Model>({ status: "updating" }));

    return this.rest.create(requestId, contragentId, positions).pipe(
      tap(contract => setState(patch<Model>({ contracts: insertItem(contract), status: "received" }))),
      tap(() => dispatch([new ToastActions.Success('Договор успешно добавлен'), new FetchSuppliers(requestId)])),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Send)
  send({ setState, dispatch }: Context, { contract, files, comment }: Send) {
    setState(patch<Model>({ status: "updating" }));

    return dispatch(!!files ? new Upload(contract, files, comment) : []).pipe(
      switchMap(() => this.rest.sendForApproval(contract.id)),
      tap(() => dispatch([new ToastActions.Success('Договор отправлен на согласование')])),
      tap(c => setState(patch({ contracts: updateItem(({ id }) => c.id === id, c) }))),
      tap(() => setState(patch<Model>({ status: "received" }))),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Sign)
  sign({ setState, dispatch }: Context, { contract }: Sign) {
    setState(patch<Model>({ status: "updating" }));

    return this.rest.sign(contract.id).pipe(
      tap(c => setState(patch({ contracts: updateItem(({ id }) => id === c.id, c) }))),
      tap(() => dispatch([new ToastActions.Success('Договор подписан')])),
      tap(() => setState(patch<Model>({ status: "received" }))),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Rollback)
  rollback({ setState, dispatch }: Context, { contract }: Rollback) {
    setState(patch<Model>({ status: "updating" }));
    return this.rest.rollback(contract.id).pipe(
      tap(c => setState(patch({ contracts: updateItem(({ id }) => id === c.id, c) }))),
      tap(() => dispatch([new ToastActions.Success('Договор отозван')])),
      tap(() => setState(patch<Model>({ status: "received" }))),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Delete)
  delete({ setState, dispatch }: Context, { contract }: Delete) {
    setState(patch<Model>({ status: "updating" }));
    return this.rest.delete(contract.id).pipe(
      tap(c => setState(patch({ contracts: updateItem(({ id }) => id === c.id, c) }))),
      tap(() => dispatch([new ToastActions.Success('Договор удалён')])),
      tap(() => setState(patch<Model>({ status: "received" }))),
      catchError(e => {
        setState(patch<Model>({status: "error"}));
        return dispatch(new ToastActions.Error(e?.error?.detail ?? "Неизвестная ошибка"));
      })
    );
  }

  @Action(Upload) upload({ setState }: Context, { contract, files, comment }: Upload) {
    return this.rest.upload(contract.id, files, comment);
  }

  @Action(Download) download({ setState }: Context, { contract }: Download) {
    return this.rest.download(contract.id).pipe(tap(data => saveAs(data, `Договор c ${ contract.supplier.shortName }.docx`)));
  }
}
