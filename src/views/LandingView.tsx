import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/jalali';
import {
  GraduationCap,
  Award,
  CalendarCheck,
  FileCheck2,
  CreditCard,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  Sparkles,
  School,
  CheckCircle2,
  Users
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
  onOpenRegisterSchool: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onOpenRegisterSchool }) => {
  const { login } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@roshdeandishe.test');
  const [passwordInput, setPasswordInput] = useState('password');

  const slides = [
    {
      title: 'کارنامه و دفتر ثبت نمرات هوشمند',
      subtitle: 'ثبت آسان نمرات مستمر و پایانی، نمرات ۲۰ یا توصیفی و صدور کارنامه جامع تحصیلی',
      icon: Award,
      badge: 'ماژول آموزش',
      desc: 'دبیران به راحتی با چند کلیک نمرات کلاسی را ثبت می‌کنند و دانش‌آموزان و اولیا در لحظه وضعیت کارنامه را مشاهده می‌نمایند.'
    },
    {
      title: 'حضور و غیاب کلاسی و مدیریت تاخیرها',
      subtitle: 'ثبت وضعیت حاضر، غایب، تاخیر و فرآیند تایید گواهی پزشکی و موجه‌سازی',
      icon: CalendarCheck,
      badge: 'ماژول انضباطی',
      desc: 'امکان چاپ دفتر فیزیکی کلاسی با استانداردهای آموزش و پرورش و ارسال نوتیفیکیشن حضور به اولیا از طریق بله.'
    },
    {
      title: 'آزمون‌های آنلاین تستی با تصحیح خودکار',
      subtitle: 'طراحی آزمون از بانک تست، تایمر لحظه‌ای و ارائه فوری کارنامه و درصد پاسخ‌ها',
      icon: FileCheck2,
      badge: 'ماژول آزمون',
      desc: 'طراحی آزمون‌های جامع چهارگزینه‌ای با زمان‌بندی دقیق و ثبت خودکار در سوابق تحصیلی دانش‌آموزان.'
    },
    {
      title: 'مدیریت اقساط شهریه و امور مالی شفاف',
      subtitle: 'تقسیط هوشمند، ثبت فیش‌های واریزی، گزارش بدهکاران و اعمال تخفیف‌های تحصیلی',
      icon: CreditCard,
      badge: 'ماژول مالی',
      desc: 'امکان تعریف اقساط دلخواه، ثبت پرداخت‌های نقدی و دستگاه پوز و نمایش مانده بدهی به اولیا در پرتال شخصی.'
    }
  ];

  const faqs = [
    {
      q: 'آیا سامانه رشدِ اندیشه از چند مدرسه به صورت همزمان پشتیبانی می‌کند؟',
      a: 'بله، رشدِ اندیشه به صورت چندمستأجره (Multi-tenant) توسعه یافته است و شما می‌توانید با یک حساب کاربری واحد، در چندین مدرسه نقش‌های مختلف داشته باشید و در نوار بالا مدرسه فعال را انتخاب کنید.'
    },
    {
      q: 'آیا امکان اتصال سامانه به پیام‌رسان بله برای ارسال کارنامه وجود دارد؟',
      a: 'بله، با فعال‌سازی ربات بله در بخش تنظیمات مدرسه، اولیا می‌توانند به صورت خودکار نمرات، تاخیرها و برنامه امتحانات را در بات بله دریافت کنند.'
    },
    {
      q: 'تعریف نقش‌های سفارشی چگونه انجام می‌شود؟',
      a: 'مدیر مدرسه می‌تواند در صفحه نقش‌ها و دسترسی‌ها، نقش‌هایی چون معاون آموزشی، مشاور یا مسئول آزمون را با مجوزهای دلخواه تعریف نماید.'
    },
    {
      q: 'آیا برای استفاده از سامانه نیاز به نصب نرم‌افزار خاصی است؟',
      a: 'خیر، رشدِ اندیشه یک وب‌اپلیکیشن ابری مدرن و ریسپانسیو است و از طریق کامپیوتر، تبلت و تلفن همراه بدون نیاز به نصب قابل استفاده می‌باشد.'
    }
  ];

  const handleQuickLogin = (email: string) => {
    login(email);
    setIsLoginModalOpen(false);
    onEnterApp();
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(emailInput);
    setIsLoginModalOpen(false);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 block leading-tight">رشدِ اندیشه</span>
              <span className="text-xs text-teal-700 font-medium hidden sm:block">سامانه جامع مدیریت هوشمند مدارس</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>ورود به سامانه</span>
            </button>

            <button
              onClick={onOpenRegisterSchool}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <School className="w-4 h-4" />
              <span>تأسیس مدرسه رایگان</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/60 text-teal-200 text-xs font-semibold border border-teal-600/80 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>سامانه نسل جدید مدیریت مدارس ایران</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            سامانه یکپارچه مدیریت آموزشی، کارنامه و امور مالی مدارس
          </h1>

          <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto leading-relaxed">
            از دفتر نمرات و ثبت حضور و غیاب روزانه تا آزمون‌های آنلاین، تقسیط خودکار شهریه و پرتال اختصاصی اولیا؛ همه در یک پلتفرم ابری مدرن و بدون نیاز به نصب.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-teal-900 hover:bg-teal-50 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>ورود با حساب‌های دمو و تست</span>
            </button>

            <button
              onClick={onOpenRegisterSchool}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm border border-teal-500 shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <School className="w-4 h-4" />
              <span>ثبت‌نام مدرسه جدید (۲ دقیقه)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4-Slide Feature Carousel */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">امکانات محوری</span>
          <h2 className="text-2xl font-bold text-slate-800">بخش‌های اصلی سامانه رشدِ اندیشه</h2>
        </div>

        {/* Carousel Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {slides[activeSlide].badge}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {slides[activeSlide].title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {slides[activeSlide].subtitle}
              </p>

              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {slides[activeSlide].desc}
              </p>
            </div>

            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center shrink-0 mx-auto shadow-md">
              {React.createElement(slides[activeSlide].icon, { className: 'w-16 h-16 sm:w-20 sm:h-20' })}
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === idx ? 'w-8 bg-teal-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-12 bg-white border-y border-slate-200 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">چندمستأجره با چند نقش همزمان</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                هر کاربر می‌تواند با یک نام کاربری هم دبیر یک مدرسه باشد و هم ولی دانش‌آموز در مدرسه‌ای دیگر.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">برنامه کلاسی و هفتگی هوشمند</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                تخصیص دروس به زنگ‌های هفتگی، بررسی تداخل ساعات کاری معلمان و نمایش برنامه برای دانش‌آموزان.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">امنیت بالا و دسترسی‌های دقیق</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                تفکیک دقیق سطوح دسترسی، شماره موبایل استاندارد شده و نگهداری سوابق تحصیلی سال‌های مختلف.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">پرسش‌های پرتکرار</span>
          <h2 className="text-2xl font-bold text-slate-800">سوالات متداول مدیران و کاربران</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-teal-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base block">رشدِ اندیشه</span>
              <span className="text-xs text-slate-400">سامانه جامع مدیریت هوشمند مدارس ایران</span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            طراحی شده با استاندارد تقویم جلالی، پشتیبانی از پایه‌های دهم تا دوازدهم و پرتال یکپارچه اولیا و مربیان.
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-base">ورود به سامانه مدارس</h3>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Demo Switchers */}
            <div className="mb-5 p-3 rounded-2xl bg-teal-50/70 border border-teal-200">
              <span className="text-[11px] font-bold text-teal-900 block mb-2">ورود تک‌کلیکی با کاربران دمو:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@roshdeandishe.test')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition text-right"
                >
                  👑 مدیر کل مدرسه
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('rezaei@roshdeandishe.test')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition text-right"
                >
                  👨‍🏫 دبیر / معلم
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ali.kamali@roshdeandishe.test')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition text-right"
                >
                  🎒 دانش‌آموز (علی کمالی)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('parent.kamali@roshdeandishe.test')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition text-right"
                >
                  👨‍👩‍👧 ولی دانش‌آموز
                </button>
              </div>
            </div>

            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل یا نام کاربری</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رمز عبور</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition"
              >
                ورود به حساب کاربری
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
