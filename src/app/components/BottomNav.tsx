import { Compass, Map, MessageCircle, Plus, User, Users } from "lucide-react";

type Page = "discover" | "explore" | "community" | "chat" | "my";

interface BottomNavProps {
  current: Page;
  onChange: (page: Page) => void;
  onPublish: () => void;
}

const ACTIVE = "#e9846a";

export function BottomNav({ current, onChange, onPublish }: BottomNavProps) {
  const leftItems = [
    { key: "discover" as Page, icon: Compass, label: "首页" },
    { key: "explore" as Page, icon: Map, label: "探索" },
  ];
  const rightItems = [
    { key: "community" as Page, icon: Users, label: "社区" },
    { key: "chat" as Page, icon: MessageCircle, label: "聊天" },
    { key: "my" as Page, icon: User, label: "我的" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-ds-border rounded-t-ds-xl shadow-ds-soft"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="relative mx-auto flex max-w-md items-center justify-between px-6 py-2">
        {leftItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-0.5 py-1 min-w-[56px]"
          >
            <Icon
              size={22}
              strokeWidth={current === key ? 2.5 : 1.8}
              style={{ color: current === key ? ACTIVE : undefined }}
              className={current === key ? "" : "text-ds-text-subtle"}
            />
            <span
              className={`text-[10px] leading-none ${current === key ? "font-semibold" : "text-ds-text-subtle"}`}
              style={current === key ? { color: ACTIVE } : undefined}
            >
              {label}
            </span>
          </button>
        ))}

        <button
          onClick={onPublish}
          className="absolute left-1/2 flex h-9 w-20 -translate-x-1/2 -translate-y-[calc(50%+24px)] items-center justify-center gap-1.5 rounded-[30px] text-white shadow-ds-floating text-sm font-bold"
          style={{ background: ACTIVE }}
        >
          <Plus size={18} strokeWidth={3} />
          <span className="text-xs">发布</span>
        </button>

        {rightItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-0.5 py-1 min-w-[56px]"
          >
            <Icon
              size={22}
              strokeWidth={current === key ? 2.5 : 1.8}
              style={{ color: current === key ? ACTIVE : undefined }}
              className={current === key ? "" : "text-ds-text-subtle"}
            />
            <span
              className={`text-[10px] leading-none ${current === key ? "font-semibold" : "text-ds-text-subtle"}`}
              style={current === key ? { color: ACTIVE } : undefined}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}