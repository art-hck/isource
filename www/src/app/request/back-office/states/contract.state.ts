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
import { iif, of } from "rxjs";
import FetchSuppliers = ContractActions.FetchSuppliers;
import Create = ContractActions.Create;
import Fetch = ContractActions.Fetch;
import Send = ContractActions.Send;
import Upload = ContractActions.Upload;
import Download = ContractActions.Download;
import Sign = ContractActions.Sign;
import Rollback = ContractActions.Rollback;

export interface ContractStateModel {
  suppliers: ContragentWithPositions[];
  contracts: Contract[];
  status: StateStatus;
}

type Model = ContractStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeContract',
  defaults: { suppliers: null, contracts: null, status: "pristine" }
})
@Injectable()
export class ContractState {

  constructor(private rest: ContractService) {}

  @Selector() static suppliers({ suppliers }: Model) { return suppliers; }
  @Selector() static contracts({ contracts }: Model) { return contracts; }
  @Selector() static status({ status }: Model) { return status; }

  @Action(Fetch)
  fetch({ setState, dispatch }: Context, { requestId }: Fetch) {
    setState(patch<Model>({ status: "fetching" }));

    return this.rest.list(requestId).pipe(
      tap(contracts => setState(patch<Model>({ contracts, status: "received" })))
    );
  }

  @Action(FetchSuppliers)
  fetchSuppliers({ setState, dispatch }: Context, { requestId }: FetchSuppliers) {
    return this.rest.suppliers(requestId).pipe(tap(suppliers => setState(patch({ suppliers }))));
  }

  @Action(Create)
  addContract({ setState, dispatch }: Context, { requestId, contragentId, positions }: Create) {
    setState(patch<Model>({ status: "updating" }));

    return this.rest.create(requestId, contragentId, positions).pipe(
      tap(contract => setState(patch<Model>({ contracts: insertItem(contract), status: "received" }))),
      tap(() => dispatch(new ToastActions.Success('Договор успешно добавлен'))),
      catchError(e => dispatch(new ToastActions.Error(e?.error?.detail)))
    );
  }

  @Action(Send)
  send({ setState, dispatch }: Context, { requestId, contractId, file, comment }: Send) {
    setState(patch<Model>({ status: "updating" }));

    return iif(() => !!file, dispatch(new Upload(requestId, contractId, file, comment)), of(0)).pipe(switchMap(
      () => this.rest.sendForApproval(requestId, contractId).pipe(
        tap(contract => setState(patch<Model>({
          contracts: updateItem(({ id }) => contract.id === id, contract),
          status: "received"
        })))
      )
    ));
  }

  @Action(Sign)
  sign({ setState }: Context, { contractId }: Sign) {
    setState(patch<Model>({ status: "updating" }));

    return this.rest.sign(contractId).pipe(
      tap(c => setState(patch({ contracts: updateItem(({ id }) => id === c.id, c) }))),
      tap(() => setState(patch<Model>({ status: "received" })))
    );
  }

  @Action(Rollback)
  rollback({ setState }: Context, { }: Rollback) {
    setState(patch<Model>({ status: "updating" }));
    // @TODO: implement method
  }

  @Action(Upload) upload({ setState }: Context, { requestId, contractId, file, comment }: Upload) {
    return this.rest.upload(requestId, contractId, file, comment);
  }

  @Action(Download) download({ setState }: Context, { requestId, contractId }: Download) {
    return this.rest.download(requestId, contractId).pipe(tap(data => saveAs(data, 'Договор.docx')));
  }

}
