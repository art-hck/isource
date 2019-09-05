import { ClrDatagridComparatorInterface } from "@clr/angular";

export class DatagridStateAndFilter<T = any> {
  startFrom: number;
  pageSize: number;
  filters?: object;
  sort?:  {
    by?: string | ClrDatagridComparatorInterface<T>;
    reverse: boolean;
  };
}
