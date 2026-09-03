import DisplayTitle from './DisplayTitle';
import LightColumns from './LightColumns';
import PortfolioNav from './PortfolioNav';
import ScaleStage from './ScaleStage';

const softwareIcons = [
  'image 6345044-1.png', 'image 6345043.png', 'image 6345044.png', 'image 6345041.png', 'image 6345042.png', 'image 6345040.png',
  'image 6345015.png', 'image 6345016.png', 'image 6345017.png', 'image 6345019.png', 'image 6345045.png', 'image 6345046.png',
];

const BlockTitle = ({ cn, en, badge }) => (
  <div className="resume-heading"><h2>{cn}</h2>{badge && <span className="resume-badge">{badge}</span>}<span>{en}</span></div>
);

export function AboutStage({ onNavigate, fitViewport = false }) {
  return (
      <ScaleStage className="about-stage" fitViewport={fitViewport} preserveSourceRatio>
        <div className="about-portrait"><img src="/assets/portfolio/about/portrait-composite.png" alt="张睿的个人肖像" /></div>
        <LightColumns page="about" className="about-columns" count={8} />
        <img className="about-prism" src="/assets/portfolio/home/prism.png" alt="透明折射棱镜" />
        <button className="about-home-link" type="button" onClick={() => onNavigate('/')} aria-label="返回作品集首页"><DisplayTitle variant="about" /></button>

        <section className="about-intro">
          <h1>张睿</h1>
          <div className="intro-copy">
            <p className="role-line">AI 产品体验设计师 <b>｜</b> UI/UX 设计师 <b>｜</b> AIGC 交互设计师</p>
            <p>对视觉有判断，对产品有感知，对技术保持好奇</p>
            <p>在持续探索中把创意转化为高完成度体验的 AI-Native 设计师</p>
          </div>
          <address className="contact-list"><span>Base： 北京</span><span>电话：130 6701 8267</span><span>邮箱：1277929459@qq.com</span><span>微信：zhangrui-rivi</span></address>
        </section>

        <section className="resume-block education-block">
          <BlockTitle cn="教育经历" en="EDUCATION" badge="27届" />
          <div className="education-item"><h3>清华大学美术学院 <time>2024.09–2027.06</time></h3><p>科普信息设计｜硕士（在读）</p><small>GPA 3.9/4.0；沉浸式体验(MR)、用户体验、人工智能辅助设计、艺术疗愈</small></div>
          <div className="education-item"><h3>江南大学设计学院 <time>2019.09–2023.06</time></h3><p>视觉传达设计｜学士</p><small>UI、信息可视化、品牌设计；优秀毕业设计、一等学业奖学金、校三好学生</small></div>
        </section>

        <section className="resume-block competency-block">
          <BlockTitle cn="专业能力" en="Core Competencies" />
          <div className="skill-tags"><span>视觉判断力</span><span>AI Native</span><span>产品思维</span><span>好奇心驱动</span></div>
          <div className="competency-copy">
            <p>产品体验： 用户研究｜需求拆解｜信息架构｜交互流程｜体验验证｜竞品分析｜移动端 UI</p>
            <p>AI 工程： System Prompt Design｜模型评测｜Vibe Coding｜结果校验｜H5 Demo｜skill设计</p>
            <p>设计系统： Visual Design｜Design Spec｜Components｜高保真交付｜动效实现</p>
            <p>协作落地： 产品 / 研发 / 测试协同｜设计评审｜走查验收｜数据验证｜迭代复盘</p>
            <p>方法沉淀： 用户洞察｜结构化拆解｜快速验证｜数据复盘｜可复用设计资产</p>
          </div>
          <div className="tool-icons">{softwareIcons.map((icon) => <img key={icon} src={`/assets/portfolio/about/icons/${icon}`} alt="" />)}</div>
        </section>

        <section className="resume-block internship-block">
          <BlockTitle cn="实习经历" en="INTERNSHIP" />
          <article className="experience-item"><h3><img src="/assets/portfolio/about/icons/image 6345037.png" alt="腾讯" />腾讯新闻｜产品体验设计实习生 <time>2026.04–2026.08</time></h3><p>负责<span>腾讯新闻</span>任务中心信息架构、用户增长、界面升级；上线一周日均 PV 增长约 <em>17%</em>。转盘抽奖近30天 <strong>6,400+次</strong>；积分净消耗约 <em>9.26 万</em>。《鲟了个者》vibe coding 连续 3 周平台前三，有效使用率 <strong>77.8%</strong>。</p></article>
          <article className="experience-item"><h3><img src="/assets/portfolio/about/icons/image 6345038.png" alt="阿里巴巴" />阿里巴巴·通义实验室｜AI 视觉美学实习生 <time>2025.10–2026.03</time></h3><p>参与<span>通义万相</span>2.6与2.7版本文生图 / 图像编辑模型的数据体系优化，构建SFT美学标签并参与约 <em>8.3 亿</em> 张训练数据整理。完成“千人千面”“调色盘”等功能设计，撰写《WAN2.7图像生产力指南》累计 <em>13.9万+</em> 阅读。</p></article>
          <article className="experience-item"><h3><img src="/assets/portfolio/about/icons/image 6345039.png" alt="字节跳动" />字节跳动·抖音政务运营中台｜视觉设计实习生 <time>2025.07–2025.09</time></h3><p>负责抖音政务与文旅活动视觉系统、主视觉 KV、移动端 UI 与 H5 信息层级优化。建立统一视觉规范。使用 Midjourney、Stable Diffusion，即梦进行创意生成与视觉扩展，协同运营迭代，推动 <strong>10+</strong> 个活动页面上线。</p></article>
        </section>

        <section className="resume-block projects-block">
          <BlockTitle cn="落地项目" en="PROJECTS" />
          <h3>北京亦庄模拟世界 AIGC 展厅互动设计</h3><p>脑电 / 表情数据 × AI 生成 × 沉浸交互</p>
          <h3>中国电信活动 AIGC 营销设计</h3><p>AIGC 内容生成 × IP × H5 × 互动抽奖</p>
          <h3>北京科技馆未来科学家站体验设计</h3><p>AIGC × 科普体验设计 北京卫视专题报道</p>
        </section>

        <section className="resume-block academic-block">
          <BlockTitle cn="学术获奖" en="ACADEMIC" />
          <p><b>IEEE VR 2025：</b><strong>第一作者</strong>论文发表，作品入选Gallery 展单元</p>
          <p><b>HRI 2025 LBR 赛道：</b>论文收录</p><p><b>清华大学梅贻琦奖学金</b></p>
          <p>全国首届深空文化创意作品全国特等奖、“学院派奖”全国最高奖、斯赫姆KTTK 优秀奖、中国好创意二等奖、米兰设计周三等奖等设计竞赛 <strong>30+ </strong>项</p>
        </section>

        <div className="hello-signature"><DisplayTitle variant="hello" /></div>
      </ScaleStage>
  );
}

export default function AboutPage({ onNavigate }) {
  return (
    <main className="portfolio-page standalone-about-page">
      <PortfolioNav />
      <section className="portfolio-section" id="about" aria-label="About Me">
        <AboutStage onNavigate={onNavigate} fitViewport />
      </section>
    </main>
  );
}
