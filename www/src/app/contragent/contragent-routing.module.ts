import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContragentListViewComponent } from "./components/contragent-list-view/contragent-list-view.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: ContragentListViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContragentRoutingModule {
}
