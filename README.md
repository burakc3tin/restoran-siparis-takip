# 🍽️ Suitable Sipariş Paneli

🌐 **Canlı Demo:**  
https://suitable-restoran.web.app/

Modern bir **Dijital Restoran Menüsü ve Sipariş Yönetim Paneli**.  
React + Firebase ile geliştirilmiş, **AI destekli ve çok dilli** bir restoran yönetim uygulaması.

---

# 📌 Konu

Restoran veya kafe işletmelerinin:

- 📋 Menülerini dijital olarak yönetmesini  
- 🛒 Sipariş oluşturmasını  
- 💳 Ödeme işlemlerini takip etmesini  
- ✏️ Ürünleri kolayca ekleyip düzenlemesini  

sağlayan **tek ekranlı bir yönetim paneli**.

---

# ✨ Özellikler

- 🤖 **AI Açıklama**  
  Groq AI (Llama-3) ile ürün açıklamaları otomatik oluşturulur.

- ☁️ **Cloudinary Entegrasyonu**  
  Ürün görselleri doğrudan buluta yüklenir.

- 🔥 **Firebase Firestore**  
  Ürünler, kategoriler ve ödemeler gerçek zamanlı saklanır.

- 📱 **QR Kod Sistemi**  
  Menü veya ürünler için QR kod oluşturulur.

- 🌍 **Çoklu Dil Desteği**  
  Türkçe, İngilizce, Rusça, Almanca ve Fransızca.

- 🛒 **Sipariş & Sepet Sistemi**  
  Ürün ekleme, çıkarma ve ödeme akışı.

- 🏆 **Ödül Sistemi**  
  Harcamaya göre seviye atlama (Bronz → Elmas).

- 📊 **Geçmiş Ödemeler**  
  Satışları görüntüleme ve filtreleme.

- 🧾 **Dijital Fiş**  
  Sipariş sonrası dijital adisyon oluşturma.

- 📤 **Menü Paylaşımı**  
  Menü WhatsApp veya Telegram üzerinden paylaşılabilir.

---

# 🗂️ Proje Yapısı

### 📦 components

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

### ⚙️ services

Harici servis entegrasyonları.

| Dosya | Açıklama |
|---|---|
aiService.js | Groq AI ürün açıklaması |
firebase.js | Firestore bağlantısı |
cloudinary.js | Görsel yükleme |
qrService.js | QR kod üretimi |
languageService.js | Dil yönetimi |

---

### 🧩 hooks

| Dosya | Açıklama |
|---|---|
useIsMobile.js | Responsive kontrol |
useProductActions.js | Ürün işlemleri |

---

### 🌐 context

Global state yönetimi.

---

### 🌍 translations

Uygulama çeviri dosyaları.

---

# 🛠️ Kullanılan Teknolojiler

- React
- Vite
- Firebase Firestore
- Firebase Deploy
- Groq AI (Llama-3)
- Cloudinary
- Bootstrap
- Vitest

---

# 📸 Ekran Görüntüleri

![Ekran 1](https://i.hizliresim.com/8o5x2kg.png)

![Ekran 2](https://i.hizliresim.com/30dgdca.png)

![Ekran 3](https://i.hizliresim.com/ygda12g.png)

![Ekran 4](https://i.hizliresim.com/pbpfgl3.png)

![Ekran 5](https://i.hizliresim.com/e1eu7oo.png)
