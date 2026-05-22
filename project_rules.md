# AGS Bilgi Kartı Projesi Geliştirme Kuralları (rules.md)

Bu doküman, projenin güvenlik, tasarım, veri tabanı ve dağıtım aşamalarındaki standartlarını belirler.

## Tasarım ve UX Standartları (Obsidian Dark)
1. **Renk Kodları:**
   * Ana Arka Plan: `#090a0f` (Derin Uzay Siyahı)
   * Kart / Panel Arka Planı: `#12131a` (%80 Opaklık + Blur)
   * Vurgu Rengi (Accent): `#a78bfa` (Neon Lavanta)
   * İkincil Metinler: `#94a3b8` (Slate-400)
2. **Düzen (Layout):**
   * Mobil öncelikli (responsive mobile-first).
   * Sabit alt menü (Bottom Navigation) ile sayfalar arası geçiş.
   * Yumuşak geçiş efektleri (`transition-all duration-300`).
3. **Dopamin Etkileri:**
   * Doğru cevaplarda ekranda mor/yeşil konfeti/parçacık fırlatma.
   * Deste bitimlerinde tebrik kartı animasyonu.

## Güvenlik Standartları
1. **Veri Kontrolü:** Tüm input alanları Zod şeması ile kontrol edilmeli.
2. **Oturum Yönetimi:** `NextAuth` JWT şifreleme anahtarı (`NEXTAUTH_SECRET`) en az 32 karakterli güçlü bir string olmalı.
3. **HTTP Başlıkları:** `next.config.js` içinde CSP ve Frame-Options başlıkları tanımlanmalı.
4. **Hassas Veriler:** Şifreler `bcrypt` veya `argon2` ile hash'lenmeli, çevre değişkenleri (`.env`) git'e commit edilmemelidir.

## Dağıtım (Deployment) Standartları
1. **Coolify Uyumlu Dockerfile:**
   * Multi-stage build kullanılacak.
   * Build aşamasında `prisma generate` çalıştırılacak.
   * Çalışma aşamasında `production` modunda çalıştırılacak.
2. **Veritabanı Senkronizasyonu:** Uygulama ayağa kalkarken şema güncellemeleri otomatik uygulanacak.
