// Mock data — replace with a `/gallery` API call later (see services/api/client.js).
export const galleryCases = [
  {
    id: 1,
    title: { ar: 'ابتسامة هوليوود كاملة', en: 'Full Hollywood Smile' },
    category: 'veneers-cosmetic',
    beforeImage: 'https://images.pexels.com/photos/3762400/pexels-photo-3762400.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
  {
    id: 2,
    title: { ar: 'تقويم أسنان لمدة 14 شهرًا', en: '14-Month Orthodontic Case' },
    category: 'orthodontics-braces',
    beforeImage: 'https://images.pexels.com/photos/3762405/pexels-photo-3762405.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/3762407/pexels-photo-3762407.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
  {
    id: 3,
    title: { ar: 'تبييض احترافي بجلسة واحدة', en: 'Single-Session Professional Whitening' },
    category: 'teeth-whitening',
    beforeImage: 'https://images.pexels.com/photos/3762439/pexels-photo-3762439.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/3762441/pexels-photo-3762441.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
  {
    id: 4,
    title: { ar: 'زراعة أسنان أمامية', en: 'Front Tooth Implant' },
    category: 'dental-implants',
    beforeImage: 'https://images.pexels.com/photos/12474261/pexels-photo-12474261.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/11515380/pexels-photo-11515380.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
  {
    id: 5,
    title: { ar: 'قشور خزفية لست أسنان', en: 'Six-Tooth Porcelain Veneers' },
    category: 'veneers-cosmetic',
    beforeImage: 'https://images.pexels.com/photos/6627573/pexels-photo-6627573.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/36763563/pexels-photo-36763563.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
  {
    id: 6,
    title: { ar: 'ترميم بعد علاج الجذور', en: 'Restoration After Root Canal' },
    category: 'root-canal',
    beforeImage: 'https://images.pexels.com/photos/28110692/pexels-photo-28110692.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
    afterImage: 'https://images.pexels.com/photos/11956948/pexels-photo-11956948.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=700&h=700&fit=crop',
  },
]

export const galleryCategories = [
  { key: 'all', labelKey: 'gallery.filters.all' },
  { key: 'veneers-cosmetic', labelKey: 'gallery.filters.veneers' },
  { key: 'orthodontics-braces', labelKey: 'gallery.filters.braces' },
  { key: 'teeth-whitening', labelKey: 'gallery.filters.whitening' },
  { key: 'dental-implants', labelKey: 'gallery.filters.implants' },
  { key: 'root-canal', labelKey: 'gallery.filters.rootcanal' },
]
