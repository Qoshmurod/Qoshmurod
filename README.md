# Klinika veb-sayti

Klinikaning ochiq veb-sayti: bosh sahifa, "Biz haqimizda", yangiliklar/maqolalar va aloqa. 4 tilda: o‘zbek, rus, ingliz, turk.

Saytning hamma ma'lumoti **Clinika** dasturidan olinadi, saytning o‘zida admin panel yo‘q:

| Saytdagi narsa | Clinika'da qayerdan boshqariladi |
|---|---|
| Yangiliklar va maqolalar (muqova rasmi, qoralama/chop etish) | **Veb-sayt → Yangiliklar va maqolalar** |
| Bosh sahifa sarlavhasi, matni, "Biz haqimizda" | **Veb-sayt → Sayt matnlari** |
| Klinika nomi, logo, telefon, manzil, ish vaqti | **Sozlamalar** |
| Telegram va Instagram | **Sozlamalar → Kontakt panel** |

"Veb-sayt" bo‘limini super admin va `WEBSITE_MANAGE` ruxsati bor xodim ko‘radi.

## Qanday ishlaydi

```
Brauzer → nginx (klinika.uz) → website (Nuxt, SSR) → Clinika backend (/api/v1/website/*)
```

- Sahifalar serverda tayyorlanadi (SSR), Google ularni to‘liq o‘qiydi: `sitemap.xml`, `robots.txt`, har til uchun `hreflang` havolalari, Telegram/Facebook uchun preview rasmlari bor.
- Brauzer Clinika API'siga to‘g‘ridan-to‘g‘ri murojaat qilmaydi: hamma so‘rov sayt serveri orqali o‘tadi (`server/` papkasi). Shuning uchun Clinika'da CORS sozlash kerak emas.
- Sayt faqat ochiq ma'lumotni oladi: chop etilgan maqolalar va klinika aloqa ma'lumotlari. Bemorlar, to‘lovlar, xodimlar saytga hech qachon chiqmaydi.
- Havolalar: `/` (o‘zbekcha), `/uz-cyrl` (o‘zbekcha kirill, o‘zbekcha matndan avtomatik), `/ru`, `/en`, `/tr`; yangiliklar `/news`, maqola `/news/<havola>`.
- Yangiliklar: bosh sahifada eng so‘nggisi katta qilib chiqadi; `/news` da qidiruv (kirill yoki lotin harfida yozsa ham topadi), maqolada o‘qish vaqti, Telegram/Facebook/WhatsApp'da ulashish va "Boshqa yangiliklar".
- RSS: `/feed/uz.xml`, `/feed/ru.xml` … — Telegram kanaliga avtomatik post qiluvchi botlar va yangilik o‘quvchilar uchun.
- Sayt chop etilgan maqolalar ro‘yxatini 1 daqiqa xotirada saqlaydi: Clinika'da chop etilgan maqola saytda ko‘pi bilan 1 daqiqada chiqadi.

## Serverga o‘rnatish (Clinika bilan bir serverda)

Clinika allaqachon `docker compose` bilan ishlab turgan bo‘lishi kerak: sayt uning Docker tarmog‘iga ulanadi.

```bash
git clone https://github.com/Qoshmurod/Qoshmurod.git clinika-website && cd clinika-website
cp .env.example .env    # NUXT_PUBLIC_SITE_URL ga domeningizni yozing
docker compose up -d --build
```

`.env` dagi sozlamalar:

| O‘zgaruvchi | Ma'nosi | Default |
|---|---|---|
| `NUXT_BACKEND_URL` | Clinika API manzili (konteyner ichidan) | `http://backend:4000/api/v1` |
| `NUXT_PUBLIC_SITE_URL` | Saytning ochiq manzili | `http://localhost:3001` |
| `CLINIKA_NETWORK` | Clinika Docker tarmog‘i: `<COMPOSE_PROJECT_NAME>_default` | `shifoxona_default` |
| `WEBSITE_PORT`, `WEBSITE_BIND` | Sayt tinglaydigan port | `127.0.0.1:3001` |

So‘ng nginx'da domenni saytga yo‘naltiring: namuna `deploy/nginx-website.conf` da. HTTPS uchun:

```bash
sudo certbot --nginx -d klinika.uz -d www.klinika.uz
```

Odatiy bo‘linish: `klinika.uz` → sayt, `app.klinika.uz` → Clinika dasturi.

## Lokal ishga tushirish

Node.js 22+ va ishlab turgan Clinika backend kerak (`http://localhost:4000`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Boshqa backend manzili bo‘lsa: `NUXT_BACKEND_URL=http://... npm run dev`.

## Tekshiruvlar

```bash
npm test           # matn formati, havolalar va sanalar uchun testlar
npm run typecheck
npm run build
```

## Maqola matni formati

Clinika'da maqola yozishda:

- bo‘sh qator — yangi xatboshi;
- `## ` bilan boshlangan qator — kichik sarlavha;
- `- ` bilan boshlangan qatorlar — ro‘yxat.

Matn saytda oddiy matn sifatida chiqadi (HTML ishlamaydi), shuning uchun maqola orqali saytga zararli kod qo‘shib bo‘lmaydi.

## Tuzilishi

```
app/
  pages/            index.vue, news/index.vue, news/[slug].vue
  components/       SiteHeader, SiteFooter, ArticleCard, ArticleBody, LangSwitcher …
  composables/      useSite (klinika ma'lumoti), useFormatDate
  assets/css/       Tailwind CSS v4 + Nuxt UI (Clinika dasturi bilan bir xil mavzu, app.config.ts)
server/
  api/              /api/info, /api/articles, /api/articles/:slug — Clinika API'ga proksi
  routes/           /media/logo, /media/cover/:id, sitemap.xml, robots.txt
shared/utils/       matn formati, havolalar, sanalar (server va brauzer uchun umumiy)
i18n/locales/       uz, ru, en, tr tarjimalari
tests/              node:test testlari
```
