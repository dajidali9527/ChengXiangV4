import { useState } from "react";
import { ChevronLeft, Globe, MessageSquare, Bell, Star, User, Settings as SettingsIcon, LogOut } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
  onAdminOpen: () => void;
  onAccountOpen: () => void;
  onPointsDetailOpen: () => void;
  onLogout: () => void;
}

const LANGUAGES = [
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "en", name: "English" },
];

const PRIVACY_OPTIONS = [
  { value: "all", label: "所有人" },
  { value: "followers", label: "仅关注我的人" },
  { value: "mutual", label: "仅互关用户" },
  { value: "none", label: "不接收私信" },
];

export function SettingsPage({ onBack, onAdminOpen, onAccountOpen, onPointsDetailOpen, onLogout }: SettingsPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("zh-CN");
  const [selectedPrivacy, setSelectedPrivacy] = useState("mutual");
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
  });

  return (
    <div className="flex flex-col h-full bg-ds-bg pb-16">
      <div className="bg-ds-surface px-4 pt-8 pb-4 shadow-ds-soft flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-ds-chip">
          <ChevronLeft size={20} className="text-ds-text" />
        </button>
        <h1 className="text-lg font-bold text-ds-text">设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-ds-surface rounded-ds-lg shadow-ds-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-ds-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-ds-text">
              <Globe size={16} className="text-ds-brand" />
              语言设置
            </div>
          </div>
          <div className="p-4 space-y-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-ds-lg transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-ds-brand/10 border-2 border-ds-brand"
                    : "bg-ds-chip hover:bg-ds-chip/80"
                }`}
              >
                <span className="text-sm text-ds-text">{lang.name}</span>
                {selectedLanguage === lang.code && (
                  <div className="w-5 h-5 rounded-full bg-ds-brand flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg shadow-ds-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-ds-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-ds-text">
              <MessageSquare size={16} className="text-ds-brand" />
              私信权限
            </div>
          </div>
          <div className="p-4 space-y-2">
            {PRIVACY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPrivacy(option.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-ds-lg transition-all ${
                  selectedPrivacy === option.value
                    ? "bg-ds-brand/10 border-2 border-ds-brand"
                    : "bg-ds-chip hover:bg-ds-chip/80"
                }`}
              >
                <span className="text-sm text-ds-text">{option.label}</span>
                {selectedPrivacy === option.value && (
                  <div className="w-5 h-5 rounded-full bg-ds-brand flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg shadow-ds-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-ds-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-ds-text">
              <Bell size={16} className="text-ds-brand" />
              通知设置
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[
              { key: "likes", label: "点赞通知" },
              { key: "comments", label: "评论通知" },
              { key: "follows", label: "关注通知" },
              { key: "messages", label: "消息通知" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm text-ds-text">{label}</span>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof notifications] }))
                  }
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    notifications[key as keyof typeof notifications] ? "bg-ds-brand" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      notifications[key as keyof typeof notifications] ? "right-1" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ds-surface rounded-ds-lg shadow-ds-soft overflow-hidden">
          <button
            onClick={onPointsDetailOpen}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-ds-border active:bg-ds-chip"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Star size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-ds-text">积分明细</p>
              <p className="text-xs text-ds-text-subtle">查看积分获取和消费记录</p>
            </div>
            <ChevronLeft size={16} className="text-ds-text-subtle rotate-180" />
          </button>

          <button
            onClick={onAccountOpen}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-ds-border active:bg-ds-chip"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <User size={18} className="text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-ds-text">账号信息维护</p>
              <p className="text-xs text-ds-text-subtle">编辑个人资料和账号设置</p>
            </div>
            <ChevronLeft size={16} className="text-ds-text-subtle rotate-180" />
          </button>

          <button
            onClick={onAdminOpen}
            className="w-full flex items-center gap-3 px-4 py-4 active:bg-ds-chip"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <SettingsIcon size={18} className="text-purple-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-ds-text">管理后台</p>
              <p className="text-xs text-ds-text-subtle">平台管理功能入口</p>
            </div>
            <ChevronLeft size={16} className="text-ds-text-subtle rotate-180" />
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 rounded-ds-lg text-red-600 text-sm font-medium"
          >
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
