# Radiant Dental Care — رادينت لطب الأسنان

A bilingual (Arabic / English, RTL / LTR) dental clinic platform: public website, online booking, patient area, doctor panel and full admin dashboard.

منصة عيادة أسنان ثنائية اللغة (عربي / إنجليزي): موقع عام، حجز مواعيد أونلاين، منطقة المريض، لوحة الطبيب، ولوحة إدارة كاملة.

| Part | Repository | Stack |
|---|---|---|
| Frontend (this repo) | `dental-clinic` | React 19 · Vite · Tailwind · Framer Motion |
| Backend API | [`dental-clinic-api`](https://github.com/ahmedehab96-c/dental-clinic-api) | Laravel 13 · Sanctum · MySQL |

---

## 🔐 Demo accounts — حسابات التجربة

All demo accounts use the password **`password`** — جميع الحسابات كلمة مرورها **`password`**

| Role — الدور | Email — البريد الإلكتروني | After login — بعد الدخول |
|---|---|---|
| Admin — مشرف | `admin@radiantdental.care` | `/admin` — لوحة الإدارة |
| Doctor — طبيب | `doctor@radiantdental.care` | `/doctor` — لوحة الطبيب |
| Patient — مريض | `patient@example.com` | `/dashboard` — منطقة المريض |

> These accounts are created by `php artisan migrate --seed` in the API. Demo only — change them before any real deployment.
>
> تُنشأ هذه الحسابات تلقائيًا عند تشغيل `php artisan migrate --seed` في الـ API. للتجربة فقط — غيّرها قبل أي نشر فعلي.

---

## 🇬🇧 English

### What you can try
- **Public site:** services, doctors, blog, before/after gallery, FAQs, testimonials, AR/EN switch.
- **Booking:** book an appointment as a guest or as a logged-in patient.
- **Patient:** view and cancel your appointments, edit your profile, see notifications.
- **Doctor:** today's schedule, statistics, confirm / complete / cancel your own appointments, edit your profile.
- **Admin:** manage appointments, doctors, services, blog, gallery, testimonials, FAQs and users.
- **Notifications:** in-app bell for every role, plus queued email notifications.

### Run locally
**1. API** (see the [API README](https://github.com/ahmedehab96-c/dental-clinic-api) for details)
```bash
git clone https://github.com/ahmedehab96-c/dental-clinic-api.git
cd dental-clinic-api
composer install
cp .env.example .env && php artisan key:generate
# set DB_DATABASE / DB_USERNAME / DB_PASSWORD in .env, then:
php artisan migrate --seed
php artisan storage:link
php artisan serve            # http://localhost:8000
php artisan queue:work       # optional: sends queued emails
```

**2. Frontend**
```bash
git clone https://github.com/ahmedehab96-c/dental-clinic.git
cd dental-clinic
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:8000/api/v1
npm run dev                  # http://localhost:5173
```

Open http://localhost:5173 and sign in with one of the demo accounts above.

---

## 🇸🇦 العربية

### ماذا يمكنك تجربته
- **الموقع العام:** الخدمات، الأطباء، المدونة، معرض قبل وبعد، الأسئلة الشائعة، آراء المرضى، والتبديل بين العربية والإنجليزية.
- **الحجز:** احجز موعدًا كزائر أو بعد تسجيل الدخول كمريض.
- **المريض:** عرض المواعيد وإلغاؤها، تعديل الملف الشخصي، ومتابعة الإشعارات.
- **الطبيب:** جدول اليوم، الإحصائيات، تأكيد / إتمام / إلغاء مواعيده فقط، وتعديل ملفه.
- **المشرف:** إدارة المواعيد، الأطباء، الخدمات، المدونة، المعرض، آراء المرضى، الأسئلة الشائعة، والمستخدمين.
- **الإشعارات:** جرس إشعارات داخل التطبيق لكل الأدوار، مع إشعارات بريد إلكتروني عبر طابور المهام.

### التشغيل محليًا
**١. الـ API**
```bash
git clone https://github.com/ahmedehab96-c/dental-clinic-api.git
cd dental-clinic-api
composer install
cp .env.example .env && php artisan key:generate
# اضبط بيانات قاعدة البيانات في ملف .env ثم:
php artisan migrate --seed
php artisan storage:link
php artisan serve            # http://localhost:8000
php artisan queue:work       # اختياري: لإرسال رسائل البريد
```

**٢. الواجهة**
```bash
git clone https://github.com/ahmedehab96-c/dental-clinic.git
cd dental-clinic
npm install
cp .env.example .env         # VITE_API_URL=http://localhost:8000/api/v1
npm run dev                  # http://localhost:5173
```

افتح http://localhost:5173 وسجّل الدخول بأحد حسابات التجربة أعلاه.

---

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | Lint with oxlint |
