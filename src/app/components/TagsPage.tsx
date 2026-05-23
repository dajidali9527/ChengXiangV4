import { useState } from "react";
import { ChevronLeft, Search, Eye, EyeOff, Plus, X } from "lucide-react";

interface TagsPageProps {
  onBack: () => void;
}

const IDENTITY_TAGS_LIST = [
  "在地新村民", "原村民", "游客", "村镇管理员",
  "民宿主理人", "有机农场主理人", "活动发起人",
];

const PERSONALITY_TAGS: Record<string, string[]> = {
  "个人": ["男", "女", "70后", "80后", "90后", "00后", "10后", "I人", "E人", "INFJ", "ENTP"],
  "职业": ["无业", "学生", "上班族", "农人", "工人", "主理人", "数字游民", "自由职业", "创业者", "间隔年"],
  "兴趣": ["徒步", "旅行", "爬山", "运动", "美食", "摄影", "露营", "骑行", "直播", "钓鱼"],
  "专业": ["文科", "理科", "艺术", "软件", "硬件", "AI", "建筑", "乡建", "农业", "设计"],
  "工作年限": ["0年", "1年", "3年", "5年", "10年", "15年", "20年+"],
};

export function TagsPage({ onBack }: TagsPageProps) {
  const [selectedIdentity, setSelectedIdentity] = useState<string[]>(["有机农场主理人"]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(["90后", "I人", "自由职业", "徒步", "摄影", "乡建"]);
  const [hiddenTags, setHiddenTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTags, setCustomTags] = useState<string[]>(["竹林探索", "自然建筑"]);
  const [activeSection, setActiveSection] = useState<"identity" | "personality">("identity");

  const toggleIdentity = (tag: string) => {
    setSelectedIdentity((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const togglePersonality = (tag: string) => {
    setSelectedPersonality((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleHide = (tag: string) => {
    setHiddenTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTagInput.trim() && !customTags.includes(customTagInput.trim())) {
      setCustomTags([...customTags, customTagInput.trim()]);
      setCustomTagInput("");
    }
  };

  const filteredPersonality = Object.entries(PERSONALITY_TAGS).reduce(
    (acc, [cat, tags]) => {
      const filtered = searchQuery
        ? tags.filter((t) => t.includes(searchQuery))
        : tags;
      if (filtered.length) acc[cat] = filtered;
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-surface px-4 pt-8 pb-4 shadow-ds-soft">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          <h1 className="font-bold text-lg text-ds-text flex-1">我的标签</h1>
          <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-ds-brand text-white">
            保存
          </button>
        </div>

        <div className="flex bg-ds-chip rounded-ds-lg p-1 gap-1">
          {(["identity", "personality"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
                activeSection === s
                  ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                  : "text-ds-text-subtle"
              }`}
            >
              {s === "identity" ? "身份标签（官方）" : "个性标签（自定义）"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {activeSection === "identity" && (
          <div>
            <p className="text-xs text-ds-text-subtle mb-3 px-1">由平台官方维护，代表你在城乡社区中的角色。可多选，高优先级展示在个人主页。</p>
            <div className="bg-ds-surface rounded-ds-lg p-4">
              <div className="flex flex-wrap gap-2">
                {IDENTITY_TAGS_LIST.map((tag) => {
                  const selected = selectedIdentity.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleIdentity(tag)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
                        selected
                          ? "border-ds-text bg-ds-text text-ds-brand"
                          : "border-ds-border text-ds-text-muted"
                      }`}
                    >
                      {selected && <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs bg-ds-brand text-white">✓</span>}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedIdentity.length > 0 && (
              <div className="bg-ds-surface rounded-ds-lg p-4 mt-3">
                <p className="text-xs font-semibold text-ds-text-subtle mb-2">已选身份</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIdentity.map((tag) => (
                    <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ds-text text-ds-brand">
                      <span className="text-xs font-semibold">{tag}</span>
                      <button onClick={() => toggleHide(tag)}>
                        {hiddenTags.includes(tag)
                          ? <EyeOff size={12} className="text-ds-text-muted" />
                          : <Eye size={12} className="text-ds-brand" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ds-text-subtle mt-2">点击眼睛图标可控制标签在主页的显示</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "personality" && (
          <div>
            <div className="flex items-center gap-2 bg-ds-surface rounded-ds-lg px-4 h-12 mb-4 shadow-ds-soft">
              <Search size={15} className="text-ds-text-subtle" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标签..."
                className="flex-1 bg-transparent outline-none text-sm text-ds-text"
              />
            </div>

            {Object.entries(filteredPersonality).map(([cat, tags]) => (
              <div key={cat} className="mb-4">
                <p className="text-xs font-bold text-ds-text-subtle uppercase tracking-wider mb-2 px-1">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const sel = selectedPersonality.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => togglePersonality(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
                          sel
                            ? "border-ds-brand bg-ds-brand text-white font-bold"
                            : "border-ds-border text-ds-text-muted"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mb-4">
              <p className="text-xs font-bold text-ds-text-subtle uppercase tracking-wider mb-2 px-1">自定义标签</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {customTags.map((tag) => (
                  <div key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-ds-border text-sm text-ds-text-muted">
                    <span>{tag}</span>
                    <button onClick={() => setCustomTags(customTags.filter((t) => t !== tag))}>
                      <X size={12} className="text-ds-text-subtle" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                  placeholder="输入自定义标签"
                  className="flex-1 bg-ds-surface rounded-ds-lg px-4 h-10 outline-none text-sm border border-ds-border text-ds-text"
                />
                <button
                  onClick={addCustomTag}
                  className="w-10 h-10 rounded-ds-lg flex items-center justify-center bg-ds-brand"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}