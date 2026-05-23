import { useState } from "react";
import { ChevronLeft, Sparkles, Bot, Database, ToggleLeft, ToggleRight, ChevronDown, Info } from "lucide-react";

interface DigitalAvatarPageProps {
  onBack: () => void;
}

const AI_MODELS = [
  { id: "openrouter", label: "OpenRouter", sub: "多模型聚合 · GPT-4/Claude/Gemini" },
  { id: "aliyun", label: "阿里云百炼", sub: "国内稳定 · 通义千问系列" },
];

export function DigitalAvatarPage({ onBack }: DigitalAvatarPageProps) {
  const [enabled, setEnabled] = useState(false);
  const [aiName, setAiName] = useState("乡野助手");
  const [aiDesc, setAiDesc] = useState("我是您的城乡生活数字分身，可以代替您回答关于农场、民宿、活动的问题。");
  const [selectedModel, setSelectedModel] = useState("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [knowledge, setKnowledge] = useState<string[]>(["我的农场介绍.pdf", "活动FAQ.txt"]);
  const [autoReply, setAutoReply] = useState(true);
  const [prompt, setPrompt] = useState("你是一个友善的城乡体验助手，专注于回答有机农场、乡村民宿和户外活动相关的问题。如果问题超出你的知识范围，请礼貌地说明人不在，稍后再回复。");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [testMsg, setTestMsg] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [testing, setTesting] = useState(false);

  const handleTest = () => {
    if (!testMsg.trim()) return;
    setTesting(true);
    setTimeout(() => {
      setTestResponse(`您好！我是${aiName}。关于"${testMsg}"，根据我的知识库，我可以为您提供以下信息：这是一个很有意思的问题，我们的农场/民宿相关活动非常丰富，欢迎进一步了解！`);
      setTesting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-ds-bg">
      <div className="bg-ds-surface px-4 pt-8 pb-4 shadow-ds-soft">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-ds-chip flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          <h1 className="font-bold text-lg text-ds-text flex-1">数字分身配置</h1>
          <button className="px-4 py-1.5 rounded-full text-sm font-bold bg-ds-brand text-white">
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="bg-ds-surface rounded-ds-lg p-4 flex items-center gap-4 shadow-ds-soft">
          <div className="w-12 h-12 rounded-ds-lg flex items-center justify-center bg-ds-brand">
            <Bot size={24} className="text-ds-text" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-ds-text">开启数字分身</p>
            <p className="text-xs text-ds-text-subtle mt-0.5">开启后 AI 将代替你自动回复访客消息</p>
          </div>
          <button onClick={() => setEnabled(!enabled)}>
            {enabled
              ? <ToggleRight size={32} className="text-ds-brand" />
              : <ToggleLeft size={32} className="text-ds-text-subtle" />}
          </button>
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex flex-col gap-3 shadow-ds-soft">
          <p className="font-semibold text-sm text-ds-text">分身身份</p>
          <div>
            <label className="text-xs text-ds-text-subtle mb-1 block">AI 名称</label>
            <div className="flex gap-2">
              <input
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                className="flex-1 bg-ds-surface-soft rounded-xl px-3 h-10 outline-none text-sm text-ds-text"
              />
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-ds-brand">
                <Sparkles size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-ds-text-subtle mb-1 block">分身介绍</label>
            <textarea
              value={aiDesc}
              onChange={(e) => setAiDesc(e.target.value)}
              rows={2}
              className="w-full bg-ds-surface-soft rounded-xl px-3 py-2.5 outline-none text-sm resize-none text-ds-text"
            />
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex flex-col gap-3 shadow-ds-soft">
          <p className="font-semibold text-sm text-ds-text">AI 模型</p>
          <button
            onClick={() => setShowModelPicker(true)}
            className="flex items-center justify-between bg-ds-surface-soft rounded-xl px-4 h-12"
          >
            <div className="text-left">
              <p className="text-sm font-medium text-ds-text">{AI_MODELS.find((m) => m.id === selectedModel)?.label}</p>
              <p className="text-xs text-ds-text-subtle">{AI_MODELS.find((m) => m.id === selectedModel)?.sub}</p>
            </div>
            <ChevronDown size={16} className="text-ds-text-subtle" />
          </button>
          <div>
            <label className="text-xs text-ds-text-subtle mb-1 block">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入 API 密钥"
              className="w-full bg-ds-surface-soft rounded-xl px-3 h-10 outline-none text-sm text-ds-text"
            />
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex flex-col gap-3 shadow-ds-soft">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-ds-text">角色设定 (Prompt)</p>
            <Info size={14} className="text-ds-text-subtle" />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full bg-ds-surface-soft rounded-xl px-3 py-2.5 outline-none text-sm resize-none text-ds-text"
            placeholder="描述你的 AI 分身应该如何表现..."
          />
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex flex-col gap-3 shadow-ds-soft">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-ds-text-muted" />
            <p className="font-semibold text-sm text-ds-text">知识库</p>
          </div>
          <div className="flex flex-col gap-2">
            {knowledge.map((doc) => (
              <div key={doc} className="flex items-center justify-between bg-ds-surface-soft rounded-xl px-3 h-10">
                <span className="text-sm text-ds-text-muted">📄 {doc}</span>
                <button className="text-xs text-red-400">删除</button>
              </div>
            ))}
            <button className="h-10 rounded-xl border-2 border-dashed border-ds-border text-sm text-ds-text-subtle flex items-center justify-center gap-1">
              + 上传文件 (PDF / TXT / MD)
            </button>
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex items-center gap-4 shadow-ds-soft">
          <div className="flex-1">
            <p className="font-semibold text-sm text-ds-text">自动回复托管</p>
            <p className="text-xs text-ds-text-subtle mt-0.5">超出知识范围时提示"人不在，稍后回复"</p>
          </div>
          <button onClick={() => setAutoReply(!autoReply)}>
            {autoReply
              ? <ToggleRight size={32} className="text-ds-brand" />
              : <ToggleLeft size={32} className="text-ds-text-subtle" />}
          </button>
        </div>

        <div className="bg-ds-surface rounded-ds-lg p-4 flex flex-col gap-3 shadow-ds-soft">
          <p className="font-semibold text-sm text-ds-text">测试对话</p>
          <div className="flex gap-2">
            <input
              value={testMsg}
              onChange={(e) => setTestMsg(e.target.value)}
              placeholder="输入一条测试消息..."
              className="flex-1 bg-ds-surface-soft rounded-xl px-3 h-10 outline-none text-sm text-ds-text"
            />
            <button
              onClick={handleTest}
              disabled={testing || !testMsg.trim()}
              className="px-4 h-10 rounded-xl text-sm font-bold bg-ds-brand text-white disabled:opacity-40"
            >
              {testing ? "..." : "发送"}
            </button>
          </div>
          {testResponse && (
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Bot size={13} className="text-purple-500" />
                <span className="text-xs font-semibold text-purple-600">{aiName}</span>
              </div>
              <p className="text-sm text-gray-700">{testResponse}</p>
            </div>
          )}
        </div>
      </div>

      {showModelPicker && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModelPicker(false)}>
          <div className="w-full bg-ds-surface rounded-t-ds-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-ds-text mb-4">选择 AI 模型</h3>
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => { setSelectedModel(model.id); setShowModelPicker(false); }}
                className={`w-full flex items-center justify-between p-4 rounded-ds-lg mb-2 transition-all ${
                  selectedModel === model.id
                    ? "bg-ds-brand/10 border-2 border-ds-brand"
                    : "bg-ds-chip border-2 border-transparent"
                }`}
              >
                <div className="text-left">
                  <p className="font-semibold text-sm text-ds-text">{model.label}</p>
                  <p className="text-xs text-ds-text-subtle">{model.sub}</p>
                </div>
                {selectedModel === model.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-ds-brand">
                    <span className="text-xs font-bold text-ds-text">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}