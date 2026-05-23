import { useState } from "react";
import { QrCode, Settings, ChevronRight, MapPin, Grid3X3, Heart, Bookmark, Star, Users, LogOut } from "lucide-react";
import { useApp } from "../store/AppContext";

const STATUSES = [
  { label: "空闲中", emoji: "😊", bg: "linear-gradient(135deg, #7C72FF 0%, #A79FFF 100%)" },
  { label: "活动中", emoji: "🎉", bg: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" },
  { label: "旅行中", emoji: "✈️", bg: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)" },
  { label: "工作中", emoji: "💻", bg: "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)" },
  { label: "接待中", emoji: "🏡", bg: "linear-gradient(135deg, #FDB99B 0%, #CF8BF3 100%)" },
  { label: "休息中", emoji: "🌙", bg: "linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)" },
];

const POSTS_GRID = [
  "https://images.unsplash.com/photo-1761908106045-5c03daf33014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1501554728187-ce583db33af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1758980417540-aca340a47be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1776653097012-8eca4145b7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1778595478564-89642cb79f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1776687856110-a1f738a07a6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
];

interface MyPageProps {
  onTagsOpen: () => void;
  onAvatarOpen: () => void;
  onMapOpen: () => void;
  onAdminOpen: () => void;
  onLogout: () => void;
}

export function MyPage({ onTagsOpen, onAvatarOpen, onMapOpen, onAdminOpen, onLogout }: MyPageProps) {
  const { currentUser } = useApp();
  const [currentStatus, setCurrentStatus] = useState(0);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "likes" | "saves">("posts");

  const status = STATUSES[currentStatus];

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-ds-bg">
      <div
        className="relative pt-8 pb-6 px-5"
        style={{ background: status.bg }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowStatusPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.9)" }}
          >
            <span>{status.emoji}</span>
            <span>{status.label}</span>
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.2)" }}>
              <QrCode size={17} color="rgba(255,255,255,0.9)" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.2)" }}>
              <Settings size={17} color="rgba(255,255,255,0.9)" />
            </button>
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg bg-ds-surface overflow-hidden">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="flex-1 mb-1">
            <h2 className="text-white font-bold text-lg">{currentUser.name}</h2>
            <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
              <MapPin size={11} />
              <span>在线</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentUser.identityTags.slice(0, 2).map((tag, i) => (
                <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${i === 0 ? "bg-ds-brand text-white" : ""}`}
                  style={i !== 0 ? { background: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" } : undefined}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-white/80 text-sm mt-3 leading-relaxed">
          {currentUser.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {currentUser.personalityTags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {showStatusPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowStatusPicker(false)}
        >
          <div className="w-full bg-ds-surface rounded-t-ds-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-base text-ds-text mb-4">切换状态</h3>
            <div className="grid grid-cols-3 gap-3">
              {STATUSES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentStatus(i); setShowStatusPicker(false); }}
                  className="flex flex-col items-center gap-1.5 py-4 rounded-ds-lg border-2 transition-all"
                  style={{
                    background: s.bg,
                    borderColor: currentStatus === i ? "var(--ds-brand)" : "transparent",
                  }}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs font-medium text-white">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-ds-surface mx-4 -mt-3 rounded-ds-lg shadow-ds-soft p-4">
        <div className="grid grid-cols-4 divide-x divide-ds-border">
          {[
            { label: "关注", value: "128" },
            { label: "粉丝", value: "2.3k" },
            { label: "获赞", value: "5.6k" },
            { label: "积分", value: "340" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-1">
              <div className="font-bold text-lg text-ds-text">{value}</div>
              <div className="text-xs text-ds-text-subtle">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-4 gap-3">
        {[
          { icon: "🏷️", label: "我的标签", action: onTagsOpen },
          { icon: "🤖", label: "数字分身", action: onAvatarOpen },
          { icon: "🗺️", label: "位置地图", action: onMapOpen },
          { icon: "⚙️", label: "管理后台", action: onAdminOpen },
        ].map(({ icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="flex flex-col items-center gap-1.5 p-3 bg-ds-surface rounded-ds-lg shadow-ds-soft active:bg-ds-chip"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs text-ds-text-muted">{label}</span>
          </button>
        ))}
      </div>

      <div className="px-4 mt-4 bg-ds-surface rounded-ds-lg shadow-ds-soft overflow-hidden">
        {[
          { icon: Star, label: "积分与兑换", sub: "340 积分可用" },
          { icon: Users, label: "聊天权限", sub: "仅互关用户" },
          { icon: Grid3X3, label: "多语言设置", sub: "简体中文" },
        ].map(({ icon: Icon, label, sub }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 border-ds-border active:bg-ds-chip"
          >
            <div className="w-8 h-8 rounded-xl bg-ds-chip flex items-center justify-center">
              <Icon size={16} className="text-ds-text-muted" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-ds-text">{label}</p>
              <p className="text-xs text-ds-text-subtle">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-ds-text-subtle" />
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-ds-surface rounded-ds-lg shadow-ds-soft active:bg-ds-chip text-ds-text-muted text-sm font-medium"
        >
          <LogOut size={16} />
          退出登录
        </button>
      </div>

      <div className="px-4 mt-4">
        <div className="flex bg-ds-chip rounded-ds-lg p-1 gap-1 mb-4">
          {(["posts", "likes", "saves"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab
                  ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                  : "text-ds-text-subtle"
              }`}
            >
              {{ posts: "发布", likes: "获赞", saves: "收藏" }[tab]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {POSTS_GRID.map((img, i) => (
            <div key={i} className="aspect-square rounded-ds-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}