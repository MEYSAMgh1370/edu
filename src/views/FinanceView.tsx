import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, formatToman, formatRial, getTodayJalali } from '../utils/jalali';
import {
  CreditCard,
  Plus,
  TrendingUp,
  Receipt,
  DollarSign,
  Percent,
  CheckCircle,
  Clock,
  Filter,
  Search
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    invoices,
    setSchoolTuition,
    recordPayment,
    applyDiscount,
    currentSchool
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<string | null>(null);
  const [selectedInvoiceForDiscount, setSelectedInvoiceForDiscount] = useState<string | null>(null);

  // Config states
  const [tuitionToman, setTuitionToman] = useState(24000000); // 24 million toman
  const [installmentsCount, setInstallmentsCount] = useState(4);

  // Payment states
  const [paymentAmountToman, setPaymentAmountToman] = useState(6000000);
  const [refNum, setRefNum] = useState('');
  const [method, setMethod] = useState<'CARD' | 'BANK_TRANSFER' | 'CASH'>('CARD');

  // Discount states
  const [discountToman, setDiscountToman] = useState(2000000);

  const totalTuition = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const totalDiscount = invoices.reduce((s, i) => s + i.discountAmount, 0);
  const totalRemaining = totalTuition - totalDiscount - totalPaid;

  const filteredInvoices = invoices.filter(inv => {
    if (searchQuery.trim()) {
      return inv.studentName.toLowerCase().includes(searchQuery.trim().toLowerCase());
    }
    return true;
  });

  const handleSaveTuition = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolTuition(tuitionToman * 10, installmentsCount);
    setIsConfigModalOpen(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;
    recordPayment(
      selectedInvoiceForPayment,
      paymentAmountToman * 10,
      refNum || `TX-${Date.now().toString().slice(-6)}`,
      method
    );
    setSelectedInvoiceForPayment(null);
    setRefNum('');
  };

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForDiscount) return;
    applyDiscount(selectedInvoiceForDiscount, discountToman * 10);
    setSelectedInvoiceForDiscount(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="شهریه و امور مالی دانش‌آموزان"
        subtitle={`مدیریت تقسیط، دریافت شهریه و تخفیفات در ${currentSchool?.name}`}
        badge={`سال ${toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')}`}
        actions={
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition"
          >
            <CreditCard className="w-4 h-4" />
            <span>تنظیم نرخ و اقساط شهریه</span>
          </button>
        }
      />

      {/* Financial overview widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">کل بدهی شهریه مصوب</span>
          <span className="text-xl font-bold text-slate-800">{formatToman(totalTuition)}</span>
          <span className="text-[11px] text-slate-400 block mt-1">{toPersianDigits(invoices.length)} پرونده دانش‌آموز</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مجموع وصولی نقد و کارت</span>
          <span className="text-xl font-bold text-emerald-600">{formatToman(totalPaid)}</span>
          <span className="text-[11px] text-emerald-700 block mt-1">
            {toPersianDigits(totalTuition > 0 ? Math.round((totalPaid / totalTuition) * 100) : 0)}٪ وصول شده
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">مانده بدهی در انتظار پرداخت</span>
          <span className="text-xl font-bold text-amber-600">{formatToman(Math.max(0, totalRemaining))}</span>
          <span className="text-[11px] text-slate-400 block mt-1">شامل اقساط سررسیدنشده</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400 block mb-1">کل تخفیفات و بورسیه</span>
          <span className="text-xl font-bold text-blue-600">{formatToman(totalDiscount)}</span>
          <span className="text-[11px] text-slate-400 block mt-1">تخفیف‌های تشویقی و بستگان</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="جستجوی دانش‌آموز..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">نام دانش‌آموز</th>
                <th className="py-3 px-4">کل شهریه</th>
                <th className="py-3 px-4">تخفیف</th>
                <th className="py-3 px-4">پرداخت‌شده</th>
                <th className="py-3 px-4">مانده بدهی</th>
                <th className="py-3 px-4">وضعیت اقساط</th>
                <th className="py-3 px-4 text-left">عملیات مالی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const remaining = inv.totalAmount - inv.discountAmount - inv.paidAmount;
                const paidInstallments = inv.installments.filter(ins => ins.status === 'PAID').length;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {inv.studentName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {formatToman(inv.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-blue-600 font-medium">
                      {inv.discountAmount > 0 ? formatToman(inv.discountAmount) : '۰ تومان'}
                    </td>

                    <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                      {formatToman(inv.paidAmount)}
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {remaining <= 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">
                          تسویه کامل
                        </span>
                      ) : (
                        <span className="text-amber-700">
                          {formatToman(remaining)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {toPersianDigits(paidInstallments)} از {toPersianDigits(inv.installments.length)} قسط پرداخت شده
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedInvoiceForPayment(inv.id);
                            setPaymentAmountToman(Math.floor((inv.totalAmount / (inv.installments.length || 4)) / 10));
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                        >
                          ثبت واریز
                        </button>
                        <button
                          onClick={() => setSelectedInvoiceForDiscount(inv.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        >
                          اعمال تخفیف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Tuition Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">تنظیم نرخ و اقساط شهریه سال</h3>
            <p className="text-xs text-slate-500 mb-4">
              نرخ پایه شهریه برای تمام دانش‌آموزان سال {toPersianDigits(currentSchool?.currentAcademicYear || '1403-1404')} اعمال خواهد شد.
            </p>

            <form onSubmit={handleSaveTuition} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مبلغ کل شهریه سال (تومان) *</label>
                <input
                  type="number"
                  step="1000000"
                  required
                  value={tuitionToman}
                  onChange={e => setTuitionToman(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold text-lg text-teal-800"
                />
                <span className="text-[11px] text-slate-400 mt-1 block text-left">
                  معادل {formatRial(tuitionToman * 10)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">تعداد اقساط استاندارد *</label>
                <select
                  value={installmentsCount}
                  onChange={e => setInstallmentsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value={1}>۱ قسط (یکجا نقد)</option>
                  <option value={2}>۲ قسط (ترم اول و دوم)</option>
                  <option value={3}>۳ قسط</option>
                  <option value={4}>۴ قسط فصلی (مهر، آذر، بهمن، اردیبهشت)</option>
                  <option value={6}>۶ قسط دوماهه</option>
                </select>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
                مبلغ هر قسط: <strong>{formatToman(Math.floor((tuitionToman * 10) / installmentsCount))}</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  محاسبه و تقسیط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">ثبت دریافت وجه شهریه</h3>
            <p className="text-xs text-slate-500 mb-4">صدور فیش واریزی و تسویه اقساط</p>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مبلغ پرداختی (تومان) *</label>
                <input
                  type="number"
                  step="500000"
                  required
                  value={paymentAmountToman}
                  onChange={e => setPaymentAmountToman(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold text-base text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">روش پرداخت</label>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="CARD">کارتخوان مدرسه (POS)</option>
                  <option value="BANK_TRANSFER">واریز به شبا / فیش بانکی</option>
                  <option value="CASH">نقدی</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شماره پیگیری فیش یا تراکنش</label>
                <input
                  type="text"
                  placeholder="مثال: TX-849301"
                  value={refNum}
                  onChange={e => setRefNum(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  ثبت پرداخت و صدور فیش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Discount Modal */}
      {selectedInvoiceForDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">اعمال تخفیف شهریه</h3>
            <p className="text-xs text-slate-500 mb-4">بورسیه، تخفیف بستگان، حافظان قرآن یا فرزندان فرهنگیان</p>

            <form onSubmit={handleApplyDiscount} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مبلغ تخفیف مصوب (تومان) *</label>
                <input
                  type="number"
                  step="500000"
                  required
                  value={discountToman}
                  onChange={e => setDiscountToman(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-center font-bold text-base text-blue-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForDiscount(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
                >
                  اعمال تخفیف بر پرونده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
