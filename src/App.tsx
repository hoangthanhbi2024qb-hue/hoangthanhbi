import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Send,
  User,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { HeaderBar } from './components/HeaderBar';
import { QuestionCard } from './components/QuestionCard';
import { ResultSummary } from './components/ResultSummary';
import { SubmitConfirmModal } from './components/SubmitConfirmModal';
import {
  QUESTIONS,
  QUIZ_DURATION_SECONDS,
  WARNING_THRESHOLD_SECONDS,
} from './data/questions';
import { evaluateQuiz } from './utils/grading';

type OptionId = 'A' | 'B' | 'C' | 'D';

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [answers, setAnswers] = useState<Record<number, OptionId[]>>({});
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION_SECONDS);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedByTimeout, setSubmittedByTimeout] = useState<boolean>(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmResetActive, setConfirmResetActive] = useState<boolean>(false);

  const finalizeSubmission = useCallback(
    (byTimeout: boolean) => {
      setIsSubmitted(true);
      setSubmittedByTimeout(byTimeout);
      setTimeSpentSeconds(
        byTimeout ? QUIZ_DURATION_SECONDS : Math.max(1, QUIZ_DURATION_SECONDS - timeLeft)
      );
      setIsConfirmModalOpen(false);
      setConfirmResetActive(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [timeLeft]
  );

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isSubmitted]);

  // Auto-submit when countdown hits 00:00
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      finalizeSubmission(true);
    }
  }, [timeLeft, isSubmitted, finalizeSubmission]);

  const handleToggleOption = useCallback(
    (questionId: number, optionId: OptionId) => {
      if (isSubmitted) return;
      const question = QUESTIONS.find((q) => q.id === questionId);
      if (!question) return;

      setAnswers((prev) => {
        const current = prev[questionId] ?? [];
        if (question.type === 'single') {
          return { ...prev, [questionId]: [optionId] };
        }
        const exists = current.includes(optionId);
        const next = exists
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: next };
      });
    },
    [isSubmitted]
  );

  const unansweredIds = useMemo(
    () =>
      QUESTIONS.filter((q) => (answers[q.id]?.length ?? 0) === 0).map(
        (q) => q.id
      ),
    [answers]
  );

  const answeredCount = QUESTIONS.length - unansweredIds.length;
  const isWarning = !isSubmitted && timeLeft <= WARNING_THRESHOLD_SECONDS && timeLeft > 0;

  const evaluation = useMemo(() => {
    if (!isSubmitted) return null;
    return evaluateQuiz(answers);
  }, [isSubmitted, answers]);

  const handleSubmitRequest = useCallback(() => {
    if (isSubmitted) return;
    const missingStudentInfo = !studentName.trim() || !studentClass.trim();
    if (unansweredIds.length > 0 || missingStudentInfo) {
      setIsConfirmModalOpen(true);
      return;
    }
    finalizeSubmission(false);
  }, [isSubmitted, studentName, studentClass, unansweredIds.length, finalizeSubmission]);

  const performReset = useCallback(() => {
    setAnswers({});
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setIsSubmitted(false);
    setSubmittedByTimeout(false);
    setTimeSpentSeconds(0);
    setIsConfirmModalOpen(false);
    setConfirmResetActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRetryRequest = useCallback(() => {
    if (!isSubmitted && answeredCount > 0 && !confirmResetActive) {
      setConfirmResetActive(true);
      return;
    }
    performReset();
  }, [isSubmitted, answeredCount, confirmResetActive, performReset]);

  const scrollToQuestion = (questionId: number) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <HeaderBar
        timeLeft={timeLeft}
        isWarning={isWarning}
        isSubmitted={isSubmitted}
        onSubmitClick={handleSubmitRequest}
        onRetryClick={handleRetryRequest}
      />

      <main className="flex-1 w-full max-w-[1160px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 1-Minute Warning Banner */}
        {isWarning && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
            <p className="font-medium">
              Cảnh báo: Chỉ còn dưới 1 phút! Hệ thống sẽ tự động nộp bài khi đồng hồ về{' '}
              <span className="font-mono font-bold tabular-nums">00:00</span>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Primary Content Column */}
          <div className="space-y-6 min-w-0">
            {/* Result Summary (after submission) */}
            {isSubmitted && evaluation && (
              <ResultSummary
                evaluation={evaluation}
                studentName={studentName}
                studentClass={studentClass}
                timeSpentSeconds={timeSpentSeconds}
                submittedByTimeout={submittedByTimeout}
                onRetry={performReset}
                onScrollToDetails={() => scrollToQuestion(1)}
              />
            )}

            {/* Student Info Form (shown during test so students can enter before or when submitting) */}
            {!isSubmitted && (
              <section
                aria-label="Thông tin học sinh"
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                    <h2 className="text-base font-bold text-slate-900">
                      Thông tin học sinh
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500">
                    Có thể điền trước hoặc khi nộp bài
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="student-name"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Họ và tên
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="student-class"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Lớp
                    </label>
                    <input
                      id="student-class"
                      type="text"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      placeholder="Ví dụ: 10A1"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Questions List */}
            <div className="space-y-5">
              {QUESTIONS.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  selectedIds={answers[question.id] ?? []}
                  isSubmitted={isSubmitted}
                  result={evaluation?.resultsByQuestion[question.id]}
                  onToggleOption={handleToggleOption}
                />
              ))}
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600">
                {isSubmitted ? (
                  <span>
                    Đã hoàn thành bài kiểm tra · Điểm số:{' '}
                    <strong className="font-mono tabular-nums text-slate-900">
                      {evaluation?.totalScore.toFixed(2)} / 10
                    </strong>
                  </span>
                ) : (
                  <span>
                    Đã trả lời{' '}
                    <strong className="font-mono tabular-nums text-slate-900">
                      {answeredCount}/{QUESTIONS.length}
                    </strong>{' '}
                    câu hỏi
                    {unansweredIds.length > 0 && (
                      <span className="text-slate-500">
                        {' '}
                        (còn {unansweredIds.map((id) => `Câu ${id}`).join(', ')})
                      </span>
                    )}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {!isSubmitted ? (
                  <>
                    {confirmResetActive ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={performReset}
                          className="px-3.5 py-2.5 min-h-[42px] rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Xác nhận làm lại
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmResetActive(false)}
                          className="px-3.5 py-2.5 min-h-[42px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRetryRequest}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Làm lại</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmitRequest}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Nộp bài</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={performReset}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Làm lại bài kiểm tra</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar: Question Progress & Navigator */}
          <aside className="lg:sticky lg:top-20 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Danh sách câu hỏi
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSubmitted
                  ? 'Nhấn vào từng câu để xem đáp án và giải thích'
                  : `Đã chọn đáp án ${answeredCount}/${QUESTIONS.length} câu`}
              </p>
            </div>

            <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
              {QUESTIONS.map((q) => {
                const isAnswered = (answers[q.id]?.length ?? 0) > 0;
                const qResult = evaluation?.resultsByQuestion[q.id];

                let itemStyle =
                  'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700';
                let statusText = isAnswered ? 'Đã chọn' : 'Chưa làm';

                if (!isSubmitted && isAnswered) {
                  itemStyle =
                    'border-sky-300 bg-sky-50/80 hover:bg-sky-100/70 text-sky-900';
                } else if (isSubmitted && qResult) {
                  if (qResult.status === 'correct') {
                    itemStyle =
                      'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900';
                    statusText = 'Đúng';
                  } else if (qResult.status === 'partial') {
                    itemStyle =
                      'border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900';
                    statusText = 'Một phần';
                  } else {
                    itemStyle =
                      'border-red-300 bg-red-50/70 hover:bg-red-100/70 text-red-900';
                    statusText = qResult.status === 'unanswered' ? 'Bỏ trống' : 'Sai';
                  }
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`flex items-center justify-center lg:justify-between gap-2 px-3 py-2.5 min-h-[42px] rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${itemStyle}`}
                  >
                    <span className="font-semibold whitespace-nowrap">
                      <span className="lg:hidden">{q.id}</span>
                      <span className="hidden lg:inline">Câu {q.id}</span>
                    </span>

                    <span className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
                      {isSubmitted && qResult ? (
                        <>
                          {qResult.status === 'correct' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          )}
                          {qResult.status === 'partial' && (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                          )}
                          {(qResult.status === 'incorrect' ||
                            qResult.status === 'unanswered') && (
                            <XCircle className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                          )}
                          <span>{statusText}</span>
                        </>
                      ) : (
                        <span className={isAnswered ? 'text-sky-700' : 'text-slate-400'}>
                          {statusText}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              {!isSubmitted ? (
                <>
                  <button
                    type="button"
                    onClick={handleSubmitRequest}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Nộp bài</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetryRequest}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{confirmResetActive ? 'Nhấn lại để xác nhận' : 'Làm lại'}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={performReset}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Làm lại</span>
                </button>
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-500 pt-1">
              Mỗi câu tối đa 2,00 điểm (tổng 10,00 điểm). Câu nhiều lựa chọn được tính điểm thành phần khi không chọn nhầm đáp án sai.
            </p>
          </aside>
        </div>
      </main>

      <SubmitConfirmModal
        isOpen={isConfirmModalOpen}
        unansweredIds={unansweredIds}
        studentName={studentName}
        studentClass={studentClass}
        onChangeName={setStudentName}
        onChangeClass={setStudentClass}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={() => finalizeSubmission(false)}
      />
    </div>
  );
}
