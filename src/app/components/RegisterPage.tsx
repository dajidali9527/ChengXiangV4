import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react";
import { useApp } from "../store/AppContext";
import { DEMO_USERS } from "../data/users";

interface RegisterPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const IDENTITY_TAGS = [
  "在地新村民", "原村民", "游客", "村镇管理员",
  "民宿主理人", "有机农场主理人", "活动发起人",
];

const PERSONALITY_TAGS = {
  "个人": ["男", "女", "90后", "00后", "I人", "E人", "INFJ", "ENTP"],
  "职业": ["自由职业", "数字游民", "农人", "创业者", "学生", "上班族"],
  "兴趣": ["徒步", "摄影", "露营", "骑行", "美食", "旅行"],
  "专业": ["设计", "AI", "建筑", "乡建", "农业", "软件"],
};

const STATUS_OPTIONS = ["空闲中", "活动中", "工作中", "旅行中", "接待中", "休息中"];

export function RegisterPage({ onComplete, onBack }: RegisterPageProps) {
  const { login } = useApp();
  const [step, setStep] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("空闲中");
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const steps = ["选择形象", "身份标签", "个性标签", "完善资料"];

  const handleAiGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setNickname("云野探索者_" + Math.floor(Math.random() * 999));
      setBio("热爱城乡结合的生活方式，在田野与数字之间寻找平衡。");
      setAiGenerating(false);
    }, 1200);
  };

  const toggleTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const canNext = () => {
    if (step === 0) return selectedId !== null;
    if (step === 1) return selectedIdentity.length > 0;
    return true;
  };

  const handleComplete = () => {
    if (selectedId !== null) {
      login(selectedId);
    }
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f0ea" }}>
      <div className="flex items-center gap-3 px-5 pt-8 pb-4">
        <button onClick={step === 0 ? onBack : () => setStep(step - 1)} className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <div className="flex gap-1.5 mb-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all"
                style={{ background: i <= step ? "#e9846a" : "rgba(0,0,0,0.1)" }}
              />
            ))}
          </div>
          <p className="text-xs text-ds-text-subtle">{step + 1} / {steps.length} — {steps[step]}</p>
        </div>
      </div>

      <div className="flex-1 px-5 overflow-y-auto pb-32">
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-ds-text mb-1">选择你的形象</h1>
            <p className="text-ds-text-subtle text-sm mb-6">这是你在平台上的第一印象</p>
            <div className="grid grid-cols-5 gap-3">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedId(user.id)}
                  className="relative flex flex-col items-center gap-1 p-1.5 rounded-ds-lg transition-all active:scale-90"
                  style={{
                    background: selectedId === user.id ? "rgba(233,132,106,0.15)" : "transparent",
                    border: selectedId === user.id ? "2px solid #e9846a" : "2px solid transparent",
                  }}
                >
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    {selectedId === user.id && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow"
                        style={{ background: "#e9846a" }}>
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-ds-text mb-1">选择身份标签</h1>
            <p className="text-ds-text-subtle text-sm mb-2">官方身份，可多选</p>
            <p className="text-xs mb-6 px-3 py-2 rounded-xl bg-white/60 text-ds-text-muted">身份标签由平台维护，代表你在城乡社区中的角色</p>
            <div className="flex flex-wrap gap-2">
              {IDENTITY_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag, selectedIdentity, setSelectedIdentity)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    selectedIdentity.includes(tag)
                      ? "border-ds-text bg-ds-text text-white"
                      : "border-ds-border text-ds-text-muted bg-white/60"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-ds-text mb-1">个性标签</h1>
            <p className="text-ds-text-subtle text-sm mb-6">告诉大家你是什么样的人，可随时编辑</p>
            {Object.entries(PERSONALITY_TAGS).map(([cat, tags]) => (
              <div key={cat} className="mb-5">
                <p className="text-xs font-semibold text-ds-text-subtle uppercase tracking-wider mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag, selectedPersonality, setSelectedPersonality)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        selectedPersonality.includes(tag)
                          ? "border-[#e9846a] bg-[#e9846a] text-white font-semibold"
                          : "border-ds-border text-ds-text-muted bg-white/60"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <p className="text-xs font-semibold text-ds-text-subtle uppercase tracking-wider mb-2">当前状态</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      selectedStatus === s
                        ? "border-ds-text bg-ds-text text-white"
                        : "border-ds-border text-ds-text-muted bg-white/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-ds-text mb-1">完善资料</h1>
            <p className="text-ds-text-subtle text-sm mb-6">让别人更了解你，也可以跳过</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-ds-text mb-1.5 block">昵称</label>
                <div className="flex gap-2">
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="给自己起个名字"
                    className="flex-1 bg-white/60 rounded-ds-lg px-4 h-12 outline-none text-sm text-ds-text"
                  />
                  <button
                    onClick={handleAiGenerate}
                    disabled={aiGenerating}
                    className="w-12 h-12 rounded-ds-lg flex items-center justify-center transition-all"
                    style={{ background: "#e9846a" }}
                    title="AI 自动生成"
                  >
                    <Sparkles size={18} className={aiGenerating ? "animate-spin text-white/60" : "text-white"} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ds-text mb-1.5 block">个人介绍</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="一句话介绍自己..."
                  rows={3}
                  className="w-full bg-white/60 rounded-ds-lg px-4 py-3 outline-none text-sm resize-none text-ds-text"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: "#f4f0ea", paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
        <div className="flex gap-3">
          {step === 3 && (
            <button
              onClick={handleComplete}
              className="flex-1 h-12 rounded-ds-lg border-2 border-ds-border text-ds-text-subtle text-sm font-medium"
            >
              跳过
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleComplete()}
            disabled={!canNext()}
            className="flex-1 h-12 rounded-ds-lg font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40"
            style={{ background: "white", color: "#e9846a" }}
          >
            {step < 3 ? "下一步" : "进村"}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}