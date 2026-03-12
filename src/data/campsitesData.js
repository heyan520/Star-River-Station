// 统一露营地数据文件
export const campsitesData = [
    {
        id: 1,
        title: '武陵山玫瑰湾露营基地',
        image: '/assets/武陵山玫瑰湾露营基地.png',
        description: '邻武陵山大裂谷，高海拔避暑地，提供玫瑰景观与烧烤',
        rating: 4.8,
        reviews: 128,
        price: 120,
        capacity: 30,
        isHot: true,
        vrPanorama: "https://www.720yun.com/t/74vkz9rep1b?scene_id=78920538",
        features: '营地位于重庆涪陵区武陵山，海拔约1500米，夏季平均气温20℃。紧邻武陵山大裂谷景区，可步行前往游览；内部种植玫瑰景观，花期5-10月观赏性强。提供帐篷租赁、自助烧烤区，配备热水淋浴，适合家庭及朋友结伴露营。',
        facilities: [
            '24小时热水淋浴',
            '分区烧烤区',
            '免费停车场',
            '基础充电接口'
        ],
        userReviews: [
            {
                id: 1,
                name: '旅行爱好者',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler',
                rating: 5,
                content: '非常棒的露营点,星空特别美,设施也很完善,工作人员很热情。下次还会再来!',
                image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=300&h=200&fit=crop',
                date: '2023年8月5日'
            },
            {
                id: 2,
                name: '自然摄影师',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer',
                rating: 5,
                content: '作为摄影师,这个营地给了我无数绝佳的拍摄机会。清晨的云海和夜晚的星空都是不可错过的美景。',
                image: 'https://images.unsplash.com/photo-1464822759844-d150baec2b1b?w=300&h=200&fit=crop',
                date: '2023年7月28日'
            }
        ],
        tags: [
            { text: '综合', type: 'level-intermediate' },
            { text: '避暑', type: 'type-summer' }
        ],
        position: [108.8632, 29.7145],
        type: '避暑',
        area: '涪陵',
        level: '综合',
        location: '重庆涪陵区武陵山玫瑰湾'
    },
    {
        id: 2,
        title: '南川金佛山露营基地',
        image: '/assets/南川金佛山露营基地.png',
        description: '金佛山山麓营地，近景区入口，适合亲子与景区联动',
        rating: 4.6,
        reviews: 132,
        price: 110,
        capacity: 25,
        isHot: true,
        vrPanorama: "https://www.720yun.com/t/devkz78m5qe?scene_id=81083953",
        features: '营地位于南川区金佛山景区山麓，海拔约1200米，距离金佛山游客中心仅2公里，方便次日进景区游玩。营地以亲子友好为特色，设有小型儿童游乐区，提供帐篷、防潮垫等基础装备租赁，冬季可远眺金佛山雪景。',
        facilities: [
            '定时热水淋浴（18:00-22:00）',
            '共享烧烤架租赁',
            'WiFi覆盖公共区',
            '儿童游乐设施'
        ],
        userReviews: [
            {
                id: 1,
                name: '家庭主妇',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=family',
                rating: 5,
                content: '非常适合带孩子来玩,孩子们玩得很开心,环境也很安全。',
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
                date: '2023年8月10日'
            }
        ],
        tags: [
            { text: '亲子', type: 'level-beginner' },
            { text: '景区联动', type: 'type-scenic' }
        ],
        position: [107.1825, 29.1068],
        type: '亲子',
        area: '南川',
        level: '入门',
        location: '重庆南川区金佛山山麓'
    },
    {
        id: 3,
        title: '渝北玉峰山露营基地',
        image: '/assets/渝北玉峰山露营基地.png',
        description: '主城近郊营地，交通便利，主打短时休闲露营',
        rating: 4.5,
        reviews: 189,
        price: 90,
        capacity: 20,
        isHot: true,
        vrPanorama: "https://www.720yun.com/t/f4vkzlqq78w?scene_id=78007528",
        features: '营地位于渝北区玉峰山森林公园旁，海拔约800米，从主城核心区自驾仅1小时可达。主打“短时休闲露营”，无需长途奔波，适合周末家庭游。提供自带帐篷营地位及简易装备租赁，周边有玉峰山步道可徒步。',
        facilities: [
            '简易热水淋浴',
            '烧烤食材售卖点',
            '新能源汽车充电桩',
            '公共卫生间'
        ],
        userReviews: [
            {
                id: 1,
                name: '登山爱好者',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hiker',
                rating: 5,
                content: '作为资深登山爱好者,这里的设施和服务都很专业,向导经验丰富,推荐给有一定经验的登山者。',
                image: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=300&h=200&fit=crop',
                date: '2023年9月15日'
            }
        ],
        tags: [
            { text: '近郊', type: 'level-beginner' },
            { text: '短时露营', type: 'type-short' }
        ],
        position: [106.6817, 29.7832],
        type: '近郊',
        area: '渝北（主城）',
        level: '入门',
        location: '重庆渝北区玉峰山森林公园旁'
    },
    {
        id: 4,
        title: '璧山区秀湖汽车露营公园',
        image: '/assets/璧山秀湖汽车露营公园.png',
        description: '湖景汽车露营地，房车友好，配套完善',
        rating: 4.8,
        reviews: 215,
        price: 150,
        capacity: 35,
        isHot: true,
        vrPanorama: "https://www.720yun.com/t/10vksmd75pm?scene_id=49297163",
        features: '营地位于璧山区秀湖公园西侧，紧邻秀湖水域，主打“汽车+房车露营”。每个营位配备独立水电桩，适合房车停靠；同时提供普通帐篷区域，可欣赏湖景日落。周边依托秀湖公园，有步道、草坪，适合休闲散步。',
        facilities: [
            '24小时热水淋浴',
            '房车专用水电桩',
            '湖景烧烤区',
            '共享厨房',
            'WiFi全覆盖'
        ],
        userReviews: [
            {
                id: 1,
                name: '车友',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=car',
                rating: 5,
                content: '作为车友，这里提供的服务 very good，location very good，environment very good，recommend to car owner.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月10日'
            },
            {
                id: 2,
                name: '家庭主妇',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=family',
                rating: 4.5,
                content: '家庭主妇，这里服务很棒，location very good，environment very good，recommend to family.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月15日'
            }
        ],
        tags: [
            { text: '汽车露营', type: 'level-advanced' },
            { text: '湖景', type: 'type-lake' }
        ],
        position: [106.2031, 29.4327],
        type: '汽车露营',
        area: '璧山',
        level: '进阶',
        location: '重庆璧山区秀湖公园西侧'
    },
    {
        id: 5,
        title: '丰都雪玉山露营基地',
        image: '/assets/丰都雪玉山露营基地.png',
        description: '高海拔观星营地，夏季避暑胜地，视野开阔',
        rating: 4.7,
        reviews: 167,
        price: 140,
        capacity: 26,
        isHot: false,
        vrPanorama: "https://www.720yun.com/t/9fcjrruvvf2?scene_id=24888621",
        features: '营地位于丰都县雪玉山景区内，海拔约1800米，是重庆周边海拔较高的露营地之一。夏季平均气温18℃，避暑效果极佳；夜间光污染少，是观星绝佳地点，营地可租赁简易观星设备。周边有雪玉山草甸，适合拍照打卡。',
        facilities: [
            '24小时热水淋浴',
            '观星设备租赁',
            '大型烧烤广场',
            '应急医疗点'
        ],
        userReviews: [
            {
                id: 1,
                name: '车友',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=car',
                rating: 5,
                content: '作为车友，这里提供的服务 very good，location very good，environment very good，recommend to car owner.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月10日'
            },
            {
                id: 2,
                name: '家庭主妇',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=family',
                rating: 4.5,
                content: '家庭主妇，这里服务很棒，location very good，environment very good，recommend to family.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月15日'
            }
        ],
        tags: [
            { text: '观星', type: 'type-photo' },
            { text: '避暑', type: 'type-summer' }
        ],
        position: [108.1245, 29.8563],
        type: '观星',
        area: '丰都',
        level: '综合',
        location: '重庆丰都县雪玉山景区内'
    },
    {
        id: 6,
        title: '江津四屏镇花小原露营地',
        image: '/assets/江津四屏镇花小原露营地.png',
        description: '四面山周边田园营地，主打田园风光与亲子体验',
        rating: 4.6,
        reviews: 143,
        price: 120,
        capacity: 22,
        isHot: false,
        vrPanorama: "https://www.720yun.com/t/1aejvdhwOm8?scene_id=18558616",
        features: '营地位于江津区四屏镇，距离四面山景区约8公里，周边是田园村落，风光清新。主打“田园露营”，可体验采摘（季节性）、农耕科普等活动，适合带孩子感受乡村生活。提供帐篷租赁及农家菜预订服务。',
        facilities: [
            '定时热水淋浴（17:00-23:00）',
            '田园风格烧烤区',
            '免费停车场',
            '农耕体验道具租赁'
        ],
        userReviews: [
            {
                id: 1,
                name: '车友',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=car',
                rating: 5,
                content: '作为车友，这里提供的服务 very good，location very good，environment very good，recommend to car owner.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月10日'
            },
            {
                id: 2,
                name: '家庭主妇',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=family',
                rating: 4.5,
                content: '家庭主妇，这里服务很棒，location very good，environment very good，recommend to family.',
                image: 'https://images.unsplash.com/photo-1596436889148-61e24d897887?w=300&h=200&fit=crop',
                date: '2023年10月15日'
            }
        ],
        tags: [
            { text: '亲子', type: 'level-beginner' },
            { text: '田园', type: 'type-rural' }
        ],
        position: [106.2841, 28.8529],
        type: '亲子',
        area: '江津',
        level: '入门',
        location: '重庆江津区四屏镇花小原'
    }
];

// 获取所有露营地数据
export const getAllCampsites = () => {
    return campsitesData;
};

// 根据ID获取露营地详情
export const getCampsiteById = (id) => {
    const idNum = Number(id);
    const campsite = campsitesData.find(campsite => campsite.id === idNum);
    return campsite || campsitesData[0]; // 如果未找到，返回第一个露营地
};