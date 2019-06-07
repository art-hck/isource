# Управление angular с помощью forever

Управление осуществляется из docker-контейнера:

```bash
docker attach $ANGULAR_CONTAINER_NAME
```

Список запущенных приложений:

```bash
forever list
```

Из списка запущенных приложений надо смотреть номер приложения для команд остановки и просмотра вывода.

Остановка:

```bash
forever stop 0
```

Запуск:

```bash
forever start --workingDir /home/www /usr/local/bin/ng serve --host 0.0.0.0
```

Вывод из консоли от запущенного сервера разработки angular:

```bash
forever logs 0
```