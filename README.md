# PRISM - Portfolio 2026

个人设计师秋招作品集的第一阶段视觉与交互原型。视觉依据 Figma 文件 `DsKiNQC6i88gCs0DkCRHE9` 的个人网站画板实现。

## 技术架构

- React 19 + Vite
- Three.js + React Three Fiber + Drei
- GSAP + ScrollTrigger
- Postprocessing Bloom
- HTML / CSS Editorial Typography

## 当前完成

- Figma 风格的 Serif / Pixel / Sans / 中文混合字形系统
- 纯黑首屏海报构图、程序化透明 Prism、多光源产品摄影灯光
- White Beam、Rainbow Spectrum、18 层纵向光学切片
- 指针惯性、Prism 轻旋转、光谱位移和 Pointer Refraction
- 六个真实项目名称与集中式 Spectrum Color 配置
- 项目 Hover / Focus 连续切换与 WebGL Optical Lens Preview
- About、Beyond、Black-to-White Ending 的响应式视觉骨架
- Reduced Motion、Reduced Transparency、移动端低 DPR / 低 Bloom / 低传输分辨率
- WebGL 场景动态加载，DOM Typography 优先显示

## 主要模块

- `src/config/visual.js`：Prism、灯光、Spectrum、Bloom、Pointer 参数
- `src/data/projects.js`：项目名称、项目色、波长与 Spectrum 标签
- `src/components/typography/`：Portfolio 混合字形与像素字形
- `src/components/optical/`：DOM White Beam 与 Spectrum Slices
- `src/components/scene/PrismScene.jsx`：R3F 场景、Prism Geometry、Lighting Rig
- `src/components/scene/OpticalGlass.jsx`：项目 Hover 光学镜片
- `src/components/sections/`：Hero、About、Work、Beyond、Ending

## 本地预览

```bash
npm install
npm run dev
```

访问 `http://localhost:5182/`。

构建校验：

```bash
npm run build
```

## 待补内容

- Education、Experience、Contact 的真实信息
- 六个项目的真实封面图、案例摘要与 Case Study 正文
- Email 与 Resume 链接
- 可替换程序化 Prism 的最终 `prism.glb`
