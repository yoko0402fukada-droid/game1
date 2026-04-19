'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { locations, getAddress, getYahooMapUrl, type Location } from './data';


type Status = '在宅' | '不在';

interface VisitRecord {
  status: Status;
  datetime: string;
}

type VisitData = { [no: number]: VisitRecord[] };

const STORAGE_KEY = 'visit_beppu3_v2';
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

function pruneOld(records: VisitRecord[]): VisitRecord[] {
  const cutoff = Date.now() - SIX_MONTHS_MS;
  return records.filter((r) => new Date(r.datetime).getTime() >= cutoff);
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function fmtShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

const CALENDAR_ID = '6f648888d7459187812a96d248acd4ff7a700843baedc0744c08f80656a3ee24%40group.calendar.google.com';
const CALENDAR_BASE = `https://calendar.google.com/calendar/embed?src=${CALENDAR_ID}&ctz=Asia%2FTokyo&hl=ja&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`;

type CalMode = 'MONTH' | 'WEEK' | 'AGENDA';
const CAL_MODES: { key: CalMode; label: string; height: number }[] = [
  { key: 'MONTH',  label: '月',   height: 420 },
  { key: 'WEEK',   label: '週',   height: 420 },
  { key: 'AGENDA', label: '予定リスト', height: 420 },
];
// 福岡市城南区別府3丁目周辺（緯度経度で指定）
const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.7!2d130.3594!3d33.5808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x354191c5e2b6a8a9%3A0x0!2z56aP5bKh5biC5Z6L5Y2X5Yy65YiG5bqD77yT5LiB55uu!5e0!3m2!1sja!2sjp!4v1';

export default function VisitPage() {
  const [visitData, setVisitData] = useState<VisitData>({});
  const [recordModal, setRecordModal] = useState<Location | null>(null);
  const [historyModal, setHistoryModal] = useState<Location | null>(null);
  const [filter, setFilter] = useState<'all' | '未訪問' | '在宅' | '不在'>('all');
  const [mapOpen, setMapOpen] = useState(true);
  const [calOpen, setCalOpen] = useState(true);
  const [calMode, setCalMode] = useState<CalMode>('MONTH');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setVisitData(JSON.parse(saved));
  }, []);

  function save(data: VisitData) {
    setVisitData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function handleSelect(loc: Location, status: Status) {
    const prev = visitData[loc.no] ?? [];
    const newRecord: VisitRecord = { status, datetime: new Date().toISOString() };
    save({ ...visitData, [loc.no]: pruneOld([newRecord, ...prev]) });
    setRecordModal(null);
  }

  function deleteRecord(no: number, idx: number) {
    const prev = visitData[no] ?? [];
    const next = prev.filter((_, i) => i !== idx);
    const updated = { ...visitData };
    if (next.length === 0) delete updated[no];
    else updated[no] = next;
    save(updated);
  }

  const latestStatuses = Object.values(visitData).map((recs) => recs[0]?.status).filter(Boolean);
  const visitedCount = Object.keys(visitData).filter((no) => (visitData[+no]?.length ?? 0) > 0).length;
  const zaitaku = latestStatuses.filter((s) => s === '在宅').length;
  const fuzai  = latestStatuses.filter((s) => s === '不在').length;

  const filtered = locations.filter((loc) => {
    const recs = visitData[loc.no];
    if (filter === 'all') return true;
    if (filter === '未訪問') return !recs || recs.length === 0;
    return recs?.[0]?.status === filter;
  });

  const histRecs = historyModal ? (visitData[historyModal.no] ?? []) : [];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', minHeight: '100vh', background: '#f3f4f6' }}>

      {/* ヘッダー */}
      <header style={{ background: '#1d4ed8', color: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
        <Link href="/" style={{ color: '#fff', fontSize: 24, lineHeight: 1, textDecoration: 'none' }}>←</Link>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>訪問管理表</div>
          <div style={{ fontSize: 13, color: '#bfdbfe', marginTop: 2 }}>別府3丁目エリア（最大6ヶ月記録）</div>
        </div>
      </header>

      {/* ===== 地図セクション ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <button
          onClick={() => setMapOpen((v) => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, fontWeight: 700, color: '#1d4ed8' }}
        >
          <span>🗺️ エリア地図（別府3丁目）</span>
          <span style={{ fontSize: 20, color: '#9ca3af' }}>{mapOpen ? '▲' : '▼'}</span>
        </button>
        {mapOpen && (
          <div style={{ width: '100%', height: 260, overflow: 'hidden' }}>
            <iframe
              src={MAP_SRC}
              width="100%"
              height="260"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </section>

      {/* ===== カレンダーセクション ===== */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        {/* タイトル行 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
          <button
            onClick={() => setCalOpen((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, fontWeight: 700, color: '#1d4ed8', padding: 0 }}
          >
            <span>📅 スケジュール</span>
            <span style={{ fontSize: 18, color: '#9ca3af' }}>{calOpen ? '▲' : '▼'}</span>
          </button>
          {/* 表示切替ボタン */}
          {calOpen && (
            <div style={{ display: 'flex', gap: 6 }}>
              {CAL_MODES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCalMode(key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: calMode === key ? 700 : 400,
                    border: calMode === key ? '2px solid #1d4ed8' : '2px solid #d1d5db',
                    background: calMode === key ? '#1d4ed8' : '#fff',
                    color: calMode === key ? '#fff' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* iframeエリア */}
        {calOpen && (
          <div style={{ width: '100%', height: CAL_MODES.find(m => m.key === calMode)!.height, overflow: 'hidden' }}>
            <iframe
              key={calMode}
              src={`${CALENDAR_BASE}&mode=${calMode}`}
              width="100%"
              height={CAL_MODES.find(m => m.key === calMode)!.height}
              style={{ border: 0, display: 'block' }}
              scrolling="no"
            />
          </div>
        )}
      </section>

      {/* サマリー */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex' }}>
        {[
          { label: '訪問済み', value: visitedCount,              color: '#1d4ed8' },
          { label: '在宅',     value: zaitaku,                   color: '#16a34a' },
          { label: '不在',     value: fuzai,                     color: '#dc2626' },
          { label: '未訪問',   value: locations.length - visitedCount, color: '#9ca3af' },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', borderRight: i < arr.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</span>
            <span style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* フィルター */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '10px 16px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {(['all', '未訪問', '在宅', '不在'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: filter === f ? 700 : 400,
              border: filter === f ? '2px solid #1d4ed8' : '2px solid #d1d5db',
              background: filter === f ? '#1d4ed8' : '#fff',
              color: filter === f ? '#fff' : '#374151',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'すべて' : f}
          </button>
        ))}
      </div>

      {/* リスト */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filtered.map((loc) => {
          const recs = visitData[loc.no] ?? [];
          const latest = recs[0];
          return (
            <li
              key={loc.no}
              onClick={() => setRecordModal(loc)}
              style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '18px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, WebkitTapHighlightColor: 'transparent' }}
            >
              {/* No */}
              <span style={{ fontSize: 14, color: '#9ca3af', minWidth: 24, textAlign: 'right', paddingTop: 4 }}>{loc.no}</span>

              {/* メイン情報 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 建物名 */}
                <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3 }}>
                  {loc.building || '(建物名なし)'}
                </p>

                {/* 住所 */}
                <a
                  href={getYahooMapUrl(loc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontSize: 16, color: '#2563eb', display: 'block', marginTop: 4 }}
                >
                  {getAddress(loc)}
                </a>

                {/* 最新記録 */}
                {latest && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 17,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 6,
                      background: latest.status === '在宅' ? '#dcfce7' : '#fee2e2',
                      color:      latest.status === '在宅' ? '#15803d' : '#dc2626',
                    }}>
                      {latest.status}
                    </span>
                    <span style={{ fontSize: 17, color: '#4b5563' }}>{fmtShort(latest.datetime)}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setHistoryModal(loc); }}
                      style={{ fontSize: 16, color: '#2563eb', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      履歴 {recs.length}件
                    </button>
                  </div>
                )}
              </div>

              {/* 訪問記録ボタン */}
              <button
                onClick={(e) => { e.stopPropagation(); setRecordModal(loc); }}
                style={{
                  flexShrink: 0,
                  background: latest ? '#4b5563' : '#1d4ed8',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1.3,
                  textAlign: 'center',
                  minWidth: 72,
                }}
              >
                訪問記録
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '60px 0', fontSize: 18 }}>該当なし</div>
      )}

      {/* ===== 訪問記録モーダル ===== */}
      {recordModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setRecordModal(null)}
        >
          <div
            style={{ background: '#fff', width: '100%', borderRadius: '20px 20px 0 0', padding: '28px 24px 48px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 4px' }}>No.{recordModal.no}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
              {recordModal.building || '(建物名なし)'}
            </p>
            <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 4px' }}>{getAddress(recordModal)}</p>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 24px' }}>
              {new Date().toLocaleString('ja-JP')} の記録を追加
            </p>

            <p style={{ fontSize: 17, fontWeight: 600, color: '#374151', marginBottom: 14 }}>訪問結果を選択してください</p>
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                onClick={() => handleSelect(recordModal, '在宅')}
                style={{ flex: 1, background: '#16a34a', color: '#fff', fontSize: 28, fontWeight: 700, padding: '24px 0', borderRadius: 16, border: 'none', cursor: 'pointer' }}
              >
                在宅
              </button>
              <button
                onClick={() => handleSelect(recordModal, '不在')}
                style={{ flex: 1, background: '#dc2626', color: '#fff', fontSize: 28, fontWeight: 700, padding: '24px 0', borderRadius: 16, border: 'none', cursor: 'pointer' }}
              >
                不在
              </button>
            </div>
            <button
              onClick={() => setRecordModal(null)}
              style={{ marginTop: 16, width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: 17, padding: '10px 0', cursor: 'pointer' }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ===== 履歴モーダル ===== */}
      {historyModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setHistoryModal(null)}
        >
          <div
            style={{ background: '#fff', width: '100%', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 2px' }}>No.{historyModal.no} ― 訪問履歴</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
                {historyModal.building || '(建物名なし)'}
              </p>
              <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 4px' }}>{getAddress(historyModal)}</p>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>※ 6ヶ月以内の記録を表示</p>
            </div>

            <ul style={{ overflowY: 'auto', flex: 1, listStyle: 'none', margin: 0, padding: '0 24px' }}>
              {histRecs.length === 0 ? (
                <li style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 17 }}>記録なし</li>
              ) : (
                histRecs.map((rec, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 17,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 6,
                        background: rec.status === '在宅' ? '#dcfce7' : '#fee2e2',
                        color:      rec.status === '在宅' ? '#15803d' : '#dc2626',
                      }}>
                        {rec.status}
                      </span>
                      <span style={{ fontSize: 17, color: '#374151' }}>{fmtDate(rec.datetime)}</span>
                      {idx === 0 && (
                        <span style={{ fontSize: 13, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4 }}>最新</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        deleteRecord(historyModal.no, idx);
                        if ((visitData[historyModal.no]?.length ?? 0) <= 1) setHistoryModal(null);
                      }}
                      style={{ fontSize: 15, color: '#9ca3af', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', flexShrink: 0 }}
                    >
                      削除
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div style={{ padding: '16px 24px 40px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setHistoryModal(null); setRecordModal(historyModal); }}
                style={{ flex: 1, background: '#1d4ed8', color: '#fff', fontSize: 18, fontWeight: 600, padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer' }}
              >
                ＋ 新しい記録を追加
              </button>
              <button
                onClick={() => setHistoryModal(null)}
                style={{ flex: 1, background: '#f3f4f6', color: '#374151', fontSize: 18, padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer' }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
