# AGS Bilgi Kartı Proje Yetenekleri (skills.md)

Bu dosya, projenin yerel geliştirme, veritabanı yönetimi ve sunucu dağıtım süreçlerinde kullanılacak pratik komutları (skills) ve iş akışlarını tanımlar.

## 1. Geliştirme Ortamı Yetenekleri
*   **Bağımlılıkların Kurulması:**
    ```bash
    npm install
    ```
*   **Yerel Sunucunun Çalıştırılması:**
    ```bash
    npm run dev
    ```
*   **Projenin Derlenmesi (Build):**
    ```bash
    npm run build
    ```

## 2. Veritabanı ve Prisma Yetenekleri
*   **Veritabanı Şemasının Oluşturulması/Güncellenmesi (Migration):**
    ```bash
    npx prisma db push
    # veya resmi migration oluşturmak için:
    npx prisma migrate dev --name init
    ```
*   **Veritabanına Test Verisi Eklenmesi (Seeding):**
    ```bash
    npx prisma db seed
    ```
*   **Prisma İstemcisinin Yeniden Derlenmesi:**
    ```bash
    npx prisma generate
    ```
*   **Veritabanı Arayüzünün Açılması (Prisma Studio):**
    ```bash
    npx prisma studio
    ```

## 3. Güvenlik ve Şifreleme Yetenekleri
*   **Yeni Admin Şifresi Hashing Yeteneği:**
    Admin şifresinin güvenli bir şekilde Bcrypt hash değerini üretmek için kullanılacak script:
    ```bash
    node -e "console.log(require('bcryptjs').hashSync('ADMIN_SIFRENIZ', 10))"
    ```
*   **JWT Secret Oluşturma Yeteneği:**
    `NEXTAUTH_SECRET` için güvenli, rastgele 32 karakterli anahtar üretme:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```

## 4. Docker ve Coolify Dağıtım Yetenekleri
*   **Yerel Docker Testi:**
    ```bash
    docker build -t ags-app .
    docker run -p 3000:3000 --env-file .env ags-app
    ```
