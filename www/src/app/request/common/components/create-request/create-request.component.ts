import { Component, OnInit } from '@angular/core';
import { CreateRequestService } from "../../services/create-request.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  constructor(
    private createRequestService: CreateRequestService,
    protected router: Router
  ) {
  }

  ngOnInit() {
  }

  onAddRequest(formData: any) {
    return this.createRequestService.addRequest(formData['itemForm']).subscribe(
      (data: any) => {
        this.router.navigateByUrl(`requests/customer/${data.id}`);
      }
    );
  }

  onSendExcelFile(files: File[]): void {
    this.createRequestService.addRequestFromExcel(files).subscribe((data: any) => {
      this.router.navigateByUrl(`requests/customer/${data.id}`);
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
  }
}
