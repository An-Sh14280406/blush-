import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const SettingsPage = () => {
  const { openLogPeriod } = useOutletContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Data Export
  const handleExportData = async () => {
    setExporting(true);
    setError('');
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `blush-ananya-wellness-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('Your personal health data export was downloaded successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // 2. Delete Account
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(
      "Type 'DELETE' to permanently erase your blush. account and all health entries:"
    );
    if (confirmation !== 'DELETE') return;

    setDeleting(true);
    setError('');
    try {
      await api.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
            Privacy, Exports & Management
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
            Settings & Data Sovereignty ♡
          </h3>
          <p className="text-xs sm:text-sm text-[#171316]/70">
            You maintain 100% ownership and control over your personal wellness data.
          </p>
        </div>

        {message && (
          <div className="p-3.5 rounded-xl bg-[#FFF0F3] border-2 border-[#F04478] text-[#C51F46] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#F04478]" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Export Data Card */}
        <ScrapbookCard variant="default">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-[#171316] mb-1 flex items-center gap-2">
                <Download className="w-4 h-4 text-[#F04478]" />
                <span>Export All Personal Data</span>
              </h4>
              <p className="text-xs text-[#171316]/70 max-w-md">
                Download a clean, structured JSON file containing all your period records, mood reflections, symptoms, and wellness history.
              </p>
            </div>

            <button
              onClick={handleExportData}
              disabled={exporting}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-[#171316] shadow-scrapbook-sm font-bold text-xs hover:bg-[#FFF0F3] transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <FileText className="w-4 h-4 text-[#F04478]" />
              <span>{exporting ? 'Exporting...' : 'Download JSON Export'}</span>
            </button>
          </div>
        </ScrapbookCard>

        {/* Privacy & Account Erasure Card */}
        <ScrapbookCard variant="default">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-red-700 mb-1 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Permanent Account & Data Erasure</span>
              </h4>
              <p className="text-xs text-[#171316]/70 max-w-md">
                Permanently erase your account, all period logs, moods, symptoms, and settings from the database. This action cannot be undone.
              </p>
            </div>

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm hover:bg-red-700 transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>{deleting ? 'Erasing...' : 'Delete All Data'}</span>
            </button>
          </div>
        </ScrapbookCard>
      </div>
    </div>
  );
};
