import {Uuid} from "../../cart/models/uuid";

export interface PurchaseItem {
    id: Uuid;
    title: string;
    quantity: number;
    isMainItem?: boolean;
}
