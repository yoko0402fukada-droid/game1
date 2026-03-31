"use client";

import { useState, useCallback } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  removing: boolean;
}

// Web Audio API でにゃーっと鳴らす
function playMeow() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;

    // メインオシレーター（にゃー本体）
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    filter.type = "bandpass";
    filter.frequency.value = 900;
    filter.Q.value = 3;

    // 周波数エンベロープ: ゆっくり上がって下がる
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.12);
    osc.frequency.linearRampToValueAtTime(500, now + 0.28);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.5);

    // 音量エンベロープ
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.06);
    gain.gain.setValueAtTime(0.35, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // ちょっとノイズっぽさを足す（喉の感じ）
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(420, now);
    osc2.frequency.linearRampToValueAtTime(720, now + 0.12);
    osc2.frequency.linearRampToValueAtTime(520, now + 0.28);
    osc2.frequency.exponentialRampToValueAtTime(360, now + 0.5);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.06);
    gain2.gain.setValueAtTime(0.08, now + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.6);

    setTimeout(() => ctx.close(), 1000);
  } catch {
    // AudioContext 非対応環境では無視
  }
}

// 猫の顔 SVG
function CatFace({ completed }: { completed?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-10 h-10"
      aria-hidden="true"
    >
      {/* 耳 */}
      <polygon points="4,16 10,2 16,16" fill={completed ? "#c47a4a" : "#d4956a"} />
      <polygon points="24,16 30,2 36,16" fill={completed ? "#c47a4a" : "#d4956a"} />
      <polygon points="6,15 10,5 14,15" fill="#fce8e8" />
      <polygon points="26,15 30,5 34,15" fill="#fce8e8" />
      {/* 顔 */}
      <ellipse cx="20" cy="26" rx="16" ry="13" fill={completed ? "#c47a4a" : "#d4956a"} />
      {/* 目 */}
      {completed ? (
        <>
          <path d="M13 23 Q15 21 17 23" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M23 23 Q25 21 27 23" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="15" cy="24" rx="2.5" ry="3" fill="#3d2b1f" />
          <ellipse cx="25" cy="24" rx="2.5" ry="3" fill="#3d2b1f" />
          <circle cx="16" cy="23" r="0.8" fill="white" />
          <circle cx="26" cy="23" r="0.8" fill="white" />
        </>
      )}
      {/* 鼻 */}
      <ellipse cx="20" cy="28" rx="1.5" ry="1" fill="#e89090" />
      {/* 口 */}
      <path d="M20 29 Q17 32 15 30" stroke="#a85f32" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M20 29 Q23 32 25 30" stroke="#a85f32" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* ひげ */}
      <line x1="3" y1="27" x2="13" y2="28" stroke="#a85f32" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="3" y1="30" x2="13" y2="30" stroke="#a85f32" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="27" y1="28" x2="37" y2="27" stroke="#a85f32" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="27" y1="30" x2="37" y2="30" stroke="#a85f32" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// 肉球アイコン
function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor" aria-hidden="true">
      <ellipse cx="12" cy="15" rx="5" ry="4.5" />
      <ellipse cx="6" cy="10" rx="2.5" ry="3" />
      <ellipse cx="18" cy="10" rx="2.5" ry="3" />
      <ellipse cx="9" cy="7" rx="2" ry="2.5" />
      <ellipse cx="15" cy="7" rx="2" ry="2.5" />
    </svg>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [meowText, setMeowText] = useState("");

  const showMeow = useCallback((text: string) => {
    setMeowText(text);
    setTimeout(() => setMeowText(""), 1200);
  }, []);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false, removing: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.completed) {
          playMeow();
          showMeow("にゃー！");
        }
        return { ...t, completed: !t.completed };
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  const remaining = todos.filter((t) => !t.completed).length;
  const total = todos.length;

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* にゃー吹き出し */}
      {meowText && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                     bg-white border-2 border-caramel-400 rounded-full
                     px-6 py-2 text-caramel-600 font-bold text-xl shadow-lg
                     animate-bounce-in pointer-events-none select-none"
        >
          {meowText}
        </div>
      )}

      {/* ヘッダー */}
      <div className="flex flex-col items-center mb-8 gap-2">
        <div className="animate-wiggle">
          <CatFace />
        </div>
        <h1 className="text-3xl font-bold text-caramel-600 tracking-wide">
          にゃんTodo
        </h1>
        {total > 0 && (
          <p className="text-sm text-caramel-400">
            {remaining === 0
              ? "全部できたにゃ！"
              : `あと ${remaining} 件にゃ`}
          </p>
        )}
      </div>

      {/* カード */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-cream-200">
        {/* 入力フォーム */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="やることを入力にゃ..."
            className="flex-1 rounded-2xl border-2 border-cream-200 bg-cream-50
                       px-4 py-2.5 text-sm text-gray-700 placeholder-caramel-400/60
                       outline-none focus:border-caramel-400 transition-colors"
            maxLength={80}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-2xl bg-caramel-500 hover:bg-caramel-600
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-white px-4 py-2.5 text-sm font-medium
                       transition-all active:scale-95 flex items-center gap-1.5"
          >
            <PawIcon className="text-white/80" />
            追加
          </button>
        </form>

        {/* タスクリスト */}
        {todos.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-3 text-caramel-400/70">
            <CatFace />
            <p className="text-sm">タスクがないにゃ〜</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`
                  flex items-center gap-3 rounded-2xl p-3
                  border-2 transition-all duration-300
                  ${todo.removing ? "animate-fade-out" : "animate-bounce-in"}
                  ${
                    todo.completed
                      ? "bg-cream-100 border-cream-200"
                      : "bg-white border-cream-200 hover:border-caramel-400/40"
                  }
                `}
              >
                {/* チェックボックス（猫顔） */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                    transition-all active:scale-90
                    ${todo.completed ? "animate-paw-spin" : "hover:scale-110"}
                  `}
                >
                  <CatFace completed={todo.completed} />
                </button>

                {/* テキスト */}
                <span
                  className={`flex-1 text-sm transition-all ${
                    todo.completed
                      ? "line-through text-caramel-400/60"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="削除"
                  className="flex-shrink-0 w-7 h-7 rounded-full
                             text-caramel-400/50 hover:text-caramel-600
                             hover:bg-blush-100 flex items-center justify-center
                             transition-all text-base leading-none"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* フッター統計 */}
        {total > 0 && (
          <div className="mt-5 pt-4 border-t border-cream-200 flex justify-between text-xs text-caramel-400">
            <span className="flex items-center gap-1">
              <PawIcon />
              {total} 件
            </span>
            <span>{todos.filter((t) => t.completed).length} 件完了</span>
          </div>
        )}
      </div>

      {/* フッター */}
      <p className="mt-8 text-xs text-caramel-400/60">
        完了したら猫が鳴くにゃ 🐾
      </p>
    </main>
  );
}
