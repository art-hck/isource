import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ClrLoadingState } from "@clr/angular";

@Component({
  selector: 'app-restore-password-by-code',
  templateUrl: './restore-password-by-code.component.html',
  styleUrls: ['./restore-password-by-code.component.scss']
})
export class RestorePasswordByCodeComponent implements OnInit {
  code: string;
  form = new FormGroup({
    code: new FormControl(null),
    password: new FormControl(""),
  });
  loadingState: ClrLoadingState;
  clrLoadingState = ClrLoadingState;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;
    if (this.code) {
      this.form.get("code").setValue(this.code);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const {password, code} = this.form.value;
    this.loadingState = ClrLoadingState.LOADING;
    this.authService.changePasswordByCode(password, code).subscribe(
      () => this.loadingState = ClrLoadingState.SUCCESS,
      () => this.loadingState = ClrLoadingState.ERROR,
    );
  }
}
