import { Component, OnInit } from '@angular/core';
import { EmployeesService } from "../../services/employees.service";
import { EmployeeList } from "../../models/employee-list";
import { Observable } from "rxjs";
import { DatagridStateAndFilter } from "../../../../../common/models/datagrid-state-and-filter";

@Component({
  selector: 'app-employee-list-view',
  templateUrl: './employee-list-view.component.html',
  styleUrls: ['./employee-list-view.component.css']
})
export class EmployeeListViewComponent implements OnInit {

  currentDatagridState: DatagridStateAndFilter;

  employees$: Observable<EmployeeList[]>;


  employees = {
    purchasers: [
      {
        id: '1',
        name: 'Иванов Семен Евгеньевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Иванов Семен Евгеньевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Иванов Семен Евгеньевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Иванов Семен Евгеньевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
    ],
    managers: [
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
      {
        id: '1',
        name: 'Андреев Алексей Сергеевич',
        email: 'ivanov.semen@email.ru',
        phone: '+ 7 923 123 45 67',
        requestsCount: 12,
        positionsCount: 567,
      },
    ],
  };

  purchasersCount: number;
  managersCount: number;

  constructor(
    protected employeesService: EmployeesService
  ) { }

  ngOnInit() {
    this.getEmployeeList('purchasers');

    this.purchasersCount = this.employees.purchasers.length;
    this.managersCount = this.employees.managers.length;
  }

  getEmployeeList(type): EmployeeList[] {
    // this.staff$ = this.employeesService.getStaffList();
    return this.employees[type];
  }

}
