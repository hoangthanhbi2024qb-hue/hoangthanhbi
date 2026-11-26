import React from 'react';
import { Award, CheckCircle2, Clock, RotateCcw, ArrowDown } from 'lucide-react';
import { QuizEvaluation, formatDurationVietnamese } from '../utils/grading';

interface ResultSummaryProps {
  evaluation: QuizEvaluation;
  studentName: string;
  studentClass: string;
  timeSpentSeconds: number;
  submittedByTimeout: boolean;
  onRetry: () => void;
  onScrollToDetails: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  evaluation,
  studentName,
  studentClass,
  timeSpentSeconds,
  submittedByTimeout,
  onRetry,
  onScrollToDetails,
}) => {
  const { totalScore, correctCount, partialCount, totalQuestions } = evaluation;

  const scoreComment =
    totalScore >= 8
      ? 'Kết quả xuất sắc'
      : totalScore >= 6.5
        ? 'Kết quả khá tốt'
        : totalScore >= 5
          ? 'Đạt yêu cầu'
          : 'Cần ôn tập thêm';

  return (
    <section
      aria-label="Kết quả bài kiểm tra"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700 mb-1">
            {submittedByTimeout
              ? 'Hết giờ làm bài · Hệ thống đã tự động nộp bài'
              : 'Đã hoàn thành bài kiểm tra'}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Kết quả: {scoreComment}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            <span>Học sinh: </span>
            <span className="font-semibold text-slate-900">
              {studentName.trim() || 'Chưa nhập họ tên'}
            </span>
            <span className="mx-2 text-slate-400" aria-hidden="true">
              ·
            </span>
            <span>Lớp: </span>
            <span className="font-semibold text-slate-900">
              {studentClass.trim() || 'Chưa nhập lớp'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onScrollToDetails}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
          >
            <ArrowDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Đối chiếu đáp án</span>
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      {/* 3 Tabular Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <Award className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
            <span>Tổng điểm (thang 10)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {totalScore.toFixed(2)}
            <span className="text-base font-medium text-slate-500"> / 10</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Số câu trả lời đúng</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {correctCount}
            <span className="text-base font-medium text-slate-500">
              {' '}
              / {totalQuestions} câu
            </span>
          </div>
          {partialCount > 0 && (
            <p className="mt-1 text-xs text-amber-700 font-medium">
              Có {partialCount} câu đạt điểm thành phần
            </p>
          )}
        </div>

        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
            <Clock className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
            <span>Thời gian đã làm</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900 pt-1">
            {formatDurationVietnamese(timeSpentSeconds)}
          </div>
        </div>
      </div>
    </section>
  );
};
