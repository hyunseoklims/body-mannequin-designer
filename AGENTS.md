# AGENTS.md

## 목표
Body Mannequin Designer v0.1을 기획 문서에 맞춰 점진적으로 구현한다.

## 개발 원칙
1. 요구사항 이해 → 기존 코드 확인 → 최소 변경 → 실제 동작 검증.
2. v0.1에서는 정면 마네킹과 최대 5인 비교에 집중한다.
3. 기존 기능을 임의로 삭제하거나 범위를 확장하지 않는다.
4. 신체 수치는 UI 문구가 아니라 실제 Body Spec과 렌더링 좌표/모프에 반영한다.
5. 키는 절대값으로 고정하고 등신 및 체형 조정은 전체 키를 변경하지 않는다.
6. 저장 결과는 현재 화면 캡처가 아니라 출력용 렌더링 결과여야 한다.
7. OxiHuman 사용 시 Apache-2.0 및 포함 자산의 CC0 고지를 유지한다.
8. MakeHuman AGPL 프로그램 코드는 직접 포함하지 않는다.

## 구현 순서 권장
1. 기본 2인 데이터 모델
2. 좌측 카드/선택/순서 변경
3. 정면 마네킹 렌더링
4. 우측 기본값/슬라이더
5. 최대 5인 추가/삭제
6. 비교 캔버스와 키 그래프
7. 간격/줌/팬/스크롤/화면 맞춤
8. PNG 출력
9. OxiHuman 통합 검증 및 라이선스 고지

## UI reference rule
For v0.1, treat Size Sim as the primary UI/UX direction reference: clean, white, minimal, and canvas-first. Adapt the principles rather than cloning the site. Preserve the project's established three-column structure (character cards / comparison canvas / selected-character settings) plus the slim bottom export bar. Do not let decorative UI reduce comparison-canvas space.
