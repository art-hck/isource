import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators';
import { TokenService } from '@stdlib-ng/core';
import { UserInfoService } from "./user-info.service";
import { APP_CONFIG } from '@stdlib-ng/core';
import { GpnmarketConfigInterface } from '../config/gpnmarket-config.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  appConfig: GpnmarketConfigInterface;

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
   * Делает логин на хабе по логину и паролю.
   * После успешной авторизации сохраняет токены в хранилище.
   * Использует CORS запрос. Благадоря ему на хабе проставляются куки и срабатывает кросдоменная авторизация.
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
        'username': login ? login.toLowerCase() : '',
        'password': password || ''
      };
    return this.http.post<any>('oauth', params, options)
      .pipe(
        tap(data => {
          this.token.saveToken(data.access_token, data.token_type);
        })
      );
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
        this.token.signOut();
      })
    );
  }

  isAuth(): boolean {
    return !!this.token.getToken();
  }
}
