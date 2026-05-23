import { useState, useMemo, useEffect, useCallback } from "react";
import { X, Users, MapPin } from "lucide-react";
import { useApp } from "../store/AppContext";
import type { DemoUser } from "../data/users";

const EMOJIS = ["👍", "👋", "😊", "❤️", "🎉", "✨"];

const VIEW_STATUSES = [
  { label: "空闲中", emoji: "😊", bg: "linear-gradient(135deg, #7C72FF 0%, #A79FFF 100%)" },
  { label: "活动中", emoji: "🎉", bg: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)" },
  { label: "旅行中", emoji: "✈️", bg: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)" },
  { label: "工作中", emoji: "💻", bg: "linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)" },
  { label: "接待中", emoji: "🏡", bg: "linear-gradient(135deg, #FDB99B 0%, #CF8BF3 100%)" },
  { label: "休息中", emoji: "🌙", bg: "linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)" },
];

const VIEW_POSTS = [
  "https://images.unsplash.com/photo-1761908106045-5c03daf33014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1501554728187-ce583db33af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1758980417540-aca340a47be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1776653097012-8eca4145b7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1778595478564-89642cb79f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1776687856110-a1f738a07a6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400",
];

interface Reaction {
  id: number;
  fromUser: DemoUser;
  emoji: string;
  timestamp: number;
}

function generatePositions(count: number, seed: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const cols = Math.min(count, 5);
  const rows = Math.ceil(count / cols);
  const areaW = 76;
  const areaH = 55;
  const cellW = areaW / cols;
  const cellH = areaH / rows;
  const startX = 8;
  const startY = 23;
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jitterX = ((seed * (i + 1) * 13) % 8) - 4;
    const jitterY = ((seed * (i + 1) * 17) % 8) - 4;
    const x = startX + col * cellW + cellW / 2 + jitterX;
    const y = startY + row * cellH + cellH / 2 + jitterY;
    positions.push({
      x: Math.max(8, Math.min(90, x)),
      y: Math.max(20, Math.min(82, y)),
    });
  }
  return positions;
}

function generateMockReactions(allUsers: DemoUser[], currentUserId: number): Reaction[] {
  const now = Date.now();
  const DAY = 86400000;
  const reactions: Reaction[] = [];
  const otherUsers = allUsers.filter((u) => u.id !== currentUserId);
  const reactionCount = 4 + Math.floor(Math.random() * 6);
  for (let i = 0; i < reactionCount; i++) {
    const fromUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    reactions.push({
      id: i,
      fromUser,
      emoji,
      timestamp: now - daysAgo * DAY - hoursAgo * 3600000,
    });
  }
  return reactions.sort((a, b) => b.timestamp - a.timestamp);
}

export function DiscoverPage() {
  const { currentUser, communities, getUsersByCommunity, allUsers } = useApp();
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [viewUser, setViewUser] = useState<DemoUser | null>(null);
  const [viewTab, setViewTab] = useState<"posts" | "likes" | "saves">("posts");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [visibleReactions, setVisibleReactions] = useState<Set<number>>(new Set());

  const userCommunities = useMemo(
    () => currentUser?.communityIds?.length ? communities.filter((c) => currentUser.communityIds.includes(c.id)) : [],
    [currentUser, communities]
  );

  const communityUsers = useMemo(() => {
    if (!currentUser || currentUser.communityIds.length === 0) return [];
    const seenIds = new Set<number>();
    const users: DemoUser[] = [];
    currentUser.communityIds.forEach((cid) => {
      getUsersByCommunity(cid).forEach((u) => {
        if (!seenIds.has(u.id)) {
          seenIds.add(u.id);
          users.push(u);
        }
      });
    });
    if (users.length <= 10) return users;
    const shuffled = [...users].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [currentUser, getUsersByCommunity]);

  const positions = useMemo(
    () => generatePositions(communityUsers.length, currentUser?.id ?? 1),
    [communityUsers.length, currentUser]
  );

  const gridUsers = communityUsers.map((user, i) => ({
    user,
    x: positions[i].x,
    y: positions[i].y,
    size: 56 + ((i * 7) % 20),
    delay: ((i * 0.15) % 1.5),
  }));

  useEffect(() => {
    if (currentUser) {
      setReactions(generateMockReactions(allUsers, currentUser.id));
    }
  }, [currentUser, allUsers]);

  useEffect(() => {
    if (reactions.length === 0) return;
    const timer = setInterval(() => {
      setVisibleReactions((prev) => {
        const next = new Set(prev);
        const hidden = reactions.filter((r) => !prev.has(r.id));
        if (hidden.length > 0 && prev.size < 3) {
          next.add(hidden[Math.floor(Math.random() * hidden.length)].id);
        }
        return next;
      });
    }, 3000);
    const initialTimer = setTimeout(() => {
      setVisibleReactions(new Set(reactions.slice(0, 2).map((r) => r.id)));
    }, 1000);
    return () => {
      clearInterval(timer);
      clearTimeout(initialTimer);
    };
  }, [reactions]);

  useEffect(() => {
    if (visibleReactions.size === 0) return;
    const hideTimer = setInterval(() => {
      setVisibleReactions((prev) => {
        const next = new Set(prev);
        const ids = [...next];
        if (ids.length > 0) {
          next.delete(ids[0]);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(hideTimer);
  }, [visibleReactions]);

  const handleEmojiClick = useCallback((emoji: string, user: DemoUser) => {
    setReactions((prev) => [
      { id: Date.now(), fromUser: user, emoji, timestamp: Date.now() },
      ...prev.slice(0, 20),
    ]);
    setSelectedUser(null);
    setVisibleReactions((prev) => {
      const next = new Set(prev);
      next.add(Date.now());
      return next;
    });
  }, []);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col h-full bg-ds-bg relative">
      <div className="bg-ds-surface px-4 pt-3 pb-4 shadow-ds-soft">
        {userCommunities.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {userCommunities.map((c, i) => (
              <div key={c.id} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-xs text-ds-text-subtle">·</span>}
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-sm font-medium text-ds-text-muted">{c.name}</span>
              </div>
            ))}
            <span className="text-xs text-ds-text-subtle">· {communityUsers.length} 位成员</span>
          </div>
        )}
      </div>

      {currentUser.communityIds.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pb-24 relative">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img src="/backgrounds/shouye.png" className="w-full h-full object-cover opacity-[0.3]" alt="" />
          </div>
          <div className="flex flex-col items-center z-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-ds-brand"
                style={{ transform: "scale(1.5)" }} />
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-ds-surface shadow-ds-floating relative z-10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <h2 className="text-xl font-bold text-ds-text mt-6">{currentUser.name}</h2>
            <p className="text-sm text-ds-text-muted mt-1">{currentUser.bio}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3 px-8">
              {currentUser.identityTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-ds-brand/20 text-ds-brand-dark">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2 px-8">
              {currentUser.personalityTags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] bg-ds-chip text-ds-text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 px-6 py-4 bg-ds-surface rounded-ds-xl shadow-ds-soft text-center">
              <Users size={24} className="mx-auto text-ds-text-subtle mb-2" />
              <p className="text-sm text-ds-text-muted">你还没有加入任何社区</p>
              <p className="text-xs text-ds-text-subtle mt-1">前往「社区」发现和加入你感兴趣的社区</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden pb-24">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img src="/backgrounds/shouye.png" className="w-full h-full object-cover opacity-[0.3]" alt="" />
          </div>
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" className="text-ds-text" />
            </svg>
          </div>

          {gridUsers.map(({ user, x, y, size, delay }, i) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all cursor-pointer group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                animation: `floatIn 0.6s ease-out ${delay}s both`,
              }}
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="rounded-full object-cover border-2 border-white shadow-lg transition-all group-hover:scale-110 group-hover:shadow-xl group-active:scale-95"
                  style={{ width: size, height: size }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: user.status === "空闲中" ? "#4CAF50" : user.status === "活动中" ? "#FF9800" : "#9E9E9E" }}
                />
              </div>
              <span className="text-[10px] font-medium text-ds-text bg-white/80 rounded-full px-1.5 py-0.5 shadow-sm whitespace-nowrap">
                {user.name}
              </span>
            </button>
          ))}

          <style>{`
            @keyframes floatIn {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
              to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Emoji wheel overlay */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.35)" }}
          onClick={() => setSelectedUser(null)}
        >
          <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Emoji ring */}
            {EMOJIS.map((emoji, i) => {
              const angle = (i * 60 - 90) * (Math.PI / 180);
              const radius = 90;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji, selectedUser)}
                  className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg text-2xl transition-all active:scale-90 hover:scale-110 animate-fadeIn"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  {emoji}
                </button>
              );
            })}
            {/* Center dot */}
            <button
              onClick={() => { setViewUser(selectedUser); setSelectedUser(null); }}
              className="w-16 h-16 rounded-full bg-white shadow-xl border-2 border-ds-border flex items-center justify-center transition-all active:scale-90 hover:scale-105 animate-fadeIn overflow-hidden"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </button>
          </div>
        </div>
      )}

      {/* Top danmu - greeting messages */}
      <div className="fixed top-40 left-0 right-0 z-30 h-0 pointer-events-none max-w-md mx-auto">
        {reactions.slice(0, 8).map((reaction, index) => (
          <div
            key={reaction.id}
            className="absolute whitespace-nowrap transition-all duration-700"
            style={{
              opacity: visibleReactions.has(reaction.id) ? 1 : 0,
              transform: visibleReactions.has(reaction.id)
                ? "translateY(0)"
                : "translateY(-10px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
              left: `${10 + (index * 15) % 60}%`,
              top: `${(index * 42) % 120}px`,
            }}
          >
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
              <img
                src={reaction.fromUser.avatar}
                className="w-5 h-5 rounded-full object-cover shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-xs text-ds-text font-medium">
                {reaction.fromUser.name}
                <span className="text-ds-text-muted ml-1">
                  {reaction.emoji === "👍" ? "赞了你" :
                   reaction.emoji === "👋" ? "向你打了招呼" :
                   reaction.emoji === "😊" ? "对你微笑" :
                   reaction.emoji === "❤️" ? "给你爱心" :
                   reaction.emoji === "🎉" ? "欢迎你" :
                   reaction.emoji === "✨" ? "欣赏你" : "互动了"}
                </span>
              </span>
              <span className="text-sm">{reaction.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      {viewUser && (() => {
        const vs = VIEW_STATUSES.find((s) => s.label === viewUser.status) ?? VIEW_STATUSES[0];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => { setViewUser(null); setViewTab("posts"); }}
          >
            <div
              className="w-full max-w-sm bg-ds-bg rounded-ds-xl animate-fadeIn overflow-hidden max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative pt-10 pb-6 px-5" style={{ background: vs.bg }}>
                <button onClick={() => { setViewUser(null); setViewTab("posts"); }} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.2)" }}>
                  <X size={16} className="text-white" />
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold w-fit" style={{ background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.9)" }}>
                  <span>{vs.emoji}</span>
                  <span>{vs.label}</span>
                </div>
                <div className="flex items-end gap-4 mt-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-ds-surface overflow-hidden shrink-0">
                    <img
                      src={viewUser.avatar}
                      alt={viewUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="flex-1 mb-1">
                    <h2 className="text-white font-bold text-lg">{viewUser.name}</h2>
                    <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                      <MapPin size={11} />
                      <span>在线</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {viewUser.identityTags.slice(0, 2).map((tag, i) => (
                        <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${i === 0 ? "bg-ds-brand text-white" : ""}`}
                          style={i !== 0 ? { background: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" } : undefined}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/80 text-sm mt-3 leading-relaxed">{viewUser.bio}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {viewUser.personalityTags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs"
                      style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-ds-surface mx-4 -mt-3 rounded-ds-lg shadow-ds-soft p-4">
                <div className="grid grid-cols-4 divide-x divide-ds-border">
                  {[
                    { label: "关注", value: 12 + viewUser.id * 3 },
                    { label: "粉丝", value: 56 + viewUser.id * 7 },
                    { label: "获赞", value: 128 + viewUser.id * 11 },
                    { label: "积分", value: 340 + viewUser.id * 5 },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center py-1">
                      <div className="font-bold text-lg text-ds-text">{value}</div>
                      <div className="text-xs text-ds-text-subtle">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 mt-4 pb-4">
                <div className="flex bg-ds-chip rounded-ds-lg p-1 gap-1 mb-4">
                  {(["posts", "likes", "saves"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setViewTab(tab)}
                      className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
                        viewTab === tab
                          ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                          : "text-ds-text-subtle"
                      }`}
                    >
                      {{ posts: "发布", likes: "获赞", saves: "收藏" }[tab]}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {VIEW_POSTS.map((img, i) => (
                    <div key={i} className="aspect-square rounded-ds-lg overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}