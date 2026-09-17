# UI Specification v0.1

## 전체 레이아웃

```text
┌───────────────┬────────────────────────────────────────┬──────────────────┐
│ 인물 카드      │          비교 캔버스                   │ 선택 인물 설정    │
│ [+ 인물 추가]  │ 키(cm) + 마네킹 1~5명                 │ 기본정보          │
│ [카드 1] ↕     │ 동일 바닥선 / 동일 실제 스케일         │ 체형 슬라이더     │
│ [카드 2] ↕     │ 간격 조절 / Wheel Zoom / Pan          │ 초기화            │
│ ...           │ 스크롤 / Zoom Fit / 확대율             │                  │
├───────────────┴────────────────────────────────────────┴──────────────────┤
│ 출력                                                        [PNG 저장] │
└──────────────────────────────────────────────────────────────────────────┘
```

## 좌측 사이드바
- 카드 기반.
- 최대 5개.
- 선택 상태 명확히 표시.
- Drag & Drop 정렬.
- 카드 순서 = 캔버스 좌→우 순서.
- 인물별 데이터 색상 표식 제공.

## 중앙 비교 캔버스
- 가장 넓은 영역.
- 흰색 작업 배경.
- 마네킹은 검정 선화.
- 키 그래프의 인물별 선/점은 각 인물 표시색 사용.
- 모든 발바닥은 공통 Floor Line에 맞춘다.
- 키 축은 cm 단위.
- 인물 간격 슬라이더/버튼.
- Wheel Zoom, Pan, Scroll, Zoom Fit.
- 선택 인물은 선화 색을 바꾸지 않고 선택 박스/표식으로 구분.

## 우측 사이드바
- 좌측에서 선택된 인물의 설정만 표시.
- 상단: 이름/성별/키/체중/등신.
- 하단: 신체 세부 조절 슬라이더.
- `기본 체형으로 초기화`는 해당 인물의 보정값만 초기화.

## 하단 바
- 화면 전체 폭을 사용하는 고정 출력 영역.
- v0.1 핵심 액션: `마네킹 이미지 저장`.

## UI Design Reference — Size Sim direction (v0.1 update)

The primary UI/UX reference for v0.1 is the clean, canvas-first approach seen in Size Sim. This is a design-direction reference only; do not copy its branding, assets, source code, or distinctive proprietary visual elements.

### Design principles
- The comparison canvas is the visual priority and should occupy most of the window.
- Use a bright white/neutral surface, restrained borders, compact controls, and generous whitespace.
- Sidebars should remain narrow enough that they do not crowd the mannequin comparison canvas.
- Keep the mannequin itself monochrome (white background + black minimal line drawing). Character-specific colors are reserved for data indicators such as height graph lines/points and small card markers.
- Avoid decorative UI, excessive dialogs, gradients, heavy shadows, and oversized controls.

### Layout
- Left sidebar: compact character cards, Add Character button, drag-and-drop vertical reordering. Card order must immediately control left-to-right mannequin order on the canvas.
- Center: large comparison canvas with front-view mannequins, common floor baseline, centimeter height scale/graph, per-character colored height indicator, adjustable character spacing, mouse-wheel zoom, pan, scroll/navigation, zoom percentage, and Fit to View.
- Right sidebar: settings for the currently selected character only. Basic values first, body-shape sliders below, vertically scrollable when necessary.
- Bottom bar: slim persistent output/action area with Save Mannequin Image (PNG) as the primary v0.1 action.

### Interaction priorities
1. Selecting a character card selects the corresponding mannequin and opens its settings.
2. Reordering cards updates mannequin order immediately.
3. Editing height/weight/head-count/body sliders updates the mannequin and height visualization in real time.
4. Zoom/pan/spacing are view controls only and must not alter physical body specifications or exported scale.
5. Export must render from model data, not capture the current UI viewport.
