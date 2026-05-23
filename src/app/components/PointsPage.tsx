import { useState } from "react";
import { ChevronLeft, Star, Gift, Zap, Coins, ShoppingBag } from "lucide-react";

const POINTS_HISTORY = [
  { id: 1, title: "完成每日签到", points: 10, type: "earn", date: "2026-05-23" },
  { id: 2, title: "发布优质内容", points: 50, type: "earn", date: "2026-05-22" },
  { id: 3, title: "邀请好友加入", points: 100, type: "earn", date: "2026-05-20" },
  { id: 4, title: "兑换帆布包", points: -200, type: "spend", date: "2026-05-18" },
  { id: 5, title: "完成任务", points: 20, type: "earn", date: "2026-05-15" },
];

const PRODUCTS = [
  { id: 1, name: "定制帆布包", points: 200, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "乡村主题定制帆布包" },
  { id: 2, name: "手工笔记本", points: 150, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "传统工艺手工笔记本" },
  { id: 3, name: "环保水杯", points: 180, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "可持续环保水杯" },
  { id: 4, name: "文化明信片", points: 50, image: "https://images.unsplash.com/photo-1544716278-e513176f20b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "精美乡村风景明信片" },
  { id: 5, name: "手工钥匙扣", points: 80, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "传统手工艺钥匙扣" },
  { id: 6, name: "特色徽章", points: 60, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=400", description: "乡村文化主题徽章" },
];

interface PointsPageProps {
  onBack: () => void;
  onPointsDetailOpen: () => void;
}

export function PointsPage({ onBack, onPointsDetailOpen }: PointsPageProps) {
  const [currentPoints, setCurrentPoints] = useState(340);
  const [activeTab, setActiveTab] = useState<"products" | "history">("products");

  const handleRedeem = (product: typeof PRODUCTS[0]) => {
    if (currentPoints >= product.points) {
      setCurrentPoints(currentPoints - product.points);
      alert(`成功兑换 ${product.name}！`);
    } else {
      alert("积分不足！");
    }
  };

  return (
    <div className="flex flex-col h-full bg-ds-bg pb-16">
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 pt-8 pb-6 px-5 relative">
        <button onClick={onBack} className="absolute top-8 left-4 w-9 h-9 rounded-full bg-black/20 backdrop-blur flex items-center justify-center">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm mb-1">
            <Coins size={16} />
            <span>我的积分</span>
          </div>
          <div className="text-white text-4xl font-bold mb-2">{currentPoints.toLocaleString()}</div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onPointsDetailOpen} className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold bg-white/20 text-white">
              <Star size={14} /> 积分明细
            </button>
            <button className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold bg-white text-orange-600">
              <Gift size={14} /> 赚积分
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex bg-ds-chip rounded-ds-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
              activeTab === "products"
                ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                : "text-ds-text-subtle"
            }`}
          >
            <ShoppingBag size={14} className="inline mr-1" />
            文创产品
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 h-9 rounded-xl text-xs font-medium transition-all ${
              activeTab === "history"
                ? "bg-ds-surface text-ds-text font-bold shadow-sm"
                : "text-ds-text-subtle"
            }`}
          >
            <Zap size={14} className="inline mr-1" />
            积分记录
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {activeTab === "products" ? (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="bg-ds-surface rounded-ds-xl overflow-hidden shadow-ds-soft">
                <div className="aspect-square bg-ds-chip">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-ds-text mb-1">{product.name}</h3>
                  <p className="text-xs text-ds-text-subtle mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                      <Star size={14} fill="currentColor" />
                      {product.points}
                    </div>
                    <button
                      onClick={() => handleRedeem(product)}
                      disabled={currentPoints < product.points}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        currentPoints >= product.points
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      兑换
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {POINTS_HISTORY.map((item) => (
              <div key={item.id} className="bg-ds-surface rounded-ds-lg p-4 shadow-ds-soft flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-ds-text">{item.title}</div>
                  <div className="text-xs text-ds-text-subtle mt-1">{item.date}</div>
                </div>
                <div className={`font-bold text-sm ${item.type === "earn" ? "text-green-600" : "text-red-500"}`}>
                  {item.type === "earn" ? "+" : ""}{item.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
