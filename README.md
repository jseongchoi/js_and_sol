# 모바일 청첩장

Vite + React로 만든 모바일 우선 청첩장입니다. GitHub Pages에는 빌드 결과물(`dist`)이 배포됩니다.

## 현재 정보

- 신랑: 최지성
- 신부: 이솔
- 예식일: 2026년 10월 17일 토요일 오전 10시 40분
- 장소: 더링크호텔서울 / 더링크 웨딩홀
- 홀: 2F 링크홀
- 주소: 서울특별시 구로구 경인로 610

## 구조

- `index.html`: Vite 진입점과 공유 메타 정보
- `src/main.jsx`: 청첩장 데이터와 React 화면 구성
- `src/styles.css`: 모바일 청첩장 스타일
- `vite.config.js`: GitHub Pages용 상대 경로 빌드 설정
- `.github/workflows/deploy.yml`: GitHub Pages Actions 배포 설정

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## GitHub Pages 배포

이 저장소를 GitHub에 push한 뒤 저장소 설정에서 Pages의 Source를 `GitHub Actions`로 바꾸면, `.github/workflows/deploy.yml`이 자동으로 빌드하고 배포합니다.

1. 변경사항을 커밋하고 push합니다.
2. GitHub 저장소 `Settings`로 이동합니다.
3. `Pages` 메뉴를 엽니다.
4. `Build and deployment`의 Source를 `GitHub Actions`로 선택합니다.
5. Actions가 통과하면 Pages URL이 생성됩니다.

## 수정 위치

이름, 날짜, 식장, 주소, 계좌, RSVP 링크는 `src/main.jsx` 상단의 `wedding` 객체에서 바꾸면 됩니다.

## 사진 교체

현재는 사진이 들어갈 자리를 CSS 플레이스홀더로 만들었습니다. 실제 사진을 넣을 때는 `public/assets/` 폴더를 만들고 다음 파일명을 추천합니다.

- `public/assets/main.jpg`
- `public/assets/gallery-1.jpg`
- `public/assets/gallery-2.jpg`
- `public/assets/gallery-3.jpg`
- `public/assets/gallery-4.jpg`

그 다음 `src/main.jsx`의 사진 플레이스홀더를 `<img src="./assets/main.jpg" />` 방식으로 바꾸면 됩니다.

## 포함 기능

- 모바일 공유 시트
- 주소/계좌 복사
- Google Calendar 추가
- 카카오맵/네이버맵 링크
- 스크롤 등장 애니메이션
- 모바일 우선 반응형 UI
- GitHub Pages 자동 배포 workflow
