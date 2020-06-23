import { Component, OnInit } from '@angular/core';
import { UserInfoService } from "../../user/service/user-info.service";
import { Router } from "@angular/router";
import { FeatureService } from "../../core/services/feature.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private featureService: FeatureService,
    private user: UserInfoService,
    private router: Router,
    ) {

    if (this.user.isCustomer()) {
      const url = this.featureService.authorize("dashboard") ? "/dashboard" : "/requests/customer";
      this.router.navigateByUrl(url);
    } else if (this.user.isBackOffice()) {
      this.router.navigateByUrl("/agreements/backoffice");
    }
  }

  ngOnInit(): void {
  }

}
