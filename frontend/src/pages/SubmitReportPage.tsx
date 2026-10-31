import React, { useState } from 'react';
import { submitReport } from '../services/api';
import { IssueCategory, SeverityLevel } from '../types';
import confetti from 'canvas-confetti';
import {
  Wrench,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  CopyCheck,
  ArrowRight,
  Sparkles,
  X,
  FileText,
  Building,
  MapPin,
  Flame,
  Zap,
} from 'lucide-react';

interface Props {
  onNav: (tab: string, reportId?: string) => void;
}

const CATEGORIES: IssueCategory[] = [
  'Electrical',
  'Plumbing',
  'Infrastructure',
  'Furniture',
  'Cleaning and Hygiene',
  'Internet and Networking',
  'Laboratory Equipment',
  'Other',
];

const BUILDINGS = [
  'Science & Technology Block',
  'Engineering Annex',
  'Central Library',
  'Life Sciences Research Complex',
  'Humanities Auditorium',
  'Student Center & Cafeteria',
  'Management Institute',
  'Hostels & Residential Halls',
  'Sports Complex & Gym',
  'Administration Headquarters',
];

export const SubmitReportPage: React.FC<Props> = ({ onNav }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Electrical');
  const [building, setBuilding] = useState(BUILDINGS[0]);
  const [floor, setFloor] = useState('2nd Floor');
  const [room, setRoom] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, PNG, or WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }
    if (!room.trim()) {
      setError('Please specify the room, corridor, or unit number.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('building', building);
      formData.append('floor', floor);
      formData.append('room', room.trim());
      formData.append('severity', severity);
      formData.append('is_urgent', isUrgent ? 'true' : 'false');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await submitReport(formData);
      setSubmissionResult(res);

      // Trigger celebratory confetti for successful submission
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas unavailable
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  // If successfully submitted, show rich confirmation & AI duplicate detection screen
  if (submissionResult) {
    const { report, duplicate_detection } = submissionResult;
    const hasDuplicates = duplicate_detection && duplicate_detection.matches_found > 0;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            Issue Registered Successfully
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
            Campus Issue #{report.id}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Your maintenance request has been recorded in the institutional database and assigned
            priority <strong className="text-slate-800">{report.priority}</strong>.
          </p>

          {/* AI Duplicate Detection Result Card */}
          <div
            className={`rounded-2xl p-5 mb-8 text-left border ${
              hasDuplicates
                ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                : 'bg-blue-50/50 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-sm">
                  {hasDuplicates
                    ? 'AI Duplicate Detection Flagged'
                    : 'AI Duplicate Verification Complete'}
                </h4>
              </div>
              {hasDuplicates && (
                <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  {duplicate_detection.matches_found} Potential Match(es)
                </span>
              )}
            </div>

            <p className="text-xs leading-relaxed mb-4">
              {duplicate_detection.message}
            </p>

            {hasDuplicates && duplicate_detection.candidates && (
              <div className="space-y-2.5">
                {duplicate_detection.candidates.map((cand: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-600">
                          {cand.matching_report_id}
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {cand.similarity_score}% Composite Similarity
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        "{cand.matching_title}"
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {cand.match_reasons?.map((reason: string, rIdx: number) => (
                          <span
                            key={rIdx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNav('issue-detail', report.id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Issue Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNav('my-reports')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
            >
              Track My Reports
            </button>
            <button
              onClick={() => {
                setSubmissionResult(null);
                setTitle('');
                setDescription('');
                setRoom('');
                removeImage();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Campus Fault Submission
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Report an Infrastructure Problem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide accurate details to help campus technicians locate, prioritize, and resolve the defect quickly.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Issue Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fan is not working in Room 204 or Ruptured water line in 1st floor washroom"
            maxLength={180}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>Be specific about the equipment and malfunction.</span>
            <span>{title.length}/180</span>
          </div>
        </div>

        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              User Severity <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Low', 'Medium', 'High', 'Critical'] as SeverityLevel[]).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    severity === sev
                      ? sev === 'Critical'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : sev === 'High'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : sev === 'Medium'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Campus Location Specifics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Building</label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {BUILDINGS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Floor</label>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Basement">Basement</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="1st Floor">1st Floor</option>
                <option value="2nd Floor">2nd Floor</option>
                <option value="3rd Floor">3rd Floor</option>
                <option value="4th Floor">4th Floor</option>
                <option value="Exterior Grounds">Exterior Grounds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Room / Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Room 204 or Lab 003"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Urgency Checkbox */}
        <div className="flex items-start gap-3 p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl">
          <input
            type="checkbox"
            id="urgent-check"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
            className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
          />
          <label htmlFor="urgent-check" className="text-xs text-slate-700 cursor-pointer">
            <span className="font-bold text-rose-900 block">
              Flag as Urgent / Active Hazard
            </span>
            Check this if the issue creates immediate danger (sparks, major flood, glass shards) or shuts down a scheduled academic lab.
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Issue Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the defect in detail: what happens, when it started, sounds or smells, and how severely it impacts students or faculty..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="text-[11px] text-slate-400">
            Minimum 10 characters. Full details improve NLP duplicate clustering accuracy.
          </span>
        </div>

        {/* Optional Photograph Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Attach Photograph <span className="text-slate-400 text-[10px]">(Optional, Max 5MB)</span>
          </label>

          {imagePreview ? (
            <div className="relative inline-block border border-slate-300 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={imagePreview}
                alt="Issue upload preview"
                className="w-full max-w-sm h-48 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-colors">
              <Camera className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700">
                Click to upload a defect photo
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG or WEBP (Max 5MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Analyzing & Submitting...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Submit Maintenance Report</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

