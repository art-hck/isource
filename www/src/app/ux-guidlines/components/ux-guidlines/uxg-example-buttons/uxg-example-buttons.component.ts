import { Component } from '@angular/core';

@Component({
  selector: 'uxg-example-buttons',
  templateUrl: './uxg-example-buttons.component.html'
})
export class UxgExampleButtonsComponent {
  readonly example1 = `<button uxgButton primary>Primary button</button>
<button uxgButton primary icon>
  <clr-icon shape="app-message" size="16" class="is-solid"></clr-icon>
</button>
<button uxgButton primary icon-text>
  <clr-icon shape="app-trash" size="16" class="is-solid"></clr-icon>
  <span>Удалить</span>
</button>
<button uxgButton primary disabled>Primary disabled</button>
<button uxgButton secondary>Secondary button</button>
<button uxgButton secondary disabled>Secondary disabled</button>
<button uxgButton outline>Outline button</button>
<button uxgButton outline disabled>Outline disabled</button>
<button uxgButton link>Link button</button>`;

  readonly example2 = `<button uxgButton primary lg>L Primary button</button>
<button uxgButton primary lg icon><clr-icon shape="app-message" size="16" class="is-solid"></clr-icon></button>
<button uxgButton primary lg icon-text>
  <clr-icon shape="app-trash" size="16" class="is-solid"></clr-icon>
  <span>Удалить</span>
</button>
<button uxgButton secondary lg>L Secondary button</button>
<button uxgButton outline lg>L Outline button</button>
<button uxgButton link lg >L Link button</button>`;

  readonly example3 = `<div class="app-btn-group">
  <button uxgButton outline>Create</button>
  <button uxgButton outline>Read</button>
  <button uxgButton outline>Update</button>
  <button uxgButton outline>Delete</button>
</div>
<div class="app-btn-group">
  <button uxgButton outline lg>Create</button>
  <button uxgButton outline lg>Read</button>
  <button uxgButton outline lg>Update</button>
  <button uxgButton outline lg>Delete</button>
</div>
<div class="app-btn-group">
  <button uxgButton primary lg>Create</button>
  <button uxgButton primary lg>Read</button>
  <button uxgButton primary lg>Update</button>
  <button uxgButton primary lg>Delete</button>
</div>`;
}
