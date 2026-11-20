import React from 'react';

export default function MoonScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center h-full pt-64">
      <div className="text-white text-[16px] font-light" style={{ fontFamily: 'Gilroy, sans-serif' }}>экран муун в разработке</div>
      <div className="animate-spin h-6 w-6 border-4 border-white/20 border-t-white rounded-full" />
    </div>
  );
}