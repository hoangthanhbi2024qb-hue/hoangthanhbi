import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  unansweredIds: number[];
  studentName: string;
  studentClass: string;
  onChangeName: (val: string) => void;
  onChangeClass: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  unansweredIds,
  studentName,
  studentClass,
  onChangeName,
  onChangeClass,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const hasUnanswered = unansweredIds.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle
              className={`w-5 h-5 shrink-0 ${
                hasUnanswered ? 'text-amber-600' : 'text-sky-600'
              }`}
              aria-hidden="true"
            />
            <h2
              id="submit-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              Xác nhận nộp bài
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {hasUnanswered ? (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900 mb-4">
            <p className="font-semibold">
              Bạn còn {unansweredIds.length} câu chưa chọn đáp án:
            </p>
            <p className="mt-1 text-amber-800">
              {unansweredIds.map((id) => `Câu ${id}`).join(', ')}. Bạn có chắc chắn muốn nộp bài ngay không?
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600 mb-4">
            Bạn đã trả lời đầy đủ tất cả các câu hỏi. Vui lòng kiểm tra thông tin học sinh bên dưới trước khi nộp bài.
          </p>
        )}

        <div className="space-y-3 mb-6">
          <div>
            <label
              htmlFor="modal-student-name"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Họ và tên học sinh
            </label>
            <input
              id="modal-student-name"
              type="text"
              value={studentName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Minh Anh"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="modal-student-class"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Lớp
            </label>
            <input
              id="modal-student-class"
              type="text"
              value={studentClass}
              onChange={(e) => onChangeClass(e.target.value)}
              placeholder="Ví dụ: 10A1"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            Quay lại làm tiếp
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            Xác nhận nộp bài
          </button>
        </div>
      </div>
    </div>
  );
};
