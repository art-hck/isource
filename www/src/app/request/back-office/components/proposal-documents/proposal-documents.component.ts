import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestDocument } from "../../../common/models/request-document";

@Component({
  selector: 'proposal-documents',
  templateUrl: 'proposal-documents.component.html',
  styleUrls: ['proposal-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProposalDocumentsComponent {
  @Input() documents: RequestDocument[];
  @Input() files: File[];
  @Input() disabled: boolean;
  @Output() select = new EventEmitter<File[]>();
  @Output() remove = new EventEmitter<number>();
}
