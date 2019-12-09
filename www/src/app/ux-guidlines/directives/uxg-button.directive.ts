import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[uxgButton], [uxgButton][lg], [uxgButton][primary], ' +
    '[uxgButton][secondary], [uxgButton][outline], [uxgButton][link], ' +
    '[uxgButton][icon], [uxgButton][icon-text], [uxgButton][clear]'
})
export class UxgButtonDirective {

  @Input() lg: boolean | string;
  @Input() primary: boolean | string;
  @Input() secondary: boolean | string;
  @Input() outline: boolean | string;
  @Input() link: boolean | string;
  @Input() icon: boolean | string;
  @Input('icon-text') iconText: boolean | string;
  @Input() clear: boolean | string;

  @HostBinding('class.app-btn') buttonClass = true;
  @HostBinding('class.app-btn-large') get isLarge() { return this.is(this.lg); }
  @HostBinding('class.app-btn-primary') get isPrimary() { return this.is(this.primary); }
  @HostBinding('class.app-btn-secondary') get isSecondary() { return this.is(this.secondary); }
  @HostBinding('class.app-btn-outline') get isOutline() { return this.is(this.outline); }
  @HostBinding('class.app-btn-link') get isLink() { return this.is(this.link); }
  @HostBinding('class.app-btn-icon') get isIcon() { return this.is(this.icon); }
  @HostBinding('class.app-btn-icon-text') get isIconText() { return this.is(this.iconText); }
  @HostBinding('class.app-btn-clear') get isClear() { return this.is(this.clear); }

  private is = (prop?: boolean | string) => prop !== undefined && prop !== false;
}
