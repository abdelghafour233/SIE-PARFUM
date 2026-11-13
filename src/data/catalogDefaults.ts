import heroLuxuryPerfumeImg from '../assets/images/hero_luxury_perfume_1794530313316.jpg';
import perfumeOudRoyalImg from '../assets/images/perfume_oud_royal_1794530313763.jpg';
import perfumeAmberVelvetImg from '../assets/images/perfume_amber_velvet_1794530313708.jpg';
import perfumeRoseSaffronImg from '../assets/images/perfume_rose_saffron_1794530313965.jpg';
import perfumePackCollectionImg from '../assets/images/perfume_pack_collection_1794530313916.jpg';
import type { Product } from '../types/store';

export const HERO_CAMPAIGN_IMAGE = heroLuxuryPerfumeImg;

export const STUDIO_IMAGE_PRESETS = [
  {
    label: 'عود الملكي (أسود وذهبي)',
    url: perfumeOudRoyalImg,
  },
  {
    label: 'عنبر أطلس (كريستال عنبري)',
    url: perfumeAmberVelvetImg,
  },
  {
    label: 'مسك الزعفران (زجاج مصنفر)',
    url: perfumeRoseSaffronImg,
  },
  {
    label: 'علبة الباقة الفاخرة (مجموعة عطور)',
    url: perfumePackCollectionImg,
  },
];

export const INITIAL_CATALOG_PRODUCTS: Product[] = [
  {
    id: 'oud-al-malaki',
    name: 'عود الملكي',
    subtitle: 'عطر واحد · 100 مل · تركيز فاخر',
    description:
      'توليفة مهيبة تجمع بين خشب العود الكمبودي المعتّق والجلد الدافئ مع لمسة من البرغموت الداكن، تمنحك حضوراً راقياً يدوم طوال اليوم وفي المناسبات الخاصة.',
    notes: 'العود الكمبودي، العنبر الأسود، الجلود المدبوغة، الهيل',
    features: [
      'تركيز عطري عالٍ Extrait de Parfum يضمن ثباتاً يتجاوز 18 ساعة',
      'زجاجة فاخرة بغطاء معدني ذهبي مصقول مناسبة للإهداء',
      'توصيل مجاني وسريع لجميع المدن المغربية مع الدفع عند الاستلام',
      'فوحان متوازن يجمع بين الأصالة الشرقية والأناقة العصرية',
    ],
    priceMad: 299,
    category: 'single',
    bottleCount: 1,
    volumeMl: 100,
    imageUrl: perfumeOudRoyalImg,
    isBestSeller: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'amber-atlas',
    name: 'عنبر أطلس',
    subtitle: 'عطر واحد · 100 مل · عطر دافئ',
    description:
      'عبق دافئ مستوحى من أمسيات جبال الأطلس الذهبية، يمزج العنبر الصافي مع الفانيليا المدغشقرية وخشب الصندل الكريمي لإحساس مخملي فريد.',
    notes: 'العنبر الذهبي، خشب الصندل، الفانيليا، الباتشولي',
    features: [
      'تركيبة غنية بزيوت عطرية طبيعية عالية النقاء',
      'مثالي للأجواء المسائية واللقاءات الرسمية طوال السنة',
      'الدفع عند الاستلام بعد استلام طلبك ومعاينته',
      'زجاجة كريستالية مصممة لحفظ نقاء العطر وجودته',
    ],
    priceMad: 279,
    category: 'single',
    bottleCount: 1,
    volumeMl: 100,
    imageUrl: perfumeAmberVelvetImg,
    isBestSeller: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'misk-al-zaafaran',
    name: 'مسك الزعفران وورد دادس',
    subtitle: 'عطر واحد · 100 مل · زهري وتابلي',
    description:
      'إشراقة عطرية مغربية تحتفي بورد قلعة مكونة وزعفران تالوين الأصيل على قاعدة ناعمة من المسك الأبيض والأخشاب البيضاء.',
    notes: 'زعفران تالوين، الورد المغربي، المسك الأبيض، خشب الأرز',
    features: [
      'مناسب للرجال والنساء بفضل توازنه بين النعومة والعمق',
      'ثبات ممتاز على الملابس والبشرة طوال اليوم',
      'شحن مضمون لكافة مدن المملكة المغربية',
      'تغليف أنيق جاهز للتقديم كهدية فاخرة',
    ],
    priceMad: 269,
    category: 'single',
    bottleCount: 1,
    volumeMl: 100,
    imageUrl: perfumeRoseSaffronImg,
    isBestSeller: false,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'pack-duo-royal',
    name: 'باك عطرين — الثنائي الملكي',
    subtitle: 'باك عطرين · 2 × 100 مل · عرض التوفير',
    description:
      'اختيار مثالي يجمع بين عطر عود الملكي وعطر عنبر أطلس في علبة تقديم فاخرة، لتنويع إطلالتك بين النهار والمساء بسعر تفضيلي.',
    notes: 'عود الملكي + عنبر أطلس (زجاجتان بحجم 100 مل)',
    features: [
      'يشمل عطرين بحجم كامل 100 مل لكل زجاجة داخل علبة هدايا',
      'توفير مالي واضح مقارنة بشراء كل عطر على حدة',
      'التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام',
      'مناسب للاستخدام الشخصي أو كهدية راقية لشخص عزيز',
    ],
    priceMad: 449,
    compareAtPriceMad: 578,
    category: 'pack_2',
    bottleCount: 2,
    volumeMl: 100,
    imageUrl: perfumePackCollectionImg,
    isBestSeller: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'pack-trio-signatures',
    name: 'باك 3 عطور — مجموعة التوقيع الفاخرة',
    subtitle: 'باك 3 عطور · 3 × 100 مل · الأكثر طلباً',
    description:
      'المجموعة الثلاثية المتكاملة التي تضم عود الملكي وعنبر أطلس ومسك الزعفران في صندوق أسود مبطّن بالمخمل، تجربة عطرية شاملة بأفضل قيمة.',
    notes: 'عود الملكي + عنبر أطلس + مسك الزعفران (3 × 100 مل)',
    features: [
      'ثلاثة عطور كاملة 100 مل تغطي جميع الأذواق والمناسبات',
      'صندوق عرض فاخر باللون الأسود والذهبي',
      'أكبر نسبة طلب في المغرب مع شحن مجاني للباب',
      'ادفع نقداً عند الاستلام دون أي رسوم مسبقة',
    ],
    priceMad: 599,
    compareAtPriceMad: 847,
    category: 'pack_3',
    bottleCount: 3,
    volumeMl: 100,
    imageUrl: perfumePackCollectionImg,
    isBestSeller: true,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'pack-quartet-prestige',
    name: 'باك 4 عطور — الباقة الملكية الكاملة',
    subtitle: 'باك 4 عطور · 4 × 100 مل · العرض الأوفر',
    description:
      'باقة العائلة والمناسبات الكبرى: أربع زجاجات عطرية كاملة الحجم من توقيع دار العنبر، تمنحك خزانة عطور متكاملة بأفضل سعر للزجاجة.',
    notes: '2 عود الملكي + عنبر أطلس + مسك الزعفران (4 × 100 مل)',
    features: [
      'أربع زجاجات عطور فاخرة بحجم 100 مل لكل زجاجة',
      'أعلى قيمة توفير في المتجر (أقل من 190 درهم للعطر الواحد)',
      'توصيل مجاني مؤمّن إلى جميع المدن المغربية',
      'الدفع عند الاستلام بكل أمان وراحة',
    ],
    priceMad: 749,
    compareAtPriceMad: 1116,
    category: 'pack_4',
    bottleCount: 4,
    volumeMl: 100,
    imageUrl: perfumePackCollectionImg,
    isBestSeller: false,
    isActive: true,
    sortOrder: 6,
  },
];
