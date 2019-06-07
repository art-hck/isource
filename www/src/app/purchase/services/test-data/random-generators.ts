/**
 * Модуль тестовых данных
 *
 * TODO: 2018-10-08 После создания бека удалить этот модуль
 */

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomUniqKeys(count: number, min: number, max: number): number[] {
  const res = [];
  while (res.length < count) {
    const value = getRandomInt(min, max);
    if (res.indexOf(value) < 0) {
      res.push(value);
    }
  }
  return res;
}

export function getRandomId(): string {
  const length = 32;
  const values = [];
  const separators = [8, 12, 16, 20];
  for (let i = 0; i < length; i++) {
    values.push(getRandomInt(0, 9));
  }
  separators.forEach((index) => {
    values.splice(index, 0, '-');
  });
  return values.join('');
}

export function getRandomBoolean(): boolean {
  const random = Math.random();
  return random > 0.5;
}

export function getRandomDate(min: Date, max: Date): Date {
  const minTimestamp = min.getTime();
  const maxTimestamp = max.getTime();
  const randTimestamp = getRandomInt(minTimestamp, maxTimestamp);
  const date = new Date();
  date.setTime(randTimestamp);
  return date;
}
