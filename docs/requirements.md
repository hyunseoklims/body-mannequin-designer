# Requirements v0.1

## 목적
성별, 키, 체중, 등신을 기반으로 단순한 정면 인체 마네킹을 생성하고 최대 5명의 키와 신체 비율을 한 화면에서 비교한다.

## 초기 상태
프로그램 최초 실행 시 2명이 자동 생성된다.

| 이름 | 성별 | 키 | 등신 | 체중 |
|---|---|---:|---:|---:|
| 기본 남성 | 남성 | 175 cm | 6.0H | 75 kg |
| 기본 여성 | 여성 | 162 cm | 6.0H | 55 kg |

## 인물 관리
- 최대 5명.
- 좌측 사이드바에 카드 형식으로 표시.
- 카드는 이름, 성별, 키, 체중, 등신의 요약을 표시.
- 카드 순서를 위/아래로 드래그해 변경할 수 있다.
- 카드 순서 변경 즉시 중앙 마네킹의 좌→우 순서도 동일하게 변경한다.
- 카드를 클릭하면 선택 인물이 되고 우측 설정 패널이 해당 인물을 표시한다.

## 인물 추가
`+ 인물 추가`를 누르면 모달을 연다.
입력값: 인물 이름, 성별, 키(cm), 체중(kg), 등신(H).
성별 선택 시 기본 프리셋을 초기값으로 사용할 수 있다.
- 남성: 175 / 75 / 6.0H
- 여성: 162 / 55 / 6.0H
5명 등록 시 추가 버튼 비활성화.

## Body Mannequin
- v0.1은 정면만 지원.
- 흰 배경, 검정색 단선.
- 얼굴 이목구비, 머리카락, 의상, 채색, 명암, 질감 제거.
- 손발 세부묘사는 최소화.
- 막대인간이 아니라 어깨/흉곽/허리/골반/사지 굵기가 보이는 최소 신체 볼륨 실루엣.
- 중립 정면 직립 자세.
- 모든 인물은 같은 바닥선과 동일한 cm 스케일을 사용.
- 서로 다른 키를 동일 높이로 정규화하지 않는다.

## 비교 캔버스
- 1~5명 마네킹 표시.
- 키 그래프 포함.
- 세로축: 키(cm).
- 가로축: 좌측 카드 순서와 동일한 인물.
- 인물별 고유 표시색은 카드 표시/키 그래프에 사용하고 마네킹 선화는 검정 유지.
- 인물 간격 조절 컨트롤 제공. 간격 변경은 마네킹 크기에 영향을 주지 않는다.
- 마우스 휠 확대/축소.
- 확대 상태에서 Pan 지원.
- 가로/세로 스크롤 지원.
- 우측 하단에 확대율/스크롤 네비게이션 영역 배치.
- 화면 맞춤(Zoom Fit) 지원.

## 세부 설정
우측 패널은 선택 인물만 수정한다.
기본값: 이름, 성별, 키, 체중, 등신.
체형 조정 후보: 어깨폭, 흉곽폭, 허리폭, 골반폭, 상체길이, 다리길이, 팔길이, 허벅지 굵기, 종아리 굵기.
슬라이더는 실제 Body Spec 수치를 변경해야 한다.

## 출력
하단 고정 영역에 `마네킹 이미지 저장` 버튼을 둔다.
v0.1 저장 형식은 PNG.
UI 스크린샷이 아니라 출력용 캔버스를 별도 렌더링한다.
화면의 현재 줌/스크롤 상태가 저장 이미지의 실제 신체 스케일을 변경해서는 안 된다.

## UI/UX reference update
- v0.1 adopts a **Size Sim-inspired canvas-first UI direction** as a visual/interaction reference.
- This means a clean white interface, minimal controls, restrained borders, wide central comparison canvas, and unobtrusive sidebars.
- It is not a requirement to reproduce Size Sim. Do not copy its brand, assets, code, or exact proprietary layout; adapt the general interaction principles to Body Mannequin Designer.
- The central mannequin/height comparison canvas must remain the dominant visual area.
