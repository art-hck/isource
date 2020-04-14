import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StateStatus } from "../../../../request/common/models/state-status";
import { ItemsDictionaryState } from "../../states/items-dictionary.state";
import { ItemsDictionaryActions } from "../../actions/items-dictionary.actions";
import Search = ItemsDictionaryActions.Search;
import { FormControl } from "@angular/forms";
import { KimDictionaryItem } from "../../../common/models/kim-dictionary-item";
import { ActivatedRoute, Router } from "@angular/router";
import Clear = ItemsDictionaryActions.Clear;

@Component({
  selector: 'app-items-dictionary',
  templateUrl: './items-dictionary.component.html',
  styleUrls: ['./items-dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsDictionaryComponent implements OnInit {
  @Select(ItemsDictionaryState.itemsDictionary) itemsDictionary$: Observable<KimDictionaryItem[]>;
  @Select(ItemsDictionaryState.status) status$: Observable<StateStatus>;
  searchText = new FormControl();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(({query}) => {
      if (query) {
        this.onSearch(query);
      } else {
        this.store.dispatch(new Clear());
      }
    );
  }

  onSearch(searchText: string) {
    return this.store.dispatch(new Search(searchText));
  }
}
