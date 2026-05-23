import { useState } from "react";
import { ChevronLeft, Users, MapPin, Shield, Star, MessageCircle, Plus } from "lucide-react";

interface CommunityPageProps {
  onBack?: () => void;
}

const COMMUNITIES = [
  {
    id: 1,
    name: "竹林数字村",
    avatar: "🏘️",
    desc: "数字游民与原村民共同建设的新型社区，探索城乡融合新模式",
    tags: ["乡建", "数字游民", "农业"],
    members: 128,
    location: "浙江·德清",
    verified: true,
    activities: 12,
    color: "#C8FF00",
  },
  {
    id: 2,
    name: "漓江民宿联盟",
    avatar: "🏡",
    desc: "汇聚漓江沿岸优质民宿主理人，共享资源与游客",
    tags: ["民宿", "旅行", "设计"],
    members: 67,
    location: "广西·阳朔",
    verified: true,
    activities: 8,
    color: "#FF8C42",
  },
  {
    id: 3,
    name: "山野探索队",
    avatar: "🧗",
    desc: "专注于自然徒步与山地探索，每月组织深度出行",
    tags: ["徒步", "露营", "摄影"],
    members: 243,
    location: "四川·峨眉",
    verified: false,
    activities: 24,
    color: "#4ECDC4",
  },
  {
    id: 4,
    name: "有机农夫市集",
    avatar: "🌾",
    desc: "连接城乡的有机食品直购平台，支持本地小农经济",
    tags: ["农业", "美食", "有机"],
    members: 512,
    location: "全国",
    verified: true,
    activities: 35,
    color: "#A18CD1",
  },
];

const NETWORK_NODES = [
  { id: "center", x: 50, y: 50, label: "我", size: 40, color: "#C8FF00", emoji: "🙂" },
  { id: "farm", x: 20, y: 25, label: "农场", size: 34, color: "#4CAF50", emoji: "🌾" },
  { id: "hiking", x: 75, y: 20, label: "徒步", size: 32, color: "#4ECDC4", emoji: "🧗" },
  { id: "nomad", x: 80, y: 65, label: "游民", size: 30, color: "#A18CD1", emoji: "💻" },
  { id: "homestay", x: 25, y: 72, label: "民宿", size: 32, color: "#FF8C42", emoji: "🏡" },
  { id: "village", x: 50, y: 82, label: "村镇", size: 28, color: "#FF6B6B", emoji: "🏘️" },
];

const NETWORK_EDGES = [
  ["center", "farm"], ["center", "hiking"], ["center", "nomad"],
  ["center", "homestay"], ["center", "village"],
  ["farm", "village"], ["hiking", "nomad"], ["homestay", "village"],
];

export function CommunityPage({ onBack }: CommunityPageProps) {
  const [view, setView] = useState<"list" | "network">("list");
  const [selectedCommunity, setSelectedCommunity] = useState<typeof COMMUNITIES[0] | null>(null);

  const getNodeById = (id: string) => NETWORK_NODES.find((n) => n.id === id);

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-surface px-4 pt-8 pb-4 shadow-ds-soft">
        <div className="flex items-center gap-3 mb-4">
          {onBack && (
            <button onClick={onBack} className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center">
              <ChevronLeft size={18} />
            </button>
          )}
          <h1 className="font-bold text-lg text-ds-text flex-1">社区</h1>
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-ds-brand">
            <Plus size={18} />
          </button>
        </div>

        <div className="flex bg-ds-chip rounded-ds-lg p-1 gap-1">
          {(["list", "network"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
                view === v
                  ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                  : "text-ds-text-subtle"
              }`}
            >
              {v === "list" ? "社区列表" : "标签网络"}
            </button>
          ))}
        </div>
      </div>

      {view === "list" && (
        <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 flex flex-col gap-3">
          {COMMUNITIES.map((community) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunity(community)}
              className="bg-ds-surface rounded-ds-lg overflow-hidden shadow-ds-soft text-left active:bg-ds-chip"
            >
              <div className="h-1.5" style={{ background: community.color }} />
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-ds-lg flex items-center justify-center text-2xl shrink-0"
                    style={{ background: community.color + "20" }}>
                    {community.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-ds-text">{community.name}</span>
                      {community.verified && (
                        <Shield size={13} className="shrink-0" style={{ color: community.color }} />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ds-text-subtle mt-0.5">
                      <MapPin size={10} />
                      <span>{community.location}</span>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-full text-xs font-bold bg-ds-text text-ds-surface shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    加入
                  </button>
                </div>

                <p className="text-sm text-ds-text-muted leading-relaxed mb-3">{community.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {community.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs"
                      style={{ background: community.color + "20", color: community.color }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-ds-text-subtle pt-2 border-t border-ds-border">
                  <span className="flex items-center gap-1"><Users size={11} /> {community.members} 成员</span>
                  <span className="flex items-center gap-1"><Star size={11} /> {community.activities} 活动</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11} /> 社区讨论</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {view === "network" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{
              background: "radial-gradient(ellipse at center, #1a2a1a 0%, #0d0d0d 70%)"
            }} />

            <svg className="absolute inset-0 w-full h-full">
              {NETWORK_EDGES.map(([a, b], i) => {
                const nodeA = getNodeById(a);
                const nodeB = getNodeById(b);
                if (!nodeA || !nodeB) return null;
                return (
                  <line
                    key={i}
                    x1={`${nodeA.x}%`} y1={`${nodeA.y}%`}
                    x2={`${nodeB.x}%`} y2={`${nodeB.y}%`}
                    stroke="rgba(200,255,0,0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {NETWORK_NODES.map((node) => (
              <div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className="rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg"
                  style={{
                    width: node.size,
                    height: node.size,
                    background: node.id === "center" ? "var(--ds-brand)" : `${node.color}40`,
                    fontSize: node.size * 0.45,
                    boxShadow: node.id === "center" ? `0 0 20px var(--ds-brand)` : `0 0 10px ${node.color}40`,
                  }}
                >
                  {node.emoji}
                </div>
                <span className="text-white text-[10px] font-medium">{node.label}</span>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 bg-black/60 rounded-xl px-3 py-2 text-white text-xs">
              <p className="font-semibold mb-1">标签关系网</p>
              <p className="text-white/60">展示你与各类标签的连接</p>
            </div>
          </div>

          <div className="bg-ds-surface px-4 py-4">
            <p className="text-xs text-ds-text-subtle mb-3">相关标签</p>
            <div className="flex flex-wrap gap-2">
              {["农场·12人", "徒步·89人", "数字游民·156人", "乡建·34人", "民宿·67人"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs bg-ds-brand/20 text-ds-brand-dark">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCommunity && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedCommunity(null)}>
          <div className="w-full bg-ds-surface rounded-t-ds-xl p-6 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-ds-border rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-ds-lg flex items-center justify-center text-3xl"
                style={{ background: selectedCommunity.color + "20" }}>
                {selectedCommunity.avatar}
              </div>
              <div>
                <h2 className="font-bold text-lg text-ds-text">{selectedCommunity.name}</h2>
                <p className="text-sm text-ds-text-subtle">{selectedCommunity.members} 成员 · {selectedCommunity.activities} 活动</p>
              </div>
            </div>
            <p className="text-sm text-ds-text-muted leading-relaxed mb-4">{selectedCommunity.desc}</p>
            <div className="flex gap-3">
              <button className="flex-1 h-12 rounded-ds-lg bg-ds-chip text-ds-text-muted text-sm font-semibold">
                查看活动
              </button>
              <button className="flex-1 h-12 rounded-ds-lg bg-ds-brand text-white font-bold text-sm">
                申请加入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}