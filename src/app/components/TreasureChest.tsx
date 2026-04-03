'use client';

export default function TreasureChest() {
  return (
    <div className="treasure-wrapper">
      <svg
        viewBox="0 0 240 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        aria-label="宝箱"
      >
        {/* ===== 宝石や金貨（溢れ出す） ===== */}
        <ellipse cx="95" cy="88" rx="9" ry="6" fill="#E84040" className="gem gem-1" />
        <ellipse cx="145" cy="82" rx="7" ry="5" fill="#4040E8" className="gem gem-2" />
        <ellipse cx="72" cy="78" rx="8" ry="5" fill="#40C840" className="gem gem-3" />
        <circle cx="168" cy="90" r="7" fill="#E8C840" className="gem gem-4" />
        <circle cx="58" cy="90" r="6" fill="#E87840" className="gem gem-5" />
        <ellipse cx="120" cy="72" rx="10" ry="7" fill="#C840E8" className="gem gem-6" />
        <circle cx="186" cy="82" r="5" fill="#E8C840" className="gem gem-7" />
        <circle cx="42" cy="84" r="5" fill="#E8C840" className="gem gem-8" />

        {/* ===== 宝箱の蓋（開いた状態） ===== */}
        {/* 蓋の影 */}
        <path
          d="M 22,100 Q 22,55 120,55 Q 218,55 218,100 L 218,108 Q 218,63 120,63 Q 22,63 22,108 Z"
          fill="#3A2808"
          opacity="0.4"
          className="chest-lid"
        />
        {/* 蓋メイン */}
        <path
          d="M 20,100 Q 20,52 120,52 Q 220,52 220,100 Z"
          fill="#8B5E1E"
          stroke="#5A3A08"
          strokeWidth="2"
          className="chest-lid"
        />
        {/* 蓋のハイライト */}
        <path
          d="M 35,92 Q 35,65 120,65 Q 205,65 205,92"
          fill="none"
          stroke="#C8922A"
          strokeWidth="3"
          opacity="0.6"
          className="chest-lid"
        />
        {/* 蓋の金属バンド */}
        <path
          d="M 20,82 Q 120,72 220,82"
          fill="none"
          stroke="#E8B830"
          strokeWidth="5"
          className="chest-lid"
        />
        <path
          d="M 115,52 L 125,52 L 125,100 L 115,100 Z"
          fill="#E8B830"
          className="chest-lid"
        />

        {/* ===== 宝箱の本体 ===== */}
        {/* 本体の影 */}
        <rect x="22" y="101" width="198" height="90" rx="4" fill="#2A1808" opacity="0.4" />
        {/* 本体メイン */}
        <rect x="20" y="98" width="200" height="90" rx="4" fill="#7A4E18" stroke="#5A3A08" strokeWidth="2" />
        {/* 本体の木目/テクスチャ */}
        <rect x="20" y="108" width="200" height="8" fill="#8A5E28" opacity="0.5" />
        <rect x="20" y="128" width="200" height="8" fill="#8A5E28" opacity="0.5" />
        <rect x="20" y="148" width="200" height="8" fill="#8A5E28" opacity="0.5" />
        <rect x="20" y="168" width="200" height="8" fill="#8A5E28" opacity="0.5" />
        {/* 金属バンド（横） */}
        <rect x="18" y="118" width="204" height="10" rx="2" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        <rect x="18" y="158" width="204" height="10" rx="2" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        {/* 金属バンド（縦） */}
        <rect x="112" y="98" width="16" height="92" rx="2" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        {/* 錠前 */}
        <rect x="107" y="125" width="26" height="22" rx="4" fill="#E8C840" stroke="#C8A820" strokeWidth="2" />
        <circle cx="120" cy="134" r="6" fill="#C89820" stroke="#A87810" strokeWidth="1.5" />
        <rect x="117" y="136" width="6" height="8" rx="1" fill="#A87810" />
        {/* 本体の角金具 */}
        <circle cx="28" cy="106" r="6" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        <circle cx="212" cy="106" r="6" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        <circle cx="28" cy="182" r="6" fill="#E8B830" stroke="#C89820" strokeWidth="1" />
        <circle cx="212" cy="182" r="6" fill="#E8B830" stroke="#C89820" strokeWidth="1" />

        {/* ===== キラキラエフェクト ===== */}
        <text x="10" y="50" fontSize="22" className="chest-sparkle cs-1">✨</text>
        <text x="200" y="48" fontSize="20" className="chest-sparkle cs-2">⭐</text>
        <text x="100" y="32" fontSize="18" className="chest-sparkle cs-3">💎</text>
        <text x="160" y="42" fontSize="16" className="chest-sparkle cs-4">✨</text>
        <text x="40" y="42" fontSize="16" className="chest-sparkle cs-5">⭐</text>
      </svg>
    </div>
  );
}
