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
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="border-2 border-black max-w-md w-full text-center p-8 bg-white">
          <h2 className="text-2xl font-bold text-black mb-2">Tidak Ada Kuis</h2>
          <p className="text-gray-600 mb-6">Tidak ada pertanyaan kuis yang tersedia untuk e-book ini.</p>
          <button onClick={onCancel} className="w-full border-2 border-black bg-white text-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-all">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter(
      (q) => selectedAnswers[q.id] === q.correct_answer.toLowerCase()
    ).length;

    const resultMessage =
      score >= 80
        ? 'Luar Biasa! Kamu menguasai materi ini!'
        : score >= 60
        ? 'Bagus! Terus tingkatkan pengetahuanmu'
        : 'Ayo coba lagi untuk hasil yang lebih baik';

    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="border-2 border-black max-w-md w-full p-8 bg-white">
          <h2 className="text-2xl font-bold text-black mb-6">Hasil Kuismu</h2>
          <div className="text-center mb-6">
            <div className="inline-block border-2 border-black text-black px-8 py-4 font-bold text-5xl mb-4">
              {score}%
            </div>
            <p className="text-lg text-gray-600 mt-4">{resultMessage}</p>
          </div>

          <div className="border-2 border-gray-300 p-4 mb-6 space-y-3 bg-gray-50">
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Jawaban Benar:</span>
              <span className="text-black font-bold">{correctAnswers}/{questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-bold">Akurasi:</span>
              <span className="text-black font-bold">{Math.round((correctAnswers / questions.length) * 100)}%</span>
            </div>
            <div className="w-full border-2 border-black h-4 overflow-hidden bg-white">
              <div
                className="bg-black h-4 transition-all duration-300"
                style={{ width: `${(correctAnswers / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleTakeAgain} className="w-full border-2 border-black bg-white text-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-all">
              Coba Lagi
            </button>
            <button onClick={onCancel} className="w-full border-2 border-gray-300 bg-white text-black px-6 py-3 font-bold hover:border-black transition-all">
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-black bg-white px-4 sm:px-6 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-black mb-4">Kuis: {ebookTitle}</h1>
          <div className="w-full border-2 border-black h-4 overflow-hidden bg-white">
            <div
              className="bg-black h-4 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2 font-bold">
            Soal {currentIndex + 1} dari {questions.length}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-3xl">
          {/* Question Card */}
          <div className="border-2 border-black mb-8 p-8 bg-white">
            <h2 className="text-2xl font-bold text-black mb-8 leading-relaxed">
              {currentQuestion?.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {options.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSelectAnswer(option.key)}
                  className={`w-full p-4 text-left border-2 transition-all font-bold ${
                    selectedAnswers[currentQuestion?.id] === option.key
                      ? 'border-black bg-black text-white'
                      : 'border-black bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-inherit flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + ['a', 'b', 'c', 'd'].indexOf(option.key))}
                    </div>
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="border-2 border-black p-4 bg-white">
              <p className="text-sm text-gray-600 font-bold">
                Petunjuk: Pilih satu jawaban terbaik dari opsi yang tersedia.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentIndex === 0}
              className="border-2 border-black bg-white text-black px-6 py-3 font-bold hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-bold">
                {Object.keys(selectedAnswers).length}/{questions.length} Terjawab
              </p>
            </div>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allAnswered}
                className="border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selesai
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="border-2 border-black bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-6 py-4 text-center">
        <button
          onClick={onCancel}
          className="border-2 border-gray-300 bg-white text-black px-6 py-2 font-bold hover:border-black transition-all"
        >
          Batal Kuis
        </button>
      </footer>
    </div>
  );
}
