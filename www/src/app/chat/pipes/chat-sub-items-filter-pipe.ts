import { Pipe, PipeTransform } from '@angular/core';
import { ChatSubItem } from "../models/chat-item";

@Pipe({name: 'subItemsFilter'})
export class ChatSubItemsFilterPipe implements PipeTransform {
  transform(subItems: ChatSubItem[], q: string) {
    return subItems.filter(item => item.position.name.toLowerCase().indexOf(q?.toLowerCase()) > -1 || !q);
  }
}
