# AGS Bilgi Kartı Uygulaması - Geliştirme Yol Haritası (roadmap.md)

Bu yol haritası, Antigravity 2.0 yapay zeka kodlama asistanının adımları sırasıyla, eksiksiz ve en yüksek kalitede uygulayabilmesi için hazırlanmış detaylı bir kılavuzdur.

---

## 📌 FAZ 1: Temel Kurulum ve Çevre Yapılandırması

### 1.1. Next.js Kurulumu
- [ ] `./` dizininde Next.js projesini TypeScript ve TailwindCSS destekli olacak şekilde kur.
- [ ] Gereksiz şablon dosyalarını (`app/page.tsx` içindeki varsayılan Next.js içeriklerini, default CSS kurallarını) temizle.
- [ ] Geist veya Outfit fontunu Google Fonts ya da `next/font` üzerinden sisteme entegre et.

### 1.2. TailwindCSS ve Tasarım Sistemi Konfigürasyonu
- [ ] `tailwind.config.ts` (veya `postcss` entegrasyonunu) yapılandır.
- [ ] Obsidian Dark renk paletini (`#090a0f` arka plan, `#12131a` kart rengi, `#a78bfa` neon mor aksanı) Tailwind custom theme olarak ekle.
- [ ] `globals.css` içinde ince şeffaf sınır çizgileri (`border-white/5`), arka plan parlaması (neon glow) ve cam (glassmorphism) efektleri için gerekli CSS sınıflarını tanımla.

### 1.3. Prisma ORM ve Veritabanı Kurulumu
- [ ] Prisma paketlerini kur ve yerel geliştirme için SQLite provider'lı `prisma/schema.prisma` şemasını oluştur.
- [ ] `Category`, `Card` ve `User` (Admin) modellerini şemada tanımla.
- [ ] `prisma/seed.ts` dosyasını oluştur:
  * 2 test kategorisi (Türkçe, Mevzuat) ekle.
  * 2 test bilgi kartı (Paragraf yapısı ve Anayasa sorusu) ekle.
  * Test admin kullanıcısını (şifresi hash'lenmiş olarak) oluştur.
- [ ] Veritabanını ilkle (`npx prisma db push` ve `npx prisma db seed`).

---

## 📌 FAZ 2: Güvenlik Altyapısının Kurulması (NextAuth & Protection)

### 2.1. Kimlik Doğrulama (Auth.js) Entegrasyonu
- [ ] `next-auth` paketini projeye dahil et.
- [ ] Credentials Provider kullanarak şifre tabanlı kimlik doğrulama akışını `src/lib/auth.ts` içinde yapılandır.
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

### 3.3. Kategori CRUD İşlemleri (Server Actions)
- [ ] Kategori ekleme, güncelleme ve silme işlevlerini gerçekleştirecek Server Action'ları (`src/app/actions/categories.ts`) oluştur.
- [ ] Girdileri doğrulamak için **Zod** şeması tanımla.
- [ ] Arayüzde kategori ekleme ve düzenleme formlarını oluştur.

### 3.4. Kart CRUD İşlemleri (Server Actions)
- [ ] Kart ekleme, güncelleme ve silme Server Action'larını (`src/app/actions/cards.ts`) yaz (Zod validasyonlu).
- [ ] Kategoriye göre kart filtreleme ve hızlı kart ekleme arayüzünü admin paneline entegre et.

---

## 📌 FAZ 4: Aday Arayüzü ve Akıllı Dashboard Geliştirme

### 4.1. Mobil Uyumlu Root Düzeni
- [ ] `src/app/page.tsx` dosyasını görseldeki mobil odaklı tasarıma uygun şekilde kodla.
- [ ] Ekran genişliğini sınırla (maksimum `max-w-md`), yatay kaydırmayı engelle.
- [ ] `BottomNav.tsx` (Alt Navigasyon Çubuğu: Ana Sayfa, Ekle/Çalış, İstatistikler) bileşenini yerleştir.

### 4.2. EXP, Seviye ve Oyunlaştırma Mantığı
- [ ] `src/lib/state.ts` içinde `localStorage` ile senkronize çalışan aday ilerleme durumunu yöneten JS sınıfını/fonksiyonlarını yaz:
  * Mevcut EXP, Seviye, Günlük Görevler.
  * Kart çalışıldığında EXP ekleme ve Seviye atlama (Level Up) mantığı.
- [ ] Dashboard üzerinde Seviye ve EXP barlarını görselleştir.

### 4.3. Dairesel İlerleme ve Kart Durumları
- [ ] Görseldeki `%68` dairesel ilerleme grafiğini SVG tabanlı `CircularProgress.tsx` olarak kodla.
- [ ] Toplam öğrenilen, tekrar edilecek ve toplam kart istatistik panellerini Obsidian tarzı tasarla.

### 4.4. Günlük Görevler ve Kategori Listesi
- [ ] Günlük Görevler bileşenini (Örn: "25:00 Odaklan", "68/100 Kart Çalış") ekle.
- [ ] Veritabanından gelen aktif kategorileri ilerleme durumlarıyla (Örn: "15 / 30 kart") listeleyen "Çalışmaya Devam Et" bölümünü kodla.

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

### 5.4. Çalışma Algoritması
- [ ] "Zor" seçilen kartları seans sonuna ekle.
- [ ] "Kolay" seçilen kartları tamamlandı say ve bir sonraki seansa kadar gösterme.

---

## 📌 FAZ 6: Dağıtım (Deployment) ve Canlıya Alma

### 6.1. Docker Yapılandırması
- [ ] Projenin root dizinine multi-stage derleme yapan `Dockerfile` ekle.
- [ ] `.dockerignore` dosyasını oluştur.
- [ ] Start aşamasında `prisma db push` komutunun otomatik çalışmasını sağlayan bir entrypoint veya start komutu ekle.

### 6.2. Coolify Konfigürasyonu
- [ ] Projeyi GitHub'a commit et ve pushla.
- [ ] Coolify panelinde GitHub reposunu bağla.
- Çevre değişkenlerini (`DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`) Coolify üzerinde tanımla.
- [ ] Uygulamayı VPS üzerinde yayına al ve mobil cihaz tarayıcısından test et.
