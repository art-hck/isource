import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RequestDocument } from "../../../common/models/request-document";

@Component({
  selector: 'proposal-form-documents',
  templateUrl: 'proposal-form-documents.component.html',
  styleUrls: ['proposal-form-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProposalFormDocumentsComponent {
  @Input() documents: RequestDocument[];
  @Input() files: File[];
  @Input() disabled: boolean;
  @Output() select = new EventEmitter<File[]>();
  @Output() remove = new EventEmitter<number>();
}
