import { useState } from "react";
import { ChevronLeft, Users, Tag, Flag, Package, BarChart3, Settings, Plus, Trash2, Shield } from "lucide-react";

interface AdminPageProps {
  onBack: () => void;
}

const STATS = [
  { label: "注册用户", value: "12,340", trend: "+128", color: "#C8FF00" },
  { label: "发布内容", value: "45,892", trend: "+342", color: "#4ECDC4" },
  { label: "活动数量", value: "1,204", trend: "+56", color: "#FF8C42" },
  { label: "今日活跃", value: "3,891", trend: "+890", color: "#A18CD1" },
];

const IDENTITY_TAGS_ADMIN = [
  { id: 1, label: "在地新村民", count: 1245, active: true },
  { id: 2, label: "原村民", count: 867, active: true },
  { id: 3, label: "游客", count: 4532, active: true },
  { id: 4, label: "村镇管理员", count: 89, active: true },
  { id: 5, label: "民宿主理人", count: 312, active: true },
  { id: 6, label: "有机农场主理人", count: 156, active: true },
  { id: 7, label: "活动发起人", count: 423, active: true },
];

const REPORTS = [
  { id: 1, type: "内容违规", content: "某帖子涉嫌虚假宣传", user: "张三", time: "1小时前", status: "待审" },
  { id: 2, type: "用户举报", content: "用户疑似发布垃圾信息", user: "李四", time: "3小时前", status: "待审" },
  { id: 3, type: "社区申诉", content: "社区认证申请复核", user: "王五", time: "1天前", status: "处理中" },
];

const SECTIONS = ["概览", "用户", "标签", "内容审核", "积分管理", "Banner", "举报"] as const;

export function AdminPage({ onBack }: AdminPageProps) {
  const [section, setSection] = useState<typeof SECTIONS[number]>("概览");
  const [tags, setTags] = useState(IDENTITY_TAGS_ADMIN);
  const [newTagInput, setNewTagInput] = useState("");

  const addTag = () => {
    if (newTagInput.trim()) {
      setTags([...tags, { id: tags.length + 1, label: newTagInput.trim(), count: 0, active: true }]);
      setNewTagInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-text px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg text-white">管理后台</h1>
            <p className="text-xs text-white/50">城乡体验平台 · 管理员</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-ds-brand">
            <Shield size={17} className="text-ds-text" />
          </div>
        </div>
      </div>

      <div className="bg-ds-text border-b border-white/10 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-4 py-3 text-xs font-medium shrink-0 transition-all ${
                section === s
                  ? "text-ds-brand font-bold border-b-2 border-ds-brand"
                  : "text-white/50 border-b-2 border-transparent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {section === "概览" && (
          <div className="px-4 py-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ label, value, trend, color }) => (
                <div key={label} className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
                  <p className="text-xs text-ds-text-subtle mb-1">{label}</p>
                  <p className="text-xl font-bold text-ds-text">{value}</p>
                  <p className="text-xs font-medium mt-1" style={{ color }}>↑ {trend} 今日</p>
                </div>
              ))}
            </div>

            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <p className="font-semibold text-sm text-ds-text mb-3">快捷操作</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Tag, label: "标签管理", action: () => setSection("标签") },
                  { icon: Users, label: "用户管理", action: () => setSection("用户") },
                  { icon: Flag, label: "举报审核", action: () => setSection("举报") },
                  { icon: Package, label: "积分商城", action: () => setSection("积分管理") },
                  { icon: BarChart3, label: "数据报表", action: () => {} },
                  { icon: Settings, label: "系统设置", action: () => {} },
                ].map(({ icon: Icon, label, action }) => (
                  <button key={label} onClick={action}
                    className="flex flex-col items-center gap-1.5 p-3 bg-ds-chip rounded-xl active:bg-ds-surface">
                    <div className="w-9 h-9 rounded-xl bg-ds-surface flex items-center justify-center shadow-sm">
                      <Icon size={16} className="text-ds-text-muted" />
                    </div>
                    <span className="text-xs text-ds-text-muted">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-ds-text">最新举报</p>
                <button onClick={() => setSection("举报")} className="text-xs text-ds-brand-dark">查看全部</button>
              </div>
              {REPORTS.slice(0, 2).map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-2.5 border-b last:border-b-0 border-ds-border">
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: r.status === "待审" ? "#FF4444" : "var(--ds-brand)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ds-text truncate">{r.content}</p>
                    <p className="text-xs text-ds-text-subtle">{r.type} · {r.time}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0 bg-ds-brand/20 text-ds-brand-dark">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "标签" && (
          <div className="px-4 py-4 flex flex-col gap-4">
            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <p className="font-semibold text-sm text-ds-text mb-3">身份标签管理</p>
              <div className="flex gap-2 mb-4">
                <input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="新增身份标签"
                  className="flex-1 bg-ds-surface-soft rounded-xl px-3 h-10 outline-none text-sm text-ds-text"
                />
                <button onClick={addTag} className="w-10 h-10 rounded-xl flex items-center justify-center bg-ds-brand">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-3 p-3 bg-ds-chip rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ds-text">{tag.label}</p>
                      <p className="text-xs text-ds-text-subtle">{tag.count} 用户选择</p>
                    </div>
                    <button
                      onClick={() => setTags(tags.map((t) => t.id === tag.id ? { ...t, active: !t.active } : t))}
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        tag.active ? "bg-ds-brand/20 text-ds-brand-dark" : "bg-ds-chip text-ds-text-subtle"
                      }`}
                    >
                      {tag.active ? "启用" : "禁用"}
                    </button>
                    <button onClick={() => setTags(tags.filter((t) => t.id !== tag.id))}>
                      <Trash2 size={15} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === "用户" && (
          <div className="px-4 py-4">
            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <p className="font-semibold text-sm text-ds-text mb-3">用户列表</p>
              {[
                { name: "李晓农", tag: "有机农场主理人", status: "正常", joined: "2024-01" },
                { name: "张数游", tag: "数字游民", status: "正常", joined: "2024-03" },
                { name: "村委王静", tag: "村镇管理员", status: "正常", joined: "2023-11" },
                { name: "陈然然", tag: "在地新村民", status: "正常", joined: "2024-05" },
              ].map((user) => (
                <div key={user.name} className="flex items-center gap-3 py-3 border-b last:border-b-0 border-ds-border">
                  <div className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center text-base text-ds-text-muted">
                    🧑
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ds-text">{user.name}</p>
                    <p className="text-xs text-ds-text-subtle">{user.tag} · {user.joined}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-ds-brand/20 text-ds-brand-dark">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "举报" && (
          <div className="px-4 py-4 flex flex-col gap-3">
            {REPORTS.map((r) => (
              <div key={r.id} className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full mr-2 bg-red-50 text-red-500">{r.type}</span>
                    <span className="text-xs text-ds-text-subtle">{r.time}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    r.status === "待审" ? "bg-red-50 text-red-500" : "bg-ds-brand/20 text-ds-brand-dark"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-sm text-ds-text mb-3">{r.content}</p>
                <p className="text-xs text-ds-text-subtle mb-3">举报人：{r.user}</p>
                <div className="flex gap-2">
                  <button className="flex-1 h-9 rounded-xl bg-ds-chip text-sm text-ds-text-muted font-medium">忽略</button>
                  <button className="flex-1 h-9 rounded-xl bg-red-50 text-sm text-red-500 font-medium">处理</button>
                  <button className="flex-1 h-9 rounded-xl text-sm font-bold bg-ds-brand text-white">通过</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {section === "积分管理" && (
          <div className="px-4 py-4 flex flex-col gap-4">
            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <p className="font-semibold text-sm text-ds-text mb-3">积分规则</p>
              {[
                { action: "发布内容", points: "+5", note: "每日上限20分" },
                { action: "NFC 打卡", points: "+10", note: "每次打卡" },
                { action: "发起活动", points: "+20", note: "活动成功举办" },
                { action: "参与活动", points: "+8", note: "到场确认" },
                { action: "获得点赞", points: "+1", note: "每10个赞" },
              ].map(({ action, points, note }) => (
                <div key={action} className="flex items-center justify-between py-2.5 border-b last:border-b-0 border-ds-border">
                  <div>
                    <p className="text-sm text-ds-text">{action}</p>
                    <p className="text-xs text-ds-text-subtle">{note}</p>
                  </div>
                  <span className="font-bold text-sm text-ds-brand-dark">{points}</span>
                </div>
              ))}
            </div>

            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <p className="font-semibold text-sm text-ds-text mb-3">兑换商品</p>
              {[
                { name: "平台限定文创袋", points: 100, stock: 50 },
                { name: "手绘村庄明信片", points: 50, stock: 200 },
                { name: "有机茶叶礼盒", points: 300, stock: 20 },
              ].map(({ name, points, stock }) => (
                <div key={name} className="flex items-center gap-3 py-2.5 border-b last:border-b-0 border-ds-border">
                  <div className="w-10 h-10 rounded-xl bg-ds-chip flex items-center justify-center">🎁</div>
                  <div className="flex-1">
                    <p className="text-sm text-ds-text">{name}</p>
                    <p className="text-xs text-ds-text-subtle">库存 {stock} 件</p>
                  </div>
                  <span className="text-xs font-bold text-ds-brand-dark">{points}分</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Banner" && (
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-sm text-ds-text">Banner 管理</p>
                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-ds-brand">
                  <Plus size={16} />
                </button>
              </div>
              {[
                { title: "五月乡村节", status: "展示中", img: "🌾" },
                { title: "民宿主理人大会", status: "已结束", img: "🏡" },
                { title: "数字游民招募", status: "待上线", img: "💻" },
              ].map(({ title, status, img }) => (
                <div key={title} className="flex items-center gap-3 py-3 border-b last:border-b-0 border-ds-border">
                  <div className="w-12 h-9 rounded-xl bg-ds-chip flex items-center justify-center text-xl">{img}</div>
                  <div className="flex-1">
                    <p className="text-sm text-ds-text">{title}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    status === "展示中" ? "bg-ds-brand/20 text-ds-brand-dark" :
                    status === "待上线" ? "bg-yellow-50 text-yellow-600" :
                    "bg-ds-chip text-ds-text-subtle"
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}