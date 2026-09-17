# Architecture Plan v0.1

## 논리 계층

```text
UI
 ↓
Character State / Application Logic
 ↓
Body Spec Calculator
 ↓
Parametric Body Adapter (OxiHuman 우선)
 ↓
Front Orthographic Mannequin Renderer
 ↓
Comparison Canvas / PNG Export
```

## 주요 모듈 계획
- Character Manager: 최대 5인, 선택, 추가/삭제, 정렬.
- Body Spec Calculator: 성별/키/체중/등신 및 보정값 → 최종 규격.
- OxiHuman Adapter: Body Spec을 OxiHuman 파라미터/모프에 매핑.
- Renderer: 정면 Orthographic 결과를 최소 검정 선화 마네킹으로 표현.
- Comparison Canvas: 동일 cm 스케일, 공통 바닥선, 키 그래프, 간격, 줌/팬.
- Exporter: 화면 상태와 독립된 PNG 출력.

## OxiHuman 활용 방향
OxiHuman을 파라메트릭 인체 엔진의 우선 후보로 사용한다. 사용자는 3D UI를 직접 다루지 않는다. 내부에서 신체 형태를 계산하고 정면 Orthographic 결과를 단순 Body Mannequin으로 변환한다.

v0.1에서는 정면만 구현하되 구조상 향후 측면/후면/3/4 확장이 가능하도록 렌더러와 Body Spec을 분리한다.

## 비기능 원칙
- 동일 입력 → 동일 Body Spec/결과.
- AI 이미지 생성 랜덤성을 핵심 신체 계산에 사용하지 않는다.
- 무거운 계산은 UI 입력을 막지 않도록 분리한다.
- 저장/덮어쓰기 같은 사용자 데이터 작업은 명시적으로 처리한다.
