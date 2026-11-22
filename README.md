# DefHat: лендінг

Односторінковий сайт на [Astro](https://astro.build) з українською (`/uk/`) та англійською (`/en/`) версіями.

## Запуск

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # статичний сайт у dist/
```

## Структура

| Що | Де |
|---|---|
| Усі тексти (UA / EN) | `src/content/uk.json`, `src/content/en.json` |
| Секції сторінки | `src/components/*.astro` |
| Кольори, шрифти, кнопки | `src/styles/global.css` (змінні в `:root`) |
| Логотип (вектор) | `src/brand.ts` (контури шолома та напису, відтворені з `src/assets/brand/defhat-logo-original.png`) |
| Фавікони та `og.png` | генеруються з вектора командою `npm run brand` |
| Шрифти | Geologica (текст і заголовки), Martian Mono (технічні підписи), через Google Fonts у `src/layouts/Base.astro` |
| Блок «Підхід» | `src/components/Showcase.astro`: фото радіотелескопа (Donald Giannatti, Unsplash) і поверх нього контур шолома. Альтернативне хвилясте зображення лежить у `public/approach-*.webp` |
| Палітра | змінні в `:root` у `src/styles/global.css`, акценти взято із зображення «Підходу» |
| Політика приватності | `src/pages/[lang]/privacy.astro` + тексти в JSON |

Щоб змінити тексти, напрями експертизи, кроки чи типи задач, відредагуйте JSON-файли. Структура обох мов однакова. JSON-файли можна напряму підключити до Git-based CMS (Decap CMS або TinaCMS), і тоді замовник редагуватиме тексти через адмінку.

## Форма

Форма надсилає JSON на `PUBLIC_FORM_ENDPOINT`. За замовчуванням вона сумісна з Web3Forms (`access_key`), але підійде будь-який сервіс, що приймає JSON.

```bash
cp .env.example .env
# PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
# PUBLIC_FORM_ACCESS_KEY=<ключ, прив'язаний до email замовника>
```

- Обов'язкові поля перевіряються на клієнті: ім'я, email і опис від 10 символів.
- Захист від спаму: приховане поле-пастка та мінімальний час заповнення 3 с.
- Якщо endpoint не задано, у `npm run dev` надсилання лише імітується (payload з'являється в консолі браузера). У зібраній версії без endpoint форма покаже помилку.

## Що потрібно від замовника

- Офіційний SVG логотипу, якщо він є. Поточний вектор відтворено з PNG.
- Погоджені фінальні тексти. Поточні тексти є чернеткою за ТЗ, без назв клієнтів, партнерів і проєктів.
- Адреса, на яку мають приходити заявки, для ключа форми.

## Публікація на GitHub Pages

Сайт: https://anyanesterenko.github.io/defhat/

```bash
npm run deploy
```

Скрипт збирає сайт і викладає `dist/` у гілку `gh-pages`. Для власного домену збирати з
`SITE_URL=https://www.defencehat.com BASE_PATH=/` (див. `astro.config.mjs`).
