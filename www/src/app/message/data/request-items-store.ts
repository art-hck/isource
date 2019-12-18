import { RequestPositionList } from 'src/app/request/common/models/request-position-list';
import { RequestGroup } from 'src/app/request/common/models/request-group';
import { RequestPosition } from 'src/app/request/common/models/request-position';

type Item = RequestPositionList | RequestGroup | RequestPosition;
type Items = Item[];

export class RequestItemsStore {

  protected requestItems: Items = [];

  setRequestItems(data: Items): RequestItemsStore {
    this.requestItems = this.cloneItems(data);
    return this;
  }

  getRequestItems(): Items {
    return this.cloneItems(this.requestItems);
  }

  getFiltredRequestItems(filter: string): Items {
    return this.filterPositions(this.requestItems, filter);
  }

  clone(): RequestItemsStore {
    const store = new RequestItemsStore();
    store.setRequestItems(this.cloneItems(this.requestItems));
    return store;
  }

  protected cloneItems(items: Items): Items {
    const clonedItems: Items = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item instanceof RequestGroup) {
        clonedItems.push(this.cloneGroup(item));
      } else if (item instanceof RequestPosition) {
        clonedItems.push(this.clonePosition(item));
      }
    }

    return clonedItems;
  }

  protected cloneGroup(group: RequestGroup): RequestGroup {
    const clonedGroup: RequestGroup = Object.assign(new RequestGroup, group);
    const positions = group.positions;
    const clonedPositions: RequestPosition[] = [];

    for (let i = 0; i < positions.length; i++) {
      const item = positions[i];
      if (!(item instanceof RequestPosition)) {
        continue;
      }
      const position: RequestPosition = item as RequestPosition;
      clonedPositions.push(this.clonePosition(position));
    }

    clonedGroup.positions = clonedPositions;

    return clonedGroup;
  }

  protected clonePosition(position: RequestPosition): RequestPosition {
    return Object.assign(new RequestPosition, position);
  }

  protected filterPositions(items: Items, filter: string): Items {
    let res = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item instanceof RequestPosition && this.checkPositionName(item, filter)) {
        const position = this.clonePosition(item);
        res.push(position);
      } else if (item instanceof RequestGroup) {
        const group = this.filterGroup(item, filter);
        if (group) {
          res.push(group);
        }
      }
    }

    return res;
  }

  protected filterGroup(item: RequestGroup, filter: string): Item|null {
    const checkGroupName = this.checkGroupName(item, filter);
    const filteredPositions = this.filterPositions(item.positions, filter);
    if (this.checkGroupName(item, filter) || filteredPositions.length > 0) {
      const clonedGroup = Object.assign(new RequestGroup, item);
      clonedGroup.positions = filteredPositions as RequestPosition[];
      return clonedGroup;
    }
    return null;
  }

  protected checkPositionName(position: RequestPosition, filter: string): boolean {
    return (position.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }

  protected checkGroupName(group: RequestGroup, filter: string): boolean {
    return (group.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }

}
