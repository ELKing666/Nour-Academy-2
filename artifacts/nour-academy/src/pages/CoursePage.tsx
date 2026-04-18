import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useCourse } from "@/hooks/use-courses";
import { Skeleton } from "@/components/ui/skeleton";

// Hardcoded rich content for legacy courses until DB migration is complete
const LEGACY_BADGES: Record<string, string> = {
  bac: "شعبة بكالوريا",
  english: "لغة إنجليزية",
  robotics: "روبوتيك للأطفال",
};

const LEGACY_STATS: Record<string, Array<{ value: string; label: string }>> = {
  bac: [
    { value: "📚", label: "شعب علمية وأدبية" },
    { value: "15+", label: "سنة خبرة" },
    { value: "الكبار", label: "الفئة" },
    { value: "الأكثر طلباً", label: "التميز" },
  ],
  english: [
    { value: "🇬🇧", label: "اللغة الإنجليزية" },
    { value: "4+", label: "مستويات" },
    { value: "الكبار", label: "الفئة" },
    { value: "دورة متميزة", label: "التميز" },
  ],
  robotics: [
    { value: "🤖", label: "الروبوتيك" },
    { value: "8-14", label: "الفئة العمرية" },
    { value: "الأطفال", label: "الفئة" },
    { value: "مشاريع عملية", label: "المميز" },
  ],
};

const LEGACY_TOPICS: Record<string, Array<{ num: string; title: string; desc: string; tags: string[] }>> = {
  bac: [
    {
      num: "01",
      title: "الرياضيات والفيزياء",
      desc: "تغطية شاملة لمناهج الرياضيات والفيزياء مع تمارين تطبيقية مكثفة.",
      tags: ["رياضيات", "فيزياء", "تمارين"],
    },
    {
      num: "02",
      title: "العلوم الطبيعية",
      desc: "دراسة معمقة في علم الأحياء والكيمياء وفق المنهج الرسمي.",
      tags: ["أحياء", "كيمياء", "بيولوجيا"],
    },
    {
      num: "03",
      title: "اختبارات تجريبية",
      desc: "اختبارات دورية تحاكي امتحانات البكالوريا الرسمية مع التصحيح التفصيلي.",
      tags: ["اختبارات", "بكالوريا", "تصحيح"],
    },
  ],
  english: [
    {
      num: "01",
      title: "المحادثة والنطق",
      desc: "جلسات محادثة مكثفة مع مدرسين متخصصين لتطوير الطلاقة اللفظية.",
      tags: ["محادثة", "نطق", "طلاقة"],
    },
    {
      num: "02",
      title: "الكتابة والقراءة",
      desc: "تطوير مهارات الكتابة الأكاديمية والإبداعية مع قراءة نصوص متنوعة.",
      tags: ["كتابة", "قراءة", "نصوص"],
    },
    {
      num: "03",
      title: "قواعد اللغة",
      desc: "إتقان قواعد اللغة الإنجليزية من خلال شرح مبسط وتطبيقات يومية.",
      tags: ["grammar", "قواعد", "تطبيق"],
    },
  ],
  robotics: [
    {
      num: "01",
      title: "أساسيات البرمجة",
      desc: "تعلم البرمجة المرئية عبر Scratch وتطبيقات تفاعلية مسلية.",
      tags: ["Scratch", "برمجة مرئية", "تفاعلي"],
    },
    {
      num: "02",
      title: "تجميع الروبوتات",
      desc: "بناء روبوتات حقيقية وتشغيلها خطوة بخطوة مع إشراف متخصص.",
      tags: ["روبوت", "تجميع", "ميكانيك"],
    },
    {
      num: "03",
      title: "مشاريع عملية",
      desc: "تنفيذ مشروع متكامل في نهاية كل وحدة لتعزيز المهارات المكتسبة.",
      tags: ["مشروع", "إبداع", "تحدي"],
    },
  ],
};

const LEGACY_FOR_WHOM: Record<string, string[]> = {
  bac: [
    "طلاب السنة الثالثة ثانوي (البكالوريا)",
    "الراغبون في تحسين معدلاتهم في المواد العلمية",
    "من يحتاج إلى متابعة فردية مكثفة قبل الامتحانات",
    "الطلاب الذين يعانون من صعوبات في الفهم داخل القسم",
  ],
  english: [
    "المبتدئون الراغبون في تعلم اللغة الإنجليزية من الصفر",
    "الطلاب الذين يحتاجون إلى تحسين مستواهم للمدرسة أو الجامعة",
    "المهنيون الراغبون في تطوير مهاراتهم للعمل",
    "من يرغب في الحصول على شهادات دولية معترف بها",
  ],
  robotics: [
    "الأطفال بين 8 و14 سنة المهتمون بالتكنولوجيا",
    "من يحب التجارب العلمية والبناء اليدوي",
    "الطلاب الراغبون في تعلم البرمجة بطريقة ممتعة",
    "الموهوبون الذين يريدون تطوير تفكيرهم الإبداعي",
  ],
};

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const { data: course, isLoading, isError } = useCourse(slug);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col gap-6">
        <Skeleton className="h-64 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 p-8">
        <p className="text-2xl font-bold text-gray-700">الدورة غير موجودة</p>
        <Link href="/" className="text-primary underline font-semibold">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const imgSrc = course.image_url
    ? course.image_url
    : `${import.meta.env.BASE_URL}course-${course.id}.jpg`;

  const badge =
    course.badge ||
    LEGACY_BADGES[course.id] ||
    (course.category === "kids" ? "للأطفال" : "للكبار");

  const defaultStats = course.duration
    ? [
        { value: course.icon, label: course.title },
        { value: course.duration, label: "المدة الأسبوعية" },
        {
          value: course.category === "kids" ? "الأطفال" : "الكبار",
          label: "الفئة",
        },
        {
          value: course.is_featured ? "الأكثر طلباً" : "دورة متميزة",
          label: "التميز",
        },
      ]
    : [];

  const stats =
    course.stats && course.stats.length > 0
      ? course.stats
      : LEGACY_STATS[course.id] ?? defaultStats;
  const topics =
    course.topics && course.topics.length > 0
      ? course.topics
      : LEGACY_TOPICS[course.id] ?? null;
  const forWhom =
    course.for_whom && course.for_whom.length > 0
      ? course.for_whom
      : LEGACY_FOR_WHOM[course.id] ?? null;

  const price = course.price;

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen" dir="rtl">
      <Link
        href="/#courses"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white text-primary font-bold px-4 py-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all text-sm"
      >
        → الرئيسية
      </Link>

      {/* Hero */}
      <header
        className="relative text-white py-28 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #6b0010 0%, #a0001a 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${imgSrc}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block bg-amber-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold mb-5 tracking-wide"
          >
            {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-5"
          >
            {course.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg opacity-90 leading-relaxed"
          >
            {course.description}
          </motion.p>
        </div>
      </header>

      {/* Floating stats */}
      {stats.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="bg-white p-5 rounded-2xl shadow-xl text-center"
              >
                <div className="text-primary font-bold text-lg">{s.value}</div>
                <div className="text-gray-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* What you'll learn */}
      {topics && topics.length > 0 && (
        <section className="py-24 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">ماذا ستتعلم؟</h2>
            <p className="text-gray-500 mt-2">محاور البرنامج التعليمي بالتفصيل</p>
          </div>

          <div className="space-y-6">
            {topics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="md:w-1/3 bg-red-50 p-8 flex items-center gap-4">
                  <span className="text-5xl font-black text-primary/20 leading-none">{topic.num}</span>
                  <h3 className="text-xl font-bold text-primary">{topic.title}</h3>
                </div>
                <div className="md:w-2/3 p-8">
                  <p className="text-gray-600 leading-relaxed mb-5">{topic.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <span key={tag} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* For whom + pricing */}
      <section
        className="py-20 px-4 text-white"
        style={{ background: "linear-gradient(135deg, #8b0012 0%, #c0001a 100%)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">من يستفيد من هذا البرنامج؟</h2>
            {forWhom ? (
              <ul className="space-y-4">
                {forWhom.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-white/30 h-6 w-6 flex items-center justify-center rounded-full text-xs shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/80 leading-relaxed">
                {course.description || "هذا البرنامج مناسب لجميع الراغبين في التعلم وتطوير مهاراتهم."}
              </p>
            )}
          </div>

          <div className="bg-white/10 p-8 rounded-[2rem] border border-white/20">
            <h3 className="text-2xl font-bold mb-4">التسجيل والأسعار</h3>
            {price ? (
              <>
                <div className="text-4xl font-bold text-amber-400 mb-2">{price.split(" / ")[0]}</div>
                {price.includes(" / ") && (
                  <p className="text-white/60 mb-8 text-sm">/ {price.split(" / ")[1]}</p>
                )}
              </>
            ) : (
              <p className="text-white/60 mb-8 text-sm">تواصل معنا لمعرفة الأسعار</p>
            )}
            {course.duration && (
              <p className="text-white/70 text-sm mb-6">المدة: {course.duration}</p>
            )}
            <a
              href={`${base}/#registration`}
              className="block w-full bg-amber-400 text-gray-900 text-center py-4 rounded-2xl font-bold text-lg hover:bg-amber-300 transition-all"
            >
              احجز مقعدك الآن
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm bg-white border-t border-gray-100">
        <p>© 2026 نور أكاديمي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
