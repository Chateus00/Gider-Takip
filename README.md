# Gider Takip

Mail analizi odakli abonelik takip uygulamasi.

## Yerel Calistirma

```bash
npm.cmd install
npm.cmd run dev
```

Uygulama varsayilan olarak `http://localhost:5173` adresinde acilir.

## Ortam Degiskenleri

`.env.local` icine su alanlari ekleyebilirsin:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

Notlar:

- Yerelde `VITE_API_BASE_URL` bos birakilabilir. Bu durumda Vite proxy ile `http://localhost:3001` kullanilir.
- `VITE_API_BASE_URL` doluysa frontend API isteklerini dogrudan o adrese yollar.

## Vercel + Render Deploy

### Vercel

- Repo'yu Vercel'e import et
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_BASE_URL` = Render servis URL'in

### Render

- Repo'yu Render'a bagla
- `render.yaml` dosyasi otomatik ayari yapar
- Elle girmen gerekirse:
  - Build Command: `npm install`
  - Start Command: `npm run server:start`
- Environment variables:
  - `CORS_ORIGIN` = Vercel domain'in
  - `AI_API_KEY` = opsiyonel

## OAuth Guncellemesi

Canliya ciktiktan sonra su yerleri yeni domain ile guncelle:

- Supabase `Site URL`
- Supabase `Redirect URLs`
- Google OAuth `Authorized JavaScript origins`
- Google OAuth `Test users` veya publish ayarlari
