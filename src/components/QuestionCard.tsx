import React from 'react';
import { AlertCircle, Check, CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '../data/questions';
import { QuestionResult } from '../utils/grading';
import { MathText } from './MathText';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedIds: Array<'A' | 'B' | 'C' | 'D'>;
  isSubmitted: boolean;
  result?: QuestionResult;
  onToggleOption: (questionId: number, optionId: 'A' | 'B' | 'C' | 'D') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedIds,
  isSubmitted,
  result,
  onToggleOption,
}) => {
  const isMultiple = question.type === 'multiple';
  const correctSet = new Set(question.correctIds);
  const selectedSet = new Set(selectedIds);

  const renderStatusLabel = () => {
    if (!isSubmitted || !result) return null;

    const pointsText = `${result.earnedPoints.toFixed(2)} / ${result.maxPoints.toFixed(2)} điểm`;

    if (result.status === 'correct') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Đúng</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">+{pointsText}</span>
        </span>
      );
    }

    if (result.status === 'partial') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 whitespace-nowrap">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>Đúng một phần</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">+{pointsText}</span>
        </span>
      );
    }

    if (result.status === 'unanswered') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 whitespace-nowrap">
          <MinusCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
          <span>Chưa trả lời</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{pointsText}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 whitespace-nowrap">
        <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
        <span>Sai</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono tabular-nums">{pointsText}</span>
      </span>
    );
  };

  return (
    <section
      id={`question-${question.id}`}
      aria-labelledby={`question-heading-${question.id}`}
      className="scroll-mt-20 bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      {/* Question metadata header — clean unboxed typography */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[13px] text-slate-500">
          <span
            id={`question-heading-${question.id}`}
            className="font-bold text-slate-900 text-sm sm:text-[15px]"
          >
            Câu {question.id}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-600">{question.topic}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-sky-700">
            {isMultiple ? 'Chọn các đáp án đúng' : 'Chọn một đáp án'}
          </span>
        </div>

        {renderStatusLabel()}
      </div>

      {/* Prompt */}
      <div className="text-[15px] sm:text-base leading-relaxed text-slate-900 font-medium mb-4">
        <MathText text={question.prompt} />
      </div>

      {/* Options */}
      <div
        role={isMultiple ? 'group' : 'radiogroup'}
        aria-labelledby={`question-heading-${question.id}`}
        className="space-y-2.5"
      >
        {question.options.map((option) => {
          const isSelected = selectedSet.has(option.id);
          const isCorrect = correctSet.has(option.id);

          let containerClasses =
            'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';
          let indicatorClasses = 'border-slate-300 bg-white text-transparent';
          let letterClasses = 'text-slate-600';
          let feedbackNode: React.ReactNode = null;

          if (!isSubmitted) {
            if (isSelected) {
              containerClasses =
                'border-sky-600 bg-sky-50/70 text-slate-900 ring-1 ring-sky-600/20';
              indicatorClasses = 'border-sky-600 bg-sky-600 text-white';
              letterClasses = 'text-sky-800';
            }
          } else {
            if (isCorrect && isSelected) {
              containerClasses = 'border-emerald-500 bg-emerald-50/70 text-slate-900';
              indicatorClasses = 'border-emerald-600 bg-emerald-600 text-white';
              letterClasses = 'text-emerald-800';
              feedbackNode = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Bạn chọn · Đúng</span>
                </span>
              );
            } else if (isCorrect && !isSelected) {
              containerClasses = 'border-emerald-400 border-dashed bg-emerald-50/35 text-slate-900';
              indicatorClasses = 'border-emerald-500 bg-white text-emerald-600';
              letterClasses = 'text-emerald-800';
              feedbackNode = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 whitespace-nowrap shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Đáp án đúng</span>
                </span>
              );
            } else if (!isCorrect && isSelected) {
              containerClasses = 'border-red-400 bg-red-50/70 text-slate-900';
              indicatorClasses = 'border-red-600 bg-red-600 text-white';
              letterClasses = 'text-red-800';
              feedbackNode = (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 whitespace-nowrap shrink-0">
                  <XCircle className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                  <span>Bạn chọn · Sai</span>
                </span>
              );
            } else {
              containerClasses = 'border-slate-200 bg-slate-50/40 text-slate-500';
              indicatorClasses = 'border-slate-200 bg-slate-100 text-transparent';
              letterClasses = 'text-slate-400';
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              role={isMultiple ? 'checkbox' : 'radio'}
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => onToggleOption(question.id, option.id)}
              className={`w-full text-left flex items-start sm:items-center justify-between gap-3 px-3.5 sm:px-4 py-3 min-h-[48px] rounded-lg border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                isSubmitted ? 'cursor-default' : 'cursor-pointer'
              } ${containerClasses}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Selection Indicator */}
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center border transition-colors duration-150 ${
                    isMultiple ? 'rounded' : 'rounded-full'
                  } ${indicatorClasses}`}
                >
                  {isMultiple ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : isSubmitted && isCorrect
                            ? 'bg-emerald-600'
                            : 'bg-transparent'
                      }`}
                    />
                  )}
                </span>

                <div className="flex items-baseline gap-2 min-w-0 text-[15px] leading-relaxed">
                  <span className={`font-bold shrink-0 ${letterClasses}`}>
                    {option.id}.
                  </span>
                  <MathText text={option.text} className="break-words" />
                </div>
              </div>

              {feedbackNode && <div className="pt-0.5 sm:pt-0">{feedbackNode}</div>}
            </button>
          );
        })}
      </div>

      {/* Explanation after submission */}
      {isSubmitted && (
        <div className="mt-5 pt-4 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-700 mb-1.5">
            Lời giải thích
          </p>
          <div className="text-sm leading-relaxed text-slate-700">
            <MathText text={question.explanation} />
          </div>
        </div>
      )}
    </section>
  );
};
