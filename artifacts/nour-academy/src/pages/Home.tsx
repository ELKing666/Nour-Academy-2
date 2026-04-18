import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Menu,
  Users,
  GraduationCap,
  Award,
  Target,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  ChevronDown,
  BookOpen,
  Languages,
  Bot,
  Cpu,
  FlaskConical,
  Calculator,
  Code,
  Music,
  Palette,
  Microscope,
  Pencil,
  Lightbulb,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContent } from "@/hooks/use-site-content";
import { useCourses } from "@/hooks/use-courses";
import { useLang } from "@/contexts/LanguageContext";
import { LANGUAGES } from "@/i18n/translations";
import ReactCountryFlag from "react-country-flag";

// --- Course Icon Map ---
const COURSE_ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap, BookOpen, Globe, Languages, Bot, Cpu,
  FlaskConical, Calculator, Code, Music, Palette, Microscope, Pencil, Lightbulb, Star,
  "📚": BookOpen, "🌍": Globe, "🇫🇷": Languages, "🤖": Bot,
  bac: GraduationCap, english: Globe, french: Languages, robotics: Bot,
};

function CourseIcon({ icon, courseId, className = "w-12 h-12" }: { icon?: string; courseId?: string; className?: string }) {
  const Icon = (icon && COURSE_ICON_MAP[icon]) || (courseId && COURSE_ICON_MAP[courseId]) || BookOpen;
  return <Icon className={className} />;
}

// --- Animation variants ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeUpDelay = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
});

// --- Animated Counter ---
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// --- Language Dropdown ---
function LanguageDropdown() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-white hover:text-gold transition-colors font-medium text-sm px-2 py-1.5 rounded-lg hover:bg-white/10"
        aria-label="Select language"
      >
        <ReactCountryFlag
          countryCode={current.countryCode}
          svg
          style={{ width: "1.25em", height: "1.25em", borderRadius: "2px" }}
        />
        <span>{current.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 end-0 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[155px] z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-start px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2.5 ${
                  l.code === lang ? "text-primary font-bold bg-red-50/60" : "text-gray-700"
                }`}
              >
                <ReactCountryFlag
                  countryCode={l.countryCode}
                  svg
                  style={{ width: "1.4em", height: "1.4em", borderRadius: "2px" }}
                />
                <span>{l.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Navbar ---
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, setLang, dir } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/80 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Nour Academy"
            className="h-14 w-14 object-cover shrink-0"
            style={{ mixBlendMode: "screen" }}
          />
          <span className="text-2xl font-bold font-sans">
            <span className="text-white">{t.brandFirst}</span>{" "}
            <span className="text-gold">{t.brandSecond}</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5 text-white font-medium">
          <a href="#hero" className="hover:text-gold transition-colors text-sm">{t.nav.home}</a>
          <a href="#about" className="hover:text-gold transition-colors text-sm">{t.nav.about}</a>
          <a href="#courses" className="hover:text-gold transition-colors text-sm">{t.nav.courses}</a>
          <a href="#testimonials" className="hover:text-gold transition-colors text-sm">{t.nav.testimonials}</a>
          <a href="#faq" className="hover:text-gold transition-colors text-sm">{t.nav.faq}</a>
          <a href="#branches" className="hover:text-gold transition-colors text-sm">{t.nav.branches}</a>
          <LanguageDropdown />
          <Button asChild className="bg-gold text-primary hover:bg-gold-dark font-bold">
            <a href="#contact">{t.nav.contact}</a>
          </Button>
        </div>

        {/* Mobile: language toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageDropdown />
          <button
            className="text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            dir={dir}
            className="md:hidden bg-primary/95 backdrop-blur-md shadow-lg absolute top-20 left-0 right-0 p-5 flex flex-col gap-4 text-white text-center font-medium"
          >
            <a href="#hero" onClick={() => setMobileOpen(false)}>{t.nav.home}</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>{t.nav.about}</a>
            <a href="#courses" onClick={() => setMobileOpen(false)}>{t.nav.courses}</a>
            <a href="#testimonials" onClick={() => setMobileOpen(false)}>{t.nav.testimonials}</a>
            <a href="#faq" onClick={() => setMobileOpen(false)}>{t.nav.faq}</a>
            <a href="#branches" onClick={() => setMobileOpen(false)}>{t.nav.branches}</a>

            <Button
              asChild
              className="bg-gold text-primary hover:bg-gold-dark font-bold w-full mt-1"
              onClick={() => setMobileOpen(false)}
            >
              <a href="#contact">{t.nav.contact}</a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const { t } = useLang();
  return (
    <section
      id="hero"
      className="min-h-screen relative flex flex-col items-center justify-center pt-20 bg-primary overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary pointer-events-none"></div>
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-gold/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 relative z-10 text-center text-white flex-1 flex flex-col items-center justify-center"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          {t.hero.title}{" "}<span className="text-gold">{t.hero.brand}</span>
        </h1>
        <p className="text-lg md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
          {t.hero.subtitle}
        </p>
        <Button
          size="lg"
          asChild
          className="bg-gold text-primary hover:bg-gold-dark font-bold text-xl px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <a href="#contact">{t.hero.cta}</a>
        </Button>
      </motion.div>
    </section>
  );
}

function About() {
  const { t } = useLang();

  const statCards = [
    {
      icon: <Users className="w-7 h-7 text-white" />,
      target: 1000,
      suffix: "+",
      label: t.about.stat1,
      gradient: "from-blue-500 to-blue-700",
      glow: "shadow-blue-400/40",
    },
    {
      icon: <GraduationCap className="w-7 h-7 text-white" />,
      target: 50,
      suffix: "+",
      label: t.about.stat2,
      gradient: "from-emerald-500 to-emerald-700",
      glow: "shadow-emerald-400/40",
    },
    {
      icon: <Award className="w-7 h-7 text-white" />,
      target: 15,
      suffix: "+",
      label: t.about.stat3,
      gradient: "from-gold to-gold-dark",
      glow: "shadow-gold/40",
    },
    {
      icon: <Target className="w-7 h-7 text-white" />,
      target: 20,
      suffix: "+",
      label: t.about.stat4,
      gradient: "from-primary to-red-800",
      glow: "shadow-red-400/40",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.about.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.about.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeUpDelay(i * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className={`text-center border-none shadow-xl ${card.glow} shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
                <CardContent className="pt-6 pb-6 px-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${card.glow} shadow-md`}>
                    {card.icon}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-1">
                    <AnimatedCounter target={card.target} suffix={card.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{card.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const COURSE_FEATURES: Record<string, string[]> = {
  bac: [
    "رياضيات وفيزياء وعلوم",
    "متابعة فردية دقيقة",
    "اختبارات تجريبية دورية",
    "تطبيق عملي 100%",
  ],
  english: [
    "محادثة وكتابة وقراءة",
    "مستويات متعددة",
    "مدرسون متخصصون",
    "تمارين يومية تفاعلية",
  ],
  robotics: [
    "برمجة وتجميع روبوتات",
    "Scratch والبرمجة المرئية",
    "مشاريع عملية كل وحدة",
    "للأعمار 8-14 سنة",
  ],
};

function CoursesGrid() {
  const [activeTab, setActiveTab] = useState("adults");
  const { data: courses, isLoading } = useCourses();
  const { t } = useLang();

  const adultsCourses = (courses ?? []).filter((c) => c.category === "adults");
  const kidsCourses = (courses ?? []).filter((c) => c.category === "kids");

  const CATEGORY_TABS = [
    ...(adultsCourses.length > 0 ? [{ id: "adults", label: t.courses.adultsTab }] : []),
    ...(kidsCourses.length > 0 ? [{ id: "kids", label: t.courses.kidsTab }] : []),
  ];

  const firstAvailable = CATEGORY_TABS[0]?.id ?? "adults";
  const resolvedTab = CATEGORY_TABS.some((tab) => tab.id === activeTab) ? activeTab : firstAvailable;

  const currentCourses = resolvedTab === "adults" ? adultsCourses : kidsCourses;

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            {t.courses.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.courses.title}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.courses.desc}
          </p>
        </motion.div>

        {CATEGORY_TABS.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-1">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    resolvedTab === tab.id
                      ? "bg-gray-900 text-white shadow"
                      : "border border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
            >
              {currentCourses.map((course) => {
                const features = COURSE_FEATURES[course.id] ?? [
                  course.description || "محتوى تعليمي متميز",
                  `المدة: ${course.duration || "حسب الجدول"}`,
                ];
                const parts = course.price.split(" / ");
                return (
                  <div
                    key={course.id}
                    className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 ${
                      course.is_featured
                        ? "border-2 border-primary shadow-2xl scale-105 z-10"
                        : "border border-gray-100 shadow-md"
                    }`}
                  >
                    {course.is_featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                          {t.courses.popular}
                        </span>
                      </div>
                    )}

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-center mb-4 text-primary">
                        <CourseIcon icon={course.icon} courseId={course.id} className="w-12 h-12" />
                      </div>

                      <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                        {course.title}
                      </h3>

                      <div className="text-center mb-6">
                        <span className="text-3xl font-black text-primary">{parts[0]}</span>
                        <span className="text-gray-400 text-sm mr-1">
                          {parts[1] ? ` / ${parts[1]}` : ""}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-primary font-bold text-base leading-none">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#contact"
                        className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${
                          course.is_featured
                            ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
                            : "border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {t.courses.enroll}
                      </a>

                      <Link
                        href={`/courses/${course.id}`}
                        className="block text-center text-primary text-xs font-semibold mt-3 hover:underline"
                      >
                        {t.courses.learnMore}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

function Testimonials() {
  const { t } = useLang();
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="w-full overflow-hidden leading-none mb-0 -mt-1">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,0 L0,0 Z" fill="#f8fafc" />
        </svg>
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.testimonials.title}</h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <iframe
              src="https://drive.google.com/file/d/1FZWLh56OimAPSN0bBCCxd-CP6Jgk3Sgx/preview"
              className="w-full"
              style={{ height: "600px" }}
              allow="autoplay"
              title="شهادات الطلاب وأولياء الأمور"
            />
          </div>
          <div className="text-center mt-6">
            <a
              href="https://drive.google.com/file/d/1FZWLh56OimAPSN0bBCCxd-CP6Jgk3Sgx/view"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all"
            >
              {t.testimonials.viewAll}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQ() {
  const { data, isLoadingContent: isLoading } = useSiteContent();
  const { t } = useLang();
  const faqItems = data?.faq ?? [];

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.faq.title}</h2>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-lg border shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="bg-white px-6 rounded-lg mb-4 border shadow-sm">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary py-4">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}

function Branches() {
  const { t } = useLang();

  const branches = [
    {
      name: t.branches.branch1,
      address: "Hay Arroudj, Centre des Affaires Erriadh N°02, Chlef",
      maps: "https://maps.app.goo.gl/sHU7mRKx5rNMk89SA",
    },
    {
      name: t.branches.branch2,
      address: "Hay Arroudj, Centre des Affaires Erriadh N°02, Chlef",
      maps: "https://maps.app.goo.gl/PqruSFBzrdkExpy89",
    },
  ];

  return (
    <section id="branches" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t.branches.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.branches.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {branches.map((branch, i) => (
            <motion.div
              key={i}
              variants={fadeUpDelay(i * 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-7 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin size={22} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{branch.name}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{branch.address}</p>
              <a
                href={branch.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition-all shadow hover:shadow-md"
              >
                <MapPin size={16} />
                {t.branches.mapsBtn}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { data, isLoadingContent: isLoading } = useSiteContent();
  const { t } = useLang();
  const contact = data?.contact;
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const contactSchema = z.object({
    name: z.string().min(2, t.contact.nameErr),
    phone: z.string().min(8, t.contact.phoneErr),
    message: z.string().min(10, t.contact.msgErr),
  });
  type ContactFormValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || t.contact.errSend);
      }
      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t.contact.errGeneral);
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactItems = [
    {
      icon: <Phone size={26} className="text-white" />,
      title: t.contact.phone,
      info: contact?.phone ?? "0770 764 200\n0770 767 750\n0550 686 498",
      dir: "ltr" as const,
      gradient: "from-blue-500 to-blue-700",
      glow: "hover:shadow-blue-400/30",
    },
    {
      icon: <Mail size={26} className="text-white" />,
      title: t.contact.email,
      info: contact?.email ?? "nooracademyalgeria@gmail.com",
      dir: undefined,
      gradient: "from-primary to-red-700",
      glow: "hover:shadow-red-400/30",
    },
    {
      icon: <MapPin size={26} className="text-white" />,
      title: t.contact.address,
      info: contact?.address ?? "Hay Arroudj, Centre des Affaires Erriadh N°02 Chlef DZ، 02000",
      dir: undefined,
      gradient: "from-emerald-500 to-emerald-700",
      glow: "hover:shadow-emerald-400/30",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-white border-t">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">{t.contact.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-6 rounded-2xl border border-gray-100 shadow-md bg-white">
                  <Skeleton className="w-16 h-16 rounded-2xl mb-4" />
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))
            : contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpDelay(i * 0.15)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`flex flex-col items-center p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white ${item.glow}`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-800 font-semibold text-base whitespace-pre-line" dir={item.dir}>{item.info}</p>
                </motion.div>
              ))}
        </div>

        <div className="max-w-lg mx-auto flex flex-col gap-8 w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full bg-gray-50 rounded-2xl p-8 shadow-md border border-gray-100 text-start"
          >
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">{t.contact.successTitle}</h3>
                <p className="text-muted-foreground mb-6">{t.contact.successDesc}</p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="font-bold border-primary text-primary hover:bg-primary hover:text-white"
                >
                  {t.contact.sendAnother}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">{t.contact.nameLbl}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.contact.namePh}
                            {...field}
                            className="focus-visible:ring-primary focus-visible:border-primary h-11 bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">{t.contact.phoneLbl}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0555 XX XX XX"
                            dir="ltr"
                            className="focus-visible:ring-primary focus-visible:border-primary h-11 bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-700">{t.contact.msgLbl}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t.contact.msgPh}
                            rows={5}
                            {...field}
                            className="focus-visible:ring-primary focus-visible:border-primary bg-white resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg text-center">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? t.contact.sending : t.contact.send}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>

          <motion.div
            variants={fadeUpDelay(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="bg-gray-50 rounded-2xl px-8 py-6 shadow-md border border-gray-100 flex flex-col items-center gap-4">
              <p className="text-base font-bold text-gray-600 tracking-wide">{t.contact.followUs}</p>
              <div className="flex flex-row items-center justify-center gap-5">
                <a
                  href="https://www.instagram.com/noor_academyalgeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white shadow hover:scale-110 hover:shadow-lg transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/NoorAcademy.Algeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow hover:scale-110 hover:shadow-lg transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC6HwVZGpRGfOhv_dpVarcbA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow hover:scale-110 hover:shadow-lg transition-all duration-200"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { data } = useSiteContent();
  const { t } = useLang();
  const contact = data?.contact;

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold font-sans mb-4">
              <span className="text-white">{t.brandFirst}</span>{" "}
              <span className="text-gold">{t.brandSecond}</span>
            </div>
            <p className="text-white/80 max-w-sm">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              <li><a href="#hero" className="text-white/80 hover:text-white transition-colors">{t.nav.home}</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white transition-colors">{t.nav.about}</a></li>
              <li><a href="#courses" className="text-white/80 hover:text-white transition-colors">{t.footer.ourCourses}</a></li>
              <li><a href="#faq" className="text-white/80 hover:text-white transition-colors">{t.nav.faq}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-gold">{t.footer.contactCol}</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2"><MapPin size={18} className="text-gold" /> {contact?.address ?? "شلف، الجزائر"}</li>
              <li className="flex items-start gap-2"><Phone size={18} className="text-gold mt-1 shrink-0" /> <span dir="ltr" className="whitespace-pre-line">{contact?.phone ?? "0770 764 200\n0770 767 750\n0550 686 498"}</span></li>
              <li className="flex items-center gap-2"><Mail size={18} className="text-gold" /> {contact?.email ?? "contact@nour-academy.dz"}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60 text-sm">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { dir } = useLang();
  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir={dir}>
      <Navbar />
      <Hero />
      <About />
      <div className="bg-gray-50 -mt-1">
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,0 720,60 1080,30 C1260,15 1380,45 1440,30 L1440,60 L0,60 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
      <CoursesGrid />
      <div className="bg-white -mt-1">
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>
      <Testimonials />
      <FAQ />
      <Branches />
      <Contact />
      <Footer />

      {/* WhatsApp Button */}
      <a
        href="https://api.whatsapp.com/send?phone=213770764200&text=%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 start-6 z-50 w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-110 transition-transform"
        style={{ background: "#25D366" }}
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
