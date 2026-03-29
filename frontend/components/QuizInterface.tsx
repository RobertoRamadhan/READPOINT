'use client';

import { useState } from 'react';

export interface QuizQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface QuizInterfaceProps {
  quizId: number;
  ebookTitle: string;
  questions: QuizQuestion[];
  onSubmit: (answers: Record<number, string>, score: number) => void;
  onCancel: () => void;
}

export default function QuizInterface({
  ebookTitle,
  questions,
  onSubmit,
  onCancel,
}: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const options = [
    { key: 'a', label: currentQuestion?.option_a },
    { key: 'b', label: currentQuestion?.option_b },
    { key: 'c', label: currentQuestion?.option_c },
    { key: 'd', label: currentQuestion?.option_d },
  ];

  const handleSelectAnswer = (key: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: key,
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer.toLowerCase()) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    onSubmit(selectedAnswers, calculatedScore);
  };

  const handleTakeAgain = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const isAnswered = currentQuestion && selectedAnswers[currentQuestion.id];
  const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white p-4">
        <div className="card max-w-md w-full text-center animate-slide-up">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tidak Ada Kuis</h2>
          <p className="text-slate-600 mb-6">Tidak ada pertanyaan kuis yang tersedia untuk e-book ini.</p>
          <button onClick={onCancel} className="btn-primary w-full">
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correct_answer.toLowerCase()
    ).length;

    const resultIcon = score >= 80 ? '🎉' : score >= 60 ? '👏' : '💪';
    const resultMessage =
      score >= 80
        ? 'Luar Biasa! Kamu menguasai materi ini!'
        : score >= 60
        ? 'Bagus! Terus tingkatkan pengetahuanmu'
        : 'Ayo coba lagi untuk hasil yang lebih baik';

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-white p-4">
        <div className="card max-w-md w-full animate-slide-up">
          {/* Score Display */}
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{resultIcon}</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hasil Kuismu</h2>
            <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-bold text-5xl my-4">
              {score}%
            </div>
            <p className="text-lg text-slate-600 mt-4">{resultMessage}</p>
          </div>

          {/* Stats */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 font-semibold">Jawaban Benar:</span>
              <span className="text-primary-600 font-bold">{correctAnswers}/{questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-semibold">Akurasi:</span>
              <span className="text-accent-600 font-bold">{Math.round((correctAnswers / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 transition-all duration-300"
                style={{ width: `${(correctAnswers / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button onClick={handleTakeAgain} className="btn-primary w-full">
              🔄 Coba Lagi
            </button>
            <button onClick={onCancel} className="btn-secondary w-full">
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 sm:px-6 py-4 shadow-lg sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Kuis: {ebookTitle}</h1>
          <div className="w-full bg-primary-500 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-primary-100 mt-2">
            Soal {currentIndex + 1} dari {questions.length}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-3xl animate-slide-up">
          {/* Question Card */}
          <div className="card mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
              {currentQuestion?.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSelectAnswer(option.key)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-semibold ${
                    selectedAnswers[currentQuestion?.id] === option.key
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold ${
                        selectedAnswers[currentQuestion?.id] === option.key
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + ['a', 'b', 'c', 'd'].indexOf(option.key))}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 <span className="font-semibold">Petunjuk:</span> Pilih satu jawaban terbaik dari opsi yang tersedia.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className="btn-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-600 font-medium">
                {Object.keys(selectedAnswers).length}/{questions.length} Terjawab
              </p>
            </div>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="btn-success px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selesai ✓
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4 text-center">
        <button
          onClick={onCancel}
          className="btn-ghost text-slate-600 hover:text-slate-700"
        >
          ✕ Batal Kuis
        </button>
      </footer>
    </div>
  );
}
