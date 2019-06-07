import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private api: HttpClient
  ) {
  }

  ngOnInit() {
  }

  /**
   * Тестовый запрос. Показывает, как работать с apiService
   */
  test(): void {
    this.api
      .post('example', { param1: 'test' })
      .subscribe(
        res => {
          console.log(res);
        }
      );
  }

}
