import { useState } from "react";
import { X, Image, Video, Link, Calendar, MapPin, Tag, Users, ChevronDown, Check, Zap, Shield, MessageCircle } from "lucide-react";

type PublishType = "feed" | "link" | "activity" | "community";
type FeedSubType = "post" | "video" | "checkin";

interface PublishPageProps {
  onClose: () => void;
}

const ACTIVITY_TYPES = ["招聘", "找合伙人", "组织活动", "出行", "一日游", "亲子", "项目", "问卷"];
const CONTENT_TAGS = ["农场", "民宿", "徒步", "露营", "美食", "摄影", "乡建", "手工", "骑行", "出行"];
const IDENTITY_TAGS = ["在地新村民", "原村民", "游客", "民宿主理人", "农场主理人", "活动发起人"];
const AVATAR_OPTIONS = ["🏘️", "🏡", "🧗", "🌾", "🏕️", "🎨", "📚", "🎵", "🌿", "🏔️", "🌊", "🌻"];
const COLOR_OPTIONS = ["#C8FF00", "#FF8C42", "#4ECDC4", "#A18CD1", "#FF6B6B", "#36D399", "#FB923C", "#60A5FA", "#F472B6", "#FBBF24"];

const FEED_SUB_TYPES = [
  { key: "post" as FeedSubType, icon: Image, label: "图文" },
  { key: "video" as FeedSubType, icon: Video, label: "视频" },
  { key: "checkin" as FeedSubType, icon: Zap, label: "打卡" },
];

const PUBLISH_TYPES = [
  { key: "feed" as PublishType, icon: MessageCircle, label: "动态" },
  { key: "link" as PublishType, icon: Link, label: "外链" },
  { key: "activity" as PublishType, icon: Calendar, label: "活动" },
  { key: "community" as PublishType, icon: Shield, label: "社区" },
];

export function PublishPage({ onClose }: PublishPageProps) {
  const [type, setType] = useState<PublishType>("feed");
  const [feedSubType, setFeedSubType] = useState<FeedSubType>("post");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activityType, setActivityType] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [nfcAnimate, setNfcAnimate] = useState(false);
  const [published, setPublished] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityDesc, setCommunityDesc] = useState("");
  const [communityLocation, setCommunityLocation] = useState("");
  const [communityTags, setCommunityTags] = useState("");
  const [communityAvatar, setCommunityAvatar] = useState("🏘️");
  const [communityColor, setCommunityColor] = useState("#C8FF00");

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  const toggleReq = (tag: string) =>
    setSelectedRequirements((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const showParticipantReq = ["招聘", "找合伙人", "组织活动"].includes(activityType);

  const handleNFC = () => {
    setNfcAnimate(true);
    setTimeout(() => {
      setNfcAnimate(false);
      setPublished(true);
    }, 2000);
  };

  if (published) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl bg-ds-brand text-white">
            ✓
          </div>
          <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-ds-brand" />
        </div>
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">发布成功！</h2>
          <p className="text-white/60 text-sm">已打卡 · 获得 +10 积分</p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-8 py-3 rounded-full font-bold bg-ds-brand text-white"
        >
          完成
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-ds-surface flex flex-col">
      <div className="flex items-center justify-between px-5 pt-8 pb-4 border-b border-ds-border">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center">
          <X size={18} />
        </button>
        <h1 className="font-bold text-base text-ds-text">发布内容</h1>
        <button
          className="px-5 h-9 rounded-full font-bold text-sm bg-ds-brand text-white"
          onClick={() => setPublished(true)}
        >
          发布
        </button>
      </div>

      <div className="flex border-b border-ds-border overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {PUBLISH_TYPES.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setType(key)}
            className={`flex items-center gap-1.5 px-4 py-3 shrink-0 text-sm transition-all ${
              type === key
                ? "text-ds-brand font-semibold border-b-2 border-ds-brand"
                : "text-ds-text-subtle border-b-2 border-transparent"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {type === "feed" && (
          <>
            <div className="flex gap-2 pb-1">
              {FEED_SUB_TYPES.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setFeedSubType(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    feedSubType === key
                      ? "bg-ds-brand text-white"
                      : "bg-ds-chip text-ds-text-muted"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {feedSubType === "checkin" ? (
              <div className="flex flex-col items-center gap-6 py-8">
                <div
                  className={`w-36 h-36 rounded-full flex items-center justify-center cursor-pointer transition-all ${nfcAnimate ? "scale-95" : "scale-100"}`}
                  style={{ background: nfcAnimate ? "var(--ds-brand)" : "var(--ds-text)", boxShadow: nfcAnimate ? "0 0 40px var(--ds-brand)" : "none" }}
                  onClick={handleNFC}
                >
                  <div className="text-center">
                    <Zap size={40} color={nfcAnimate ? "#fff" : "var(--ds-brand)"} className={nfcAnimate ? "animate-bounce" : ""} />
                    <p className="text-sm mt-2" style={{ color: nfcAnimate ? "#fff" : "var(--ds-brand)" }}>
                      {nfcAnimate ? "感应中..." : "触碰 NFC"}
                    </p>
                  </div>
                </div>
                {nfcAnimate && (
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce bg-ds-brand"
                        style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}
                <p className="text-ds-text-muted text-sm text-center">将手机靠近 NFC 打卡点<br />或手动点击按钮打卡</p>
                <button
                  onClick={() => setPublished(true)}
                  className="px-8 py-3 rounded-full text-sm font-semibold bg-ds-chip text-ds-text-muted"
                >
                  手动打卡
                </button>
              </div>
            ) : (
              <>
                <div className="w-full h-36 rounded-ds-lg border-2 border-dashed border-ds-border flex flex-col items-center justify-center gap-2 cursor-pointer active:bg-ds-chip">
                  {feedSubType === "post" ? <Image size={28} className="text-ds-text-subtle" /> : <Video size={28} className="text-ds-text-subtle" />}
                  <span className="text-sm text-ds-text-subtle">点击{feedSubType === "post" ? "上传图片" : "上传视频"}</span>
                </div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="添加标题（可选）"
                  className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="分享你在城乡之间的故事..."
                  rows={4}
                  className="w-full bg-ds-surface-soft rounded-ds-lg px-4 py-3 outline-none text-sm resize-none text-ds-text"
                />
              </>
            )}
          </>
        )}

        {type === "link" && (
          <>
            <input
              placeholder="粘贴小红书 / 抖音 / B站链接"
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
            />
            <div className="flex gap-2 flex-wrap">
              {["小红书", "抖音", "B站", "其他"].map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full text-xs border border-ds-border text-ds-text-muted">{s}</span>
              ))}
            </div>
            <textarea
              placeholder="加一句你想说的话..."
              rows={3}
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 py-3 outline-none text-sm resize-none text-ds-text"
            />
          </>
        )}

        {type === "activity" && (
          <>
            <div>
              <p className="text-sm font-medium mb-2 text-ds-text">活动类型</p>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActivityType(t)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                      activityType === t
                        ? "border-ds-brand bg-ds-brand text-white"
                        : "border-ds-border text-ds-text-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="活动标题"
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="活动详情介绍..."
              rows={4}
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 py-3 outline-none text-sm resize-none text-ds-text"
            />
            {showParticipantReq && (
              <div>
                <p className="text-sm font-medium mb-2 text-ds-text">
                  参与者身份要求
                  <span className="ml-2 text-xs text-ds-text-subtle font-normal">（选自系统标签库）</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {IDENTITY_TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleReq(t)}
                      className={`px-3 py-1.5 rounded-full text-xs border-2 transition-all ${
                        selectedRequirements.includes(t)
                          ? "border-ds-brand bg-ds-brand text-white font-semibold"
                          : "border-ds-border text-ds-text-muted"
                      }`}
                    >
                      {selectedRequirements.includes(t) ? <Check size={10} className="inline mr-0.5" /> : null}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === "community" && (
          <>
            <div>
              <p className="text-sm font-medium mb-2 text-ds-text">社区图标</p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setCommunityAvatar(emoji)}
                    className={`w-10 h-10 rounded-ds-lg flex items-center justify-center text-xl ${
                      communityAvatar === emoji ? "bg-ds-brand/20 ring-2 ring-ds-brand" : "bg-ds-chip"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2 text-ds-text">主题色</p>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCommunityColor(c)}
                    className={`w-8 h-8 rounded-full ${communityColor === c ? "ring-2 ring-offset-2 ring-ds-text" : ""}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="社区名称"
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
            />
            <textarea
              value={communityDesc}
              onChange={(e) => setCommunityDesc(e.target.value)}
              placeholder="社区简介..."
              rows={3}
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 py-3 outline-none text-sm resize-none text-ds-text"
            />
            <input
              value={communityLocation}
              onChange={(e) => setCommunityLocation(e.target.value)}
              placeholder="所在地区（如：浙江·德清）"
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
            />
            <input
              value={communityTags}
              onChange={(e) => setCommunityTags(e.target.value)}
              placeholder="标签（用空格分隔，如：乡建 数字游民 农业）"
              className="w-full bg-ds-surface-soft rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
            />
          </>
        )}

        {(type !== "feed" || feedSubType !== "checkin") && type !== "community" && (
          <>
            <div>
              <p className="text-sm font-medium mb-2 text-ds-text flex items-center gap-1">
                <Tag size={14} /> 内容标签
              </p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      selectedTags.includes(tag)
                        ? "border-ds-brand bg-ds-brand text-white"
                        : "border-ds-border text-ds-text-muted"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-2 bg-ds-surface-soft rounded-ds-lg px-4 h-12 w-full text-left">
              <MapPin size={16} className="text-ds-text-subtle shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="添加地点"
                className="flex-1 bg-transparent outline-none text-sm text-ds-text"
              />
            </button>

            <div className="flex items-center justify-between bg-ds-surface-soft rounded-ds-lg px-4 h-12">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-ds-text-subtle" />
                <span className="text-sm text-ds-text-muted">可见范围</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-ds-text-subtle">
                <span>公开</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}