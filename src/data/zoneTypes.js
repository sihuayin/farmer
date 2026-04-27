export const ZONE_TYPES = [
  {
    id: 'vegetable',
    name: '蔬菜区',
    emoji: '🥬',
    color: '#4CAF50',
    varieties: ['番茄', '黄瓜', '白菜', '萝卜', '土豆', '茄子', '辣椒', '西兰花', '菠菜', '生菜'],
  },
  {
    id: 'fruit',
    name: '水果区',
    emoji: '🍎',
    color: '#FF9800',
    varieties: ['苹果', '梨', '桃', '葡萄', '草莓', '西瓜', '橙子', '芒果', '香蕉', '猕猴桃'],
  },
  {
    id: 'grain',
    name: '粮食区',
    emoji: '🌾',
    color: '#FFC107',
    varieties: ['小麦', '水稻', '玉米', '大豆', '花生', '红薯', '棉花', '高粱', '燕麦', '大麦'],
  },
  {
    id: 'flower',
    name: '花卉区',
    emoji: '🌸',
    color: '#E91E63',
    varieties: ['玫瑰', '郁金香', '菊花', '百合', '牡丹', '兰花', '向日葵', '薰衣草', '樱花', '梅花'],
  },
  {
    id: 'poultry',
    name: '家禽区',
    emoji: '🐔',
    color: '#FFEB3B',
    varieties: ['鸡', '鸭', '鹅', '火鸡', '鹌鹑', '鸽'],
  },
  {
    id: 'livestock',
    name: '畜牧区',
    emoji: '🐄',
    color: '#795548',
    varieties: ['牛', '羊', '猪', '马', '驴', '骡'],
  },
  {
    id: 'aquaculture',
    name: '水产区',
    emoji: '🐟',
    color: '#2196F3',
    varieties: ['草鱼', '鲤鱼', '鲢鱼', '鳙鱼', '罗非鱼', '对虾', '螃蟹', '黄鳝', '泥鳅', '鳜鱼'],
  },
]

export const ZONE_MAP = Object.fromEntries(ZONE_TYPES.map((z) => [z.id, z]))
