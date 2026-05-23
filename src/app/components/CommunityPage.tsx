import { useState } from "react";
import { ChevronLeft, Users, MapPin, Shield, Star, MessageCircle, X, ChevronRight, Clock, Heart, Send } from "lucide-react";
import { useApp } from "../store/AppContext";

interface CommunityPageProps {
  onBack?: () => void;
}

interface CommunityItem {
  id: number;
  name: string;
  avatar: string;
  desc: string;
  tags: string[];
  members: number;
  location: string;
  verified: boolean;
  activities: number;
  color: string;
}

interface CommunityActivity {
  id: number;
  communityId: number;
  title: string;
  cover: string;
  date: string;
  duration: string;
  quota: string;
  enrolled: number;
  total: number;
  price: string;
  tags: string[];
}

interface CommunityDiscussion {
  id: number;
  communityId: number;
  author: string;
  authorAvatar: string;
  content: string;
  time: string;
  likes: number;
  replies: number;
}

const INITIAL_COMMUNITIES: CommunityItem[] = [
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

const COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  { id: 1, communityId: 1, title: "数字游民共居周", cover: "🏘️", date: "6月15日", duration: "7天", quota: "10人", enrolled: 7, total: 10, price: "¥1,280", tags: ["共居", "远程办公"] },
  { id: 2, communityId: 1, title: "乡村创客沙龙", cover: "💡", date: "6月22日", duration: "半天", quota: "30人", enrolled: 18, total: 30, price: "免费", tags: ["创业", "分享"] },
  { id: 3, communityId: 1, title: "稻田插秧体验", cover: "🌱", date: "7月1日", duration: "1天", quota: "20人", enrolled: 12, total: 20, price: "¥168", tags: ["农耕", "体验"] },
  { id: 4, communityId: 2, title: "漓江民宿主理人交流会", cover: "🏡", date: "6月18日", duration: "2天", quota: "15人", enrolled: 11, total: 15, price: "¥580", tags: ["民宿", "运营"] },
  { id: 5, communityId: 2, title: "阳朔山水摄影行", cover: "📷", date: "6月25日", duration: "3天", quota: "12人", enrolled: 8, total: 12, price: "¥980", tags: ["摄影", "旅行"] },
  { id: 6, communityId: 2, title: "民宿设计工作坊", cover: "🎨", date: "7月5日", duration: "1天", quota: "20人", enrolled: 14, total: 20, price: "¥298", tags: ["设计", "美学"] },
  { id: 7, communityId: 3, title: "峨眉山深度徒步7日", cover: "🧗", date: "6月20日", duration: "7天", quota: "16人", enrolled: 12, total: 16, price: "¥2,380", tags: ["徒步", "露营"] },
  { id: 8, communityId: 3, title: "周末山野露营", cover: "⛺", date: "6月28日", duration: "2天", quota: "25人", enrolled: 19, total: 25, price: "¥368", tags: ["露营", "星空"] },
  { id: 9, communityId: 3, title: "高山日出摄影团", cover: "🌄", date: "7月8日", duration: "1天", quota: "10人", enrolled: 6, total: 10, price: "¥258", tags: ["摄影", "日出"] },
  { id: 10, communityId: 3, title: "溯溪探险之旅", cover: "🏞️", date: "7月15日", duration: "2天", quota: "15人", enrolled: 9, total: 15, price: "¥488", tags: ["溯溪", "探险"] },
  { id: 11, communityId: 4, title: "有机农夫市集·夏日场", cover: "🌾", date: "6月16日", duration: "1天", quota: "50人", enrolled: 38, total: 50, price: "免费", tags: ["市集", "有机"] },
  { id: 12, communityId: 4, title: "农场到餐桌体验", cover: "🍽️", date: "6月30日", duration: "半天", quota: "20人", enrolled: 16, total: 20, price: "¥198", tags: ["美食", "体验"] },
  { id: 13, communityId: 4, title: "有机种植工作坊", cover: "🌻", date: "7月10日", duration: "1天", quota: "15人", enrolled: 10, total: 15, price: "¥128", tags: ["种植", "学习"] },
];

const COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
  { id: 1, communityId: 1, author: "陈浩然", authorAvatar: "/avatars/Frame 14.jpg", content: "有人一起合租莫干山的共享办公空间吗？月租很划算", time: "10分钟前", likes: 12, replies: 5 },
  { id: 2, communityId: 1, author: "李雨桐", authorAvatar: "/avatars/Frame 15.jpg", content: "下周村里的农耕体验活动，有想一起去的吗？", time: "1小时前", likes: 8, replies: 3 },
  { id: 3, communityId: 1, author: "王明哲", authorAvatar: "/avatars/Frame 16.jpg", content: "分享一篇关于数字游民社区运营的文章，很有启发", time: "3小时前", likes: 23, replies: 7 },
  { id: 4, communityId: 2, author: "赵晓萱", authorAvatar: "/avatars/Frame 17.jpg", content: "阳朔新开了一家超美的江景民宿，推荐大家去看看", time: "30分钟前", likes: 15, replies: 4 },
  { id: 5, communityId: 2, author: "刘志远", authorAvatar: "/avatars/Frame 18.jpg", content: "民宿淡季如何提升入住率？大家有什么好方法吗", time: "2小时前", likes: 9, replies: 11 },
  { id: 6, communityId: 2, author: "杨思雨", authorAvatar: "/avatars/Frame 19.jpg", content: "漓江边的日落真的太美了，每天看都不会腻", time: "5小时前", likes: 31, replies: 6 },
  { id: 7, communityId: 3, author: "黄俊杰", authorAvatar: "/avatars/Frame 20.jpg", content: "上周峨眉山的云海太壮观了！分享几张照片", time: "20分钟前", likes: 45, replies: 8 },
  { id: 8, communityId: 3, author: "周梦瑶", authorAvatar: "/avatars/Frame 21.jpg", content: "求推荐适合新手的徒步路线，最好在四川境内", time: "1小时前", likes: 6, replies: 14 },
  { id: 9, communityId: 3, author: "吴天宇", authorAvatar: "/avatars/Frame 22.jpg", content: "露营装备清单整理好了，有需要的可以私信我", time: "4小时前", likes: 28, replies: 9 },
  { id: 10, communityId: 3, author: "郑雅文", authorAvatar: "/avatars/Frame 23.jpg", content: "这周末有人一起走四姑娘山长坪沟吗", time: "6小时前", likes: 17, replies: 5 },
  { id: 11, communityId: 4, author: "钱一鸣", authorAvatar: "/avatars/Frame 24.jpg", content: "今天的有机蔬菜特别新鲜，番茄和黄瓜都很棒", time: "15分钟前", likes: 19, replies: 3 },
  { id: 12, communityId: 4, author: "孙雪晴", authorAvatar: "/avatars/Frame 25.jpg", content: "有机种植不用农药真的可行吗？想听听大家的经验", time: "2小时前", likes: 11, replies: 16 },
  { id: 13, communityId: 4, author: "朱浩宇", authorAvatar: "/avatars/Frame 26.jpg", content: "市集上买到了超好吃的土蜂蜜，强烈推荐", time: "5小时前", likes: 22, replies: 4 },
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
  const [communities, setCommunities] = useState<CommunityItem[]>(INITIAL_COMMUNITIES);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityItem | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "activities" | "discussions">("info");
  const { getUsersByCommunity } = useApp();

  const getNodeById = (id: string) => NETWORK_NODES.find((n) => n.id === id);

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-surface px-4 pt-3 pb-4 shadow-ds-soft">
        {onBack && (
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center mb-3">
            <ChevronLeft size={18} />
          </button>
        )}
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
              {v === "list" ? "社区列表" : "社区网络"}
            </button>
          ))}
        </div>
      </div>

      {view === "list" && (
        <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 flex flex-col gap-3">
          {communities.map((community) => (
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
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 relative bg-gray-900 overflow-hidden min-h-0">
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
              <p className="font-semibold mb-1">社区关系网</p>
              <p className="text-white/60">展示你与各社区的连接</p>
            </div>
          </div>

          <div className="bg-ds-surface px-4 py-4 pb-24">
            <p className="text-xs text-ds-text-subtle mb-3">相关社区</p>
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
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => { setSelectedCommunity(null); setDetailTab("info"); }}>
          <div className="w-full bg-ds-surface rounded-t-ds-xl flex-1 overflow-y-auto mt-12"
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-ds-surface/95 backdrop-blur-sm">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <div className="w-10 h-1 bg-ds-border rounded-full" />
                <button onClick={() => { setSelectedCommunity(null); setDetailTab("info"); }} className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="flex bg-ds-chip mx-4 mb-2 rounded-ds-lg p-0.5 gap-0.5">
                {(["info", "activities", "discussions"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDetailTab(t)}
                    className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all ${
                      detailTab === t
                        ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                        : "text-ds-text-subtle"
                    }`}
                  >
                    {t === "info" ? "简介" : t === "activities" ? "活动" : "讨论"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${selectedCommunity.color}, ${selectedCommunity.color}60)` }} />

            {detailTab === "info" && (
              <div className="px-5 pt-5 pb-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-ds-lg flex items-center justify-center text-3xl shrink-0"
                    style={{ background: selectedCommunity.color + "20" }}>
                    {selectedCommunity.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-lg text-ds-text">{selectedCommunity.name}</h2>
                      {selectedCommunity.verified && (
                        <Shield size={15} className="shrink-0" style={{ color: selectedCommunity.color }} />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-ds-text-subtle mt-1">
                      <MapPin size={12} />
                      <span>{selectedCommunity.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mb-5">
                  <div className="flex-1 bg-ds-chip rounded-ds-lg p-3 text-center">
                    <p className="font-bold text-lg text-ds-text">{selectedCommunity.members}</p>
                    <p className="text-xs text-ds-text-subtle mt-0.5">成员</p>
                  </div>
                  <div className="flex-1 bg-ds-chip rounded-ds-lg p-3 text-center">
                    <p className="font-bold text-lg text-ds-text">{selectedCommunity.activities}</p>
                    <p className="text-xs text-ds-text-subtle mt-0.5">活动</p>
                  </div>
                  <div className="flex-1 bg-ds-chip rounded-ds-lg p-3 text-center">
                    <p className="font-bold text-lg text-ds-text">活跃</p>
                    <p className="text-xs text-ds-text-subtle mt-0.5">状态</p>
                  </div>
                </div>
                <div className="mb-5">
                  <h3 className="font-semibold text-sm text-ds-text mb-2">社区简介</h3>
                  <p className="text-sm text-ds-text-muted leading-relaxed">{selectedCommunity.desc}</p>
                </div>
                <div className="mb-5">
                  <h3 className="font-semibold text-sm text-ds-text mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommunity.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: selectedCommunity.color + "20", color: selectedCommunity.color }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                {(() => {
                  const members = getUsersByCommunity(selectedCommunity.id);
                  if (members.length === 0) return null;
                  return (
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm text-ds-text">社区成员</h3>
                        <span className="text-xs text-ds-text-subtle flex items-center gap-0.5">
                          查看全部 <ChevronRight size={12} />
                        </span>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {members.slice(0, 8).map((member) => (
                          <div key={member.id} className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-ds-chip">
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] text-ds-text-subtle max-w-[48px] truncate">{member.name}</span>
                          </div>
                        ))}
                        {members.length > 8 && (
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-11 h-11 rounded-full bg-ds-chip flex items-center justify-center text-xs text-ds-text-subtle font-medium">
                              +{members.length - 8}
                            </div>
                            <span className="text-[10px] text-ds-text-subtle">更多</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
                <button className="w-full h-12 rounded-ds-lg bg-ds-brand text-white font-bold text-sm flex items-center justify-center gap-1.5">
                  <Users size={15} /> 申请加入
                </button>
              </div>
            )}

            {detailTab === "activities" && (
              <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
                {(() => {
                  const acts = COMMUNITY_ACTIVITIES.filter((a) => a.communityId === selectedCommunity.id);
                  if (acts.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-16 text-ds-text-subtle">
                        <Star size={32} className="mb-3 opacity-40" />
                        <p className="text-sm">暂无活动</p>
                      </div>
                    );
                  }
                  return acts.map((act) => (
                    <div key={act.id} className="bg-ds-chip rounded-ds-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-ds-lg flex items-center justify-center text-xl shrink-0"
                            style={{ background: selectedCommunity.color + "20" }}>
                            {act.cover}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-ds-text">{act.title}</h4>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-ds-text-subtle">
                              <span className="flex items-center gap-1"><Clock size={10} /> {act.date}</span>
                              <span>{act.duration}</span>
                              <span>{act.quota}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold shrink-0" style={{ color: selectedCommunity.color }}>{act.price}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-ds-text-subtle mb-1">
                            <span>报名进度</span>
                            <span>{act.enrolled}/{act.total}</span>
                          </div>
                          <div className="h-1.5 bg-ds-border rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(act.enrolled / act.total) * 100}%`, background: selectedCommunity.color }} />
                          </div>
                        </div>
                        <div className="flex gap-1.5 mt-3">
                          {act.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px]"
                              style={{ background: selectedCommunity.color + "15", color: selectedCommunity.color }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {detailTab === "discussions" && (
              <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
                {(() => {
                  const discs = COMMUNITY_DISCUSSIONS.filter((d) => d.communityId === selectedCommunity.id);
                  if (discs.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-16 text-ds-text-subtle">
                        <MessageCircle size={32} className="mb-3 opacity-40" />
                        <p className="text-sm">暂无讨论</p>
                      </div>
                    );
                  }
                  return discs.map((disc) => (
                    <div key={disc.id} className="bg-ds-chip rounded-ds-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-ds-border shrink-0">
                          <img src={disc.authorAvatar} alt={disc.author} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-ds-text">{disc.author}</span>
                            <span className="text-[10px] text-ds-text-subtle">{disc.time}</span>
                          </div>
                          <p className="text-sm text-ds-text-muted leading-relaxed mt-1">{disc.content}</p>
                          <div className="flex items-center gap-4 mt-2.5">
                            <button className="flex items-center gap-1 text-xs text-ds-text-subtle">
                              <Heart size={12} /> {disc.likes}
                            </button>
                            <button className="flex items-center gap-1 text-xs text-ds-text-subtle">
                              <MessageCircle size={12} /> {disc.replies}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
                <div className="flex gap-2 mt-1">
                  <input
                    placeholder="说点什么..."
                    className="flex-1 h-10 px-3 rounded-full bg-ds-chip text-sm text-ds-text placeholder:text-ds-text-subtle outline-none focus:ring-2 focus:ring-ds-brand"
                  />
                  <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: selectedCommunity.color }}>
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}