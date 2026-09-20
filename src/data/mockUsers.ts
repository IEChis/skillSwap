import type { User, TeachSkill, LearnSkill, Category, Proficiency, TeachLevel, LearnLevel, Method } from '../types';

let sid = 0;
function teach(
  name: string,
  category: Category,
  proficiency: Proficiency,
  canTeach: TeachLevel,
  method: Method,
  content: string,
  availableTime: string,
): TeachSkill {
  return { id: `m_t${sid++}`, name, category, proficiency, canTeach, content, method, availableTime };
}
function learn(
  name: string,
  category: Category,
  currentLevel: LearnLevel,
  goal: string,
  preferredMethod: Method,
  weeklyTime: string,
): LearnSkill {
  return { id: `m_l${sid++}`, name, category, currentLevel, goal, preferredMethod, weeklyTime };
}

/**
 * 12 pre-seeded users. Skills are intentionally arranged into real complementary
 * pairs so the demo shows genuine matches on first open:
 *   林晓 ↔ 周宇  (摄影/PS ↔ Python)
 *   陈晨 ↔ 王思远 (英语口语 ↔ 吉他)
 *   李然 ↔ 赵可  (UI/Figma ↔ Python)
 *   ...and several single-direction links.
 */
export const MOCK_USERS: User[] = [
  {
    id: 'u_linxiao',
    name: '林晓',
    bio: '自由摄影师 / 视觉设计师，喜欢用镜头记录城市光影。',
    city: '广州',
    canTeach: [
      teach('摄影', '摄影', '熟练', '都可以', '都可以', '构图、用光、后期调色基础', '周末全天'),
      teach('Photoshop', '设计', '熟练', '入门', '线上', '人像精修与海报设计入门', '工作日晚间'),
    ],
    wantToLearn: [learn('Python', '编程', '零基础', '能写简单脚本自动化处理照片', '线上', '每周 2 小时')],
  },
  {
    id: 'u_zhouyu',
    name: '周宇',
    bio: '后端工程师，热衷用代码解决重复劳动。',
    city: '深圳',
    canTeach: [
      teach('Python', '编程', '精通', '都可以', '都可以', '从语法到爬虫、数据分析项目', '周末'),
      teach('数据分析', '编程', '熟练', '入门', '线上', 'Pandas 基础与可视化', '工作日晚间'),
    ],
    wantToLearn: [learn('摄影', '摄影', '入门', '能拍出有质感的日常照片', '都可以', '每周 1-2 小时')],
  },
  {
    id: 'u_chenchen',
    name: '陈晨',
    bio: '英语口语老师，相信开口是最好的练习。',
    city: '广州',
    canTeach: [teach('英语口语', '语言', '精通', '都可以', '都可以', '日常会话、发音纠正、情景演练', '每晚')],
    wantToLearn: [learn('吉他', '音乐', '零基础', '能弹唱一首完整的歌', '线下', '每周 2 小时')],
  },
  {
    id: 'u_wangsiyuan',
    name: '王思远',
    bio: '独立音乐人，写歌、编曲、也教乐理。',
    city: '上海',
    canTeach: [
      teach('吉他', '音乐', '熟练', '都可以', '都可以', '基础和弦到弹唱', '周末'),
      teach('音乐理论', '音乐', '熟练', '入门', '线上', '识谱与和弦进行', '工作日晚间'),
    ],
    wantToLearn: [learn('英语口语', '语言', '入门', '能用英语做简单交流', '线上', '每周 1 小时')],
  },
  {
    id: 'u_liran',
    name: '李然',
    bio: 'UI 设计师，关注体验与细节。',
    city: '杭州',
    canTeach: [
      teach('UI设计', '设计', '熟练', '入门', '线上', '界面排版与组件规范', '工作日晚间'),
      teach('Figma', '设计', '熟练', '都可以', '线上', '从原型到交付协作', '周末'),
    ],
    wantToLearn: [learn('Python', '编程', '零基础', '能写小工具辅助设计流程', '线上', '每周 2 小时')],
  },
  {
    id: 'u_zhaoke',
    name: '赵可',
    bio: '全栈工程师，喜欢把想法变成产品。',
    city: '北京',
    canTeach: [teach('Python', '编程', '熟练', '都可以', '都可以', 'Web 开发与自动化脚本', '周末')],
    wantToLearn: [learn('UI设计', '设计', '入门', '能做出好看的界面', '线上', '每周 1 小时')],
  },
  {
    id: 'u_sunyue',
    name: '孙悦',
    bio: '插画师，画风温暖，爱画生活小物。',
    city: '成都',
    canTeach: [
      teach('插画', '设计', '熟练', '入门', '线上', '手绘风格与配色', '工作日晚间'),
      teach('手绘', '设计', '熟练', '都可以', '都可以', '速写基础', '周末'),
    ],
    wantToLearn: [learn('摄影', '摄影', '入门', '为插画收集素材', '都可以', '每周 1 小时')],
  },
  {
    id: 'u_wutong',
    name: '吴桐',
    bio: '健身教练，相信运动改变状态。',
    city: '广州',
    canTeach: [
      teach('健身', '运动', '熟练', '都可以', '都可以', '居家训练计划制定', '周末'),
      teach('瑜伽', '运动', '熟练', '入门', '线下', '基础体式与呼吸', '工作日晚间'),
    ],
    wantToLearn: [learn('英语口语', '语言', '入门', '能带外国学员训练', '线上', '每周 1 小时')],
  },
  {
    id: 'u_zhenghao',
    name: '郑昊',
    bio: '日语翻译，也喜欢街头摄影。',
    city: '广州',
    canTeach: [teach('日语', '语言', '精通', '都可以', '线上', 'JLPT 与日常会话', '每晚')],
    wantToLearn: [learn('摄影', '摄影', '入门', '记录旅行中的瞬间', '都可以', '每周 1 小时')],
  },
  {
    id: 'u_helin',
    name: '何琳',
    bio: '产品经理，用数据讲故事。',
    city: '深圳',
    canTeach: [
      teach('产品思维', '职业技能', '熟练', '入门', '线上', '需求拆解与 PRD 写作', '工作日晚间'),
      teach('数据分析', '编程', '熟练', '入门', '线上', '指标设计与看板', '周末'),
    ],
    wantToLearn: [learn('Python', '编程', '零基础', '能自己跑数据分析脚本', '线上', '每周 2 小时')],
  },
  {
    id: 'u_huanglei',
    name: '黄磊',
    bio: '私房菜厨师，三餐皆乐趣。',
    city: '重庆',
    canTeach: [teach('烹饪', '生活技能', '精通', '都可以', '都可以', '家常菜与摆盘', '周末')],
    wantToLearn: [learn('吉他', '音乐', '零基础', '弹唱给家人听', '线下', '每周 2 小时')],
  },
  {
    id: 'u_liuyang',
    name: '刘洋',
    bio: '留学生，正在学西班牙语。',
    city: '广州',
    canTeach: [teach('西班牙语', '语言', '熟练', '都可以', '线上', '西语入门与口语', '每晚')],
    wantToLearn: [learn('健身', '运动', '入门', '规律训练塑形', '线下', '每周 2 小时')],
  },
];
