import React, { useState, useEffect } from 'react';
import { X, Calendar, Droplets, AlertCircle, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { format } from 'date-fns';

export const AddEditPeriodModal = ({
  isOpen,
  onClose,
  onSuccess,
  periodToEdit = null,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [intensity, setIntensity] = useState('medium');
  const [isSpotting, setIsSpotting] = useState(false);
  const [isUncertain, setIsUncertain] = useState(false);
  const [isPeriodStart, setIsPeriodStart] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (periodToEdit) {
      setStartDate(periodToEdit.startDate ? format(new Date(periodToEdit.startDate), 'yyyy-MM-dd') : '');
      setEndDate(periodToEdit.endDate ? format(new Date(periodToEdit.endDate), 'yyyy-MM-dd') : '');
      setIntensity(periodToEdit.intensity || 'medium');
      setIsSpotting(Boolean(periodToEdit.isSpotting));
      setIsUncertain(Boolean(periodToEdit.isUncertain));
      setIsPeriodStart(periodToEdit.isPeriodStart !== undefined ? Boolean(periodToEdit.isPeriodStart) : true);
      setIsConfirmed(periodToEdit.isConfirmed !== undefined ? Boolean(periodToEdit.isConfirmed) : true);
      setNotes(periodToEdit.notes || '');
    } else {
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setEndDate('');
      setIntensity('medium');
      setIsSpotting(false);
      setIsUncertain(false);
      setIsPeriodStart(true);
      setIsConfirmed(true);
      setNotes('');
    }
    setError('');
  }, [periodToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setError('Please provide a period start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        startDate,
        endDate: endDate || null,
        intensity: isSpotting ? 'spotting' : intensity,
        isSpotting,
        isUncertain,
        isPeriodStart,
        isConfirmed,
        notes,
      };

      if (periodToEdit && periodToEdit._id) {
        await api.updatePeriod(periodToEdit._id, payload);
      } else {
        await api.createPeriod(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save period entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!periodToEdit || !periodToEdit._id) return;
    if (!window.confirm('Are you sure you want to remove this period record?')) return;

    setLoading(true);
    try {
      await api.deletePeriod(periodToEdit._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete period entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFF9F5] border-2 border-[#171316] rounded-2xl shadow-scrapbook p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#F9C3D0]/60 text-[#171316] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
            {periodToEdit ? 'Edit Record' : 'New Period Log'}
          </span>
          <h3 className="text-2xl font-bold font-editorial text-[#171316]">
            {periodToEdit ? 'Update Period Log' : 'Log Period Flow ♡'}
          </h3>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Start Date */}
          <div>
            <label className="block font-bold text-[#171316] mb-1.5">
              Start Date <span className="text-[#C51F46]">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block font-bold text-[#171316] mb-1.5">
              End Date <span className="font-normal text-[#171316]/60">(optional / leave empty if ongoing or unknown)</span>
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
            />
          </div>

          {/* Flow Intensity */}
          <div>
            <label className="block font-bold text-[#171316] mb-1.5">Flow Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              {['light', 'medium', 'heavy'].map((flow) => (
                <button
                  type="button"
                  key={flow}
                  onClick={() => {
                    setIntensity(flow);
                    setIsSpotting(false);
                  }}
                  className={`py-2 px-3 rounded-xl border-2 font-medium capitalize text-xs transition-all ${
                    intensity === flow && !isSpotting
                      ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm font-bold'
                      : 'bg-white text-[#171316] border-[#171316]/30 hover:border-[#171316]'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

          {/* Spotting & Uncertainty Options */}
          <div className="p-3.5 rounded-xl bg-white border border-[#171316]/20 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpotting}
                onChange={(e) => setIsSpotting(e.target.checked)}
                className="w-4 h-4 accent-[#F04478] rounded cursor-pointer"
              />
              <span className="font-semibold text-[#171316]">Is Spotting</span>
              <span className="text-[11px] text-[#171316]/60">(Very light brownish or pink traces)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPeriodStart}
                onChange={(e) => setIsPeriodStart(e.target.checked)}
                className="w-4 h-4 accent-[#F04478] rounded cursor-pointer"
              />
              <div>
                <span className="font-semibold text-[#171316] block">Marks Period Start</span>
                <span className="text-[10px] text-[#171316]/60">
                  Uncheck if this is an isolated observation rather than a cycle start date
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isUncertain}
                onChange={(e) => setIsUncertain(e.target.checked)}
                className="w-4 h-4 accent-[#F04478] rounded cursor-pointer"
              />
              <span className="font-semibold text-[#171316]">Uncertain observation</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-[#171316] mb-1.5">Personal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? Any specific symptoms..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 pt-3">
            {periodToEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="p-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#171316]/30 hover:bg-black/5 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-[#F04478] text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all"
              >
                {loading ? 'Saving...' : periodToEdit ? 'Save Changes' : 'Log Period ♡'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
