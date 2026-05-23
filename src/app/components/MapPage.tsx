import { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, X, Users, Star, Map, List, Heart, MessageSquare, Share2, Bookmark, ChevronLeft, Calendar, Clock, UserPlus, Search, ChevronRight } from "lucide-react";
import { useApp } from "../store/AppContext";

interface MapPageProps {
  onBack?: () => void;
}

const TDT_KEY = "7631ffaa84e90481b8410619225d1e03";

const TYPE_ICONS: Record<string, string> = {
  farm: "/icons/farm.jpg",
  homestay: "/icons/homestay.jpg",
  hiking: "/icons/hiking.jpg",
  activity: "/icons/activity.jpg",
  community: "/icons/community.jpg",
  food: "/icons/food.jpg",
};

const MAP_POINTS = [
  { id: 1, lng: 119.963, lat: 30.522, type: "farm", label: "云端有机农场", user: "李晓农", tag: "有机农场主理人", distance: "0.8km", rating: 4.9 },
  { id: 2, lng: 119.980, lat: 30.511, type: "homestay", label: "漓江边·悦民宿", user: "村委王静", tag: "民宿主理人", distance: "1.2km", rating: 4.7 },
  { id: 3, lng: 120.003, lat: 30.541, type: "activity", label: "峨眉山徒步营", user: "山野探索队", tag: "活动发起人", distance: "2.1km", rating: 4.8 },
  { id: 4, lng: 119.972, lat: 30.552, type: "user", label: "张数游", user: "张数游", tag: "数字游民", distance: "0.3km", rating: 0 },
  { id: 5, lng: 119.952, lat: 30.533, type: "community", label: "竹林数字村", user: "社区", tag: "村镇管理员", distance: "3.4km", rating: 4.6 },
  { id: 6, lng: 119.945, lat: 30.505, type: "farm", label: "莫干山茶园", user: "陈然然", tag: "在地新村民", distance: "2.5km", rating: 4.5 },
  { id: 7, lng: 119.990, lat: 30.560, type: "homestay", label: "山间·隐民宿", user: "林泽宇", tag: "民宿主理人", distance: "1.8km", rating: 4.8 },
  { id: 8, lng: 116.407, lat: 39.904, type: "community", label: "京郊·温榆河生态村", user: "社区", tag: "村镇管理员", distance: "25km", rating: 4.3 },
  { id: 9, lng: 121.473, lat: 31.230, type: "user", label: "沪上数字游民", user: "周梦瑶", tag: "数字游民", distance: "0km", rating: 0 },
  { id: 10, lng: 113.264, lat: 23.129, type: "farm", label: "从化荔枝园", user: "黄俊杰", tag: "有机农场主理人", distance: "60km", rating: 4.6 },
  { id: 11, lng: 114.057, lat: 22.543, type: "homestay", label: "大鹏半岛·海舍民宿", user: "郑雅文", tag: "民宿主理人", distance: "45km", rating: 4.8 },
  { id: 12, lng: 104.066, lat: 30.572, type: "activity", label: "川西高原骑行营", user: "山野探索队", tag: "活动发起人", distance: "120km", rating: 4.9 },
  { id: 13, lng: 106.551, lat: 29.563, type: "farm", label: "武陵山有机菜园", user: "吴天宇", tag: "有机农场主理人", distance: "80km", rating: 4.4 },
  { id: 14, lng: 108.939, lat: 34.341, type: "community", label: "秦岭·终南山居", user: "社区", tag: "村镇管理员", distance: "40km", rating: 4.7 },
  { id: 15, lng: 102.712, lat: 25.040, type: "homestay", label: "大理·苍山脚下", user: "钱一鸣", tag: "民宿主理人", distance: "5km", rating: 4.9 },
  { id: 16, lng: 100.233, lat: 26.872, type: "activity", label: "丽江古城慢行", user: "孙雪晴", tag: "活动发起人", distance: "2km", rating: 4.5 },
  { id: 17, lng: 110.350, lat: 25.274, type: "farm", label: "桂林·龙脊梯田", user: "朱浩宇", tag: "在地新村民", distance: "70km", rating: 4.8 },
  { id: 18, lng: 117.283, lat: 31.861, type: "user", label: "合肥创客", user: "马晓晨", tag: "数字游民", distance: "0km", rating: 0 },
  { id: 19, lng: 120.153, lat: 30.287, type: "community", label: "杭州·良渚文化村", user: "社区", tag: "村镇管理员", distance: "15km", rating: 4.9 },
  { id: 20, lng: 118.796, lat: 32.060, type: "homestay", label: "南京·紫金山房", user: "胡雨涵", tag: "民宿主理人", distance: "8km", rating: 4.6 },
  { id: 21, lng: 114.305, lat: 30.593, type: "farm", label: "武汉·江夏田园", user: "何诗涵", tag: "有机农场主理人", distance: "30km", rating: 4.3 },
  { id: 22, lng: 112.982, lat: 28.194, type: "activity", label: "长沙·岳麓山徒步", user: "郭子豪", tag: "活动发起人", distance: "3km", rating: 4.7 },
  { id: 23, lng: 103.834, lat: 36.061, type: "homestay", label: "兰州·黄河古道民宿", user: "高婉清", tag: "民宿主理人", distance: "10km", rating: 4.4 },
  { id: 24, lng: 87.617, lat: 43.792, type: "community", label: "乌鲁木齐·南山牧歌", user: "社区", tag: "村镇管理员", distance: "50km", rating: 4.5 },
  { id: 25, lng: 91.118, lat: 29.653, type: "activity", label: "拉萨·转山朝圣", user: "罗明辉", tag: "活动发起人", distance: "200km", rating: 4.9 },
  { id: 26, lng: 126.535, lat: 45.802, type: "farm", label: "哈尔滨·松花江农场", user: "梁思源", tag: "有机农场主理人", distance: "20km", rating: 4.2 },
  { id: 27, lng: 123.429, lat: 41.796, type: "user", label: "沈阳手艺人", user: "宋佳怡", tag: "在地新村民", distance: "0km", rating: 0 },
  { id: 28, lng: 117.000, lat: 36.675, type: "homestay", label: "泰山·山腰小院", user: "唐志豪", tag: "民宿主理人", distance: "5km", rating: 4.7 },
  { id: 29, lng: 115.892, lat: 28.676, type: "farm", label: "南昌·鄱阳湖渔庄", user: "韩雨桐", tag: "有机农场主理人", distance: "40km", rating: 4.5 },
  { id: 30, lng: 106.713, lat: 26.578, type: "community", label: "贵阳·青岩古镇", user: "社区", tag: "村镇管理员", distance: "30km", rating: 4.6 },
  { id: 31, lng: 108.320, lat: 22.824, type: "activity", label: "南宁·大明山露营", user: "冯晓峰", tag: "活动发起人", distance: "60km", rating: 4.4 },
  { id: 32, lng: 110.350, lat: 20.020, type: "homestay", label: "海口·火山口民宿", user: "董美玲", tag: "民宿主理人", distance: "15km", rating: 4.8 },
  { id: 33, lng: 125.324, lat: 43.886, type: "farm", label: "长春·黑土地农庄", user: "袁文博", tag: "有机农场主理人", distance: "25km", rating: 4.3 },
  { id: 34, lng: 111.670, lat: 40.818, type: "user", label: "呼和浩特牧民", user: "邓佳慧", tag: "在地新村民", distance: "0km", rating: 0 },
  { id: 35, lng: 101.778, lat: 36.617, type: "community", label: "西宁·青海湖畔", user: "社区", tag: "村镇管理员", distance: "80km", rating: 4.8 },
  { id: 36, lng: 109.498, lat: 18.257, type: "activity", label: "荒野高尔夫", user: "海岛运动俱乐部", tag: "活动发起人", distance: "15km", rating: 4.7 },
  { id: 37, lng: 117.020, lat: 36.670, type: "activity", label: "陶艺手工捏泥·做陶罐", user: "泥巴工坊", tag: "手工达人", distance: "8km", rating: 4.8 },
  { id: 38, lng: 117.020, lat: 36.690, type: "activity", label: "陶瓷工艺学培训", user: "瓷都研学社", tag: "非遗传承人", distance: "10km", rating: 4.6 },
  { id: 39, lng: 116.410, lat: 39.920, type: "activity", label: "旅游学·健康学学术探讨", user: "城乡研究院", tag: "学术组织", distance: "5km", rating: 4.5 },
  { id: 40, lng: 121.480, lat: 31.240, type: "activity", label: "减肥健美训练营", user: "活力健身社", tag: "健身教练", distance: "3km", rating: 4.4 },
  { id: 41, lng: 106.560, lat: 29.570, type: "activity", label: "推拿按摩·疗愈疗养规划", user: "山居疗养院", tag: "疗愈师", distance: "20km", rating: 4.9 },
];

const TYPE_COLORS: Record<string, string> = {
  farm: "#C8FF00",
  homestay: "#FF8C42",
  activity: "#4ECDC4",
  user: "#A18CD1",
  community: "#FF6B6B",
  hiking: "#7C72FF",
  food: "#FF9800",
};

const TYPE_EMOJIS: Record<string, string> = {
  farm: "🌾",
  homestay: "🏡",
  activity: "⛺",
  user: "👤",
  community: "🏘️",
  hiking: "🥾",
  food: "🍜",
};

const TYPE_LABELS: Record<string, string> = {
  farm: "农场",
  homestay: "民宿",
  activity: "活动",
  user: "用户",
  community: "社区",
  hiking: "徒步",
  food: "美食",
};

const TAGS = ["推荐", "农场", "民宿", "徒步", "活动", "社区", "美食", "手工"];

const POSTS = [
  {
    id: 1,
    title: "云端有机农场认领",
    type: "farm" as const,
    user: { name: "李晓农", avatar: "🧑‍🌾", tag: "有机农场主理人", location: "浙江·德清" },
    content: "云端有机农场正式开放认领！25亩梯田，种大米、蔬菜，年度认领名额有限，欢迎同频伙伴~",
    img: "https://images.unsplash.com/photo-1761908106045-5c03daf33014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["农场", "认领", "有机"],
    likes: 234, comments: 45, bookmarks: 89, time: "2h前",
    lng: 119.963, lat: 30.522,
  },
  {
    id: 2,
    title: "莫干山古村徒步探索",
    type: "hiking" as const,
    user: { name: "张数游", avatar: "💻", tag: "数字游民", location: "云南·大理" },
    content: "莫干山徒步三天，沿途发现了一个几乎被遗忘的古村落。分享给同样热爱探索的你们。",
    img: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["徒步", "古村", "探索"],
    likes: 567, comments: 78, bookmarks: 145, time: "5h前",
    lng: 100.233, lat: 26.872,
  },
  {
    id: 3,
    title: "漓江边民宿合伙人招募",
    type: "homestay" as const,
    user: { name: "村委王静", avatar: "🏡", tag: "村镇管理员", location: "广西·阳朔" },
    content: "【招募】民宿主理人正在寻找合伙人！具备设计或运营经验优先，坐落于漓江边，风景极佳。",
    img: "https://images.unsplash.com/photo-1758980417540-aca340a47be4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["民宿", "合伙人", "漓江"],
    likes: 312, comments: 91, bookmarks: 203, time: "1d前",
    lng: 110.350, lat: 25.274,
  },
  {
    id: 4,
    title: "亲子农场·乡村生态课堂",
    type: "farm" as const,
    user: { name: "陈然然", avatar: "🎨", tag: "在地新村民", location: "福建·武夷山" },
    content: "周末亲子农场体验·乡村生态课堂开课啦！带孩子认识二十四节气，感受真实的田园生活。",
    img: "https://images.unsplash.com/photo-1776653097012-8eca4145b7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["亲子", "农场", "节气"],
    likes: 445, comments: 67, bookmarks: 178, time: "2d前",
    lng: 118.033, lat: 27.756,
  },
  {
    id: 5,
    title: "峨眉山深度徒步7日",
    type: "hiking" as const,
    user: { name: "山野徒步队", avatar: "🧗", tag: "活动发起人", location: "四川·峨眉" },
    content: "五月出行·峨眉山深度徒步7日，寻访隐秘寺庙，10人小队名额开放，感兴趣速报名！",
    img: "https://images.unsplash.com/photo-1634093870823-f0fd787de005?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["徒步", "出行", "报名中"],
    likes: 189, comments: 34, bookmarks: 92, time: "3d前",
    isActivity: true,
    lng: 103.332, lat: 29.599,
  },
  {
    id: 6,
    title: "夏季蔬菜采摘节",
    type: "farm" as const,
    user: { name: "李晓农", avatar: "🧑‍🌾", tag: "有机农场主理人", location: "安徽·黄山" },
    content: "夏季蔬菜采摘节开始啦！体验有机蔬菜采摘，了解有机农业知识，品尝新鲜农家美食。亲子家庭优先，可获得有机食材大礼包~",
    img: "https://images.unsplash.com/photo-1744659750204-87034350eec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["采摘", "亲子", "有机", "农场"],
    likes: 312, comments: 56, bookmarks: 134, time: "4h前",
    isActivity: true,
    lng: 118.168, lat: 30.119,
  },
  {
    id: 7,
    title: "哈尼梯田摄影研学营",
    type: "activity" as const,
    user: { name: "钱一鸣", avatar: "📷", tag: "活动发起人", location: "云南·元阳" },
    content: "哈尼梯田摄影研学营，专业摄影师带队，在哈尼梯田拍摄日出、云海壮景。名额有限，速来报名！",
    img: "https://images.unsplash.com/photo-1778595478564-89642cb79f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["摄影", "梯田", "民族文化", "日出"],
    likes: 478, comments: 89, bookmarks: 201, time: "1d前",
    isActivity: true,
    lng: 102.835, lat: 23.219,
  },
  {
    id: 8,
    title: "竹林禅修·身心疗愈营",
    type: "activity" as const,
    user: { name: "周梦瑶", avatar: "🧘", tag: "民宿主理人", location: "浙江·杭州" },
    content: "竹林禅修·身心疗愈营，在竹林溪边体验冥想禅修，放松身心，重新找回内心的平静。",
    img: "https://images.unsplash.com/photo-1760532860957-9e77d97f6b9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["禅修", "瑜伽", "自然疗愈", "减压"],
    likes: 256, comments: 43, bookmarks: 167, time: "2d前",
    isActivity: true,
    lng: 120.153, lat: 30.287,
  },
  {
    id: 9,
    title: "客家美食烹饪工坊",
    type: "food" as const,
    user: { name: "郭子豪", avatar: "👨‍🍳", tag: "活动发起人", location: "广东·梅州" },
    content: "客家美食烹饪工坊，跟随客家老师傅学习传统客家菜肴，酿豆腐、盐焗鸡、梅菜扣肉一次学会！",
    img: "https://images.unsplash.com/photo-1510158116705-876a58899622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["客家美食", "烹饪", "非遗", "文化"],
    likes: 389, comments: 72, bookmarks: 198, time: "3d前",
    isActivity: true,
    lng: 116.117, lat: 24.288,
  },
  {
    id: 10,
    title: "传统农耕文化体验节",
    type: "farm" as const,
    user: { name: "何诗涵", avatar: "🌱", tag: "有机农场主理人", location: "四川·成都" },
    content: "传统农耕文化体验节，体验传统农耕方式，参与春耕秋收，感受千年农耕文明的魅力。",
    img: "https://images.unsplash.com/photo-1771019992489-ec20f95ac42d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["农耕", "文化节", "家庭", "传统"],
    likes: 267, comments: 51, bookmarks: 112, time: "5d前",
    isActivity: true,
    lng: 104.066, lat: 30.572,
  },
  {
    id: 11,
    title: "荒野高尔夫体验",
    type: "activity" as const,
    user: { name: "海岛运动俱乐部", avatar: "⛳", tag: "活动发起人", location: "海南·三亚" },
    content: "在原始荒野中挥杆！天然草坪球场，山海之间，体验最纯粹的高尔夫乐趣。适合初学者和资深球友，专业教练全程指导。",
    img: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["高尔夫", "运动", "户外", "海南"],
    likes: 356, comments: 67, bookmarks: 189, time: "6h前",
    isActivity: true,
    lng: 109.498, lat: 18.257,
  },
  {
    id: 12,
    title: "陶艺手工捏泥·做陶罐",
    type: "activity" as const,
    user: { name: "泥巴工坊", avatar: "🏺", tag: "手工达人", location: "山东·淄博" },
    content: "亲手捏泥做陶罐！从揉泥到拉坯，从修坯到上釉，体验完整的陶艺制作流程。作品可带走，感受泥土在指尖的温度。",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["陶艺", "手工", "非遗", "体验"],
    likes: 423, comments: 89, bookmarks: 234, time: "1d前",
    isActivity: true,
    lng: 117.020, lat: 36.670,
  },
  {
    id: 13,
    title: "陶瓷工艺学培训",
    type: "activity" as const,
    user: { name: "瓷都研学社", avatar: "🫖", tag: "非遗传承人", location: "江西·景德镇" },
    content: "系统学习陶瓷工艺学，从原料选取到烧成技术，由国家级非遗传承人亲授。结业颁发证书，优秀学员可推荐就业。",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["陶瓷", "工艺", "培训", "非遗"],
    likes: 289, comments: 45, bookmarks: 167, time: "2d前",
    isActivity: true,
    lng: 117.020, lat: 36.690,
  },
  {
    id: 14,
    title: "旅游学·健康学学术探讨",
    type: "activity" as const,
    user: { name: "城乡研究院", avatar: "📚", tag: "学术组织", location: "北京·海淀" },
    content: "邀请旅游学与健康学领域专家，围绕乡村旅游与健康养生的融合发展进行深度研讨。欢迎学者、从业者参加交流。",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["学术", "旅游学", "健康学", "研讨"],
    likes: 178, comments: 34, bookmarks: 123, time: "3d前",
    isActivity: true,
    lng: 116.410, lat: 39.920,
  },
  {
    id: 15,
    title: "减肥健美训练营",
    type: "activity" as const,
    user: { name: "活力健身社", avatar: "💪", tag: "健身教练", location: "上海·浦东" },
    content: "科学减脂塑形，专业教练一对一指导。结合乡村自然环境，户外跑步+力量训练+饮食规划，21天见证蜕变！",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["健美", "减肥", "训练", "健康"],
    likes: 567, comments: 123, bookmarks: 289, time: "4d前",
    isActivity: true,
    lng: 121.480, lat: 31.240,
  },
  {
    id: 16,
    title: "推拿按摩·疗愈疗养规划",
    type: "activity" as const,
    user: { name: "山居疗养院", avatar: "🧖", tag: "疗愈师", location: "重庆·武隆" },
    content: "专业推拿按摩+个性化疗养方案规划。在山间天然氧吧中，体验中医推拿、芳香疗法、冥想放松，身心全面修复。",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800",
    tags: ["推拿", "按摩", "疗愈", "疗养"],
    likes: 445, comments: 98, bookmarks: 256, time: "5d前",
    isActivity: true,
    lng: 106.560, lat: 29.570,
  },
];

function loadTdtScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).T) { resolve(); return; }
    const existing = document.querySelector('script[src*="api.tianditu.gov.cn"]');
    if (existing) {
      const check = setInterval(() => { if ((window as any).T) { clearInterval(check); resolve(); } }, 100);
      return;
    }
    const script = document.createElement("script");
    script.src = `http://api.tianditu.gov.cn/api?v=4.0&tk=${TDT_KEY}`;
    script.type = "text/javascript";
    script.onload = () => {
      const check = setInterval(() => { if ((window as any).T) { clearInterval(check); resolve(); } }, 100);
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

export function MapPage({ onBack }: MapPageProps) {
  const { currentUser } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<typeof MAP_POINTS[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showFeed, setShowFeed] = useState(false);
  const [activeTag, setActiveTag] = useState("推荐");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [detailPost, setDetailPost] = useState<typeof POSTS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;
  const filters = ["all", "farm", "homestay", "activity", "user", "community"];

  const userTags = useMemo(() => {
    if (!currentUser) return [] as string[];
    return [...currentUser.identityTags, ...currentUser.personalityTags];
  }, [currentUser]);

  const filteredPoints = activeFilter === "all"
    ? MAP_POINTS
    : MAP_POINTS.filter((p) => p.type === activeFilter);

  const allFilteredPosts = useMemo(() => {
    let posts = POSTS;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      posts = posts.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.user.location.toLowerCase().includes(q)
      );
    }
    if (activeTag === "推荐") {
      if (userTags.length === 0) return posts.slice(0, PAGE_SIZE);
      return [...posts].sort((a, b) => {
        const scoreA = a.tags.filter((t) => userTags.some((ut) => t.includes(ut) || ut.includes(t))).length;
        const scoreB = b.tags.filter((t) => userTags.some((ut) => t.includes(ut) || ut.includes(t))).length;
        return scoreB - scoreA;
      }).slice(0, PAGE_SIZE);
    }
    return posts.filter((p) => {
      if (p.tags.some((t) => t.includes(activeTag))) return true;
      if (activeTag === "活动" && p.isActivity) return true;
      return false;
    });
  }, [activeTag, userTags, searchQuery]);
  const totalPages = Math.ceil(allFilteredPosts.length / PAGE_SIZE);
  const filteredPosts = useMemo(() => {
    if (activeTag === "推荐") return allFilteredPosts;
    const start = (currentPage - 1) * PAGE_SIZE;
    return allFilteredPosts.slice(start, start + PAGE_SIZE);
  }, [allFilteredPosts, currentPage, activeTag]);

  const toggleLike = (id: number) =>
    setLikedPosts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleSave = (id: number) =>
    setSavedPosts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  useEffect(() => {
    loadTdtScript().then(() => setScriptLoaded(true));
  }, []);

  useEffect(() => {
    if (!scriptLoaded) return;
    const T = (window as any).T;
    if (!T || !mapContainerRef.current) return;
    const container = mapContainerRef.current;
    
    const initMap = () => {
      if (container.offsetWidth === 0 || container.offsetHeight === 0) return;
      try {
        // 清除可能存在的旧地图
        container.innerHTML = '';
        const map = new T.Map(container);
        map.centerAndZoom(new T.LngLat(104.0, 35.5), 5);
        map.enableScrollWheelZoom();
        mapRef.current = map;
        setMapReady(true);
      } catch (e) {
        console.error("Map init error:", e);
      }
    };
    
    if (!mapReady) {
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        const raf = requestAnimationFrame(initMap);
        return () => cancelAnimationFrame(raf);
      }
      initMap();
    }
  }, [scriptLoaded, mapReady]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const T = (window as any).T;
    markersRef.current.forEach((m) => { try { mapRef.current.removeOverLay(m); } catch (_) {} });
    markersRef.current = [];
    filteredPoints.forEach((point) => {
      const lnglat = new T.LngLat(point.lng, point.lat);
      const icon = new T.Icon.Default();
      const marker = new T.Marker(lnglat, { icon });
      marker.addEventListener("click", () => {
        const match = POSTS.find((pp) => pp.lng === point.lng && pp.lat === point.lat);
        if (match) {
          setDetailPost(match);
        } else {
          const poiPost: typeof POSTS[0] = {
            id: 100 + point.id,
            title: point.label,
            type: point.type as any,
            user: { name: point.user, avatar: TYPE_EMOJIS[point.type], tag: point.tag, location: point.label },
            content: `${point.label}，由${point.user}主理。${point.tag}，距离${point.distance}。欢迎前来体验！`,
            img: "",
            tags: [TYPE_LABELS[point.type] || "活动", point.tag],
            likes: 50 + point.id * 7,
            comments: 10 + point.id * 3,
            bookmarks: 20 + point.id * 5,
            time: "1d前",
            isActivity: point.type === "activity",
            lng: point.lng,
            lat: point.lat,
          };
          setDetailPost(poiPost);
        }
      });
      mapRef.current.addOverLay(marker);
      markersRef.current.push(marker);
    });
  }, [activeFilter, mapReady]);

  useEffect(() => {
    if (!mapRef.current) return;
    const handleResize = () => { try { mapRef.current.checkResize && mapRef.current.checkResize(); } catch (_) {} };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 300);
    return () => window.removeEventListener("resize", handleResize);
  }, [mapReady]);

  useEffect(() => {
    if (!mapRef.current || !selectedPoint) return;
    const T = (window as any).T;
    mapRef.current.panTo(new T.LngLat(selectedPoint.lng, selectedPoint.lat));
  }, [selectedPoint]);

  if (detailPost) {
    const p = detailPost;
    return (
      <div className="flex flex-col h-full bg-ds-bg pb-16">
        <div className="relative">
          {p.img ? (
            <img src={p.img} alt="" className="w-full h-56 object-cover" />
          ) : (
            <div className="w-full h-56 flex items-center justify-center" style={{ background: TYPE_COLORS[p.type] || TYPE_COLORS.activity }}>
              <span className="text-6xl">{TYPE_EMOJIS[p.type] || "📍"}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button onClick={() => setDetailPost(null)} className="absolute top-8 left-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <ChevronLeft size={20} className="text-white" />
          </button>
          {p.isActivity && (
            <div className="absolute top-8 right-4 px-3 py-1 rounded-full text-xs font-bold bg-ds-brand text-white">招募中</div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white font-bold text-xl leading-tight">{p.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ background: TYPE_COLORS[p.type] || TYPE_COLORS.activity }}>
                {TYPE_LABELS[p.type] || "活动"}
              </span>
              <span className="flex items-center gap-1 text-white/80 text-xs">
                <MapPin size={10} /> {p.user.location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="bg-ds-surface mx-3 -mt-3 rounded-ds-xl shadow-ds-soft p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-ds-chip flex items-center justify-center text-xl shrink-0">{p.user.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ds-text">{p.user.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-ds-chip text-ds-text-muted">{p.user.tag}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-ds-text-subtle mt-0.5">
                  <MapPin size={10} /> {p.user.location}
                </div>
              </div>
              <button className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-ds-brand text-white">
                <UserPlus size={12} /> 关注
              </button>
            </div>
            {p.isActivity && (
              <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-ds-lg bg-ds-chip">
                <div className="flex items-center gap-1.5 text-xs text-ds-text-muted">
                  <Calendar size={13} className="text-ds-brand" /><span>2026-06-15</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ds-text-muted">
                  <Clock size={13} className="text-ds-brand" /><span>3天</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-ds-text-muted">
                  <Users size={13} className="text-ds-brand" /><span>限{20 + p.id * 5}人</span>
                </div>
              </div>
            )}
            <p className="text-sm text-ds-text leading-relaxed mb-4">{p.content}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-ds-brand/20 text-ds-brand-dark">#{tag}</span>
              ))}
            </div>
            {p.isActivity && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-ds-text-subtle">报名进度</span>
                  <span className="text-ds-brand font-semibold">{12 + p.id * 3}/{20 + p.id * 5}</span>
                </div>
                <div className="h-2 bg-ds-chip rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(((12 + p.id * 3) / (20 + p.id * 5)) * 100, 100)}%`, background: "#e9846a" }} />
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-ds-border">
              <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1.5 text-xs text-ds-text-subtle">
                <Heart size={18} fill={likedPosts.includes(p.id) ? "#FF4466" : "none"} color={likedPosts.includes(p.id) ? "#FF4466" : "#bbb"} />
                {p.likes + (likedPosts.includes(p.id) ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-ds-text-subtle">
                <MessageSquare size={18} color="#bbb" />{p.comments}
              </button>
              <button onClick={() => toggleSave(p.id)} className="flex items-center gap-1.5 text-xs text-ds-text-subtle">
                <Bookmark size={18} fill={savedPosts.includes(p.id) ? "var(--ds-brand)" : "none"} color={savedPosts.includes(p.id) ? "#888" : "#bbb"} />
                {p.bookmarks + (savedPosts.includes(p.id) ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-ds-text-subtle">
                <Share2 size={18} color="#bbb" />分享
              </button>
            </div>
          </div>
          {p.isActivity && (
            <div className="mx-3 mt-3 p-4 bg-ds-surface rounded-ds-xl shadow-ds-soft">
              <h3 className="font-bold text-sm text-ds-text mb-3">活动介绍</h3>
              <p className="text-sm text-ds-text-muted leading-relaxed">{p.content}</p>
              <p className="text-sm text-ds-text-muted leading-relaxed mt-2">活动包含专业指导、器材提供、餐饮住宿等一站式服务，适合零基础参与者。名额有限，先到先得！</p>
            </div>
          )}
          <div className="mx-3 mt-3 p-4 bg-ds-surface rounded-ds-xl shadow-ds-soft">
            <h3 className="font-bold text-sm text-ds-text mb-3">评论 ({p.comments})</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center text-sm shrink-0">😊</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ds-text">小明</span>
                    <span className="text-[10px] text-ds-text-subtle">2h前</span>
                  </div>
                  <p className="text-xs text-ds-text-muted mt-0.5">太棒了！已经报名了，期待！</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-ds-chip flex items-center justify-center text-sm shrink-0">🌿</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ds-text">田园客</span>
                    <span className="text-[10px] text-ds-text-subtle">5h前</span>
                  </div>
                  <p className="text-xs text-ds-text-muted mt-0.5">请问需要自带装备吗？</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4" />
        </div>
        {p.isActivity && (
          <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-white/95 backdrop-blur border-t border-ds-border">
            <div className="max-w-md mx-auto flex items-center gap-3">
              <div className="flex-1">
                <div className="text-xs text-ds-text-subtle">活动费用</div>
                <div className="text-lg font-bold" style={{ color: "#e9846a" }}>¥{98 + p.id * 50}</div>
              </div>
              <button className="px-8 py-2.5 rounded-full font-bold text-sm text-white" style={{ background: "#e9846a" }}>立即报名</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showFeed) {
    return (
      <div className="flex flex-col h-full bg-ds-bg pb-16">
        <div className="bg-ds-surface px-4 pt-3 pb-3 shadow-ds-soft flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 bg-ds-chip rounded-ds-lg px-3 h-9 flex-1">
              <Search size={14} className="text-ds-text-subtle shrink-0" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索内容、标签、活动..." className="flex-1 bg-transparent outline-none text-sm text-ds-text placeholder:text-ds-text-subtle" />
            </div>
            <button
              onClick={() => { setShowFeed(false); setMapReady(false); mapRef.current = null; }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-md text-gray-600 shrink-0"
            >
              <Map size={14} />按地图探索
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
            {TAGS.map((tag) => (
              <button key={tag} onClick={() => { setActiveTag(tag); setCurrentPage(1); }}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${activeTag === tag ? "bg-ds-brand text-white" : "bg-ds-chip text-ds-text-muted"}`}
              >{tag}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-24 px-3 pt-3 flex flex-col gap-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-ds-surface rounded-ds-xl overflow-hidden shadow-ds-soft cursor-pointer active:scale-[0.98] transition-transform" onClick={() => setDetailPost(post)}>
              <div className="flex flex-col p-4 gap-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-ds-lg overflow-hidden shrink-0" style={{ background: (TYPE_COLORS[post.type] || TYPE_COLORS.activity) + "20" }}>
                    <img src={TYPE_ICONS[post.type] || TYPE_ICONS.activity} alt="" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-sm text-ds-text flex-1">{post.title}</span>
                      {post.isActivity && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-ds-brand text-white">招募</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0 text-white" style={{ background: TYPE_COLORS[post.type] || TYPE_COLORS.activity }}>
                        {TYPE_LABELS[post.type] || "活动"}
                      </span>
                      <span className="text-xs text-ds-text-subtle truncate">{post.user.name}·{post.user.location}</span>
                      <span className="text-xs text-ds-text-subtle shrink-0">{post.time}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-ds-text-subtle">
                      <span className="flex items-center gap-0.5"><Heart size={12} />{post.likes}</span>
                      <span className="flex items-center gap-0.5"><MessageSquare size={12} />{post.comments}</span>
                      <span className="flex items-center gap-0.5"><Bookmark size={12} />{post.bookmarks}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-ds-text-muted leading-relaxed line-clamp-3">{post.content}</p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-ds-brand/15 text-ds-brand-dark">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {activeTag !== "推荐" && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 py-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-ds-chip text-ds-text-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />上一页
              </button>
              <span className="text-xs text-ds-text-subtle">{currentPage}/{totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-ds-chip text-ds-text-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                下一页<ChevronRight size={14} />
              </button>
            </div>
          )}
          <div className="text-center py-4">
            <span className="text-xs text-ds-text-subtle">
              {activeTag === "推荐" ? "— 为你精选推荐 —" : `— 第${currentPage}页/共${totalPages}页 · ${allFilteredPosts.length}条 —`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-16 relative z-0">
      <div className="bg-white px-4 pt-3 pb-2 shadow-ds-soft flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-2 bg-ds-chip rounded-ds-lg px-3 h-9 flex-1">
            <Search size={14} className="text-ds-text-subtle shrink-0" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索地点、活动、民宿..." className="flex-1 bg-transparent outline-none text-sm text-ds-text placeholder:text-ds-text-subtle" />
          </div>
          <button onClick={() => setShowFeed(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-ds-chip text-gray-600 hover:bg-gray-200 shrink-0">
            <List size={13} />按列表探索
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-white overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className="flex items-center gap-1 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ background: activeFilter === f ? "#C8FF00" : "#f3f4f6", color: activeFilter === f ? "#111" : "#555", fontWeight: activeFilter === f ? 700 : 400 }}
          >
            {f !== "all" && TYPE_EMOJIS[f]}{f === "all" ? "全部" : TYPE_LABELS[f]}
          </button>
        ))}
        <div className="ml-auto flex-shrink-0 text-xs text-gray-400">{filteredPoints.length} 个地点</div>
      </div>
      <div className="relative overflow-hidden w-full flex-1 min-h-0 z-0">
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <span className="text-sm text-gray-400">地图加载中...</span>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-full" />
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl overflow-hidden z-40" style={{ maxWidth: "360px", margin: "0 auto" }}>
            <div className="flex">
              <div className="w-24 h-24 flex items-center justify-center text-3xl flex-shrink-0" style={{ background: TYPE_COLORS[selectedPoint.type] + "30" }}>
                {TYPE_EMOJIS[selectedPoint.type]}
              </div>
              <div className="p-3 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-gray-900 text-sm truncate">{selectedPoint.label}</div>
                  <button onClick={() => setSelectedPoint(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{selectedPoint.user} · {selectedPoint.tag}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="flex items-center gap-0.5 text-xs text-gray-500">
                    <MapPin size={10} /> {selectedPoint.distance}
                  </span>
                  {selectedPoint.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                      <Star size={10} className="text-amber-400 fill-amber-400" /> {selectedPoint.rating}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const match = POSTS.find((pp) => pp.lng === selectedPoint.lng && pp.lat === selectedPoint.lat);
                      if (match) {
                        setDetailPost(match);
                      } else {
                        const poiPost: typeof POSTS[0] = {
                          id: 100 + selectedPoint.id,
                          title: selectedPoint.label,
                          type: selectedPoint.type as any,
                          user: { name: selectedPoint.user, avatar: TYPE_EMOJIS[selectedPoint.type], tag: selectedPoint.tag, location: selectedPoint.label },
                          content: `${selectedPoint.label}，由${selectedPoint.user}主理。${selectedPoint.tag}，距离${selectedPoint.distance}。欢迎前来体验！`,
                          img: "",
                          tags: [TYPE_LABELS[selectedPoint.type] || "活动", selectedPoint.tag],
                          likes: 50 + selectedPoint.id * 7,
                          comments: 10 + selectedPoint.id * 3,
                          bookmarks: 20 + selectedPoint.id * 5,
                          time: "1d前",
                          isActivity: selectedPoint.type === "activity",
                          lng: selectedPoint.lng,
                          lat: selectedPoint.lat,
                        };
                        setDetailPost(poiPost);
                      }
                    }}
                    className="flex-1 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600 font-medium"
                  >查看详情</button>
                  <button className="flex-1 py-1.5 text-xs rounded-lg font-semibold text-black" style={{ background: "#C8FF00" }}>发消息</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-xl p-2 text-xs space-y-1 z-10">
          <div className="flex items-center gap-1.5 text-white/80"><div className="w-3 h-3 rounded-full bg-green-500" />农场</div>
          <div className="flex items-center gap-1.5 text-white/80"><div className="w-3 h-3 rounded-full bg-amber-500" />民宿</div>
          <div className="flex items-center gap-1.5 text-white/80"><div className="w-3 h-3 rounded-full bg-cyan-400" />活动</div>
        </div>
      </div>
    </div>
  );
}
