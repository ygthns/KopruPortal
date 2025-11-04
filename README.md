# KöprüMezun Demo Portal

Frontend-only, bilingual (EN/TR) demo of the KöprüMezun community management platform. Every route is backed by mock data, optimistic workflows, and subtle motion so stakeholders can record walkthroughs or click through features without any backend dependencies.

## Quick Start · English

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open http://localhost:5173 in your browser
4. (Optional) Restore fixtures in DevTools: `window.resetDemoState()`

### Scripts

- `npm run dev` — Vite dev server with MSW mocks enabled
- `npm run build` — Type-check and create the production bundle
- `npm run lint` — ESLint with type information
- `npm run format:write` — Prettier + Tailwind formatting
- `npm run msw:init` — Copies the MSW service worker (already done)

### Mock API & Data

- Mock Service Worker starts automatically in dev and in the production preview bundle (`npm run build && npm run preview`).
- Endpoints live in `src/mocks/handlers.ts`; fixtures and seeds sit in `src/mocks/fixtures/demo-data.ts`.
- Responses intentionally include gentle warnings/latency to mimic real-world systems while never hard-failing.
- Zustand stores plus `localStorage` (`koprumezun.demo`) persist key demo state such as feed posts, club membership, and profile edits.

### Internationalisation

- i18next configuration is in `src/i18n/i18n.ts`; copy lives in `src/i18n/en.json` and `src/i18n/tr.json`.
- Always add new strings to both files using the same key path. Feel free to nest common groups.
- The language toggle (US/🇹🇷) sits inside the top-right quick actions menu and persists in `koprumezun.lang`.

### Theming & Branding

- Theme presets and white-label tokens reside in `src/lib/theme.ts`; Tailwind design tokens are in `tailwind.config.ts`.
- The theme toggle lives in the top-right quick actions dropdown (sun/moon icon) and syncs via `useSettingsStore`.
- Components follow the shadcn/ui pattern with class merging helpers in `src/lib/utils.ts`.

### Recommended Demo Flow (EN)

1. Land directly on the community feed, flip the language toggle, then create a post and reply to a thread to show optimistic toasts.
2. Open Messages to browse seeded direct conversations and send a quick reply.
3. Head to the Member Directory, apply filters (class year, location) and open a profile card.
4. Visit Clubs, join a community, post an update on the club wall, and skim upcoming events for that club.
5. In Mentoring, request a mentor and book a flash mentoring slot to trigger progress updates.
6. Run the Smart Résumé Analyzer in Careers, apply to a role, and review the application tracker.
7. Register for an event, then launch a Zoom/Calendly placeholder from the integrations drawer.
8. Create a new fundraising campaign, make a donation, and note the progress bar update.
9. Claim an offer in the Perks Marketplace and capture the generated coupon code.
10. Update the Profile page by uploading an avatar and editing bio/skills; refresh to confirm persistence.
11. Finish in Integrations by connecting and disconnecting a provider stub.

### Netlify Deployment (English)

1. Create a new Netlify site and connect this repository.
2. Build command: `npm run build`
3. Publish directory: `dist/`
4. Optional env var: `VITE_ENABLE_MSW=true` (forces mocks in production previews)
5. SPA redirects are already configured through `netlify.toml`.

---

## Hızlı Başlangıç · Türkçe

1. Bağımlılıkları yükleyin: `npm install`
2. Geliştirme sunucusunu başlatın: `npm run dev`
3. Tarayıcıda http://localhost:5173 adresini açın
4. (İsteğe bağlı) Demo verisini sıfırlamak için konsolda `window.resetDemoState()` çalıştırın

### Komutlar

- `npm run dev` — MSW mock’larıyla Vite geliştirme sunucusu
- `npm run build` — Tip kontrolü + üretim derlemesi
- `npm run lint` — Tip destekli ESLint kuralları
- `npm run format:write` — Prettier ve Tailwind biçimlendirmesi
- `npm run msw:init` — MSW service worker dosyasını kopyalar (ilk kurulumda çalıştırıldı)

### Sahte API & Veri

- MSW, geliştirme ve üretim önizleme modlarında otomatik olarak başlar (`npm run build && npm run preview`).
- Uç noktalar `src/mocks/handlers.ts`, veri setleri ve senaryolar `src/mocks/fixtures/demo-data.ts` içindedir.
- Yanıtlar, gerçekçi gecikme ve uyarı hissi için zararsız bildirimler döndürür; hiçbir çağrı hatayla sonuçlanmaz.
- Zustand + `localStorage` (`koprumezun.demo`), akış gönderileri, kulüp üyelikleri ve profil düzenlemeleri gibi durumları kalıcı tutar.

### Çok Dilli Yapı

- i18next ayarları `src/i18n/i18n.ts`, metin dosyaları `src/i18n/en.json` ve `src/i18n/tr.json` klasörlerinde.
- Yeni içerik eklerken aynı anahtar yapısını iki dilde de güncelleyin.
- Dil değiştirici üst bardaki hızlı işlemler menüsündedir ve `koprumezun.lang` anahtarında saklanır.

### Tema & Kurumsal Kimlik

- Tema preset’leri ve beyaz etiket değişkenleri `src/lib/theme.ts` içinde, Tailwind teması `tailwind.config.ts` dosyasında tanımlıdır.
- Tema geçişi sağ üstteki hızlı işlemler menüsünde bulunur ve `useSettingsStore` ile kalıcıdır.
- Bileşenler shadcn/ui yaklaşımını takip eder; sınıf birleştirme yardımcıları `src/lib/utils.ts` dosyasındadır.

### Önerilen Demo Akışı (TR)

1. Topluluk akışında dili değiştirin, bir gönderi oluşturup yorumlayarak iyimser bildirimleri gösterin.
2. Mesajlar sekmesinde mevcut sohbetlere göz atın ve hızlı bir yanıt gönderin.
3. Üye Dizini’nde filtreler uygulayıp bir profili açın.
4. Kulüpler sayfasında bir kulübe katılın, kulüp duvarına paylaşım yapın ve kulübe bağlı etkinlikleri inceleyin.
5. Mentorluk merkezinde mentor isteği gönderip hızlı mentorluk oturumu planlayın.
6. Kariyer merkezinde özgeçmiş analizini çalıştırın, bir ilana başvurun ve takip kartını inceleyin.
7. Etkinlikler bölümünde kayıt olun, ardından Zoom/Calendly düzmece bağlantılarını açın.
8. Bağış alanında yeni kampanya oluşturun, bağış yapın ve ilerleme çubuğunun güncellendiğini vurgulayın.
9. Ayrıcalıklar pazarından bir fırsat alın ve oluşturulan kuponu gösterin.
10. Profil sayfasında avatar yükleyip biyografi/becerileri güncelleyin; sayfayı yenileyerek kaydın korunduğunu doğrulayın.
11. Entegrasyonlar sekmesinde bir sağlayıcıyı bağlayıp bağlantıyı kesin.

### Netlify Dağıtımı (Türkçe)

1. Netlify’da yeni bir site açın ve bu depoyu bağlayın.
2. Derleme komutu: `npm run build`
3. Yayın klasörü: `dist/`
4. Opsiyonel ortam değişkeni: `VITE_ENABLE_MSW=true`
5. SPA yönlendirmeleri `netlify.toml` dosyasında tanımlı olduğundan ek ayar gerekmez.

## Project Structure Highlights

```
src/
  components/        // Paylaşılan UI bileşenleri ve düzen parçaları
  features/          // Her rota için özellik modülleri
  mocks/             // MSW uç noktaları ve sabitler
  i18n/              // Dil dosyaları ve yapılandırma
  store/             // Zustand store'ları
  providers/         // Tema, i18n ve demo verisi sağlayıcıları
```

## Notes

- Framer Motion mikro animasyonları hafif ve kesintisiz tutar.
- `window.resetDemoState()` geliştirme sırasında demoyu varsayılan verilere döndürür.
- Büyük JS parçaları Netlify tarafından servis edilir; gerekirse dinamik importlarla boyutu azaltabilirsiniz.
- Tüm statik varlıklar yereldir; dış fontlar için yalnızca gerekli ön bağlantılar kullanılır.
