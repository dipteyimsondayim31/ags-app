# AGS Bilgi Kartı Uygulaması - Mimari Açıdan Optimize Edilmiş Yol Haritası (roadmap.md)

Bu yol haritası, yazılım mimarisi standartlarına (veri bütünlüğü, güvenli oturum yönetimi ve sürdürülebilir CI/CD süreçleri) uygun olarak gözden geçirilmiş ve optimize edilmiştir.

---

## Mimarın Notları & Optimizasyon Değişiklikleri:
1.  **Veritabanı Tutarlılığı (No Schema Drift):** Yerelde SQLite, canlıda PostgreSQL kullanmak Prisma şemalarında uyumsuzluğa (schema drift) ve migration dosyalarında bozulmalara sebep olur. Bu yüzden hem yerel geliştirme hem de production ortamında **PostgreSQL** standartlaştırılmıştır. Yerel geliştirme için projeye tek komutla PostgreSQL başlatan `docker-compose.yml` eklenecektir.
2.  **Veri Bütünlüğü ve Senkronizasyon (Local Storage Graceful Pruning):** Admin kart sildiğinde adayın tarayıcısındaki (`localStorage`) ilerleme verisinin bozulmaması için, `state.ts` veritabanından gelen güncel kart listesiyle aday geçmişini eşleştirip (pruning) temizleyecek koruyucu bir mekanizma içerecektir.
3.  **Yerleşik CSRF Güvenliği:** Next.js Server Actions yerleşik olarak CSRF korumasına sahiptir. Bu yüzden ek CSRF kütüphaneleri yerine Next.js'in kendi güvenlik altyapısı ve **Zod** ile girdi şema doğrulaması kullanılacaktır.

---

## 📌 FAZ 1: Temel Kurulum ve Çevre Yapılandırması

### 1.1. Next.js & TailwindCSS Kurulumu
- [ ] `./` dizininde Next.js projesini TypeScript ve TailwindCSS destekli olacak şekilde kur.
- [ ] Gereksiz şablon dosyalarını (`app/page.tsx` içindeki varsayılan Next.js içeriklerini, default CSS kurallarını) temizle.
- [ ] Geist veya Outfit fontunu Google Fonts ya da `next/font` üzerinden sisteme entegre et.
- [ ] Obsidian Dark renk paletini (`#090a0f` arka plan, `#12131a` kart rengi, `#a78bfa` neon mor aksanı) Tailwind custom theme olarak ekle.

### 1.2. PostgreSQL Yerel Geliştirme Altyapısı
- [ ] Proje kök dizinine yerel PostgreSQL ayağa kaldıran `docker-compose.yml` dosyasını ekle.
- [ ] `.env.example` dosyasında veritabanı bağlantı şablonunu tanımla.

### 1.3. Prisma ORM ve Veritabanı Kurulumu
- [ ] Prisma paketlerini kur ve `postgresql` provider'lı `prisma/schema.prisma` şemasını oluştur.
- [ ] `Category`, `Card` ve `User` (Admin) modellerini tanımla.
- [ ] `prisma/seed.ts` dosyasını oluştur:
  * 2 test kategorisi (Türkçe, Mevzuat) ekle.
  * 2 test bilgi kartı ekle.
  * Test admin kullanıcısını (şifresi hash'lenmiş olarak) oluştur.
- [ ] Yerel veritabanını ayağa kaldır, tabloları oluştur ve verileri yerleştir (`docker-compose up -d`, `npx prisma db push`, `npx prisma db seed`).

---

## 📌 FAZ 2: Güvenlik Altyapısının Kurulması (NextAuth & Protection)

### 2.1. Kimlik Doğrulama (Auth.js v5) Entegrasyonu
- [ ] `next-auth` paketini projeye dahil et.
- [ ] Credentials Provider kullanarak şifre tabanlı kimlik doğrulama akışını `src/auth.ts` içinde yapılandır.
- [ ] Şifre doğrulamaları için `bcryptjs` veya `argon2` kütüphanesini kullan.

### 2.2. Middleware ve Rota Koruması
- [ ] `src/middleware.ts` dosyasını oluştur.
- [ ] `/admin` altındaki tüm sayfaları (giriş sayfası `/admin/giris` hariç) koruma altına al. Giriş yapmamış kullanıcıları `/admin/giris` sayfasına yönlendir.

### 2.3. Rate Limiting ve API Güvenliği
- [ ] IP bazlı çalışan ve bellek (in-memory) üzerinde istek sayan `/src/lib/rate-limit.ts` mekanizmasını kodla.
- [ ] Giriş API rotasına (veya server action'a) ardışık denemelerde `429 Too Many Requests` döndüren bu limitleyiciyi entegre et.
- [ ] `next.config.js` dosyasına Content Security Policy (CSP), HSTS, XSS Protection başlıklarını ekle.

---

## 📌 FAZ 3: Admin Kontrol Paneli ve Veri Yönetimi (CRUD)

### 3.1. Giriş Arayüzü
- [ ] `/admin/giris` sayfasını oluştur. Minimalist, Obsidian Dark temalı, sadece şifre girdisi alan güvenli giriş formu tasarla.
- [ ] Giriş formunu rate-limiting ve CSRF koruması ile donat.

### 3.2. Admin Kontrol Paneli (Dashboard)
- [ ] `/admin/page.tsx` altında kategori ve kart istatistiklerini gösteren bir özet ekranı tasarla.
- [ ] Kategori ve Kart tablolarını/listelerini ekle.

### 3.3. Kategori & Kart CRUD İşlemleri (Server Actions)
- [ ] Kategori ve Kart ekleme, güncelleme ve silme işlevlerini gerçekleştirecek Server Action'ları (`src/app/actions/*`) oluştur.
- [ ] Girdileri doğrulamak için **Zod** şeması tanımla.
- [ ] Form işlemlerinde `useFormStatus` veya `useTransition` kullanarak kullanıcıya yükleniyor durumu (pending state) geri bildirimi ver.

---

## 📌 FAZ 4: Aday Arayüzü ve Akıllı Dashboard Geliştirme

### 4.1. Mobil Uyumlu Root Düzeni
- [ ] `src/app/page.tsx` dosyasını görseldeki mobil odaklı tasarıma uygun şekilde kodla (max-w-md, overflow-x-hidden).
- [ ] `BottomNav.tsx` (Alt Navigasyon Çubuğu: Ana Sayfa, Ekle/Çalış, İstatistikler) bileşenini yerleştir.

### 4.2. Güvenli İlerleme ve Senkronizasyon (`state.ts`)
- [ ] `src/lib/state.ts` içinde `localStorage` ile senkronize çalışan aday ilerleme durumunu yöneten JS sınıfını/fonksiyonlarını yaz:
  * Mevcut EXP, Seviye, Günlük Görevler.
  * Kart çalışıldığında EXP ekleme ve Seviye atlama (Level Up) mantığı.
  * **Hata Önleme (Pruning):** Veritabanından çekilen kart listesinde artık var olmayan (admin tarafından silinmiş) kart ID'lerini `localStorage` geçmişinden otomatik olarak temizleyen mantığı kur.
- [ ] Dashboard üzerinde Seviye ve EXP barlarını görselleştir.

### 4.3. Dairesel İlerleme ve Kart Durumları
- [ ] Görseldeki `%68` dairesel ilerleme grafiğini SVG tabanlı `CircularProgress.tsx` olarak kodla.
- [ ] Toplam öğrenilen, tekrar edilecek ve toplam kart istatistik panellerini Obsidian tarzı tasarla.

---

## 📌 FAZ 5: Çalışma Modu ve Oyunlaştırma Deneyimi

### 5.1. Çalışma Ekranı Konsepti (`/calis/[categoryId]`)
- [ ] Sadece soru ve cevaba odaklanan, dikkat dağıtmayan minimalist arayüzü kodla.
- [ ] Üst tarafta mevcut seans ilerleme barını göster.

### 5.2. Bilgi Kartı Bileşeni (`Card.tsx`)
- [ ] Kartın ön yüzünde soruyu, arka yüzünde cevabı göster.
- [ ] CSS 3D transform ve `backface-visibility: hidden` kullanarak akıcı bir 3D kart dönme (flip) animasyonu hazırla.
- [ ] Kart çevrildiğinde altta belirecek "Zor" ve "Kolay" butonlarını ekle.

### 5.3. Dopamin Parçacık Sistemi (`Particles.tsx`)
- [ ] HTML5 Canvas kullanan `Particles.tsx` bileşenini yaz.
- [ ] Kullanıcı "Kolay" butonuna tıkladığında mor ve yeşil parıltılı parçacıkları ekrana fırlat.
- [ ] Deste başarıyla bittiğinde tam ekran konfeti yağmuru tetikle.

---

## 📌 FAZ 6: Dağıtım (Deployment) ve Canlıya Alma

### 6.1. Docker Yapılandırması
- [ ] Projenin root dizinine multi-stage derleme yapan `Dockerfile` ekle.
- [ ] Start aşamasında `prisma db push` komutunun otomatik çalışmasını sağlayan bir entrypoint veya start komutu ekle.

### 6.2. Coolify Konfigürasyonu
- [ ] Projeyi GitHub'a commit et ve pushla.
- [ ] Coolify panelinde GitHub reposunu bağla.
- [ ] Coolify üzerinde bir PostgreSQL veritabanı servisi oluştur ve bunu uygulamanın `DATABASE_URL` değişkenine bağla.
- [ ] Çevre değişkenlerini (`NEXTAUTH_SECRET`, `ADMIN_PASSWORD`) Coolify üzerinde tanımla.
- [ ] Uygulamayı VPS üzerinde yayına al ve mobil cihaz tarayıcısından test et.
