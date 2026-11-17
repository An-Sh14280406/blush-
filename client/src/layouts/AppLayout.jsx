import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { BottomNav } from '../components/BottomNav';
import { AddEditPeriodModal } from '../components/AddEditPeriodModal';

export const AppLayout = () => {
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePeriodSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFF4E9] flex text-[#171316]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 md:p-10 pb-24 md:pb-10 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet
            context={{
              openLogPeriod: () => setIsPeriodModalOpen(true),
              refreshTrigger,
            }}
          />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Add/Edit Period Modal */}
      <AddEditPeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onSuccess={handlePeriodSuccess}
      />
    </div>
  );
};
