import { AfterViewInit, Component, ContentChild, Directive, ElementRef, Input, QueryList, TemplateRef, ViewChildren } from "@angular/core";

@Directive({ selector: '[uxgTreeNode]' })
export class UxgTreeNodeDirective {}

@Directive({ selector: '[uxgTreeNodeWrap]' })
export class UxgTreeWrapDirective {}

@Component({
  selector: 'uxg-tree',
  templateUrl: './uxg-tree.component.html'
})
export class UxgTreeComponent implements AfterViewInit {
  @ContentChild(UxgTreeWrapDirective, {static: false, read: TemplateRef}) wrapTpl: TemplateRef<any>;
  @ContentChild(UxgTreeNodeDirective, {static: false, read: TemplateRef}) nodeTpl: TemplateRef<any>;
  @ViewChildren("wrapRef") wraps: QueryList<ElementRef>;
  @ViewChildren("nodeRef") nodes: QueryList<ElementRef>;
  @Input() getChildrenFn: (node: any) => any = node => node.children;
  @Input() tree: any[];
  @Input() depth = 0;

  ngAfterViewInit() {
    this.wraps.forEach((wrap, i) => {
      const child = this.nodes.toArray()[i].nativeElement;
      const parent = Array.from<HTMLElement>(wrap.nativeElement.childNodes)
        .find((node: ChildNode) => node.nodeType !== 8);

      child.parentNode.insertBefore(parent, child);

      while (child.hasChildNodes()) {
        parent.appendChild(child.firstChild);
      }

      child.remove();
      wrap.nativeElement.remove();
    });
  }
}
