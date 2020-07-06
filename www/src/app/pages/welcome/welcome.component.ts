import { Component, OnInit } from '@angular/core';
import { UserInfoService } from "../../user/service/user-info.service";
import { Router } from "@angular/router";
import { FeatureService } from "../../core/services/feature.service";
import { AuthService } from "../../auth/services/auth.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private featureService: FeatureService,
    private user: UserInfoService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.saveAuthUserData().subscribe(() => {
      if (this.user.isCustomer()) {
        const url = this.featureService.authorize("dashboard") ? "/dashboard" : "/requests/customer";
        this.router.navigateByUrl(url);
      } else if (this.user.isBackOffice()) {
        this.router.navigateByUrl("/agreements/backoffice");
      }
    });
  }

}
