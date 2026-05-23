import { useState } from "react";
import { AppProvider, useApp } from "./store/AppContext";
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

type AuthPage = "login" | "register";
type MainTab = "discover" | "explore" | "community" | "chat" | "my";
type SubPage =
  | "none"
  | "tags"
  | "digital-avatar"
  | "admin";

function MainApp() {
  const { currentUser, logout } = useApp();
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [mainTab, setMainTab] = useState<MainTab>("discover");
  const [subPage, setSubPage] = useState<SubPage>("none");
  const [showPublish, setShowPublish] = useState(false);

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
    return <TagsPage onBack={() => setSubPage("none")} />;
  }
  if (subPage === "digital-avatar") {
    return <DigitalAvatarPage onBack={() => setSubPage("none")} />;
  }
  if (subPage === "admin") {
    return <AdminPage onBack={() => setSubPage("none")} />;
  }

  return (
    <div className="w-full h-screen max-w-md mx-auto relative overflow-hidden bg-ds-bg" style={{ fontFamily: "'PingFang SC', 'Hiragino Sans GB', sans-serif" }}>
      <div className="h-full overflow-hidden flex flex-col">
        {mainTab === "discover" && <DiscoverPage />}
        {mainTab === "explore" && <MapPage />}
        {mainTab === "community" && <CommunityPage />}
        {mainTab === "chat" && <ChatPage />}
        {mainTab === "my" && (
          <MyPage
            onTagsOpen={() => setSubPage("tags")}
            onAvatarOpen={() => setSubPage("digital-avatar")}
            onMapOpen={() => setMainTab("explore")}
            onAdminOpen={() => setSubPage("admin")}
            onLogout={logout}
          />
        )}
      </div>

      <BottomNav
        current={mainTab}
        onChange={setMainTab}
        onPublish={() => setShowPublish(true)}
      />

      {showPublish && (
        <PublishPage onClose={() => setShowPublish(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}