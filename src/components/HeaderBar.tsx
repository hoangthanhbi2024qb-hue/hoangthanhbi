import React from 'react';
import { AlertTriangle, Clock, RotateCcw, Send } from 'lucide-react';
import { formatTimeMMSS } from '../utils/grading';

interface HeaderBarProps {
  timeLeft: number;
  isWarning: boolean;
  isSubmitted: boolean;
  onSubmitClick: () => void;
  onRetryClick: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  timeLeft,
  isWarning,
  isSubmitted,
  onSubmitClick,
  onRetryClick,
}) => {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1160px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand / Quiz Title */}
        <div className="min-w-0 flex items-center">
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 truncate">
            Kiểm tra 15 phút - Toán: Mệnh đề
          </h1>
        </div>

        {/* Zone 2: Quiet inline metadata (desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
          <span>5 câu hỏi</span>
          <span aria-hidden="true">·</span>
          <span>Thang điểm 10</span>
          <span aria-hidden="true">·</span>
          <span>{isSubmitted ? 'Đã nộp bài' : 'Đang làm bài'}</span>
        </div>

        {/* Zone 3: Countdown timer + 1 primary action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-mono font-semibold tabular-nums transition-colors duration-150 whitespace-nowrap shrink-0 ${
              isSubmitted
                ? 'bg-slate-50 border-slate-200 text-slate-600'
                : isWarning
                  ? 'bg-red-50 border-red-300 text-red-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
            aria-live={isWarning && !isSubmitted ? 'polite' : 'off'}
            title="Thời gian làm bài còn lại"
          >
            {isWarning && !isSubmitted ? (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
            ) : (
              <Clock className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
            )}
            <span>{formatTimeMMSS(timeLeft)}</span>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={onSubmitClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[38px] rounded-lg bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Nộp bài</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onRetryClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[38px] rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Làm lại</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
