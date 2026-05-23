import { useState, useRef, useEffect } from "react";
import { Phone, Mail, ChevronRight, Eye, EyeOff, LogIn, ChevronDown } from "lucide-react";
import { useApp } from "../store/AppContext";
import { DEMO_USERS } from "../data/users";

interface LoginPageProps {
  onSuccess: () => void;
  onRegister: () => void;
}

export function LoginPage({ onSuccess, onRegister }: LoginPageProps) {
  const { login } = useApp();
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [showPwd, setShowPwd] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    const foundUser = DEMO_USERS.find((u) => u.password === password && (mode === "phone" ? phone.length > 0 : email.length > 0));
    if (foundUser) {
      login(foundUser.id);
      onSuccess();
    }
  };

  useEffect(() => {
    if (!showDemoDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDemoDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDemoDropdown]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f4f0ea" }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <img
          src="/images/ChengXiangLOGO2.png"
          alt="城乡"
          className="w-96 mb-6"
        />
      </div>

      <div className="px-6 pb-10 flex flex-col gap-4 relative">
        <div className="flex gap-6 mb-1">
          {(["phone", "email"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-sm pb-1.5 transition-all ${
                mode === m
                  ? "text-ds-text font-bold border-b-2 border-ds-brand"
                  : "text-ds-text-subtle border-b-2 border-transparent"
              }`}
            >
              {m === "phone" ? "手机号登录" : "邮箱登录"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {mode === "phone" ? (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-2 bg-ds-surface-soft rounded-ds-lg px-4 h-12">
                <Phone size={16} className="text-ds-text-subtle shrink-0" />
                <span className="text-ds-text-subtle text-sm border-r border-ds-border pr-2 mr-1">+86</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="flex-1 bg-transparent outline-none text-sm text-ds-text"
                />
                <button
                  onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                  className={`shrink-0 p-1 rounded-md transition-all ${showDemoDropdown ? "bg-ds-brand/20" : "hover:bg-ds-chip"}`}
                >
                  <ChevronDown size={16} className={`text-ds-text-subtle transition-transform ${showDemoDropdown ? "rotate-180" : ""}`} />
                </button>
              </div>
              {showDemoDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-ds-lg shadow-xl border border-ds-border z-50 max-h-56 overflow-y-auto">
                  <div className="p-2">
                    <div className="grid grid-cols-5 gap-1">
                      {DEMO_USERS.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => { login(user.id); onSuccess(); }}
                          className="flex flex-col items-center gap-0.5 p-1.5 rounded-ds-md hover:bg-ds-chip transition-all active:scale-90"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-ds-border"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <span className="text-[8px] text-ds-text-muted leading-tight text-center truncate w-full">{user.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-ds-surface-soft rounded-ds-lg px-4 h-12">
              <Mail size={16} className="text-ds-text-subtle shrink-0" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱"
                className="flex-1 bg-transparent outline-none text-sm text-ds-text"
              />
            </div>
          )}
          <div className="flex items-center gap-2 bg-ds-surface-soft rounded-ds-lg px-4 h-12">
            <button onClick={() => setShowPwd(!showPwd)} className="shrink-0">
              {showPwd ? <Eye size={16} className="text-ds-text-subtle" /> : <EyeOff size={16} className="text-ds-text-subtle" />}
            </button>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="演示账号密码: 123"
              className="flex-1 bg-transparent outline-none text-sm text-ds-text"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full h-12 rounded-ds-lg font-bold text-base text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{ background: "white", color: "#e9846a" }}
        >
          <LogIn size={18} />
          进村
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-ds-border" />
          <span className="text-ds-text-subtle text-xs">第三方登录</span>
          <div className="flex-1 h-px bg-ds-border" />
        </div>

        <div className="flex justify-center gap-5">
          {["微信", "小红书", "抖音"].map((label) => (
            <button
              key={label}
              onClick={() => {}}
              className="text-sm text-ds-text-subtle hover:text-ds-text transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-1 mt-1">
          <span className="text-ds-text-subtle text-sm">还没有账号？</span>
          <button onClick={onRegister} className="text-sm font-semibold flex items-center gap-0.5" style={{ color: "#e9846a" }}>
            立即注册 <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}