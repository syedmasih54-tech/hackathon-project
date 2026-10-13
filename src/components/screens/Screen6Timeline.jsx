import React, { useState, useEffect } from 'react';
import {
  Clock,
  PlusCircle,
  Camera,
  Trash2,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  FileText,
  Building2,
  X
} from 'lucide-react';
import {
  saveTimelineEntry,
  loadTimelineEntries,
  deleteTimelineEntry
} from '../../services/db.js';
import { maskLongNumber } from '../../utils/masking.js';

export default function Screen6Timeline({
  onNext,
  onBack,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';

  const [entries, setEntries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUnmaskMap, setShowUnmaskMap] = useState({});

  // New entry form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [entryType, setEntryType] = useState('visit');

  const refreshEntries = async () => {
    const list = await loadTimelineEntries();
    setEntries(list);
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  const handlePhotoSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoDataUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    await saveTimelineEntry({
      date,
      reference_number: referenceNumber,
      entry_type: entryType,
      visit_notes: visitNotes,
      rejection_reason: rejectionReason,
      photo: photoDataUrl
    });

    // Reset form
    setReferenceNumber('');
    setVisitNotes('');
    setRejectionReason('');
    setPhotoDataUrl(null);
    setShowAddForm(false);

    refreshEntries();
  };

  const handleDelete = async (id) => {
    await deleteTimelineEntry(id);
    refreshEntries();
  };

  const toggleMask = (id) => {
    setShowUnmaskMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              {isHi ? 'चरण 6: साक्ष्य टाइमलाइन' : 'Step 6: Evidence Timeline'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'आवेदन और विज़िट टाइमलाइन' : 'Application Evidence Timeline'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'कार्यालय विज़िट, आवेदन पावती और रसीदें सुरक्षित रखें (केवल आपके डिवाइस पर)।'
                : 'Track office visits, application receipts, and acknowledgement slips locally.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-200 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isHi ? 'नया रिकॉर्ड' : 'Add Entry'}</span>
          </button>
        </div>

        {/* Add Entry Modal / Form */}
        {showAddForm && (
          <div className="p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">
                {isHi ? 'नया टाइमलाइन रिकॉर्ड जोड़ें' : 'Add Timeline Entry'}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'तारीख (Date)' : 'Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'प्रकार (Entry Type)' : 'Category'}
                  </label>
                  <select
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="application">{isHi ? 'आवेदन जमा किया (Application Submitted)' : 'Application Submitted'}</option>
                    <option value="visit">{isHi ? 'ब्लॉक/पंचायत कार्यालय विज़िट (Office Visit)' : 'Office Visit'}</option>
                    <option value="followup">{isHi ? 'स्थिति पूछताछ (Status Query)' : 'Status Follow-up'}</option>
                    <option value="rejection">{isHi ? 'अस्वीकृति या आपत्ति (Rejection / Objection)' : 'Rejection Reason'}</option>
                  </select>
                </div>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'आवेदन / संदर्भ संख्या (Reference Number)' : 'Reference / Receipt Number'}
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder={isHi ? 'उदा. UP2026WID98765432' : 'e.g. UP2026WID98765432'}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHi ? 'स्क्रीन पर यह संख्या गोपनीयता के लिए आंशिक रूप से छिपाई (Masked) जाएगी।' : 'Numbers are masked on screen to protect privacy.'}
                </p>
              </div>

              {/* Notes from Office Visit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'कार्यालय विज़िट के नोट्स (Office Visit Notes)' : 'Notes from Office Visit'}
                </label>
                <textarea
                  rows="3"
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder={isHi ? 'उदा. ब्लॉक विकास अधिकारी से मिले, उन्होंने कहा कि फाइल 2 हफ्ते में पास होगी...' : 'e.g. Visited Block office, officer said verification is pending...'}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                />
              </div>

              {/* Rejection Reason (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'अस्वीकृति / आपत्ति का कारण (यदि कोई हो)' : 'Rejection Reason (If applicable)'}
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={isHi ? 'उदा. आय प्रमाण पत्र पुनः मांगा गया' : 'e.g. Re-verification of income requested'}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white text-red-900"
                />
              </div>

              {/* Optional Acknowledgement Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'पावती / रसीद की फ़ोटो (केवल डिवाइस पर सुरक्षित)' : 'Acknowledgement Slip Photo (Stored on device only)'}
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-emerald-400 bg-white hover:bg-emerald-50 cursor-pointer text-xs font-bold text-emerald-800">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>{photoDataUrl ? (isHi ? 'फ़ोटो चुनी गई (बदलें)' : 'Photo Selected (Change)') : (isHi ? 'रसीद की फ़ोटो लें या चुनें' : 'Capture Receipt Photo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
                  />
                </label>
                {photoDataUrl && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-slate-300">
                    <img src={photoDataUrl} alt="Receipt preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  {isHi ? 'रिकॉर्ड सहेजें' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vertical Timeline Display */}
        {entries.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-bold text-sm text-slate-700">
              {isHi ? 'अभी कोई टाइमलाइन रिकॉर्ड नहीं है।' : 'No timeline entries recorded yet.'}
            </p>
            <p className="text-xs mt-1">
              {isHi ? 'अपने आवेदन की तारीख या ब्लॉक विज़िट जोड़ने के लिए ऊपर "नया रिकॉर्ड" दबाएं।' : 'Click "Add Entry" to log application submissions or office visits.'}
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-300 space-y-6">
            {entries.map((entry) => {
              const isUnmasked = showUnmaskMap[entry.id];
              const displayRef = entry.reference_number
                ? (isUnmasked ? entry.reference_number : maskLongNumber(entry.reference_number))
                : '';

              return (
                <div key={entry.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />

                  {/* Timeline Entry Card */}
                  <div className="bg-slate-50 hover:bg-slate-100/70 p-4 rounded-2xl border border-slate-200 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                          {entry.date}
                        </span>
                        <h2 className="font-extrabold text-slate-900 text-sm capitalize">
                          {entry.entry_type === 'application' && (isHi ? 'आवेदन जमा किया' : 'Application Submitted')}
                          {entry.entry_type === 'visit' && (isHi ? 'कार्यालय विज़िट' : 'Office Visit')}
                          {entry.entry_type === 'followup' && (isHi ? 'स्थिति पूछताछ' : 'Status Follow-up')}
                          {entry.entry_type === 'rejection' && (isHi ? 'आपत्ति / अस्वीकृति' : 'Objection / Rejection')}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                        title={isHi ? 'हटाएं' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Masked Reference Number */}
                    {entry.reference_number && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 w-fit">
                        <span className="text-slate-500">{isHi ? 'संदर्भ संख्या:' : 'Ref:'}</span>
                        <span className="font-bold text-slate-800">{displayRef}</span>
                        <button
                          type="button"
                          onClick={() => toggleMask(entry.id)}
                          className="text-slate-500 hover:text-slate-800 p-0.5"
                          title={isUnmasked ? 'Mask' : 'Show full'}
                        >
                          {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {/* Visit Notes */}
                    {entry.visit_notes && (
                      <p className="mt-2 text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/80">
                        {entry.visit_notes}
                      </p>
                    )}

                    {/* Rejection reason if any */}
                    {entry.rejection_reason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-semibold">
                        ⚠️ {isHi ? 'अस्वीकृति कारण:' : 'Rejection Reason:'} {entry.rejection_reason}
                      </div>
                    )}

                    {/* Photo thumbnail */}
                    {entry.photo && (
                      <div className="mt-2.5">
                        <img
                          src={entry.photo}
                          alt="Acknowledgement receipt"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-300 shadow-sm cursor-pointer hover:opacity-90"
                          onClick={() => window.open(entry.photo, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delayed Case Escalation Prompt */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-amber-900 font-medium">
              {isHi
                ? 'क्या आपके पेंशन आवेदन में अनावश्यक विलंब हो रहा है?'
                : 'Is your pension application facing an unexplained delay?'}
            </p>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="min-h-[44px] px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold flex-shrink-0 shadow-sm"
          >
            {isHi ? 'शिकायत तैयार करें' : 'Draft Grievance'}
          </button>
        </div>

        {/* Navigation */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 font-bold text-sm text-slate-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'पीछे' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-emerald-200"
          >
            <span>{isHi ? 'शिकायत मसौदा (Complaint Draft)' : 'Proceed to Complaint Draft'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
