// Mock data — replace with a `/services` API call later (see services/api/client.js).
// Bilingual fields use { ar, en } objects; components pick the active one via useLanguage().tr().
export const services = [
  {
    id: 1,
    slug: 'general-checkup',
    icon: 'checkup',
    name: { ar: 'الفحص الدوري', en: 'General Checkup' },
    shortDescription: {
      ar: 'فحص شامل للأسنان واللثة لاكتشاف أي مشاكل مبكرًا.',
      en: 'A comprehensive teeth and gum exam to catch issues early.',
    },
    description: {
      ar: 'فحص دوري شامل يتضمن تقييمًا كاملاً لصحة الأسنان واللثة باستخدام أحدث أجهزة التصوير الرقمي، مع خطة علاجية واضحة إن لزم الأمر.',
      en: 'A full oral health assessment using modern digital imaging, with a clear treatment plan if needed.',
    },
    image: 'https://images.pexels.com/photos/6627483/pexels-photo-6627483.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '30 دقيقة', en: '30 minutes' },
    priceFrom: 150,
    features: [
      { ar: 'فحص شامل بالأشعة الرقمية', en: 'Full digital X-ray exam' },
      { ar: 'تقييم صحة اللثة', en: 'Gum health assessment' },
      { ar: 'استشارة طبيب مجانية', en: 'Free doctor consultation' },
    ],
  },
  {
    id: 2,
    slug: 'teeth-cleaning',
    icon: 'cleaning',
    name: { ar: 'تنظيف الأسنان', en: 'Teeth Cleaning' },
    shortDescription: {
      ar: 'إزالة الجير والبلاك للحفاظ على لثة صحية وابتسامة نظيفة.',
      en: 'Plaque and tartar removal for healthier gums and a cleaner smile.',
    },
    description: {
      ar: 'جلسة تنظيف احترافية تزيل الجير والبلاك المتراكم، وتلمّع الأسنان لمنع تسوسها وتحسين رائحة الفم.',
      en: 'A professional cleaning session that removes built-up tartar and plaque, then polishes teeth to prevent decay.',
    },
    image: 'https://images.pexels.com/photos/6528909/pexels-photo-6528909.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '45 دقيقة', en: '45 minutes' },
    priceFrom: 200,
    features: [
      { ar: 'إزالة الجير والبلاك', en: 'Tartar & plaque removal' },
      { ar: 'تلميع الأسنان', en: 'Teeth polishing' },
      { ar: 'نصائح للعناية اليومية', en: 'Daily care guidance' },
    ],
  },
  {
    id: 3,
    slug: 'teeth-whitening',
    icon: 'whitening',
    name: { ar: 'تبييض الأسنان', en: 'Teeth Whitening' },
    shortDescription: {
      ar: 'ابتسامة أكثر إشراقًا خلال جلسة واحدة بتقنية آمنة وفعالة.',
      en: 'A brighter smile in a single visit with safe, effective technology.',
    },
    description: {
      ar: 'تقنية تبييض متطورة تمنحك أسنانًا أكثر بياضًا بعدة درجات خلال جلسة واحدة، مع الحفاظ الكامل على سلامة طبقة المينا.',
      en: 'Advanced whitening technology that lifts your shade by several levels in one session — fully safe for enamel.',
    },
    image: 'https://images.pexels.com/photos/5622235/pexels-photo-5622235.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '60 دقيقة', en: '60 minutes' },
    priceFrom: 450,
    features: [
      { ar: 'نتائج فورية وملحوظة', en: 'Instant, visible results' },
      { ar: 'آمن على مينا الأسنان', en: 'Enamel-safe formula' },
      { ar: 'يدوم حتى 12 شهرًا', en: 'Lasts up to 12 months' },
    ],
  },
  {
    id: 4,
    slug: 'dental-implants',
    icon: 'implants',
    name: { ar: 'زراعة الأسنان', en: 'Dental Implants' },
    shortDescription: {
      ar: 'حل دائم لتعويض الأسنان المفقودة بمظهر ووظيفة طبيعية.',
      en: 'A permanent solution for missing teeth with a natural look and function.',
    },
    description: {
      ar: 'زراعة أسنان بأحدث التقنيات ثلاثية الأبعاد لضمان دقة الزرعة وثباتها، مع نتائج تدوم لعشرات السنين.',
      en: 'Implants placed with precise 3D-guided technology for a secure fit and results that last decades.',
    },
    image: 'https://images.pexels.com/photos/6502340/pexels-photo-6502340.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: 'جلسات متعددة', en: 'Multiple sessions' },
    priceFrom: 2500,
    features: [
      { ar: 'تخطيط ثلاثي الأبعاد دقيق', en: 'Precise 3D planning' },
      { ar: 'مواد بتيتانيوم عالية الجودة', en: 'High-grade titanium material' },
      { ar: 'ضمان يصل إلى 10 سنوات', en: 'Up to 10-year warranty' },
    ],
  },
  {
    id: 5,
    slug: 'orthodontics-braces',
    icon: 'braces',
    name: { ar: 'تقويم الأسنان', en: 'Orthodontics & Braces' },
    shortDescription: {
      ar: 'تقويم معدني أو شفاف لمحاذاة الأسنان بدقة وثقة.',
      en: 'Metal or clear aligners for precise, confident teeth alignment.',
    },
    description: {
      ar: 'خيارات تقويم متعددة تشمل التقويم المعدني والشفاف، مع متابعة دورية لضمان أفضل نتيجة لمحاذاة أسنانك.',
      en: 'Multiple options including metal braces and clear aligners, with regular follow-ups for the best alignment.',
    },
    image: 'https://images.pexels.com/photos/5524024/pexels-photo-5524024.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '12 – 24 شهرًا', en: '12 – 24 months' },
    priceFrom: 3200,
    features: [
      { ar: 'خيارات شفافة وغير مرئية', en: 'Clear, near-invisible options' },
      { ar: 'متابعة شهرية مجانية', en: 'Free monthly follow-ups' },
      { ar: 'خطة دفع مرنة', en: 'Flexible payment plan' },
    ],
  },
  {
    id: 6,
    slug: 'root-canal',
    icon: 'rootcanal',
    name: { ar: 'علاج العصب', en: 'Root Canal Treatment' },
    shortDescription: {
      ar: 'علاج فعّال وغير مؤلم لإنقاذ السن المصاب بالتهاب العصب.',
      en: 'Effective, painless treatment to save a tooth with an infected nerve.',
    },
    description: {
      ar: 'علاج عصب دقيق باستخدام أدوات دورانية حديثة يقلل من زمن الجلسة والألم، ويحافظ على السن الطبيعي.',
      en: 'Precise root canal therapy using modern rotary tools to reduce chair time and discomfort while saving the natural tooth.',
    },
    image: 'https://images.pexels.com/photos/6627519/pexels-photo-6627519.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '60 – 90 دقيقة', en: '60 – 90 minutes' },
    priceFrom: 600,
    features: [
      { ar: 'تخدير موضعي مريح', en: 'Comfortable local anesthesia' },
      { ar: 'أدوات دورانية حديثة', en: 'Modern rotary instruments' },
      { ar: 'الحفاظ على السن الطبيعي', en: 'Preserves the natural tooth' },
    ],
  },
  {
    id: 7,
    slug: 'veneers-cosmetic',
    icon: 'veneers',
    name: { ar: 'قشور وابتسامة هوليوود', en: 'Veneers & Hollywood Smile' },
    shortDescription: {
      ar: 'تصميم ابتسامة مثالية بقشور خزفية رفيعة وطبيعية المظهر.',
      en: 'A picture-perfect smile with thin, natural-looking porcelain veneers.',
    },
    description: {
      ar: 'تصميم رقمي للابتسامة قبل التنفيذ يتيح لك رؤية النتيجة النهائية، تليها قشور خزفية عالية الجودة تمنحك ابتسامة هوليوود.',
      en: 'A digital smile design preview lets you see the final result before we start, followed by premium porcelain veneers.',
    },
    image: 'https://images.pexels.com/photos/3762408/pexels-photo-3762408.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: 'جلستان', en: '2 sessions' },
    priceFrom: 1200,
    features: [
      { ar: 'تصميم رقمي مسبق للابتسامة', en: 'Digital smile preview' },
      { ar: 'خزف طبيعي المظهر', en: 'Natural-looking porcelain' },
      { ar: 'مقاومة للبقع والتصبغ', en: 'Stain-resistant finish' },
    ],
  },
  {
    id: 8,
    slug: 'pediatric-dentistry',
    icon: 'pediatric',
    name: { ar: 'طب أسنان الأطفال', en: 'Pediatric Dentistry' },
    shortDescription: {
      ar: 'رعاية أسنان لطيفة ومخصصة لأصغر أفراد العائلة.',
      en: 'Gentle, kid-friendly dental care for the youngest smiles.',
    },
    description: {
      ar: 'بيئة ودودة ومريحة للأطفال، مع أطباء متخصصين في طب أسنان الأطفال لجعل كل زيارة تجربة إيجابية وممتعة.',
      en: 'A warm, welcoming environment with pediatric specialists who make every visit a positive experience.',
    },
    image: 'https://images.pexels.com/photos/7800568/pexels-photo-7800568.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=900&h=700&fit=crop',
    duration: { ar: '30 – 40 دقيقة', en: '30 – 40 minutes' },
    priceFrom: 180,
    features: [
      { ar: 'أطباء متخصصون بالأطفال', en: 'Pediatric specialists' },
      { ar: 'عيادة مصممة لراحة الطفل', en: 'Kid-friendly clinic design' },
      { ar: 'برنامج وقائي للأسنان اللبنية', en: 'Preventive care program' },
    ],
  },
]

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug)
}
