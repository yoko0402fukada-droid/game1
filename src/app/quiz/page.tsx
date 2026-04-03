'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SacabambaspisCharacter from '../components/SacabambaspisCharacter';
import TreasureChest from '../components/TreasureChest';
import { questions } from '../data/questions';

type Phase = 'quiz' | 'result';
type CharState = 'idle' | 'correct' | 'wrong';

const LEVEL_NAMES: Record<number, string> = { 1: 'かんたん', 2: 'ふつう', 3: 'むずかしい' };
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

// 5つの泡（クイズ画面用）
const MINI_BUBBLES = [
  { size: 6,  left: 5,  duration: 9,  delay: 0   },
  { size: 10, left: 20, duration: 11, delay: 2    },
  { size: 5,  left: 75, duration: 8,  delay: 1    },
  { size: 8,  left: 90, duration: 10, delay: 3    },
  { size: 7,  left: 50, duration: 9,  delay: 4    },
];

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [charState, setCharState] = useState<CharState>('idle');
  const [animKey, setAnimKey] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpNum, setLevelUpNum] = useState(2);

  const currentQ = questions[qIndex];
  const level = qIndex < 10 ? 1 : qIndex < 20 ? 2 : 3;
  const progress = ((qIndex + (selected !== null ? 1 : 0)) / 30) * 100;
  const isAnswered = selected !== null;

  const handleAnswer = (choiceIndex: number) => {
    if (isAnswered) return;
    setSelected(choiceIndex);
    setAnimKey((k) => k + 1);
    if (choiceIndex === currentQ.correct) {
      setScore((s) => s + 1);
      setCharState('correct');
    } else {
      setCharState('wrong');
    }
    setTimeout(() => setShowExplanation(true), 900);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelected(null);
    setCharState('idle');
    setAnimKey((k) => k + 1);

    if (qIndex === 29) {
      setPhase('result');
      return;
    }
    const nextIndex = qIndex + 1;
    if (nextIndex === 10 || nextIndex === 20) {
      setLevelUpNum(nextIndex === 10 ? 2 : 3);
      setShowLevelUp(true);
      setTimeout(() => {
        setShowLevelUp(false);
        setQIndex(nextIndex);
      }, 2200);
    } else {
      setQIndex(nextIndex);
    }
  };

  // ===== 結果スクリーン =====
  if (phase === 'result') {
    const isPerfect = score === 30;
    const percentage = Math.round((score / 30) * 100);
    const grade =
      score === 30 ? '🏆 完璧！全問正解！' :
      score >= 25 ? '🥇 すばらしい！' :
      score >= 20 ? '🥈 よくできました！' :
      score >= 15 ? '🥉 まずまずです' :
      '📚 もっと勉強しよう！';

    return (
      <div className="ocean-quiz-bg">
        <div className="ocean-bg" />
        <div className="light-rays" />
        <div className="bubbles-container" aria-hidden="true">
          {MINI_BUBBLES.map((b, i) => (
            <div key={i} className="bubble" style={{ width: b.size, height: b.size, left: `${b.left}%`, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s`, bottom: `-${b.size}px` }} />
          ))}
        </div>

        <div className="quiz-result-content">
          <div className="quiz-ocean-card result-card">
            <h2 className="result-title">クイズ終了！</h2>
            <p className="result-subtitle">― サカバンクイズ ―</p>

            {isPerfect ? (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ maxWidth: '220px', margin: '0 auto 0.5rem' }}>
                  <TreasureChest />
                </div>
                <div style={{ maxWidth: '160px', margin: '0 auto' }}>
                  <SacabambaspisCharacter state="correct" animKey={999} />
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '180px', margin: '0 auto 1.5rem' }}>
                <SacabambaspisCharacter state="idle" animKey={998} />
              </div>
            )}

            <div className="result-score-area">
              <span className="result-score-num">{score}</span>
              <span className="result-score-denom"> / 30</span>
              <p className="result-pct">{percentage}% 正解</p>
            </div>

            <div className="result-grade-box">
              <p className="result-grade">{grade}</p>
              {isPerfect && (
                <p className="result-grade-sub">宝箱の封印が解かれた！古生物マスターの称号を授与します！</p>
              )}
              {!isPerfect && score >= 20 && (
                <p className="result-grade-sub">もう少しで全問正解！もう一度挑戦しよう！</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="ocean-quiz-btn" onClick={() => { setPhase('quiz'); setQIndex(0); setScore(0); setSelected(null); setCharState('idle'); setAnimKey(0); setShowExplanation(false); setShowLevelUp(false); }}>
                もう一度チャレンジ！
              </button>
              <Link href="/" className="ocean-quiz-btn-outline">
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== クイズスクリーン =====
  return (
    <div className="ocean-quiz-bg">
      {/* 海の背景 */}
      <div className="ocean-bg" />
      <div className="light-rays" />
      <div className="bubbles-container" aria-hidden="true">
        {MINI_BUBBLES.map((b, i) => (
          <div key={i} className="bubble" style={{ width: b.size, height: b.size, left: `${b.left}%`, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s`, bottom: `-${b.size}px` }} />
        ))}
      </div>

      {/* ヘッダー */}
      <header className="quiz-ocean-header">
        <div className="quiz-header-inner">
          <div className="quiz-header-top">
            <Link href="/" className="quiz-home-link">← ホーム</Link>
            <h1 className="quiz-header-title">サカバンクイズ</h1>
            <div className="quiz-header-right">
              <span className={`ocean-level-badge lv${level}`}>Lv.{level} {LEVEL_NAMES[level]}</span>
              <span className="quiz-score-display">
                {score}<span className="quiz-score-total">/{qIndex}</span>
              </span>
            </div>
          </div>
          <div className="quiz-progress-row">
            <div className="quiz-progress-bg">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="quiz-progress-label">{qIndex + 1} / 30</span>
          </div>
        </div>
      </header>

      {/* メイン */}
      <main className="quiz-main">
        {/* レベルアップ */}
        {showLevelUp && (
          <div className="levelup-modal-bg">
            <div className="levelup-overlay quiz-ocean-card" style={{ textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '280px' }}>
              <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</p>
              <p style={{ color: 'rgba(150,220,255,0.9)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>レベルアップ！</p>
              <span className={`ocean-level-badge lv${levelUpNum}`} style={{ fontSize: '1rem', padding: '0.3rem 1rem', display: 'inline-block', marginBottom: '0.75rem' }}>
                Lv.{levelUpNum} {LEVEL_NAMES[levelUpNum]}
              </span>
              <p style={{ color: 'rgba(180,230,255,0.85)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {levelUpNum === 2 ? 'ここからは「ふつう」レベル！' : 'ここからは「むずかしい」レベル！'}
              </p>
            </div>
          </div>
        )}

        {/* キャラクター */}
        <div className="quiz-char-area">
          <div style={{ width: '200px', maxWidth: '55vw' }}>
            <SacabambaspisCharacter state={charState} animKey={animKey} />
          </div>
        </div>

        {/* 問題 */}
        <div className="quiz-ocean-card question-card">
          <span className="question-num">Q{qIndex + 1}.</span>
          <p className="question-text">{currentQ.question}</p>
        </div>

        {/* 選択肢 */}
        <div className="choices-grid">
          {currentQ.choices.map((choice, i) => {
            let cls = 'ocean-choice-btn';
            if (isAnswered) {
              if (i === currentQ.correct) cls += ' choice-correct';
              else if (i === selected)    cls += ' choice-wrong';
              else                        cls += ' choice-dim';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={isAnswered}>
                <span className="choice-label">{CHOICE_LABELS[i]}.</span>
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* 解説 */}
        {showExplanation && (
          <div className={`explanation-box ocean-explain ${selected === currentQ.correct ? 'explain-correct' : 'explain-wrong'}`}>
            <div className="explain-header">
              <span className="explain-icon">{selected === currentQ.correct ? '⭕' : '❌'}</span>
              <span className={`explain-result ${selected === currentQ.correct ? 'text-correct' : 'text-wrong'}`}>
                {selected === currentQ.correct
                  ? '正解！すばらしい！'
                  : `不正解… 正解は「${currentQ.choices[currentQ.correct]}」`}
              </span>
            </div>
            <p className="explain-text">{currentQ.explanation}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button className="ocean-quiz-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }} onClick={handleNext}>
                {qIndex === 29 ? '結果を見る →' : '次の問題へ →'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="quiz-footer">
        サカバンバスピス（Sacabambaspis）― オルドビス紀の無顎魚類
      </footer>
    </div>
  );
}
