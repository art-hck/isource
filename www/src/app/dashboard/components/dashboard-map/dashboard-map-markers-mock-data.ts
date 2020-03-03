import { DashboardMapMarkerData } from "../../models/dashboard-map-marker-data";

export const markersMockData: DashboardMapMarkerData[] = [
  {
    title: "Ивановский кабельный завод",
    address: "Россия, Иваново ул. Калашникова 28Д",
    progress: 57
  },
  {
    title: "Аспект РУ",
    address: "Орск, Металлистов 11",
    progress: 74
  },
  {
    title: "ОАО «ПП ЗСД»",
    address: "Дзержинск, Нижегородское шоссе 2 к1",
    progress: 100
  },
  {
    title: "ООО «Норильск пром»",
    address: "Ленинский проспект, 16 Норильск",
    progress: 18
  },
  {
    title: "Кольская-7",
    address: "Новосибирск, Бердское шоссе 61 к2",
    progress: 12
  },
  {
    title: "Соликамск",
    address: "Соликамск, Всеобуча 162",
    progress: 72
  },
  {
    title: "Пермь",
    address: "улица Вайнера, 9 Екатеринбург",
    progress: 35,
    contragents: [{
      address: "улица Ленина, 66А Пермь, Россия"
    }]
  },
  {
    title: "Эвенкийский",
    address: "Эвенкийский район Красноярский край, Россия",
    progress: 24
  },
  {
    title: "Северо-Енисейский",
    address: "Северо-Енисейский район Красноярский край, Россия",
    progress: 63
  },
  {
    title: "ООО СУРГУТ_НЕФТЕМАШ",
    address: " проспект. Ленина, 46, Сургут",
    progress: 87
  },
];
