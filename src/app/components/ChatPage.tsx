import { useState, useEffect } from "react";
import { ChevronLeft, Send, Bot, MoreHorizontal, Phone } from "lucide-react";
import { useApp } from "../store/AppContext";
import type { DemoUser } from "../data/users";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  tag: string;
  lastMsg: string;
  time: string;
  unread: number;
  isAI?: boolean;
  isOnline?: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, name: "AI 助手·乡野", avatar: "🤖", tag: "智能体", lastMsg: "您好！我是您的城乡生活助手，有什么可以帮到您？", time: "刚刚", unread: 0, isAI: true },
  { id: 2, name: "李晓农", avatar: "🧑‍🌾", tag: "有机农场主理人", lastMsg: "周末来我农场看看？刚好在收小麦", time: "10分钟前", unread: 2, isOnline: true },
  { id: 3, name: "张数游", avatar: "💻", tag: "数字游民", lastMsg: "大理的民宿位置发给你了，记得看地图", time: "1小时前", unread: 0 },
  { id: 4, name: "莫干山探索队", avatar: "🏔️", tag: "群聊 · 12人", lastMsg: "陈然然：明天7点集合出发！", time: "3小时前", unread: 5 },
  { id: 5, name: "村委王静", avatar: "🏡", tag: "村镇管理员", lastMsg: "合伙人资料收到了，我看一下", time: "昨天", unread: 0 },
];

interface Message {
  id: number;
  from: "me" | "other" | "ai";
  text: string;
  time: string;
}

const ACTIVITY_RECOMMENDATIONS = [
  {
    title: "峨眉山深度徒步7日",
    emoji: "🧗",
    community: "山野探索队",
    tags: ["徒步", "露营"],
    date: "6月20日",
    price: "¥2,380",
    quota: "余4位",
    matchTags: ["徒步", "露营", "骑行", "摄影", "旅行"],
  },
  {
    title: "数字游民共居周",
    emoji: "🏘️",
    community: "竹林数字村",
    tags: ["共居", "远程办公"],
    date: "6月15日",
    price: "¥1,280",
    quota: "余3位",
    matchTags: ["数字游民", "自由职业", "远程办公", "AI", "软件"],
  },
  {
    title: "有机农夫市集·夏日场",
    emoji: "🌾",
    community: "有机农夫市集",
    tags: ["市集", "有机"],
    date: "6月16日",
    price: "免费",
    quota: "余12位",
    matchTags: ["美食", "有机", "农人", "农业", "旅行"],
  },
  {
    title: "阳朔山水摄影行",
    emoji: "📷",
    community: "漓江民宿联盟",
    tags: ["摄影", "旅行"],
    date: "6月25日",
    price: "¥980",
    quota: "余4位",
    matchTags: ["摄影", "旅行", "民宿", "设计"],
  },
  {
    title: "乡村创客沙龙",
    emoji: "💡",
    community: "竹林数字村",
    tags: ["创业", "分享"],
    date: "6月22日",
    price: "免费",
    quota: "余12位",
    matchTags: ["创业者", "数字游民", "自由职业", "设计", "AI", "软件", "建筑"],
  },
  {
    title: "民宿设计工作坊",
    emoji: "🎨",
    community: "漓江民宿联盟",
    tags: ["设计", "美学"],
    date: "7月5日",
    price: "¥298",
    quota: "余6位",
    matchTags: ["设计", "建筑", "民宿", "乡建"],
  },
  {
    title: "周末山野露营",
    emoji: "⛺",
    community: "山野探索队",
    tags: ["露营", "星空"],
    date: "6月28日",
    price: "¥368",
    quota: "余6位",
    matchTags: ["露营", "徒步", "骑行", "摄影", "I人", "E人"],
  },
  {
    title: "农场到餐桌体验",
    emoji: "🍽️",
    community: "有机农夫市集",
    tags: ["美食", "体验"],
    date: "6月30日",
    price: "¥198",
    quota: "余4位",
    matchTags: ["美食", "农人", "有机", "旅行", "学生"],
  },
  {
    title: "溯溪探险之旅",
    emoji: "🏞️",
    community: "山野探索队",
    tags: ["溯溪", "探险"],
    date: "7月15日",
    price: "¥488",
    quota: "余6位",
    matchTags: ["徒步", "骑行", "露营", "E人", "90后", "00后"],
  },
  {
    title: "有机种植工作坊",
    emoji: "🌻",
    community: "有机农夫市集",
    tags: ["种植", "学习"],
    date: "7月10日",
    price: "¥128",
    quota: "余5位",
    matchTags: ["农人", "农业", "乡建", "学生", "创业者"],
  },
  {
    title: "稻田插秧体验",
    emoji: "🌱",
    community: "竹林数字村",
    tags: ["农耕", "体验"],
    date: "7月1日",
    price: "¥168",
    quota: "余8位",
    matchTags: ["农人", "美食", "旅行", "学生", "上班族"],
  },
  {
    title: "高山日出摄影团",
    emoji: "🌄",
    community: "山野探索队",
    tags: ["摄影", "日出"],
    date: "7月8日",
    price: "¥258",
    quota: "余4位",
    matchTags: ["摄影", "徒步", "旅行", "露营"],
  },
];

function generateAIRecommendation(userInput: string, user: DemoUser | null): string {
  if (!user) {
    return "您好！我是您的城乡生活AI助手。请先登录，我就能根据您的标签为您推荐最合适的活动了！";
  }

  const allTags = [...user.identityTags, ...user.personalityTags];

  const scored = ACTIVITY_RECOMMENDATIONS.map((act) => {
    const matchCount = act.matchTags.filter((t) => allTags.includes(t)).length;
    return { ...act, score: matchCount };
  });

  scored.sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3);

  const intro = `根据您的身份标签「${user.identityTags.join("、")}」、个性标签「${user.personalityTags.join("、")}」以及当前状态「${user.status}」，我为您匹配了以下活动：\n\n`;

  const items = top3.map((act, i) => {
    const matchReason = act.matchTags.filter((t) => allTags.includes(t)).slice(0, 2);
    const reasonText = matchReason.length > 0 ? `（匹配：${matchReason.join("、")}）` : "";
    return `${act.emoji} **${act.title}**\n📅 ${act.date} | 💰 ${act.price} | 👥 ${act.quota}\n🏘️ ${act.community} | 🏷️ ${act.tags.join(" · ")} ${reasonText}`;
  }).join("\n\n");

  const inputHint = userInput.trim()
    ? `\n\n您提到「${userInput.slice(0, 30)}${userInput.length > 30 ? "..." : ""}」，以上推荐已结合您的兴趣方向进行筛选。点击活动卡片即可查看详情和报名！`
    : "\n\n以上是根据您的标签智能匹配的活动，点击活动卡片即可查看详情和报名！";

  return intro + items + inputHint;
}

const DEFAULT_MESSAGES: Message[] = [
  { id: 1, from: "other", text: "你好！周末来我农场看看？", time: "10:20" },
  { id: 2, from: "me", text: "好的！需要带什么吗？", time: "10:22" },
  { id: 3, from: "other", text: "不用，穿个方便走路的鞋子就好，我这边有工具。刚好在收小麦，可以体验一下。", time: "10:23" },
  { id: 4, from: "me", text: "太棒了！我很感兴趣，还有几个朋友想来，可以吗？", time: "10:25" },
  { id: 5, from: "other", text: "当然可以，最多6个人，超过的话下周再安排 😄", time: "10:26" },
];

const AI_DEFAULT_MESSAGES: Message[] = [
  { id: 1, from: "ai", text: "您好！我是您的城乡生活AI助手。我可以帮您推荐活动、匹配伙伴、介绍地点。有什么想了解的吗？", time: "刚刚" },
  { id: 2, from: "me", text: "周末有空，想找个地方放松一下", time: "刚刚" },
];

function getAiWelcomeMessages(user: DemoUser | null): Message[] {
  const baseMessages: Message[] = [
    { id: 1, from: "ai", text: "您好！我是您的城乡生活AI助手。我可以帮您推荐活动、匹配伙伴、介绍地点。有什么想了解的吗？", time: "刚刚" },
  ];
  
  if (!user) return baseMessages;
  
  const recommendation = generateAIRecommendation("周末有空，想找个地方放松一下", user);
  return [
    ...baseMessages,
    { id: 2, from: "me", text: "周末有空，想找个地方放松一下", time: "刚刚" },
    { id: 3, from: "ai", text: recommendation, time: "刚刚" },
  ];
}

interface ChatPageProps {
  onToggleBottomNav: (hide: boolean) => void;
}

export function ChatPage({ onToggleBottomNav }: ChatPageProps) {
  const { currentUser } = useApp();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);

  useEffect(() => {
    if (selectedConv) {
      onToggleBottomNav(true);
    } else {
      onToggleBottomNav(false);
    }
    return () => onToggleBottomNav(false);
  }, [selectedConv, onToggleBottomNav]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setInput("");

    if (selectedConv?.isAI || aiEnabled) {
      setTimeout(() => {
        const aiReply = generateAIRecommendation(input, currentUser);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            from: "ai",
            text: aiReply,
            time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 800);
    }
  };

  if (selectedConv) {
    return (
      <div className="flex flex-col h-full bg-ds-bg">
        <div className="bg-ds-surface px-4 pt-8 pb-3 flex items-center gap-3 shadow-ds-soft">
          <button onClick={() => setSelectedConv(null)} className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center text-xl">
            {selectedConv.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-ds-text">{selectedConv.name}</span>
              {selectedConv.isAI && (
                <span className="text-xs px-1.5 py-0.5 rounded-full text-white" style={{ background: "#7C3AED" }}>AI</span>
              )}
              {selectedConv.isOnline && (
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              )}
            </div>
            <p className="text-xs text-ds-text-subtle">{selectedConv.tag}</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center">
            <Phone size={15} />
          </button>
        </div>

        {!selectedConv.isAI && (
          <div className="bg-ds-surface px-4 py-2 flex items-center justify-between border-b border-ds-border">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-purple-500" />
              <span className="text-xs text-ds-text-muted">AI 数字分身代聊</span>
            </div>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: aiEnabled ? "var(--ds-brand)" : "#E5E5E5" }}
            >
              <div
                className="w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all"
                style={{ left: aiEnabled ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.from !== "me" && (
                <div className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center text-base shrink-0">
                  {msg.from === "ai" ? "🤖" : selectedConv.avatar}
                </div>
              )}
              <div className="max-w-[75%]">
                <div
                  className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.from === "me" ? "var(--ds-brand)" : msg.from === "ai" ? "#F3E8FF" : "var(--ds-surface)",
                    color: msg.from === "me" ? "var(--ds-surface)" : msg.from === "ai" ? "#7C3AED" : "var(--ds-text)",
                    borderRadius: msg.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    boxShadow: msg.from !== "me" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-ds-text-subtle mt-1 px-1">{msg.time}</p>
              </div>
              {msg.from === "me" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 bg-ds-brand">
                  🙂
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-ds-surface px-4 py-3 flex items-center gap-2 border-t border-ds-border"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={aiEnabled ? "AI 分身将协助回复..." : "发送消息..."}
            className="flex-1 bg-ds-surface-soft rounded-full px-4 h-10 outline-none text-sm text-ds-text"
          />
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
            style={{ background: input.trim() ? "var(--ds-brand)" : "#E5E5E5" }}
          >
            <Send size={16} color={input.trim() ? "#fff" : "#bbb"} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-surface px-5 pt-3 pb-4 shadow-ds-soft">
        <div className="flex items-center justify-end">
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {CONVERSATIONS.map((conv) => (
          <button
            key={conv.id}
            onClick={() => {
              setSelectedConv(conv);
              if (conv.id === 1) {
                setMessages(getAiWelcomeMessages(currentUser));
              } else {
                setMessages(DEFAULT_MESSAGES);
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-ds-surface border-b border-ds-border active:bg-ds-chip"
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-ds-chip flex items-center justify-center text-2xl">
                {conv.avatar}
              </div>
              {conv.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-ds-surface bg-green-400" />
              )}
              {conv.isAI && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: "#7C3AED" }}>
                  <Bot size={9} color="#fff" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm text-ds-text truncate">{conv.name}</span>
                <span className="text-xs text-ds-text-subtle shrink-0 ml-2">{conv.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-ds-text-subtle truncate flex-1">{conv.lastMsg}</p>
                {conv.unread > 0 && (
                  <span className="ml-2 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1 shrink-0 bg-ds-brand text-white">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}