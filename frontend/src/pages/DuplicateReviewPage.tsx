import React, { useEffect, useState } from 'react';
import { fetchDuplicates, reviewDuplicate } from '../services/api';
import { DuplicateSuggestionItem } from '../types';
import {
  CopyCheck,
  CheckCircle2,
  XCircle,
  Building,
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface Props {
  onNav: (tab: string, reportId?: string) => void;
}

export const DuplicateReviewPage: React.FC<Props> = ({ onNav }) => {
  const [duplicates, setDuplicates] = useState<DuplicateSuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'confirmed' | 'rejected' | 'all'>('pending');
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadDuplicates = async () => {
    setLoading(true);
    try {
      const data = await fetchDuplicates(filterStatus);
      setDuplicates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, [filterStatus]);

  const handleAction = async (id: number, action: 'confirm' | 'reject') => {
    setActionLoadingId(id);
    try {
      await reviewDuplicate(id, action);
      await loadDuplicates();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-amber-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Core Differentiator Engine
            </span>
            <span className="text-xs text-slate-400">TF-IDF Vectorization & Cosine Similarity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI Duplicate Report Review Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            FixFlow detects multiple reports describing identical campus defects.
            To preserve administrative integrity, the AI never forces automatic merges;
            facilities directors review similarity metrics and confirm or reject groupings.
          </p>
        </div>

        <button
          onClick={loadDuplicates}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        {(['pending', 'confirmed', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
              filterStatus === tab
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'pending' ? 'Pending Review' : tab}
          </button>
        ))}
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-500" />
          Comparing text vectors and extracting similarity scores...
        </div>
      ) : duplicates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            No {filterStatus} duplicate suggestions in queue
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Either all incoming complaints describe distinct problems, or previous suggestions have already been reviewed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((dup) => (
            <div
              key={dup.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Header Match Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    #{dup.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {dup.similarity_score}% Composite Similarity
                      </span>
                      <span className="text-xs text-slate-500">
                        ({dup.text_similarity}% NLP Text Vector Overlap)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {dup.location_match && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold border border-blue-200">
                      ✓ Same Campus Location
                    </span>
                  )}
                  {dup.category_match && (
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                      ✓ Matching Domain Category
                    </span>
                  )}
                  <span
                    className={`font-bold uppercase px-2.5 py-1 rounded-full text-[11px] ${
                      dup.review_status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : dup.review_status === 'rejected'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {dup.review_status}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison Container */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing / Prior Report (Target) */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Existing Open Record
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {dup.matching_report_id}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">
                      "{dup.matching_title}"
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 mb-3">
                      {dup.matching_description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.matching_building}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.matching_room}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.matching_category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNav('issue-detail', dup.matching_report_id)}
                    className="mt-4 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 self-start"
                  >
                    <span>Inspect Issue #{dup.matching_report_id}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Newly Incoming Correlated Report (Source) */}
                <div className="bg-blue-50/40 border border-blue-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        Newly Incoming Candidate
                      </span>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                        {dup.report_id}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">
                      "{dup.source_title}"
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-blue-200 mb-3">
                      {dup.source_description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.source_building}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.source_room}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {dup.source_category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNav('issue-detail', dup.report_id)}
                    className="mt-4 text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 self-start"
                  >
                    <span>Inspect Issue #{dup.report_id}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Administrative Decision Bar */}
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>
                    Confirming marks this pair as duplicates and informs students in their resolution timeline.
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAction(dup.id, 'reject')}
                    disabled={actionLoadingId === dup.id}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reject / Distinct Fault</span>
                  </button>

                  <button
                    onClick={() => handleAction(dup.id, 'confirm')}
                    disabled={actionLoadingId === dup.id}
                    className="flex-1 sm:flex-initial px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Duplicate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

