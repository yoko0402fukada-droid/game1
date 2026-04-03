'use client';

import Image from 'next/image';

type CharState = 'idle' | 'correct' | 'wrong';

interface Props {
  state: CharState;
  animKey: number;
}

export default function SacabambaspisCharacter({ state, animKey }: Props) {
  const isWrong = state === 'wrong';
  const isCorrect = state === 'correct';

  return (
    <div
      key={animKey}
      className={`saca-character saca-${state}`}
      style={{ position: 'relative', display: 'inline-block', width: '100%' }}
    >
      {/* メイン画像 */}
      <Image
        src="/sacabambaspis.png"
        alt="サカバンバスピス"
        width={400}
        height={300}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        priority
      />

      {/* 涙（不正解時のみ） */}
      {isWrong && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* 左目の涙 */}
          <span className="tear tear-1" style={{
            position: 'absolute', top: '38%', left: '35%',
            fontSize: '1.2rem', lineHeight: 1,
          }}>💧</span>
          <span className="tear tear-2" style={{
            position: 'absolute', top: '48%', left: '32%',
            fontSize: '1rem', lineHeight: 1,
          }}>💧</span>
          <span className="tear tear-3" style={{
            position: 'absolute', top: '58%', left: '30%',
            fontSize: '0.85rem', lineHeight: 1,
          }}>💧</span>
          {/* 右目の涙 */}
          <span className="tear tear-4" style={{
            position: 'absolute', top: '36%', left: '52%',
            fontSize: '1.1rem', lineHeight: 1,
          }}>💧</span>
          <span className="tear tear-5" style={{
            position: 'absolute', top: '46%', left: '50%',
            fontSize: '0.9rem', lineHeight: 1,
          }}>💧</span>
        </div>
      )}

      {/* キラキラ（正解時のみ） */}
      {isCorrect && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <span className="sparkle sparkle-1" style={{
            position: 'absolute', top: '5%', left: '5%', fontSize: '1.5rem',
          }}>✨</span>
          <span className="sparkle sparkle-2" style={{
            position: 'absolute', top: '0%', right: '10%', fontSize: '1.3rem',
          }}>⭐</span>
          <span className="sparkle sparkle-3" style={{
            position: 'absolute', bottom: '10%', right: '5%', fontSize: '1.2rem',
          }}>✨</span>
          <span className="sparkle sparkle-4" style={{
            position: 'absolute', bottom: '5%', left: '8%', fontSize: '1rem',
          }}>⭐</span>
          <span className="sparkle sparkle-5" style={{
            position: 'absolute', top: '10%', left: '50%', fontSize: '1.1rem',
          }}>💫</span>
        </div>
      )}
    </div>
  );
}
