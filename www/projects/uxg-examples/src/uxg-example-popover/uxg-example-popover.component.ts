import { Component } from '@angular/core';
import { UxgPopoverContentDirection } from "uxg";

@Component({
  selector: 'uxg-example-popover',
  templateUrl: './uxg-example-popover.component.html'
})
export class UxgExamplePopoverComponent {

  dir = UxgPopoverContentDirection;
  readonly example = `<uxg-popover #popoverRef>
  <button uxgButton icon primary (click)="popoverRef.show()">
    <clr-icon shape="user"></clr-icon>
  </button>
  <div *uxgPopoverContent>Sample text</div>
</uxg-popover>`;
}
