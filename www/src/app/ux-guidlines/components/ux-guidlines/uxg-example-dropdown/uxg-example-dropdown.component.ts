import { Component } from '@angular/core';

@Component({
  selector: 'uxg-example-dropdown',
  templateUrl: './uxg-example-dropdown.component.html'
})
export class UxgExampleDropdownComponent {
  public showCode = false;
  readonly example = `<uxg-dropdown class="app-dropdown" placeholder="Drop me down...">
  <div uxgDropdownItem>Option 1</div>
  <div uxgDropdownItem value="string">Option with string value</div>
  <div uxgDropdownItem [value]="12">Option int value</div>
  <div uxgDropdownItem disabled>Disabled option</div>
</uxg-dropdown>`;
}
