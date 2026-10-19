import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { toPersianDigits, canonicalizePhoneNumber } from '../utils/jalali';
import {
  UserPlus,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Mail,
  Phone,
  Filter
} from 'lucide-react';

export const PeopleView: React.FC = () => {
  const { memberships, addMember, toggleMemberActive, currentSchool } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('TEACHER');
  const [notice, setNotice] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const filteredMembers = memberships.filter(m => {
    if (roleFilter !== 'ALL' && m.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = m.user.name.toLowerCase().includes(q);
      const matchEmail = m.user.email.toLowerCase().includes(q);
      const matchPhone = m.user.phone.includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const canonicalPhone = canonicalizePhoneNumber(phone);
    addMember(name.trim(), email.trim(), canonicalPhone, role);

    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setRole('TEACHER');
    setNotice(`عضو جدید (${name}) با موفقیت اضافه شد. لینک دعوت و فعال‌سازی صادر گردید.`);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleCopyInvite = (userEmail: string) => {
    const inviteLink = `${window.location.origin}/activate?token=inv-${btoa(userEmail).replace(/=/g, '')}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedToken(userEmail);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="اعضا و کادر مدرسه"
        subtitle={`مدیریت همکاران، معلمان، اولیا و دانش‌آموزان در ${currentSchool?.name}`}
        badge={`${toPersianDigits(memberships.length)} عضو`}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>افزودن عضو جدید</span>
          </button>
        }
      />

      {notice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-teal-600 hover:text-teal-900 font-bold">✕</button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="جستجوی نام، ایمیل، شماره تماس..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: 'همه نقش‌ها' },
            { id: 'SCHOOL_ADMIN', label: 'مدیران' },
            { id: 'TEACHER', label: 'دبیران' },
            { id: 'FINANCE_ADMIN', label: 'مالی' },
            { id: 'STUDENT', label: 'دانش‌آموزان' },
            { id: 'PARENT', label: 'اولیا' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                roleFilter === f.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">نام و نام خانوادگی</th>
                <th className="py-3 px-4">نقش سازمانی</th>
                <th className="py-3 px-4">اطلاعات تماس</th>
                <th className="py-3 px-4">وضعیت حساب</th>
                <th className="py-3 px-4">لینک فعال‌سازی</th>
                <th className="py-3 px-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                        {m.user.name.slice(0, 1)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">{m.user.name}</span>
                        <span className="text-[11px] text-slate-400">عضویت از {toPersianDigits(m.createdAt)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      <Shield className="w-3 h-3 text-teal-600" />
                      <span>{m.roleTitle}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span dir="ltr">{m.user.email}</span>
                    </div>
                    {m.user.phone && (
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span dir="ltr">{toPersianDigits(m.user.phone)}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {m.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-medium border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>فعال</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>غیرفعال</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleCopyInvite(m.user.email)}
                      className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 transition"
                      title="کپی لینک اختصاصی دعوت و تعیین رمز عبور"
                    >
                      {copiedToken === m.user.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken === m.user.email ? 'کپی شد' : 'لینک فعال‌سازی'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-left">
                    <button
                      onClick={() => toggleMemberActive(m.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                        m.active
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {m.active ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    هیچ عضوی با این مشخصات یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-1">افزودن عضو جدید به مدرسه</h3>
            <p className="text-xs text-slate-500 mb-5">
              عضو جدید بلافاصله ثبت شده و لینک فعال‌سازی حساب برای او صادر می‌گردد.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دکتر علیرضا نادری"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ایمیل معتبر *</label>
                <input
                  type="email"
                  required
                  placeholder="name@school.ir"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">شماره تلفن همراه</label>
                <input
                  type="text"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  dir="ltr"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">شماره تلفن‌های ایرانی خودکار استانداردسازی می‌شوند.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نقش در مدرسه *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
                >
                  <option value="TEACHER">دبیر و آموزگار</option>
                  <option value="FINANCE_ADMIN">مسئول مالی و حسابدار</option>
                  <option value="SCHOOL_ADMIN">مدیر مدرسه</option>
                  <option value="STUDENT">دانش‌آموز</option>
                  <option value="PARENT">ولی دانش‌آموز</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  ثبت و صدور دعوت‌نامه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
