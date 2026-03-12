#🍝 Suitable Sipariş Paneli

Modern bir **Dijital Restoran Menüsü ve Sipariş Yönetim Paneli**.  
React + Firebase altyapısı ile geliştirilmiş, AI destekli ve çok dilli bir restoran yönetim uygulamasıdır. :contentReference[oaicite:0]{index=0}

---

# Konu

Restoran veya kafe işletmelerinin:

- Menülerini dijital olarak yönetmesini
- Sipariş oluşturmasını
- Ödeme işlemlerini takip etmesini
- Ürünleri kolayca ekleyip düzenlemesini

sağlayan **tek ekranlı bir yönetim paneli**.

---

# Özellikler

- **AI Açıklama**  
  Groq AI (Llama-3) ile ürün açıklamaları otomatik oluşturulur. :contentReference[oaicite:1]{index=1}

- **Cloudinary Entegrasyonu**  
  Ürün görselleri doğrudan buluta yüklenir. :contentReference[oaicite:2]{index=2}

- **Firebase Firestore**  
  Ürünler, kategoriler ve ödemeler gerçek zamanlı saklanır. :contentReference[oaicite:3]{index=3}

- **QR Kod Sistemi**  
  Menü veya ürünler için QR kod oluşturulur. :contentReference[oaicite:4]{index=4}

- **Çoklu Dil Desteği**  
  Türkçe, İngilizce, Rusça, Almanca ve Fransızca. :contentReference[oaicite:5]{index=5}

- **Sipariş & Sepet Sistemi**  
  Ürün ekleme, çıkarma ve ödeme akışı.

- **Ödül Sistemi**  
  Harcamaya göre seviye atlama (Bronz → Elmas). :contentReference[oaicite:6]{index=6}

- **Geçmiş Ödemeler**  
  Satışları görüntüleme ve filtreleme. :contentReference[oaicite:7]{index=7}

- **Dijital Fiş**  
  Sipariş sonrası dijital adisyon oluşturma. :contentReference[oaicite:8]{index=8}

- **Menü Paylaşımı**  
  WhatsApp / Telegram üzerinden paylaşım. :contentReference[oaicite:9]{index=9}

---

# Proje Yapısı

### components

Uygulamanın tüm UI bileşenleri.

| Dosya | Açıklama |
|---|---|
Header | Üst menü |
Footer | Alt alan |
MenuSection | Menü kategorileri |
MenuItem | Tek ürün kartı |
OrderSection | Sepet / sipariş yönetimi |
ProductDetailModal | Ürün detayları |
ProductGroupModal | Kategori ekleme |
PaymentModal | Ödeme işlemi |
ReceiptModal | Dijital fiş |
RewardsModal | Sadakat sistemi |
PastPaymentsModal | Geçmiş satışlar |
ShareMenuModal | Menü paylaşımı |
SuccessModal | Başarılı işlem bildirimi |
LanguageModal | Dil seçimi |

---

### services

Harici servis entegrasyonları.

| Dosya | Açıklama |
|---|---|
aiService.js | Groq AI ürün açıklaması |
firebase.js | Firestore bağlantısı |
cloudinary.js | Görsel yükleme |
qrService.js | QR kod üretimi |
languageService.js | Dil yönetimi |

---

### hooks

| Dosya | Açıklama |
|---|---|
useIsMobile.js | Responsive kontrol |
useProductActions.js | Ürün işlemleri |

---

### context

Global state yönetimi.

---

### translations

Tüm uygulama çevirileri.

---

# Kullanılan Teknolojiler

- React
- Vite
- Firebase Firestore
- Groq AI (Llama-3)
- Cloudinary
- Bootstrap
- Vitest

---

# Ekran Görüntüleri

![Ekran 1](https://i.hizliresim.com/8o5x2kg.png)

![Ekran 2](https://i.hizliresim.com/30dgdca.png)

![Ekran 3](https://i.hizliresim.com/ygda12g.png)

![Ekran 4](https://i.hizliresim.com/pbpfgl3.png)

![Ekran 5](https://i.hizliresim.com/e1eu7oo.png)
