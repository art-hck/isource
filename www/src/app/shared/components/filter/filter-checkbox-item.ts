export class FilterCheckboxItem<V = unknown, I = unknown> {
  value: V;
  item?: I;
  label?: string | number;
  hideFolded?: boolean;
}

export type FilterCheckboxList<V = unknown, I = unknown> = FilterCheckboxItem<V, I>[];
