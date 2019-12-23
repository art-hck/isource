import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { APP_CONFIG, TokenService } from '@stdlib-ng/core';
import { UserInfoService } from "../../user/service/user-info.service";
import { GpnmarketConfigInterface } from '../../core/config/gpnmarket-config.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  appConfig: GpnmarketConfigInterface;
  onLogin = new Subject();
  onLogout = new Subject();

  constructor(
      private http: HttpClient,
      private token: TokenService,
      private userInfoService: UserInfoService,
      @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface
  ) {
    this.appConfig = appConfig;
  }

  attemptAuth(): Observable<any> {
    const
      options = {
        withCredentials: true
      },
      params = {
        'client_id': this.appConfig.clientId,
        'grant_type': 'implicit_cookies'
      };
    return this.http.post('oauth', params, options)
      .pipe(
        tap(data => {
          this.token.saveToken(data.access_token, data.token_type);
        })
      );
  }

  /**
   * Делает логин по логину и паролю.
   * После успешной авторизации сохраняет токены в хранилище.
   *
   * @param login
   * @param password
   */
  login(login: string, password: string): Observable<any> {
    const
      options = {
        withCredentials: true
      },
      params = {
        'client_id': this.appConfig.clientId,
        'grant_type': 'password',
        'username': login.toLowerCase(),
        'password': password
      };
    return this.http.post<any>('oauth', params, options)
      .pipe(tap(data => this.token.saveToken(data.access_token, data.token_type)));
  }

  saveAuthUserData(): Observable<any> {
    const
      options = {
        withCredentials: true
      };
    return this.http.get<any>('auth-user-data', options)
      .pipe(
        tap(data => {
          this.userInfoService.saveData(data);
          this.onLogin.next();
        })
      );
  }

  /**
   * Функция рефрешит токен.
   */
  refreshToken(): Observable<any> {
    return this.attemptAuth();
  }

  logout(): Observable<any> {
    return this.http.post('logout', {}).pipe(
      tap(() => {
        this.onLogout.next();
        this.token.signOut();
      })
    );
  }

  isAuth(): boolean {
    return !!this.token.getToken();
  }

  requestPasswordRecover(email: string) {
    const url = `request-password-recover`;
    return this.http.post<null>(url, { email });
  }

  changePasswordByCode(password: string, code: string) {
    const url = `change-password-by-code`;
    return this.http.post<null>(url, { password, code });
  }

  activateAccount(activationCode: string) {
    const url = `activation/${activationCode}`;
    return this.http.post<null>(url, null);
  }

  resendActivationLink(activationCode: string) {
    const url = `activation/resend/${activationCode}`;
    return this.http.post<null>(url, null);
  }

}
