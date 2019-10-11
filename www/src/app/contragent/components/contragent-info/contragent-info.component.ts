import { Component, Input } from '@angular/core';
import { ContragentInfo } from "../../models/contragent-info";

@Component({
  selector: 'app-contragent-info',
  templateUrl: './contragent-info.component.html',
  styleUrls: ['./contragent-info.component.scss']
})
export class ContragentInfoComponent {

  @Input() contragent: ContragentInfo;

}
