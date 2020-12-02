import { Component, Input, OnInit } from '@angular/core';
import { DashboardTaskItem } from "../../models/dashboard-task-item";

@Component({
  selector: 'app-tasks-bar',
  templateUrl: './tasks-bar.component.html',
  styleUrls: ['./tasks-bar.component.scss']
})
export class TasksBarComponent implements OnInit {
  @Input() totalCounter: number;
  @Input() tasksBar: DashboardTaskItem[];

  folded = false;

  constructor() { }

  ngOnInit(): void {
  }

}
