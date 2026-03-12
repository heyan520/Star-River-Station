// 路线数据文件
export const routesData = [
  {
    id: 1,
    name: "神龟峡环线",
    level: "入门",
    theme: "峡谷",
    description: "阿蓬江最精华河段，38.9公里水路穿越27道弯，探秘悬棺遗址与喀斯特奇观，游船全程2小时，感受'重庆小三峡'的险峻与秀丽",
    location: "重庆・黔江",
    distance: "120",
    duration: "1天",
    rating: "4.6",
    imageUrl: "/assets/神龟峡环线.png",
    coordinates: [108.9251, 29.4328],
    isCollected: false,
    isFeatured: false,
    vrPanorama: "https://www.720yun.com/t/6402a9OOqcf?scene_id=1682506",
    highlights: "悬棺遗址、神门峡一线天、苗族风情体验",
    safetyTips: [
      "游船时穿好救生衣，禁止站立",
      "峡谷内信号较弱，提前下载离线地图",
      "山路弯道多，建议白天驾驶"
    ],
    reviews: [
      {
        userName: "旅行爱好者",
        rating: 5,
        content: "此生必驾！高山草甸与冰川湖泊太震撼了。",
        imageUrl: "/assets/头像.png",
        date: "2023年8月5日"
      },
      {
        userName: "自然摄影师",
        rating: 5,
        content: "清晨的然乌湖像镜子，随手一拍都是大片。",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        date: "2023年7月28日"
      }
    ]
  },
  {
    id: 2,
    name: "龚滩古镇-乌江画廊环线",
    level: "休闲",
    theme: "古镇",
    description: "千年盐道古镇与乌江画廊深度联动，徒步青石板街探访吊脚楼，乘船观赏'千里乌江，百里画廊'的水墨意境，感受土家族千年商埠文化",
    location: "重庆・酉阳",
    distance: "200",
    duration: "2天",
    rating: "4.8",
    imageUrl: "/assets/龚滩古镇-乌江画廊环线.png",
    coordinates: [108.9251, 29.4328],
    isCollected: false,
    isFeatured: true,
    vrPanorama: "https://www.720yun.com/vr/54928mzd9ti",
    highlights: "西秦会馆傩戏表演、冉家院子纤夫文化、乌江日落灯笼海",
    safetyTips: [
      "古镇石板路湿滑，建议穿防滑鞋",
      "游船选择正规公司，避免超载",
      "部分山路无护栏，谨慎驾驶"
    ],
    reviews: [
      {
        userName: "海岛控",
        rating: 5,
        content: "自驾环岛非常舒服，处处是海景公路，停停走走很惬意。",
        imageUrl: "",
        date: "2023年10月2日"
      },
      {
        userName: "吃货指南",
        rating: 4,
        content: "海鲜超新鲜！推荐文昌鸡和清补凉，晚上海边吹风太治愈。",
        imageUrl: "",
        date: "2023年9月18日"
      }
    ]
  },
  {
    id: 3,
    name: "濯水古镇-蒲花暗河环线",
    level: "综合",
    theme: "喀斯特",
    description: "世界最长风雨廊桥与地下暗河双奇观联动，徒步古镇青石板街，乘船探秘溶洞天眼与天生三桥，感受'天理良心'的商道文化与地心探险乐趣",
    location: "重庆・黔江",
    distance: "150",
    duration: "2天",
    rating: "4.7",
    imageUrl: "/assets/濯水古镇-蒲花暗河环线.png",
    coordinates: [108.9251, 29.4328],
    isCollected: false,
    isFeatured: true,
    vrPanorama: "https://www.720yun.com/t/cc7j5remvO4?scene_id=10112788", // 暂用通用VR数据，建议替换为实际链接
    highlights: "风雨廊桥夜景、蒲花暗河苍天有眼、土家十三寨民俗体验",
    safetyTips: [
      "暗河内温度较低，备薄外套",
      "溶洞内湿滑，注意脚下安全",
      "夏季暴雨可能临时关闭景区"
    ],
    reviews: [
      {
        userName: "人文爱好者",
        rating: 5,
        content: "江南味十足，夜游古镇太美了，拍照出片率高。",
        imageUrl: "",
        date: "2023年5月6日"
      },
      {
        userName: "亲子旅客",
        rating: 4,
        content: "带孩子坐乌篷船很有趣，就是节假日人有点多。",
        imageUrl: "",
        date: "2023年6月12日"
      }
    ]
  },
  {
    id: 4,
    name: "黄水镇-千野草场环线",
    level: "避暑",
    theme: "草原",
    description: "21℃清凉避暑环线，穿越万亩高山草甸与原始森林，体验露营观星、土家摆手舞与莼菜采摘，感受'重庆小瑞士'的诗意与清凉",
    location: "重庆・石柱",
    distance: "180",
    duration: "3天",
    rating: "4.7",
    imageUrl: "/assets/黄水镇-千野草场环线.png",
    coordinates: [108.9251, 29.4328],
    isCollected: false,
    isFeatured: false,
    vrPanorama: "https://www.720yun.com/t/38320xr6cug?scene_id=1164417", // 暂用通用VR数据，建议替换为实际链接
    highlights: "千野草场露营狂欢节、太阳湖水上运动、西沱古镇云梯探秘",
    safetyTips: [
      "草原昼夜温差大，备保暖衣物",
      "部分路段无路灯，夜间谨慎驾驶",
      "蚊虫较多，携带驱蚊液"
    ],
    reviews: [
      {
        userName: "越野玩家",
        rating: 5,
        content: "无人区露营看银河太震撼，沙砾路段一定要降胎压。",
        imageUrl: "",
        date: "2023年9月1日"
      },
      {
        userName: "地理控",
        rating: 5,
        content: "雅丹群地貌独一无二，自然力量的杰作。",
        imageUrl: "",
        date: "2023年8月20日"
      }
    ]
  },
  {
    id: 5,
    name: "仙女山-天生三桥环线",
    level: "摄影",
    theme: "喀斯特",
    description: "世界自然遗产深度环线，徒步天生三硚感受《满城尽带黄金甲》取景地的震撼，驰骋仙女山草原体验'南方瑞士'风情，冬季滑雪夏季避暑两相宜",
    location: "重庆・武隆",
    distance: "160",
    duration: "2天",
    rating: "4.9",
    imageUrl: "/assets/仙女山-天生三桥环线.png",
    coordinates: [108.9251, 29.4328],
    isCollected: false,
    isFeatured: true,
    vrPanorama: "https://www.720yun.com/t/c252dw8kqnn?scene_id=246320", // 暂用通用VR数据，建议替换为实际链接
    highlights: "天生三桥天龙桥、仙女山小火车穿越草原、龙水峡地缝银河飞瀑",
    safetyTips: [
      "天生三桥步道陡峭，穿舒适运动鞋",
      "草原紫外线强，做好防晒措施",
      "冬季部分路段积雪，需防滑链"
    ]
  },
  {
    id: 6,
    name: "南川178环线",
    level: "挑战",
    theme: "山区",
    description: "重庆版'318'环线，覆盖金佛山核心景区，穿越森林草甸与高山湖泊，夏季平均气温18℃，体验云端自驾的清凉与险峻，被《中国国家地理》评为'重庆最美公路'之一",
    location: "重庆・南川",
    distance: "178",
    duration: "2-3天",
    rating: "4.8",
    imageUrl: "/assets/南川178环线.png",
    coordinates: [107.1972, 29.1655],
    isCollected: false,
    isFeatured: true,
    vrPanorama: "https://www.720yun.com/t/7evkiqrespq?scene_id=35904001",
    highlights: "金佛山云海日出、山王坪水杉林秘境、风吹岭悬崖观景台",
    safetyTips: [
      "部分路段坡陡弯急，建议SUV车型",
      "山区信号不稳定，提前下载离线地图",
      "冬季冰雪路段需安装防滑链"
    ]

  }
];

// 获取所有路线数据
export const getAllRoutes = () => {
  return routesData;
};

// 根据ID获取路线详情
export const getRouteById = (id) => {
  const idNum = Number(id);
  const route = routesData.find(route => route.id === idNum);
  return route || routesData[0]; // 如果未找到，返回第一条路线
};

// 获取所有精选路线
export const getFeaturedRoutes = () => {
  return routesData.filter(route => route.isFeatured === true);
};

// 获取所有收藏路线
export const getFavoriteRoutes = () => {
  return routesData.filter(route => route.isCollected === true);
};