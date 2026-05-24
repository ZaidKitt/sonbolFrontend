"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Language = "ar" | "en";

type Service = {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  price_jod: string;
  price_label_ar: string;
  price_label_en: string;
  duration_minutes: number;
  booking_type: "standard" | "split_90" | "fast_5";
};

type Barber = {
  id: number;
  name_ar: string;
  name_en: string;
  image: string | null;
};

type Slot = {
  start_at: string;
  time: string;
};

type AppointmentResponse = {
  id: number;
  status: string;
  start_at: string;
  payment: {
    alias: string;
    amount_ar: string;
    amount_en: string;
    cancellation_phone: string;
  };
};

type FormState = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const SHOP_PHONE = "0789299699";

const copy = {
  ar: {
    back: "الرئيسية",
    switch: "EN",
    eyebrow: "حجز موعد",
    title: "اختار موعدك عند سنبل",
    subtitle: "خمس خطوات قصيرة. بعدها ادفع على كليك، وبعد وصول الدفع يتم تثبيت الموعد.",
    service: "الخدمة",
    barber: "الحلاق",
    day: "اليوم",
    time: "الوقت",
    details: "بياناتك",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال طلب الحجز",
    submitting: "جاري الإرسال...",
    summary: "ملخص الحجز",
    chosen: "اختيارك",
    selectService: "اختار الخدمة المناسبة",
    addOns: "إضافات الموعد",
    disposableTowel: "منشفة استخدام مرة واحدة",
    disposableTowelText: "أضف منشفة جديدة للموعد مقابل 1 د.أ.",
    groomBookingTitle: "حجز بكج العريس",
    groomBookingText: "لحجز بكج العريس، يرجى الاتصال بصالون سنبل مباشرة حتى يتم ترتيب التفاصيل والوقت المناسب.",
    callSalon: "اتصل بصالون سنبل",
    towelSummary: "المنشفة",
    total: "المبلغ",
    yes: "نعم",
    no: "لا",
    selectBarber: "اختار الحلاق",
    selectDay: "اختار اليوم",
    selectTime: "اختار الوقت",
    fillDetails: "اكتب بيانات التواصل",
    loading: "جاري التحميل...",
    loadingSlots: "جاري جلب الأوقات...",
    noSlots: "لا توجد أوقات متاحة لهذا اليوم.",
    noTimeYet: "اختار اليوم أولاً، ثم انتقل للوقت.",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    selected: "مختار",
    notSelected: "لم يتم الاختيار",
    required: "أكمل هذه الخطوة قبل المتابعة.",
    detailsRequired: "اكتب الاسم والبريد ورقم الهاتف.",
    successTitle: "تم إرسال طلب الحجز",
    successIntro: "ادفع مبلغ الحجز عبر كليك إلى:",
    cliq: "CLIQ",
    refund: "المبلغ قابل للاسترداد بالكامل فقط عند الإلغاء قبل الموعد بـ 3 ساعات أو أكثر. إذا كان الإلغاء خلال أقل من 3 ساعات، يتم استرداد نصف المبلغ فقط.",
    cancel: "لا يمكن إلغاء الموعد من الموقع. للإلغاء اتصل بصالون سنبل على:",
    approval: "بعد تحويل الدفعة ووصولها، سيتم تثبيت الموعد وإرسال بريد التأكيد.",
    close: "إغلاق",
    errorGeneric: "حدث خطأ. حاول مرة أخرى.",
  },
  en: {
    back: "Home",
    switch: "عربي",
    eyebrow: "Book an appointment",
    title: "Choose your time at Sonbol",
    subtitle: "Five short steps. Pay through CLIQ. Once payment arrives, the appointment is confirmed.",
    service: "Service",
    barber: "Barber",
    day: "Day",
    time: "Time",
    details: "Details",
    next: "Next",
    previous: "Back",
    submit: "Submit booking request",
    submitting: "Submitting...",
    summary: "Booking summary",
    chosen: "Your choice",
    selectService: "Choose a service",
    addOns: "Appointment add-ons",
    disposableTowel: "Single-use towel",
    disposableTowelText: "Add a fresh single-use towel for 1 JOD.",
    groomBookingTitle: "Groom package booking",
    groomBookingText: "To book the groom package, please call Sonbol Salon directly so the details and timing can be arranged.",
    callSalon: "Call Sonbol Salon",
    towelSummary: "Towel",
    total: "Amount",
    yes: "Yes",
    no: "No",
    selectBarber: "Choose a barber",
    selectDay: "Choose a day",
    selectTime: "Choose a time",
    fillDetails: "Enter your contact details",
    loading: "Loading...",
    loadingSlots: "Loading times...",
    noSlots: "No available times on this day.",
    noTimeYet: "Choose a day first, then continue to time.",
    name: "Full name",
    email: "Email",
    phone: "Phone number",
    selected: "Selected",
    notSelected: "Not selected",
    required: "Complete this step before continuing.",
    detailsRequired: "Enter your name, email, and phone number.",
    successTitle: "Booking request sent",
    successIntro: "Pay the booking amount by CLIQ to:",
    cliq: "CLIQ",
    refund: "The amount is fully refundable only if cancellation happens at least 3 hours before the appointment. Less than 3 hours before means only 50% is refundable.",
    cancel: "Appointments cannot be cancelled on the website. To cancel, call Sonbol Salon at:",
    approval: "Once the payment transfer arrives, the appointment is confirmed and a confirmation email is sent.",
    close: "Close",
    errorGeneric: "Something went wrong. Please try again.",
  },
};

function formatDuration(minutes: number, lang: Language) {
  if (minutes === 90) {
    return lang === "ar" ? "ساعة و30 دقيقة" : "1h 30m";
  }

  if (minutes >= 60) {
    const hours = minutes / 60;
    if (lang === "ar") {
      return hours === 1 ? "ساعة" : `${hours} ساعات`;
    }
    return `${hours}h`;
  }

  return lang === "ar" ? `${minutes} ${minutes === 10 ? "دقائق" : "دقيقة"}` : `${minutes} min`;
}

function todayDateString(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isTuesday(value: string) {
  return new Date(`${value}T12:00:00`).getDay() === 2;
}

function bookableDateStrings() {
  return Array.from({ length: 15 }, (_, index) => todayDateString(index)).filter((dateValue) => !isTuesday(dateValue));
}

function formatDay(value: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatFullDate(value: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function displayTime(value: string, lang: Language) {
  const [hourValue, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hourValue, minute, 0, 0);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-JO" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatJodAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function formatBookingAmount(service: Service | null, wantsDisposableTowel: boolean, lang: Language) {
  if (!service) {
    return "";
  }

  if (!wantsDisposableTowel) {
    return lang === "ar" ? service.price_label_ar : service.price_label_en;
  }

  const total = Number.parseFloat(service.price_jod) + 1;
  const amount = formatJodAmount(Number.isFinite(total) ? total : 1);

  if (lang === "ar") {
    const prefix = service.price_label_ar.includes("ابتداء") ? "ابتداءً من " : "";
    return `${prefix}${amount} د.أ`;
  }

  const prefix = service.price_label_en.toLowerCase().startsWith("from") ? "from " : "";
  return `${prefix}${amount} JOD`;
}

function isGroomPackage(service: Service) {
  return service.code === "groom-package";
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = copy.ar.errorGeneric;
    try {
      const payload = await response.json();
      if (typeof payload.detail === "string") {
        message = payload.detail;
      } else if (Array.isArray(payload.start_at)) {
        message = payload.start_at[0];
      } else if (typeof payload.start_at === "string") {
        message = payload.start_at;
      } else {
        message = JSON.stringify(payload);
      }
    } catch {
      message = response.statusText;
    }
    throw new Error(message);
  }

  return response.json();
}

export default function BookingPage() {
  const [lang, setLang] = useState<Language>("ar");
  const [stepIndex, setStepIndex] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => bookableDateStrings()[0] ?? todayDateString(0));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [wantsDisposableTowel, setWantsDisposableTowel] = useState(false);
  const [towelPromptOpen, setTowelPromptOpen] = useState(false);
  const [groomContactOpen, setGroomContactOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  });
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<AppointmentResponse | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToStep = useRef(false);

  const t = copy[lang];
  const isArabic = lang === "ar";
  const dates = useMemo(() => bookableDateStrings(), []);
  const selectedService = services.find((service) => service.id === selectedServiceId) ?? null;
  const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId) ?? null;
  const bookingAmount = formatBookingAmount(selectedService, wantsDisposableTowel, lang);
  const steps = [t.service, t.barber, t.day, t.time, t.details];

  function scrollToBookingForm() {
    window.requestAnimationFrame(() => {
      const target = formRef.current;
      if (!target) {
        return;
      }

      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    });
  }

  function scrollToStepControls() {
    window.requestAnimationFrame(() => {
      const target = navigationRef.current;
      if (!target) {
        return;
      }

      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth",
      });
    });
  }

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setLoadingInitial(true);
      setError("");
      try {
        const [servicesData, barbersData] = await Promise.all([
          fetchJson<Service[]>(`${API_BASE}/services/`),
          fetchJson<Barber[]>(`${API_BASE}/barbers/`),
        ]);

        if (!active) {
          return;
        }

        const requestedService = new URLSearchParams(window.location.search).get("service");
        const matchedService = requestedService
          ? servicesData.find((service) => service.code === requestedService || String(service.id) === requestedService)
          : null;

        setServices(servicesData);
        setBarbers(barbersData);
        if (matchedService) {
          if (isGroomPackage(matchedService)) {
            setGroomContactOpen(true);
          } else {
            setSelectedServiceId(matchedService.id);
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : copy.ar.errorGeneric);
        }
      } finally {
        if (active) {
          setLoadingInitial(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSlots() {
      if (!selectedServiceId || !selectedBarberId || !selectedDate) {
        setSlots([]);
        return;
      }

      setLoadingSlots(true);
      setError("");
      setSelectedSlot(null);

      try {
        const payload = await fetchJson<{ slots: Slot[] }>(
          `${API_BASE}/availability/?service=${selectedServiceId}&barber=${selectedBarberId}&date=${selectedDate}`,
        );

        if (active) {
          setSlots(payload.slots);
        }
      } catch (slotError) {
        if (active) {
          setSlots([]);
          setError(slotError instanceof Error ? slotError.message : t.errorGeneric);
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [selectedServiceId, selectedBarberId, selectedDate, t.errorGeneric]);

  useEffect(() => {
    if (!shouldScrollToStep.current) {
      return;
    }

    shouldScrollToStep.current = false;
    scrollToBookingForm();
  }, [stepIndex]);

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function currentStepComplete() {
    if (stepIndex === 0) {
      return Boolean(selectedServiceId);
    }
    if (stepIndex === 1) {
      return Boolean(selectedBarberId);
    }
    if (stepIndex === 2) {
      return Boolean(selectedDate);
    }
    if (stepIndex === 3) {
      return Boolean(selectedSlot);
    }
    return Boolean(form.customer_name && form.customer_email && form.customer_phone);
  }

  function continueStep() {
    setError("");
    if (!currentStepComplete()) {
      setError(stepIndex === 4 ? t.detailsRequired : t.required);
      scrollToBookingForm();
      return;
    }
    shouldScrollToStep.current = true;
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goToPreviousStep() {
    setError("");
    shouldScrollToStep.current = true;
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function goToStep(index: number) {
    setError("");
    if (index === stepIndex) {
      scrollToBookingForm();
      return;
    }

    shouldScrollToStep.current = true;
    setStepIndex(index);
  }

  function chooseDisposableTowel(wantsTowel: boolean) {
    setWantsDisposableTowel(wantsTowel);
    setTowelPromptOpen(false);
    scrollToStepControls();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedServiceId || !selectedBarberId || !selectedSlot || !form.customer_name || !form.customer_email || !form.customer_phone) {
      setError(t.detailsRequired);
      return;
    }

    setSubmitting(true);

    try {
      const payload = await fetchJson<AppointmentResponse>(`${API_BASE}/appointments/`, {
        method: "POST",
        body: JSON.stringify({
          service: selectedServiceId,
          barber: selectedBarberId,
          customer_name: form.customer_name,
          customer_email: form.customer_email,
          customer_phone: form.customer_phone,
          customer_language: lang,
          wants_disposable_towel: wantsDisposableTowel,
          start_at: selectedSlot.start_at,
        }),
      });

      setConfirmation(payload);
      setSlots((current) => current.filter((slot) => slot.start_at !== selectedSlot.start_at));
      setForm({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#050b17] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_4%,rgba(43,88,130,0.36),transparent_32%),linear-gradient(180deg,#071426_0%,#050b17_52%,#030712_100%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050b17]/[0.88] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-black text-white">
            <span className="relative size-12 rounded-xl border border-white/20 bg-white/[0.07]">
              <Image src="/assets/logo-transparent.png" alt="" fill sizes="48px" className="object-contain p-2 brightness-0 invert" />
            </span>
            {t.back}
          </Link>
          <button
            type="button"
            className="rounded-full border border-white/20 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10"
            onClick={() => setLang((current) => (current === "ar" ? "en" : "ar"))}
          >
            {t.switch}
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:pt-10 lg:pb-14">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-lg border border-white/[0.16] bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <div className="relative h-48 sm:h-56 lg:h-64">
                <Image src="/assets/salon-interior-chairs.jpeg" alt="" fill priority sizes="(min-width: 1024px) 32vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,23,0.08),rgba(5,11,23,0.72))]" />
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-xs font-black text-[#d6bf86]">{t.eyebrow}</p>
                  <h1 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">{t.title}</h1>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <p className="break-words text-sm font-bold leading-7 text-slate-300">{t.subtitle}</p>
              </div>
            </div>
          </aside>

          <form ref={formRef} className="min-w-0 scroll-mt-24 rounded-lg border border-white/[0.16] bg-white/[0.045] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur sm:p-5" onSubmit={handleSubmit}>
            <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-5 sm:px-5">
              {steps.map((step, index) => (
                <button
                  type="button"
                  key={step}
                  className={`min-w-[132px] rounded-lg border px-3 py-3 text-start transition ${
                    index === stepIndex
                      ? "border-[#d6bf86] bg-[#d6bf86] text-[#071426]"
                      : index < stepIndex
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                        : "border-white/[0.14] bg-[#0b1628]/70 text-slate-300"
                  }`}
                  onClick={() => {
                    if (index <= stepIndex) {
                      goToStep(index);
                    }
                  }}
                >
                  <span className="block text-[11px] font-black opacity-75">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block text-sm font-black">{step}</strong>
                </button>
              ))}
            </div>

            {error ? (
              <div className="mb-4 rounded-lg border border-rose-300/30 bg-rose-500/[0.12] p-3 text-sm font-bold leading-6 text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="min-h-[420px] animate-[rise_360ms_ease_both]" key={stepIndex}>
              {stepIndex === 0 ? (
                <section>
                  <StepHeader title={t.selectService} note={loadingInitial ? t.loading : t.chosen} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {services.map((service) => {
                      const selected = service.id === selectedServiceId;
                      return (
                        <button
                          key={service.id}
                          data-testid={`service-${service.code}`}
                          type="button"
                          className={`min-w-0 rounded-lg border p-4 text-start transition hover:-translate-y-0.5 ${
                            selected
                              ? "border-[#d6bf86] bg-[#d6bf86] text-[#071426]"
                              : "border-white/[0.14] bg-[#0b1628]/80 text-white hover:border-[#d6bf86]/60"
                          }`}
                          onClick={() => {
                            setSelectedSlot(null);
                            setWantsDisposableTowel(false);
                            if (isGroomPackage(service)) {
                              setSelectedServiceId(null);
                              setTowelPromptOpen(false);
                              setGroomContactOpen(true);
                            } else {
                              setSelectedServiceId(service.id);
                              setTowelPromptOpen(true);
                            }
                          }}
                        >
                          <span className="block whitespace-normal break-words text-lg font-black leading-7">{isArabic ? service.name_ar : service.name_en}</span>
                          <small className={`mt-3 block text-sm font-black ${selected ? "text-[#071426]/70" : "text-[#d6bf86]"}`}>
                            {isArabic ? service.price_label_ar : service.price_label_en} · {formatDuration(service.duration_minutes, lang)}
                          </small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {stepIndex === 1 ? (
                <section>
                  <StepHeader title={t.selectBarber} note={t.chosen} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {barbers.map((barber) => {
                      const selected = barber.id === selectedBarberId;
                      return (
                        <button
                          key={barber.id}
                          data-testid={`barber-${barber.id}`}
                          type="button"
                          className={`flex min-w-0 items-center gap-3 rounded-lg border p-4 text-start transition hover:-translate-y-0.5 ${
                            selected
                              ? "border-[#d6bf86] bg-[#d6bf86] text-[#071426]"
                              : "border-white/[0.14] bg-[#0b1628]/80 text-white hover:border-[#d6bf86]/60"
                          }`}
                          onClick={() => {
                            setSelectedBarberId(barber.id);
                            setSelectedSlot(null);
                            scrollToStepControls();
                          }}
                        >
                          <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.18] bg-[#101d31] text-lg font-black">
                            {barber.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={barber.image} alt={isArabic ? barber.name_ar : barber.name_en} className="size-full object-cover" />
                            ) : (
                              (isArabic ? barber.name_ar : barber.name_en).slice(0, 1)
                            )}
                          </span>
                          <span>
                            <strong className="block text-lg font-black">{isArabic ? barber.name_ar : barber.name_en}</strong>
                            <small className={`mt-1 block text-sm font-bold ${selected ? "text-[#071426]/70" : "text-slate-400"}`}>
                              {selected ? t.selected : t.selectBarber}
                            </small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {stepIndex === 2 ? (
                <section>
                  <StepHeader title={t.selectDay} note={isArabic ? "الأوقات في الخطوة التالية" : "Times are in the next step"} />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {dates.map((dateValue) => {
                      const selected = dateValue === selectedDate;
                      return (
                        <button
                          key={dateValue}
                          data-testid={`date-${dateValue}`}
                          type="button"
                          className={`rounded-lg border p-4 text-start transition hover:-translate-y-0.5 ${
                            selected
                              ? "border-[#d6bf86] bg-[#d6bf86] text-[#071426]"
                              : "border-white/[0.14] bg-[#0b1628]/80 text-white hover:border-[#d6bf86]/60"
                          }`}
                          onClick={() => {
                            setSelectedDate(dateValue);
                            setSelectedSlot(null);
                            scrollToStepControls();
                          }}
                        >
                          <span className="block text-base font-black">{formatDay(dateValue, lang)}</span>
                          <small className={`mt-2 block text-xs font-bold ${selected ? "text-[#071426]/70" : "text-slate-400"}`}>{dateValue}</small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {stepIndex === 3 ? (
                <section>
                  <StepHeader title={t.selectTime} note={selectedDate ? formatFullDate(selectedDate, lang) : t.noTimeYet} />
                  {loadingSlots ? (
                    <p className="rounded-lg border border-white/[0.14] bg-[#0b1628]/80 p-4 text-sm font-bold text-slate-300">{t.loadingSlots}</p>
                  ) : null}
                  {!loadingSlots && slots.length ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {slots.map((slot) => {
                        const selected = slot.start_at === selectedSlot?.start_at;
                        return (
                          <button
                            key={slot.start_at}
                            data-testid={`slot-${slot.time}`}
                            type="button"
                            className={`rounded-lg border p-4 text-center text-lg font-black transition hover:-translate-y-0.5 ${
                              selected
                                ? "border-[#d6bf86] bg-[#d6bf86] text-[#071426]"
                                : "border-white/[0.14] bg-[#0b1628]/80 text-white hover:border-[#d6bf86]/60"
                            }`}
                            onClick={() => {
                              setSelectedSlot(slot);
                              scrollToStepControls();
                            }}
                          >
                            {displayTime(slot.time, lang)}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                  {!loadingSlots && !slots.length ? (
                    <p className="rounded-lg border border-white/[0.14] bg-[#0b1628]/80 p-4 text-sm font-bold text-slate-300">
                      {selectedServiceId && selectedBarberId ? t.noSlots : t.noTimeYet}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {stepIndex === 4 ? (
                <section>
                  <StepHeader title={t.fillDetails} note={t.summary} />
                  <div className="grid gap-4">
                    <label className="grid gap-2 text-sm font-black text-slate-300">
                      {t.name}
                      <input
                        data-testid="customer-name"
                        className="min-h-12 rounded-lg border border-white/[0.16] bg-[#0b1628] px-4 text-base font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-[#d6bf86]"
                        value={form.customer_name}
                        onChange={(event) => updateForm("customer_name", event.target.value)}
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-black text-slate-300">
                      {t.email}
                      <input
                        data-testid="customer-email"
                        type="text"
                        inputMode="email"
                        autoComplete="email"
                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                        className="min-h-12 rounded-lg border border-white/[0.16] bg-[#0b1628] px-4 text-base font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-[#d6bf86]"
                        value={form.customer_email}
                        onChange={(event) => updateForm("customer_email", event.target.value)}
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-black text-slate-300">
                      {t.phone}
                      <input
                        data-testid="customer-phone"
                        className="min-h-12 rounded-lg border border-white/[0.16] bg-[#0b1628] px-4 text-base font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-[#d6bf86]"
                        value={form.customer_phone}
                        onChange={(event) => updateForm("customer_phone", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                </section>
              ) : null}
            </div>

            <div className="mt-5 rounded-lg border border-white/[0.12] bg-[#0b1628]/85 p-4">
              <p className="text-xs font-black text-[#d6bf86]">{t.summary}</p>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <SummaryRow label={t.service} value={selectedService ? (isArabic ? selectedService.name_ar : selectedService.name_en) : t.notSelected} />
                <SummaryRow label={t.barber} value={selectedBarber ? (isArabic ? selectedBarber.name_ar : selectedBarber.name_en) : t.notSelected} />
                <SummaryRow label={t.day} value={selectedDate ? formatFullDate(selectedDate, lang) : t.notSelected} />
                <SummaryRow label={t.time} value={selectedSlot ? displayTime(selectedSlot.time, lang) : t.notSelected} />
                <SummaryRow label={t.towelSummary} value={wantsDisposableTowel ? t.yes : t.no} />
                <SummaryRow label={t.total} value={bookingAmount || t.notSelected} />
              </div>
            </div>

            <div ref={navigationRef} className="mt-5 flex gap-3 border-t border-white/[0.10] pt-4">
              <button
                type="button"
                className="min-h-12 flex-1 rounded-lg border border-white/[0.18] bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white/[0.1]"
                onClick={goToPreviousStep}
                disabled={stepIndex === 0}
              >
                {t.previous}
              </button>
              {stepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  className="min-h-12 flex-[1.4] rounded-lg bg-white px-5 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
                  onClick={continueStep}
                >
                  {t.next}
                </button>
              ) : (
                <button
                  data-testid="submit-booking"
                  type="submit"
                  className="min-h-12 flex-[1.4] rounded-lg bg-white px-5 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
                  disabled={submitting}
                >
                  {submitting ? t.submitting : t.submit}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {towelPromptOpen && selectedService ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/[0.72] p-3 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-md animate-[rise_260ms_ease_both] rounded-lg border border-white/[0.18] bg-[#081426] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.48)]" role="dialog" aria-modal="true">
            <p className="text-sm font-black text-[#d6bf86]">{t.addOns}</p>
            <h2 className="mt-3 text-2xl font-black leading-tight">{t.disposableTowel}</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-300">{t.disposableTowelText}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="min-h-12 rounded-lg border border-white/[0.18] bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white/[0.1]"
                onClick={() => chooseDisposableTowel(false)}
              >
                {t.no}
              </button>
              <button
                type="button"
                className="min-h-12 rounded-lg bg-white px-5 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
                onClick={() => chooseDisposableTowel(true)}
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {groomContactOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/[0.72] p-3 backdrop-blur-sm sm:place-items-center">
          <div className="w-full max-w-md animate-[rise_260ms_ease_both] rounded-lg border border-white/[0.18] bg-[#081426] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.48)]" role="dialog" aria-modal="true">
            <p className="text-sm font-black text-[#d6bf86]">{isArabic ? "بكج العريس" : "Groom Package"}</p>
            <h2 className="mt-3 text-2xl font-black leading-tight">{t.groomBookingTitle}</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-300">{t.groomBookingText}</p>
            <a
              className="mt-5 flex min-h-12 w-full items-center justify-center rounded-lg bg-white px-5 text-sm font-black text-[#071426] transition hover:-translate-y-0.5 hover:bg-[#f4efe5]"
              href={`tel:${SHOP_PHONE}`}
            >
              {t.callSalon}: {SHOP_PHONE}
            </a>
            <button
              type="button"
              className="mt-3 flex min-h-12 w-full items-center justify-center rounded-lg border border-white/[0.18] bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white/[0.1]"
              onClick={() => setGroomContactOpen(false)}
            >
              {t.close}
            </button>
          </div>
        </div>
      ) : null}

      {confirmation ? (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/[0.72] p-3 backdrop-blur-sm sm:place-items-center">
          <div data-testid="payment-modal" className="w-full max-w-lg animate-[rise_260ms_ease_both] rounded-lg border border-white/[0.18] bg-[#081426] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.48)]" role="dialog" aria-modal="true">
            <p className="text-sm font-black text-[#d6bf86]">{t.successTitle}</p>
            <h2 className="mt-3 text-2xl font-black leading-tight">{t.successIntro}</h2>
            <div className="my-5 rounded-lg border border-[#d6bf86]/35 bg-[#d6bf86]/[0.12] p-4 text-center">
              <span className="block text-sm font-black text-[#d6bf86]">{t.cliq}</span>
              <strong className="mt-2 block text-4xl font-black tracking-widest">SKH46</strong>
              <small className="mt-2 block text-sm font-black text-slate-300">{isArabic ? confirmation.payment.amount_ar : confirmation.payment.amount_en}</small>
            </div>
            <div className="grid gap-3 text-sm font-bold leading-7 text-slate-300">
              <p>{t.approval}</p>
              <p>{t.refund}</p>
              <p>
                {t.cancel} <strong className="text-white">{SHOP_PHONE}</strong>
              </p>
            </div>
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-black text-[#071426]"
              onClick={() => {
                setConfirmation(null);
                setSelectedSlot(null);
                setWantsDisposableTowel(false);
                setTowelPromptOpen(false);
                setGroomContactOpen(false);
                setStepIndex(0);
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function StepHeader({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-black text-[#d6bf86]">{note}</p>
      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h2>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-1 border-b border-white/[0.08] pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <strong className="block max-w-full whitespace-normal break-words font-black text-white">{value}</strong>
    </div>
  );
}
