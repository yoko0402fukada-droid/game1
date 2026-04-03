'use client';

import Image from 'next/image';
import Link from 'next/link';

const BUBBLES = [
  { size: 8,  left: 8,  duration: 7,  delay: 0   },
  { size: 14, left: 18, duration: 10, delay: 1.5  },
  { size: 6,  left: 28, duration: 6,  delay: 0.5  },
  { size: 10, left: 40, duration: 8,  delay: 2.5  },
  { size: 18, left: 52, duration: 11, delay: 0    },
  { size: 7,  left: 63, duration: 7,  delay: 3    },
  { size: 12, left: 73, duration: 9,  delay: 1    },
  { size: 5,  left: 82, duration: 6,  delay: 2    },
  { size: 9,  left: 91, duration: 8,  delay: 4    },
  { size: 11, left: 55, duration: 7,  delay: 3.5  },
  { size: 6,  left: 4,  duration: 9,  delay: 5    },
  { size: 13, left: 96, duration: 10, delay: 2.2  },
];

export default function HomePage() {
  return (
    <div className="ocean-home">
      {/* 海の背景 */}
      <div className="ocean-bg" />

      {/* 光の帯 */}
      <div className="light-rays" />

      {/* 泡 */}
      <div className="bubbles-container" aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              width:  b.size,
              height: b.size,
              left:   `${b.left}%`,
              animationDuration:  `${b.duration}s`,
              animationDelay:     `${b.delay}s`,
              bottom: `-${b.size + 10}px`,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="home-content">
        {/* タイトル */}
        <div className="home-title-area">
          <p className="home-label">― 古生物4択クイズ ―</p>
          <h1 className="home-title">サカバンクイズ</h1>
        </div>

        {/* キャラクター */}
        <div className="home-character">
          <Image
            src="/sacabambaspis.png"
            alt="サカバンバスピス"
            width={340}
            height={255}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
        </div>

        {/* 説明カード */}
        <div className="home-card">
          <p className="home-desc">
            オルドビス紀の海を泳いだ古代魚<br />
            <strong>サカバンバスピス</strong>と一緒に<br />
            古生物の謎を解き明かそう！
          </p>
          <div className="home-tags">
            <span>📜 全30問</span>
            <span>📈 全3レベル</span>
            <span>🏆 全問正解で宝箱</span>
          </div>
          <div className="home-levels">
            <span className="ocean-badge easy">Lv.1 かんたん</span>
            <span className="ocean-badge normal">Lv.2 ふつう</span>
            <span className="ocean-badge hard">Lv.3 むずかしい</span>
          </div>
        </div>

        {/* スタートボタン */}
        <Link href="/quiz" className="ocean-start-btn">
          🐟　クイズをはじめる
        </Link>

        <p className="home-note">
          ※ サカバンバスピス（Sacabambaspis）は<br />オルドビス紀に実在した無顎魚類です
        </p>
      </div>

      {/* 海底の砂利風ライン */}
      <div className="ocean-floor" aria-hidden="true" />
    </div>
  );
}
