export type Locale = "zh-CN" | "zh-TW" | "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  "en": "English",
};

type TranslationSet = Record<string, string>;
type TranslationsMap = Record<Locale, TranslationSet>;

export const translations: TranslationsMap = {
  "zh-CN": {
    "login.phone": "手机号登录",
    "login.email": "邮箱登录",
    "login.phone_placeholder": "请输入手机号",
    "login.email_placeholder": "请输入邮箱",
    "login.password_placeholder": "演示账号密码: 123",
    "login.submit": "进村",
    "login.third_party": "第三方登录",
    "login.no_account": "还没有账号？",
    "login.register": "立即注册",
    "login.wechat": "微信",
    "login.xiaohongshu": "小红书",
    "login.douyin": "抖音",
  },
  "zh-TW": {
    "login.phone": "手機號登錄",
    "login.email": "郵箱登錄",
    "login.phone_placeholder": "請輸入手機號",
    "login.email_placeholder": "請輸入郵箱",
    "login.password_placeholder": "演示賬號密碼: 123",
    "login.submit": "進村",
    "login.third_party": "第三方登錄",
    "login.no_account": "還沒有賬號？",
    "login.register": "立即註冊",
    "login.wechat": "微信",
    "login.xiaohongshu": "小紅書",
    "login.douyin": "抖音",
  },
  "en": {
    "login.phone": "Phone Login",
    "login.email": "Email Login",
    "login.phone_placeholder": "Enter phone number",
    "login.email_placeholder": "Enter email",
    "login.password_placeholder": "Demo password: 123",
    "login.submit": "Enter Village",
    "login.third_party": "Third-party Login",
    "login.no_account": "No account yet?",
    "login.register": "Register Now",
    "login.wechat": "WeChat",
    "login.xiaohongshu": "Xiaohongshu",
    "login.douyin": "Douyin",
  },
};