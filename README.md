# KöprüMezun Demo Portal

Frontend-only, bilingual (EN/TR) demo of the KöprüMezun community management platform. Every route is populated with mock data, lightweight workflows, and subtle animations so stakeholders can record walkthroughs or click through the experience without a backend.

## Quick Start · English

1. Install dependencies: 
pm install
2. Start the dev server: 
pm run dev
3. Visit http://localhost:5173
4. (Optional) Reset demo state in devtools: window.resetDemoState()

### Scripts

- 
pm run dev – Vite dev server with MSW mocks
- 
pm run build – Type-check & production bundle
- 
pm run lint – ESLint type-aware linting
- 
pm run format:write – Prettier with Tailwind plugin
- 
pm run msw:init – Copy service worker (already ran once)

### Mock API & Data

- Mock Service Worker starts automatically in dev and production bundles.
- Endpoints live in src/mocks/handlers.ts; fixtures in src/mocks/fixtures/demo-data.ts.
- Responses include optional benign warnings to mimic real-world latency/noise.
- All mutable state persists via Zustand + localStorage (koprumezun.demo).

### Internationalisation

- Config in src/i18n/i18n.ts, language JSON at src/i18n/en.json & src/i18n/tr.json.
- Add strings to both files using the same key path. Nested objects are encouraged.
- Language toggle persists in localStorage (koprumezun.lang).
- useTranslation and helper useLocale drive page copy.

### Theming & Branding

- Theme presets in src/lib/theme.ts with CSS variable overrides.
- Admin console exposes the presets; selection persists via useSettingsStore.
- Tailwind tokens live in 	ailwind.config.ts; utilities merged with cn() helper.

### Recommended Demo Flow (EN)

1. Landing page hero → highlight bilingual CTA badges.
2. Switch language to Turkish in the navbar.
3. Feed: create a post, add a comment, watch optimistic toast.
4. Groups: join a premium group, observe unlock modal.
5. Mentoring: request mentor & schedule flash session.
6. Careers: run resume analyzer, apply to a role, review tracker.
7. Events: register for hybrid event + open Calendly placeholder.
8. Fundraising: create campaign as admin and donate to existing one.
9. Analytics & Admin: adjust theme preset, export privacy data.
10. Premium perks → Volunteer board → Leaderboards for badges.

### Netlify Deployment (English)

1. Create a new Netlify site, connect the repository.
2. Build command: 
pm run build
3. Publish directory: dist/
4. Environment variable: VITE_ENABLE_MSW=true (optional if you want to force mocks in prod; otherwise MSW auto-enables)
5. Enable SPA redirects (already provided via 
etlify.toml).

---

## Hızlı Başlangıç · Türkçe

1. Bağımlılıkları yükleyin: 
pm install
2. Geliştirme sunucusunu başlatın: 
pm run dev
3. http://localhost:5173 adresini açın
4. (Opsiyonel) Demo verisini sıfırlamak için konsolda window.resetDemoState() çalıştırın

### Komutlar

- 
pm run dev – MSW mock’larıyla geliştirme sunucusu
- 
pm run build – Tip kontrolü + prod derleme
- 
pm run lint – ESLint tip kontrollü kurallar
- 
pm run format:write – Prettier + Tailwind düzeni
- 
pm run msw:init – Service worker kopyalama

### Sahte API & Veri

- MSW hem geliştirme hem de prod paketlerinde otomatik başlar.
- Uç noktalar src/mocks/handlers.ts, veri setleri src/mocks/fixtures/demo-data.ts içinde.
- Yanıtlar, gerçekçi gecikme/uyarı hissi için uyarı metası içerebilir.
- Tüm durum verileri Zustand + localStorage (koprumezun.demo) ile saklanır.

### Çok Dilli Yapı

- Yapılandırma src/i18n/i18n.ts, metin dosyaları src/i18n/en.json ve src/i18n/tr.json altında.
- Aynı anahtar yapısı ile iki dilde içerik ekleyin.
- Dil seçimi navbar’daki düğme ile değişir ve kalıcıdır.

### Tema & Kurumsal Kimlik

- src/lib/theme.ts içindeki preset’ler CSS değişkenlerini günceller.
- Yönetim konsolu temaları gösterir; seçim useSettingsStore ile saklanır.
- Tailwind tema ayarları 	ailwind.config.ts dosyasında.

### Önerilen Demo Akışı (TR)

1. Açılış sayfası → iki dilli CTA ve güven rozetleri.
2. Üst menüden dili Türkçe’ye alın.
3. Akışta paylaşım oluşturun, yorum yapın ve toast bildirimini gözlemleyin.
4. Premium gruba katılın, açılan modal ile erişimi anlatın.
5. Mentorluk merkezinde mentor isteyin ve hızlı seans planlayın.
6. Kariyer merkezinde özgeçmiş analizini çalıştırın, başvuru yapın.
7. Etkinliklere kayıt olun, Calendly/Zoom placeholder’larını açın.
8. Bağış sekmesinde yeni kampanya oluşturup bağış yapın.
9. Analitik ve yönetim sekmesinde tema değiştirin, veriyi dışa aktarın.
10. Ayrıcalıklar, gönüllülük panosu ve rozetli liderlik listesini gösterin.

### Netlify Dağıtımı (Türkçe)

1. Netlify’da yeni site → repoyu bağlayın.
2. Build komutu: 
pm run build
3. Yayın klasörü: dist/
4. Ortam değişkeni (isteğe bağlı): VITE_ENABLE_MSW=true
5. 
etlify.toml içindeki SPA yönlendirmeleri aktif.

## Project Structure Highlights

`
src/
  components/        // Shared UI & layout primitives (shadcn-style)
  features/          // Route-level feature modules
  mocks/             // MSW handlers + fixtures
  i18n/              // Language files & config
  store/             // Zustand stores
  providers/         // App scaffolding (theme, mocks, demo data)
`

## Notes

- Framer Motion powers subtle entrance/hover animations. Keep them fast and non-blocking.
- window.resetDemoState() is available in dev to restore original fixture data.
- Large chunk warning is expected; Netlify handles the static bundle, but you can tweak chunking in ite.config.ts if needed.
- All assets are local; no external fonts beyond Google Fonts preconnect.
