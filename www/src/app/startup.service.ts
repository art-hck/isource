import { AuthService, AvailableGuiService } from 'stdlib-ng/dist/core';
import { Injectable } from "@angular/core";
import { interval } from "rxjs/internal/observable/interval";
import { UserInfoService } from "./core/services/user-info.service";

/**
 * Сервис для инициации приложения
 */
@Injectable()
export class StartupService {

  constructor(
    private authService: AuthService,
    private gui: AvailableGuiService,
    private user: UserInfoService
  ) {
  }

  /**
   * Загружает начальные данные для нашего приложения.
   * Сначала посылает запрос на авторизацию,
   * после авторизации посылает запрос на доступные gui
   * @returns {Promise<any>}
   */
  load() {
    /*//  каждые 5 минут рефрешим токен
    interval(1000 * 60 * 5).subscribe(() => {
      this.authService.refreshToken().subscribe(
        (data) => {
          this.user.saveData(data);
        }
      );
    });

    return this.authService
      .attemptAuth()
      .toPromise()
      .then((data) => {
        this.user.saveData(data);
        // после авторизация запрашиваем доступные ресурсы
        return this.getGuiRequestPromise();
      })
      // если не успешно получение доступных ресурсов
      .catch(() => {
        console.error('Get available resources was not successful');
      });*/
  }
}
