import { Component } from '@angular/core';
import { UxgIconShapesSources } from "uxg";

@Component({
  selector: 'uxg-example-icons',
  templateUrl: './uxg-example-icons.component.html',
  styleUrls: ['./uxg-example-icons.component.scss']
})
export class UxgExampleIconsComponent {
  shapes = UxgIconShapesSources.map(item => Object.keys(item)[0]);
  ctx = { $implicit: "" };

  getExmample(shape: string) {
    let example = `<clr-icon shape="${shape}"></clr-icon>`;

    if (this.hasSolid(shape)) {
      example += `\n<clr-icon shape="${shape}" class="is-solid"></clr-icon>`;
    }
    return example;
  }

  hasSolid(shape: string): boolean {
    return this.getSvgDoc(shape).documentElement.classList.contains("has-solid");
  }

  getDefaultSize(shape) {
    const doc = this.getSvgDoc(shape);
    return doc.documentElement.attributes.getNamedItem("viewBox").value.split(" ").pop();
  }

  private getSvgDoc(shape: string): Document {
    const SVG = Object.values(UxgIconShapesSources.find(item => Object.keys(item)[0] === shape))[0];
    const parser = new DOMParser();

    return parser.parseFromString(SVG, "image/svg+xml");
  }
}
