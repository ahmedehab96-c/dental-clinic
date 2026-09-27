// Mock data — replace with a `/doctors` API call later (see services/api/client.js).
export const doctors = [
  {
    id: 1,
    slug: 'dr-sara-alamri',
    name: { ar: 'د. سارة العمري', en: 'Dr. Sara Alamri' },
    specialty: { ar: 'استشارية تقويم أسنان', en: 'Orthodontics Consultant' },
    bio: {
      ar: 'خبرة تزيد عن 12 عامًا في تقويم الأسنان للبالغين والأطفال، حاصلة على الزمالة الأمريكية في تقويم الأسنان.',
      en: 'Over 12 years of experience in adult and pediatric orthodontics, with an American fellowship in orthodontics.',
    },
    photo: 'https://images.pexels.com/photos/31043312/pexels-photo-31043312.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 214,
    education: [
      { ar: 'بكالوريوس طب وجراحة الفم والأسنان — جامعة الملك سعود', en: 'BDS — King Saud University' },
      { ar: 'زمالة تقويم الأسنان — الولايات المتحدة', en: 'Orthodontics Fellowship — USA' },
    ],
    serviceSlugs: ['orthodontics-braces', 'general-checkup'],
    featured: true,
  },
  {
    id: 2,
    slug: 'dr-omar-hassan',
    name: { ar: 'د. عمر حسن', en: 'Dr. Omar Hassan' },
    specialty: { ar: 'استشاري زراعة الأسنان', en: 'Dental Implants Consultant' },
    bio: {
      ar: 'متخصص في زراعة الأسنان الرقمية الموجهة بالحاسوب، أجرى أكثر من 3000 عملية زراعة ناجحة.',
      en: 'Specialist in computer-guided digital implants, with over 3,000 successful implant procedures.',
    },
    photo: 'https://images.pexels.com/photos/4687340/pexels-photo-4687340.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 15,
    rating: 4.8,
    reviewsCount: 312,
    education: [
      { ar: 'دكتوراه جراحة الفم والوجه والفكين — ألمانيا', en: 'PhD Oral & Maxillofacial Surgery — Germany' },
    ],
    serviceSlugs: ['dental-implants', 'root-canal'],
    featured: true,
  },
  {
    id: 3,
    slug: 'dr-lina-mansour',
    name: { ar: 'د. لينا منصور', en: 'Dr. Lina Mansour' },
    specialty: { ar: 'استشارية تجميل الأسنان', en: 'Cosmetic Dentistry Consultant' },
    bio: {
      ar: 'رائدة في تصميم الابتسامة الرقمي وابتسامة هوليوود، شغوفة بمنح كل مريض ابتسامة تليق به.',
      en: 'A pioneer in digital smile design and Hollywood smiles, passionate about a smile tailored to every patient.',
    },
    photo: 'https://images.pexels.com/photos/37458097/pexels-photo-37458097.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 9,
    rating: 5.0,
    reviewsCount: 178,
    education: [
      { ar: 'ماجستير طب الأسنان التجميلي — إيطاليا', en: "Master's in Cosmetic Dentistry — Italy" },
    ],
    serviceSlugs: ['veneers-cosmetic', 'teeth-whitening'],
    featured: true,
  },
  {
    id: 4,
    slug: 'dr-yousef-najjar',
    name: { ar: 'د. يوسف النجار', en: 'Dr. Yousef Najjar' },
    specialty: { ar: 'استشاري علاج الجذور', en: 'Endodontics Consultant' },
    bio: {
      ar: 'متخصص في علاج العصب بالتقنيات الحديثة الخالية من الألم تقريبًا، حريص على راحة المريض في كل خطوة.',
      en: 'Specialist in near-painless modern root canal techniques, focused on patient comfort at every step.',
    },
    photo: 'https://images.pexels.com/photos/37458054/pexels-photo-37458054.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 11,
    rating: 4.7,
    reviewsCount: 156,
    education: [
      { ar: 'ماجستير علاج الجذور — مصر', en: 'Master\'s in Endodontics — Egypt' },
    ],
    serviceSlugs: ['root-canal', 'general-checkup'],
    featured: false,
  },
  {
    id: 5,
    slug: 'dr-maha-qasimi',
    name: { ar: 'د. مها القاسمي', en: 'Dr. Maha Al Qasimi' },
    specialty: { ar: 'استشارية طب أسنان الأطفال', en: 'Pediatric Dentistry Consultant' },
    bio: {
      ar: 'متخصصة في جعل زيارة الطفل للعيادة تجربة مريحة وممتعة، مع خبرة واسعة في الوقاية المبكرة.',
      en: 'Focused on making every child\'s clinic visit calm and enjoyable, with deep expertise in early prevention.',
    },
    photo: 'https://images.pexels.com/photos/32205053/pexels-photo-32205053.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 8,
    rating: 4.9,
    reviewsCount: 201,
    education: [
      { ar: 'دبلوم عالي طب أسنان الأطفال — بريطانيا', en: 'Postgraduate Diploma in Pediatric Dentistry — UK' },
    ],
    serviceSlugs: ['pediatric-dentistry', 'teeth-cleaning'],
    featured: false,
  },
  {
    id: 6,
    slug: 'dr-khalid-otaibi',
    name: { ar: 'د. خالد العتيبي', en: 'Dr. Khalid Alotaibi' },
    specialty: { ar: 'طبيب أسنان عام', en: 'General Dentist' },
    bio: {
      ar: 'يقدم رعاية شاملة للأسنان من الفحص الدوري إلى الحشوات التجميلية بأسلوب هادئ ومطمئن.',
      en: 'Provides comprehensive care from routine checkups to cosmetic fillings, with a calm, reassuring approach.',
    },
    photo: 'https://images.pexels.com/photos/37458046/pexels-photo-37458046.jpeg?auto=compress&cs=tinysrgb&fm=webp&w=600&h=700&fit=crop',
    experienceYears: 7,
    rating: 4.8,
    reviewsCount: 132,
    education: [
      { ar: 'بكالوريوس طب وجراحة الفم والأسنان — جامعة الملك عبدالعزيز', en: 'BDS — King Abdulaziz University' },
    ],
    serviceSlugs: ['general-checkup', 'teeth-cleaning'],
    featured: false,
  },
]

export function getDoctorBySlug(slug) {
  return doctors.find((doctor) => doctor.slug === slug)
}

export function getFeaturedDoctors() {
  return doctors.filter((doctor) => doctor.featured)
}
