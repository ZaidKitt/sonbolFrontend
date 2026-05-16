"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Language = "ar" | "en";

type Product = {
  id: number;
  title_ar: string;
  title_en: string;
  image: string | null;
  price_jod: string;
  is_in_stock: boolean;
};

type ServiceItem = {
  code: string;
  name: string;
  meta: string;
  price: string;
};

type ServiceGroup = {
  title: string;
  count: string;
  items: ServiceItem[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const SHOP_PHONE = "0789299699";
const LOCATION_URL = "https://maps.app.goo.gl/pqGYKWD1NurxMs1W7?g_st=ic";

const copy = {
  ar: {
    lang: "EN",
    brand: "SONBOL",
    brandAr: "سنبل",
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navProducts: "المنتجات",
    navLocation: "الموقع",
    book: "احجز الآن",
    heroEyebrow: "صالون رجالي في عمّان",
    heroTitle: "خبرة، مهارة، دقة واحترافية",
    heroLine: "خدمات متميزة",
    heroNote: "تبدأ المواعيد من الساعة 12 ظهراً وحتى الساعة 10 مساءً",
    location: "الوصول للموقع الجغرافي",
    imageAlt: "داخل صالون سنبل",
    facts: [
      { label: "الحجز", value: "خطوات قصيرة" },
      { label: "الدفع", value: "CLIQ SKH46" },
      { label: "التأكيد", value: "بعد الدفع" },
    ],
    visitEyebrow: "قبل الموعد",
    visitTitle: "موعدك واضح من الحجز لحد الكرسي.",
    visitText: "الحجز عند سنبل مش محتاج شرح طويل. اختار الخدمة والوقت، ادفع على كليك، وبعدها يصلك تأكيد الموعد.",
    visitCards: [
      { label: "01", title: "اختار وقتك", text: "الخدمات والأسعار واضحة قبل ما تثبت الحجز." },
      { label: "02", title: "ادفع على كليك", text: "حوّل المبلغ على alias: SKH46، وبعد وصول الدفع يتم تثبيت الموعد." },
      { label: "03", title: "تعال قبل بربع ساعة", text: "بعد التأكيد، الوصول قبل الموعد يساعدنا نحافظ على الدور." },
    ],
    visitNoteTitle: "تغيير أو إلغاء؟",
    visitNoteText: "اتصل بسنبل على 0789299699. الإلغاء من الموقع غير متاح.",
    servicesEyebrow: "القائمة",
    servicesTitle: "دقة بالمواعيد واهتمام بالتفاصيل.",
    servicesSubtitle: "السعر والوقت واضحين قبل ما تحجز، والنظام يحسب توفر الحلاق بدقة.",
    productsEyebrow: "المنتجات",
    productsTitle: "منتجات موجودة في الصالون.",
    productsSubtitle: "الشراء من المحل فقط. اضغط على المنتج وشوف حالته وطريقة التواصل.",
    productsLoading: "جاري تحميل المنتجات...",
    productsEmpty: "لا توجد منتجات ظاهرة حالياً.",
    locationEyebrow: "موقعنا 📍",
    locationTitle: "الأردن - البلقاء - عين الباشا",
    locationText: "بإمكانك الضغط على الرابط أدناه للوصول إلى الموقع الجغرافي.",
    locationAddress: "Sonbol Men’s Barber Shop, St, Ein Al-Basha 19374",
    phoneLabel: "الهاتف",
    hoursLabel: "الدوام",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    buyTitle: "شراء المنتج",
    restockTitle: "غير متوفر حالياً",
    buyMessage: "لشراء هذا المنتج اتصل بسنبل على:",
    restockMessage: "المنتج غير متوفر حالياً. إذا تريده اتصل بسنبل، وغالباً يصل أقرب يوم خميس.",
    close: "إغلاق",
    finalTitle: "جاهز ترتب موعدك؟",
    finalText: "اختار الخدمة والوقت المناسب، وبعد تحويل المبلغ على كليك يتم تثبيت الحجز.",
    footerTagline: "خبرة، مهارة، ودقة في كل زيارة.",
    footerQuick: "روابط سريعة",
    footerContact: "تواصل",
    footerRights: "سنبل. كل الحقوق محفوظة.",
    serviceGroups: [
      {
        title: "الشعر واللحية",
        count: "4 خدمات",
        items: [
          { code: "hair-beard-blowdry-scrub-mask", name: "شعر + لحية + سشوار + سنفرة أو ماسك", meta: "40 دقيقة", price: "7 د.أ" },
          { code: "haircut", name: "قص شعر", meta: "30 دقيقة", price: "4 د.أ" },
          { code: "beard", name: "تهذيب لحية", meta: "20 دقيقة", price: "3 د.أ" },
          { code: "kids", name: "قص أطفال", meta: "20 دقيقة", price: "3 د.أ" },
        ],
      },
      {
        title: "العناية والتجهيز",
        count: "5 خدمات",
        items: [
          { code: "blowdry", name: "سشوار", meta: "10 دقائق", price: "2 د.أ" },
          { code: "steam-oil-bath", name: "حمام زيت عالبخار", meta: "30 دقيقة", price: "10 د.أ" },
          { code: "protein", name: "بروتين", meta: "ساعة و30 دقيقة", price: "من 20 د.أ" },
          { code: "skin-cleaning", name: "تنظيف بشرة", meta: "ساعة و30 دقيقة", price: "15 د.أ" },
          { code: "home-haircut", name: "حلاقة منزلية", meta: "ساعة و30 دقيقة", price: "20 د.أ" },
        ],
      },
      {
        title: "المناسبات",
        count: "خدمة واحدة",
        items: [{ code: "groom-package", name: "بكج العريس", meta: "3 ساعات", price: "50 د.أ" }],
      },
    ] satisfies ServiceGroup[],
  },
  en: {
    lang: "عربي",
    brand: "SONBOL",
    brandAr: "سنبل",
    navHome: "Home",
    navServices: "Services",
    navProducts: "Products",
    navLocation: "Location",
    book: "Book now",
    heroEyebrow: "Men's salon in Amman",
    heroTitle: "Experience, skill, precision, and professionalism",
    heroLine: "Premium services",
    heroNote: "Appointments start at 12 PM and run until 10 PM",
    location: "Get directions",
    imageAlt: "Inside Sonbol Salon",
    facts: [
      { label: "Booking", value: "Short steps" },
      { label: "Payment", value: "CLIQ SKH46" },
      { label: "Confirm", value: "After payment" },
    ],
    visitEyebrow: "Before your appointment",
    visitTitle: "Your visit is clear from booking to chair.",
    visitText: "Booking with Sonbol stays simple. Choose the service and time, pay through CLIQ, then receive your appointment confirmation.",
    visitCards: [
      { label: "01", title: "Choose your time", text: "Services, prices, and duration are clear before booking." },
      { label: "02", title: "Pay with CLIQ", text: "Send payment to alias: SKH46. Once payment arrives, the appointment is confirmed." },
      { label: "03", title: "Arrive 15 minutes early", text: "After confirmation, arriving early keeps the schedule smooth." },
    ],
    visitNoteTitle: "Need to change or cancel?",
    visitNoteText: "Call Sonbol at 0789299699. Website cancellation is not available.",
    servicesEyebrow: "Menu",
    servicesTitle: "Precise appointments and attention to detail.",
    servicesSubtitle: "Price and time are clear before booking, and barber availability is checked precisely.",
    productsEyebrow: "Products",
    productsTitle: "Products available at the salon.",
    productsSubtitle: "Products are bought in-store only. Tap a card to check availability and contact details.",
    productsLoading: "Loading products...",
    productsEmpty: "No products are visible right now.",
    locationEyebrow: "Our location 📍",
    locationTitle: "Jordan - Balqa - Ein Al-Basha",
    locationText: "Use the link below to reach the location on Google Maps.",
    locationAddress: "Sonbol Men’s Barber Shop, St, Ein Al-Basha 19374",
    phoneLabel: "Phone",
    hoursLabel: "Hours",
    inStock: "In stock",
    outOfStock: "Out of stock",
    buyTitle: "Buy product",
    restockTitle: "Currently out of stock",
    buyMessage: "To buy this product, call Sonbol at:",
    restockMessage: "This product is currently out of stock. Call Sonbol if you want it. It usually arrives on the nearest Thursday.",
    close: "Close",
    finalTitle: "Ready to set your time?",
    finalText: "Choose your service and time. After the CLIQ transfer arrives, the appointment is confirmed.",
    footerTagline: "Experience, skill, and precision on every visit.",
    footerQuick: "Quick links",
    footerContact: "Contact",
    footerRights: "Sonbol. All rights reserved.",
    serviceGroups: [
      {
        title: "Hair and Beard",
        count: "4 services",
        items: [
          { code: "hair-beard-blowdry-scrub-mask", name: "Hair + Beard + Blow Dry + Scrub or Mask", meta: "40 min", price: "7 JOD" },
          { code: "haircut", name: "Haircut", meta: "30 min", price: "4 JOD" },
          { code: "beard", name: "Beard Trim", meta: "20 min", price: "3 JOD" },
          { code: "kids", name: "Kids Haircut", meta: "20 min", price: "3 JOD" },
        ],
      },
      {
        title: "Care and Styling",
        count: "5 services",
        items: [
          { code: "blowdry", name: "Blow Dry", meta: "10 min", price: "2 JOD" },
          { code: "steam-oil-bath", name: "Steam Oil Bath", meta: "30 min", price: "10 JOD" },
          { code: "protein", name: "Protein", meta: "1h 30m", price: "from 20 JOD" },
          { code: "skin-cleaning", name: "Facial Cleaning", meta: "1h 30m", price: "15 JOD" },
          { code: "home-haircut", name: "Home Haircut", meta: "1h 30m", price: "20 JOD" },
        ],
      },
      {
        title: "Occasions",
        count: "1 service",
        items: [{ code: "groom-package", name: "Groom Package", meta: "3h", price: "50 JOD" }],
      },
    ] satisfies ServiceGroup[],
  },
};

function formatProductPrice(value: string, lang: Language) {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return lang === "ar" ? `${value} د.أ` : `${value} JOD`;
  }

  return lang === "ar" ? `${amount.toFixed(2)} د.أ` : `${amount.toFixed(2)} JOD`;
}

export default function Home() {
  const [lang, setLang] = useState<Language>("ar");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const t = copy[lang];
  const isArabic = lang === "ar";

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setProductsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/products/`);
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = (await response.json()) as Product[];
        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      id="top"
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen overflow-hidden bg-[#050b17] text-slate-100 selection:bg-[#c8ad72] selection:text-[#050b17]"
    >
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_0%,rgba(43,88,130,0.38),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(148,163,184,0.14),transparent_30%),linear-gradient(180deg,#071426_0%,#050b17_48%,#030712_100%)]" />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#050b17]/[0.82] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[76px]">
          <a href="#top" className="flex min-w-0 items-center gap-3" aria-label={t.brandAr}>
            <span className="relative flex size-14 items-center justify-center rounded-xl border border-white/20 bg-white/[0.07]">
              <Image src="/assets/logo-transparent.png" alt="" fill sizes="56px" className="object-contain p-2 brightness-0 invert" />
            </span>
            <span className="leading-none">
              <span className="block font-serif text-xl font-black italic tracking-widest text-white sm:text-2xl">{t.brand}</span>
              <span className="mt-1 block text-[11px] font-bold text-[#c8ad72]">{t.brandAr}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-300 lg:flex" aria-label="Main navigation">
            <a className="transition hover:text-white" href="#top">{t.navHome}</a>
            <a className="transition hover:text-white" href="#services">{t.navServices}</a>
            <a className="transition hover:text-white" href="#products">{t.navProducts}</a>
            <a className="transition hover:text-white" href="#location">
              {t.navLocation}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/20 px-3 py-2 text-xs font-black text-white transition hover:border-white/[0.45] hover:bg-white/10 sm:text-sm"
              onClick={() => setLang((current) => (current === "ar" ? "en" : "ar"))}
            >
              {t.lang}
            </button>
            <Link
              href="/booking"
              className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#071426] shadow-[0_16px_36px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4efe5] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {t.book}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div className="animate-[rise_700ms_ease_both]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.07] px-3 py-2 text-xs font-black text-[#d4bd84]">
              <span className="size-1.5 rounded-full bg-[#d4bd84] shadow-[0_0_18px_rgba(212,189,132,0.88)]" />
              {t.heroEyebrow}
            </div>
            <p className="mb-3 text-sm font-black text-slate-400">{t.heroNote}</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.08] text-white sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-300 sm:text-xl">
              {t.heroLine}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
              >
                {t.book}
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 bg-white/[0.07] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:border-white/[0.45] hover:bg-white/[0.12]"
                href={LOCATION_URL}
                target="_blank"
                rel="noreferrer"
              >
                {t.location}
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-xl">
              {t.facts.map((fact, index) => (
                <div
                  className="animate-[rise_650ms_ease_both] rounded-lg border border-white/[0.16] bg-white/[0.055] p-3 backdrop-blur"
                  style={{ animationDelay: `${160 + index * 85}ms` }}
                  key={fact.label}
                >
                  <span className="block text-[11px] font-black text-slate-500">{fact.label}</span>
                  <strong className="mt-1 block text-sm font-black text-white">{fact.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-[rise_800ms_ease_both_140ms]">
            <div className="absolute -inset-3 rounded-lg border border-white/10 bg-[#173150]/20 blur-2xl animate-[soft-pulse_6s_ease-in-out_infinite]" />
            <div className="relative overflow-hidden rounded-lg border border-white/25 bg-white/[0.055] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#111827] sm:aspect-[16/11] lg:aspect-[4/3]">
                <Image
                  src="/assets/salon-interior-wide.jpeg"
                  alt={t.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,23,0.02),rgba(5,11,23,0.42))]" />
                <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-lg border border-white/[0.16] bg-[#071426]/80 p-3 backdrop-blur-xl">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[line-scan_4s_linear_infinite]" />
                  <span className="relative block font-serif text-2xl font-black italic tracking-widest text-white">{t.brand}</span>
                  <span className="relative mt-1 block text-xs font-bold leading-5 text-slate-300">{t.heroNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-black text-[#c8ad72]">{t.servicesEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{t.servicesTitle}</h2>
            <p className="mt-4 text-base font-bold leading-8 text-slate-400">{t.servicesSubtitle}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {t.serviceGroups.map((group, groupIndex) => (
              <article
                className="animate-[rise_650ms_ease_both] rounded-lg border border-white/[0.18] bg-white/[0.045] p-4 shadow-[0_18px_58px_rgba(0,0,0,0.22)] backdrop-blur"
                style={{ animationDelay: `${groupIndex * 90}ms` }}
                key={group.title}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-white">{group.title}</h3>
                  <span className="rounded-full border border-white/[0.18] px-3 py-1 text-xs font-black text-slate-300">{group.count}</span>
                </div>
                <div className="grid gap-3">
                  {group.items.map((service) => (
                    <Link
                      className="block rounded-lg border border-white/[0.12] bg-[#0b1628]/80 p-4 transition hover:-translate-y-0.5 hover:border-[#c8ad72]/55 hover:bg-[#101d31]"
                      href={`/booking?service=${encodeURIComponent(service.code)}`}
                      key={service.name}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-black leading-7 text-white">{service.name}</h4>
                        <strong className="shrink-0 text-sm font-black text-[#d6bf86]">{service.price}</strong>
                      </div>
                      <p className="mt-3 text-sm font-bold text-slate-400">{service.meta}</p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.96fr_1.04fr] lg:items-stretch">
          <div className="rounded-lg border border-white/[0.18] bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:p-8">
            <p className="text-sm font-black text-[#c8ad72]">{t.visitEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{t.visitTitle}</h2>
            <p className="mt-4 text-base font-bold leading-8 text-slate-400">{t.visitText}</p>

            <div className="mt-6 grid gap-3">
              {t.visitCards.map((card) => (
                <div className="grid gap-3 rounded-lg border border-white/[0.12] bg-[#0b1628]/85 p-4 sm:grid-cols-[56px_1fr]" key={card.label}>
                  <span className="flex size-12 items-center justify-center rounded-lg border border-[#d6bf86]/35 bg-[#d6bf86]/10 text-sm font-black text-[#d6bf86]">
                    {card.label}
                  </span>
                  <span>
                    <strong className="block text-lg font-black text-white">{card.title}</strong>
                    <span className="mt-2 block text-sm font-bold leading-7 text-slate-400">{card.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/[0.18] bg-white/[0.05] shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:min-h-[420px]">
              <Image src="/assets/salon-interior-chairs.jpeg" alt={t.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,11,23,0.62),rgba(5,11,23,0.03)_54%)]" />
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/[0.16] bg-[#071426]/85 p-4 backdrop-blur-xl">
                <span className="block text-xs font-black text-[#d6bf86]">CLIQ</span>
                <strong className="mt-1 block text-2xl font-black text-white">SKH46</strong>
                <span className="mt-2 block text-sm font-bold leading-6 text-slate-300">{t.visitNoteTitle}</span>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.18] bg-[#0b1628]/85 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#c8ad72]">{t.visitNoteTitle}</p>
                  <p className="mt-2 text-sm font-bold leading-7 text-slate-300">{t.visitNoteText}</p>
                </div>
                <a
                  className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
                  href={`tel:${SHOP_PHONE}`}
                >
                  {SHOP_PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="relative z-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 max-w-3xl">
            <p className="text-sm font-black text-[#c8ad72]">{t.productsEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{t.productsTitle}</h2>
            <p className="mt-4 text-base font-bold leading-8 text-slate-400">{t.productsSubtitle}</p>
          </div>

          {productsLoading ? (
            <p className="rounded-lg border border-white/[0.14] bg-white/[0.045] p-4 text-sm font-bold text-slate-300">{t.productsLoading}</p>
          ) : null}
          {!productsLoading && !products.length ? (
            <p className="rounded-lg border border-white/[0.14] bg-white/[0.045] p-4 text-sm font-bold text-slate-300">{t.productsEmpty}</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <button
                className="group overflow-hidden rounded-lg border border-white/[0.14] bg-white/[0.045] p-3 text-start transition hover:-translate-y-1 hover:border-[#c8ad72]/60 hover:bg-white/[0.075]"
                key={product.id}
                type="button"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-[#101827]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={isArabic ? product.title_ar : product.title_en || product.title_ar}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-sm font-black text-slate-500">
                      {isArabic ? "صورة المنتج" : "Product image"}
                    </span>
                  )}
                  <span
                    className={`absolute top-3 ${isArabic ? "right-3" : "left-3"} rounded-full border px-3 py-1 text-xs font-black ${
                      product.is_in_stock
                        ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-200"
                        : "border-rose-300/35 bg-rose-400/15 text-rose-200"
                    }`}
                  >
                    {product.is_in_stock ? t.inStock : t.outOfStock}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black text-white">{isArabic ? product.title_ar : product.title_en || product.title_ar}</h3>
                <p className="mt-2 text-sm font-black text-[#d6bf86]">{formatProductPrice(product.price_jod, lang)}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="relative z-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-white/[0.18] bg-white/[0.045] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:p-8">
            <p className="text-sm font-black text-[#c8ad72]">{t.locationEyebrow}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{t.locationTitle}</h2>
            <p className="mt-4 text-base font-bold leading-8 text-slate-400">{t.locationText}</p>

            <div className="mt-6 grid gap-3">
              <a
                className="block rounded-lg border border-white/[0.12] bg-[#0b1628]/85 p-4 transition hover:-translate-y-0.5 hover:border-[#c8ad72]/55 hover:bg-[#101d31]"
                href={LOCATION_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span className="block text-xs font-black text-slate-500">{t.navLocation}</span>
                <strong className="mt-2 block text-base font-black leading-7 text-white">{t.locationAddress}</strong>
              </a>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/[0.12] bg-[#0b1628]/85 p-4">
                  <span className="block text-xs font-black text-slate-500">{t.hoursLabel}</span>
                  <strong className="mt-2 block text-sm font-black text-white">{t.heroNote}</strong>
                </div>
                <div className="rounded-lg border border-white/[0.12] bg-[#0b1628]/85 p-4">
                  <span className="block text-xs font-black text-slate-500">{t.phoneLabel}</span>
                  <a className="mt-2 block text-sm font-black text-white" href={`tel:${SHOP_PHONE}`}>
                    {SHOP_PHONE}
                  </a>
                </div>
              </div>
            </div>

            <a
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5] sm:w-auto"
              href={LOCATION_URL}
              target="_blank"
              rel="noreferrer"
            >
              {t.location}
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 overflow-hidden rounded-lg border border-white/[0.18] bg-[#0b1628] p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black text-[#c8ad72]">SONBOL</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">{t.finalTitle}</h2>
            <p className="mt-4 max-w-2xl text-base font-bold leading-8 text-slate-400">{t.finalText}</p>
          </div>
          <Link
            href="/booking"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
          >
            {t.book}
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex size-14 items-center justify-center rounded-xl border border-white/20 bg-white/[0.07]">
                <Image src="/assets/logo-transparent.png" alt="" fill sizes="56px" className="object-contain p-2 brightness-0 invert" />
              </span>
              <span>
                <span className="block font-serif text-2xl font-black italic tracking-widest text-white">{t.brand}</span>
                <span className="mt-1 block text-xs font-bold text-[#c8ad72]">{t.brandAr}</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm font-bold leading-7 text-slate-400">{t.footerTagline}</p>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#c8ad72]">{t.footerQuick}</h3>
            <div className="mt-4 grid gap-3 text-sm font-bold text-slate-300">
              <a className="transition hover:text-white" href="#top">{t.navHome}</a>
              <a className="transition hover:text-white" href="#services">{t.navServices}</a>
              <a className="transition hover:text-white" href="#products">{t.navProducts}</a>
              <a className="transition hover:text-white" href="#location">{t.navLocation}</a>
              <Link className="transition hover:text-white" href="/booking">{t.book}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#c8ad72]">{t.footerContact}</h3>
            <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-slate-300">
              <a className="transition hover:text-white" href={`tel:${SHOP_PHONE}`}>{SHOP_PHONE}</a>
              <a className="transition hover:text-white" href={LOCATION_URL} target="_blank" rel="noreferrer">
                {t.locationAddress}
              </a>
              <span>{t.heroNote}</span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs font-bold text-slate-500">
          {t.footerRights}
        </div>
      </footer>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-3 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-md animate-[rise_240ms_ease_both] rounded-lg border border-white/[0.18] bg-[#081426] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm font-black text-[#c8ad72]">{selectedProduct.is_in_stock ? t.buyTitle : t.restockTitle}</p>
            <h2 className="mt-3 text-2xl font-black">{isArabic ? selectedProduct.title_ar : selectedProduct.title_en || selectedProduct.title_ar}</h2>
            <p className="mt-4 text-sm font-bold leading-7 text-slate-300">{selectedProduct.is_in_stock ? t.buyMessage : t.restockMessage}</p>
            <a className="mt-4 inline-flex rounded-lg border border-white/[0.18] bg-white/[0.08] px-4 py-3 font-black text-white" href={`tel:${SHOP_PHONE}`}>
              {SHOP_PHONE}
            </a>
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-[#071426]"
              onClick={() => setSelectedProduct(null)}
            >
              {t.close}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
