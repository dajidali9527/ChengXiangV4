export interface DemoUser {
  id: number;
  name: string;
  avatar: string;
  password: string;
  identityTags: string[];
  personalityTags: string[];
  status: string;
  communityIds: number[];
  bio: string;
}

const IDENTITY_TAGS = [
  "在地新村民", "原村民", "游客", "村镇管理员",
  "民宿主理人", "有机农场主理人", "活动发起人",
];

const PERSONALITY_CATEGORIES = {
  "个人": ["男", "女", "90后", "00后", "I人", "E人", "INFJ", "ENTP"],
  "职业": ["自由职业", "数字游民", "农人", "创业者", "学生", "上班族"],
  "兴趣": ["徒步", "摄影", "露营", "骑行", "美食", "旅行"],
  "专业": ["设计", "AI", "建筑", "乡建", "农业", "软件"],
};

const STATUSES = ["空闲中", "活动中", "工作中", "旅行中", "接待中", "休息中"];

const NAMES = [
  "陈浩然", "李雨桐", "王明哲", "赵晓萱", "刘志远", "杨思雨", "黄俊杰", "周梦瑶",
  "吴天宇", "郑雅文", "钱一鸣", "孙雪晴", "朱浩宇", "马晓晨", "胡雨涵", "林泽宇",
  "何诗涵", "郭子豪", "高婉清", "罗明辉", "梁思源", "宋佳怡", "唐志豪", "韩雨桐",
  "冯晓峰", "董美玲", "袁文博", "邓佳慧", "许浩铭", "沈语嫣",
];

const BIOS = [
  "热爱城乡生活，在田野与城市间自由穿梭。",
  "探索自然之美，记录每一个美好瞬间。",
  "希望结识志同道合的朋友，一起探索世界。",
  "喜欢徒步和露营，大自然是最好的疗愈。",
  "经营一家小民宿，欢迎各地朋友来做客。",
  "专注有机农业，希望让更多人吃上健康食物。",
  "数字游民一枚，边旅行边工作。",
  "摄影爱好者，用镜头捕捉生活的温度。",
  "热爱美食，探索各地风味小吃。",
  "乡建实践者，希望为乡村发展贡献力量。",
  "骑行爱好者，用车轮丈量大地。",
  "AI从业者，关注科技与农业的结合。",
  "设计改变生活，美学无处不在。",
  "软件工程师，远程办公的自由灵魂。",
  "建筑设计师，喜欢改造老房子。",
];

export const COMMUNITIES = [
  { id: 1, name: "竹林数字村", color: "#C8FF00" },
  { id: 2, name: "漓江民宿联盟", color: "#FF8C42" },
  { id: 3, name: "山野探索队", color: "#4ECDC4" },
  { id: 4, name: "有机农夫市集", color: "#A18CD1" },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateUsers(): DemoUser[] {
  const users: DemoUser[] = [];
  const communityAssignments: Record<number, number[]> = {
    1: [],
    2: [1],
    3: [2, 3, 4],
    4: [],
    5: [4],
    6: [2],
    7: [],
    8: [],
    9: [],
    10: [3],
    11: [1],
    12: [],
    13: [1],
    14: [],
    15: [4],
    16: [2],
    17: [3],
    18: [3],
    19: [3],
    20: [4],
    21: [],
    22: [2],
    23: [4],
    24: [],
    25: [],
    26: [2],
    27: [],
    28: [3],
    29: [4],
    30: [2],
  };
  for (let i = 0; i < 30; i++) {
    const frameNum = 14 + i;
    const communityIds = communityAssignments[i + 1] || [];
    const allPersonality = Object.values(PERSONALITY_CATEGORIES).flat();
    const seed = i + 1;
    const identityCount = 1 + Math.floor(seededRandom(seed * 7) * 2);
    const personalityCount = 2 + Math.floor(seededRandom(seed * 13) * 4);
    const statusIndex = Math.floor(seededRandom(seed * 19) * STATUSES.length);
    const bioIndex = Math.floor(seededRandom(seed * 23) * BIOS.length);
    users.push({
      id: i + 1,
      name: NAMES[i],
      avatar: `/avatars/Frame ${frameNum}.jpg`,
      password: "123",
      identityTags: Array.from({ length: identityCount }, (_, j) => IDENTITY_TAGS[(seed * (j + 1) * 3) % IDENTITY_TAGS.length]),
      personalityTags: Array.from({ length: personalityCount }, (_, j) => allPersonality[(seed * (j + 1) * 5) % allPersonality.length]),
      status: STATUSES[statusIndex],
      communityIds,
      bio: BIOS[bioIndex],
    });
  }
  return users;
}

export const DEMO_USERS = generateUsers();