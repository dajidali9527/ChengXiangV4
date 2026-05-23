import { useState, useEffect } from "react";
import { AppProvider, useApp } from "./store/AppContext";
import { I18nProvider } from "./store/I18nContext";
import { BottomNav } from "./components/BottomNav";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { DiscoverPage } from "./components/DiscoverPage";
import { ChatPage } from "./components/ChatPage";
import { PublishPage } from "./components/PublishPage";
import { MyPage } from "./components/MyPage";
import { TagsPage } from "./components/TagsPage";
import { MapPage } from "./components/MapPage";
import { CommunityPage } from "./components/CommunityPage";
import { DigitalAvatarPage } from "./components/DigitalAvatarPage";
import { AdminPage } from "./components/AdminPage";
import { SettingsPage } from "./components/SettingsPage";
import { PointsPage } from "./components/PointsPage";

type AuthPage = "login" | "register";
type MainTab = "discover" | "explore" | "community" | "chat" | "my";
type SubPage =
  | "none"
  | "tags"
  | "digital-avatar"
  | "admin"
  | "settings"
  | "points"
  | "points-detail"
  | "account";

function MainApp() {
  const { currentUser, logout } = useApp();
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [mainTab, setMainTab] = useState<MainTab>("discover");
  const [subPage, setSubPage] = useState<SubPage>("none");
  const [showPublish, setShowPublish] = useState(false);
  const [hideBottomNav, setHideBottomNav] = useState(false);

  const goBack = () => setSubPage("none");

  useEffect(() => {
    if (currentUser) {
      setSubPage("none");
      setMainTab("discover");
      setShowPublish(false);
      setHideBottomNav(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    if (authPage === "login") {
      return (
        <LoginPage
          onSuccess={() => {}}
          onRegister={() => setAuthPage("register")}
        />
      );
    }
    return (
      <RegisterPage
        onComplete={() => {}}
        onBack={() => setAuthPage("login")}
      />
    );
  }

  if (subPage === "tags") {
    return <TagsPage onBack={goBack} />;
  }
  if (subPage === "digital-avatar") {
    return <DigitalAvatarPage onBack={goBack} />;
  }
  if (subPage === "admin") {
    return <AdminPage onBack={goBack} />;
  }
  if (subPage === "settings") {
    return (
      <SettingsPage
        onBack={goBack}
        onAdminOpen={() => setSubPage("admin")}
        onAccountOpen={() => setSubPage("account")}
        onPointsDetailOpen={() => setSubPage("points-detail")}
        onLogout={logout}
      />
    );
  }
  if (subPage === "points") {
    return <PointsPage onBack={goBack} onPointsDetailOpen={() => setSubPage("points-detail")} />;
  }
  if (subPage === "points-detail") {
    return <PointsPage onBack={goBack} onPointsDetailOpen={goBack} />;
  }
  if (subPage === "account") {
    return <TagsPage onBack={goBack} />;
  }

  return (
    <div className="w-full h-screen max-w-md mx-auto relative overflow-hidden bg-ds-bg" style={{ fontFamily: "'PingFang SC', 'Hiragino Sans GB', sans-serif" }}>
      <div className="h-full overflow-hidden flex flex-col">
        {mainTab === "discover" && <DiscoverPage />}
        {mainTab === "explore" && <MapPage />}
        {mainTab === "community" && <CommunityPage />}
        {mainTab === "chat" && <ChatPage onToggleBottomNav={setHideBottomNav} />}
        {mainTab === "my" && (
          <MyPage
            onTagsOpen={() => setSubPage("tags")}
            onAvatarOpen={() => setSubPage("digital-avatar")}
            onSettingsOpen={() => setSubPage("settings")}
            onPointsOpen={() => setSubPage("points")}
          />
        )}
      </div>

      {!hideBottomNav && <BottomNav
        current={mainTab}
        onChange={setMainTab}
        onPublish={() => setShowPublish(true)}
      />}

      {showPublish && (
        <PublishPage onClose={() => setShowPublish(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </I18nProvider>
  );
}