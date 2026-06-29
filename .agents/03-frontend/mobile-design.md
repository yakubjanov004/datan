# Telefon dizayni va mobil ochilish rejasi

Bu hujjat telefon ekranlari uchun frontendni tuzatishdan oldin o'qiladi.
Maqsad: mavjud Datan dizaynini qayta boshidan chizmasdan, telefonlarda ochilish,
navigation, jadval, filter va dashboard ergonomikasini to'g'rilash.

## Avval hal qilinadigan ochilish muammolari

Telefon orqali lokal Wi-Fi'dan tekshirilganda muammo faqat CSS bo'lmasligi mumkin.
Kod yozishdan oldin quyidagilarni tekshir:

1. Frontend `127.0.0.1`ga bind qilingan bo'lsa, telefon LAN orqali kira olmaydi.
   Dev tekshiruv uchun Vite `0.0.0.0` yoki kompyuter LAN IP bilan ishga tushishi kerak.
2. `frontend/vite.config.js` proxy `/api`ni real backend portiga yuborishi kerak.
   Loyiha hujjatlarida va hozirgi backendda odatiy port `8000`.
3. Backend `DJANGO_ALLOWED_HOSTS` va `DJANGO_CORS_ALLOWED_ORIGINS` ichida telefon
   kiradigan host/origin bo'lishi kerak.
4. Telefon URL testida frontend HTML ochilishi va `/api/users/me/` proxy orqali
   401 qaytarishi normal holat hisoblanadi. 502 proxy port noto'g'ri yoki backend
   ishlamayotganini bildiradi.

## Dizaynni boshidan qilmaslik

Mavjud layoutda allaqachon mobil drawer, `table-wrap` horizontal scroll va bir ustunli
grid qoidalari bor. Shuning uchun to'liq redesign qilma.

Optimal yondashuv:

1. `frontend/src/styles/` ichida oxirgi import qilinadigan kichik mobil override
   qatlamini qo'shish yoki mavjud eng oxirgi responsive qatlamga juda aniq qoidalar
   qo'shish.
2. Desktop dizaynni buzmaslik uchun mobil o'zgarishlarni asosan `max-width: 768px`,
   `max-width: 640px` va kerak bo'lsa `max-width: 480px` ichida saqla.
3. Qoidalarni global rang yoki brand tizimini almashtirish uchun ishlatma.
4. Page komponentlarini qayta yozishdan oldin CSS bilan tuzatish mumkinmi tekshir.

## Mobil UX talablari

- Telefonlarda `body` umumiy horizontal scroll bermasin. Keng jadvallar faqat
  o'zining `.table-wrap` ichida scroll qilsin.
- Sidebar telefonlarda drawer bo'lib ochilsin, contentni siqmasin.
- Topbar sticky bo'lishi mumkin, lekin kontentni yopib qo'ymasligi kerak.
- Hamburger har doim ko'rinadigan va bosiladigan bo'lsin.
- `user-chip` telefonlarda joy egallab topbarni sindirmasin; kerak bo'lsa yashirilsin.
- Filterlar, selectlar, search inputlar va pagination bir ustunga tushsin.
- Touch targetlar kamida 40-44px atrofida bo'lsin.
- Telefonlarda pinch zoomni bloklashdan saqlan. Login input zoomini oldini olish uchun
  input font-size 16px bo'lishi kifoya.
- Cards ichidagi matnlar kesilmasin; uzun title va label uchun `min-width: 0`,
  `overflow-wrap: anywhere`, `text-overflow` yoki wrap ishlat.
- Chartlar telefonlarda juda baland yoki juda past bo'lmasin; stabil `height` yoki
  `min-height` ber.
- Jadvalni kartaga aylantirish majburiy emas. Records, batches, audit kabi katta
  jadvallar uchun horizontal scroll qabul qilinadi.

## Ehtiyot joylar

- `frontend/index.html` viewport qatori `maximum-scale=1.0, user-scalable=no`
  ishlatsa, telefon accessibility va jadval ko'rish yomonlashadi.
- `frontend/src/utils/zoomLock.js` touch/pinch zoomni bloklaydi. Telefon dizayn
  vazifasida buni qayta ko'rib chiq.
- `frontend/src/styles/02-base.css` ichida `body { overflow-x: hidden; }` bor.
  Bu umumiy layout overflowni yashiradi, lekin jadval scrollini `.table-wrap`
  ichida saqlash kerak.
- `frontend/src/styles/10-records.css` records table keng va `white-space: nowrap`.
  Uni global qisqartirma; `.table-wrap` scrollini yaxshila.
- `frontend/src/styles/18-sidebar-reference.css` sidebar mobile drawer qoidalarini
  oxirroq override qiladi. Sidebar tuzatishda aynan shu fayl va import tartibini
  hisobga ol.
- `frontend/src/styles/20-dashboard-real.css` v2 dashboard layoutini boshqaradi.
  Dashboard mobil tuzatishlarida `stats-grid-v2-top`, `stats-grid-v2-bottom`,
  `v2-chart-card`, `v2-area-chart`, `v2-bar-chart`, `v2-scatter-chart` ni tekshir.
- `frontend/src/styles/25-operator-dashboard.css` eski/alternativ operator dashboard
  ko'rinishi bo'lishi mumkin. Ishlatilayotganini tekshirmasdan katta o'zgartirma.

## Tekshiruv tartibi

Telefon dizayni patchidan keyin kamida shu viewportlarda tekshir:

- 360x640
- 375x667
- 390x844
- 430x932
- 768x1024

Tekshiriladigan sahifalar:

1. `/login`
2. `/dashboard`
3. `/upload`
4. `/records`
5. `/batches`
6. `/audit`
7. `/operators`
8. `/profile`
9. `/settings`

Har sahifada quyidagilarni ko'r:

- sahifa ochiladimi;
- topbar va sidebar drawer ishlaydimi;
- content viewportdan keng chiqmayaptimi;
- filter/search/selectlar bosiladimi;
- table scroll o'z konteynerida ishlaydimi;
- chart/card matnlari ustma-ust tushmayaptimi;
- modal ochilganda ekran kesilib qolmayaptimi.

## Yakuniy qabul mezoni

Telefon vazifasi yakunlangan deb hisoblanadi, agar:

- LAN orqali frontend va API ishlasa;
- build o'tsa;
- telefon viewportlarda global gorizontal overflow bo'lmasa;
- drawer, topbar, filter, jadval va modal ishlatiladigan bo'lsa;
- desktop layout ko'rinishi buzilmasa.
