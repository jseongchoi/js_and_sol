# 사진 교체 가이드

모바일 청첩장의 사진은 모두 `public/assets/` 폴더에서 관리합니다. 새 사진을 넣을 때는 PNG 파일을 사용하고, 파일명은 영문 소문자와 하이픈만 쓰는 것을 추천합니다.

## 현재 사용 중인 사진

| 파일 | 사용 위치 | 추천 비율 |
| --- | --- | --- |
| `public/assets/wedding-hero.png` | 첫 화면 메인 사진, 갤러리 1번째 사진 | 세로형 2:3 |
| `public/assets/gallery-detail.png` | 갤러리 2번째 사진 | 가로형 4:3 |
| `public/assets/gallery-venue.png` | 갤러리 3번째 사진 | 세로형 또는 가로형 |
| `public/assets/share-preview.png` | 카카오톡/문자/메신저 공유 썸네일 | 1200x630 |

첫 화면 사진은 `src/main.jsx`의 `galleryImages[0]`을 같이 사용합니다. 메인 사진만 바꾸고 싶어도 `wedding-hero.png`를 교체하면 됩니다.

공유 썸네일은 `index.html`의 Open Graph 메타 태그에서 `share-preview.png`를 사용합니다. 배포 주소가 바뀌면 `og:image`, `twitter:image`, `og:url`, `canonical` URL도 함께 바꿔주세요.

## 사진만 교체하는 방법

1. 새 사진을 PNG로 준비합니다.
2. 위 표의 파일명과 똑같이 이름을 바꿉니다.
3. `public/assets/` 폴더에 덮어씁니다.
4. 공유 썸네일도 바뀌어야 하면 `public/assets/share-preview.png`를 새로 만듭니다.
5. 개발 서버를 켜고 화면을 확인합니다.

```bash
npm run dev
```

파일명을 그대로 유지하면 코드를 수정하지 않아도 됩니다.

## 실제 사진 교체 체크리스트

- 첫 화면에 가장 중요한 세로 사진을 `wedding-hero.png`로 저장합니다.
- 갤러리용 사진은 현재 3장 기준으로 `wedding-hero.png`, `gallery-detail.png`, `gallery-venue.png`를 씁니다.
- 파일을 바꾼 뒤 첫 화면, 갤러리, 크게 보기 화면에서 얼굴이 잘리지 않는지 확인합니다.
- 새 사진이 너무 어둡거나 밝으면 `src/styles.css`의 `.hero-overlay`만 조정하면 됩니다.
- `dist/` 폴더는 빌드 결과물이므로 직접 수정하지 않습니다.

## 갤러리 사진 추가하기

새 사진을 추가하려면 먼저 `public/assets/`에 PNG 파일을 넣습니다.

예시:

```text
public/assets/gallery-04.png
```

그 다음 `src/main.jsx`의 `galleryImages` 배열에 항목을 하나 추가합니다.

```jsx
const galleryImages = [
  {
    src: asset("wedding-hero.png"),
    alt: "신랑 신부 웨딩 사진",
  },
  {
    src: asset("gallery-detail.png"),
    alt: "웨딩 디테일 사진",
  },
  {
    src: asset("gallery-venue.png"),
    alt: "예식장 사진",
  },
  {
    src: asset("gallery-04.png"),
    alt: "신랑 신부 야외 촬영 사진",
  },
];
```

갤러리의 `1 / 4` 숫자, 좌우 넘기기, 크게 보기 화면은 자동으로 따라갑니다.

## 사진 용량 팁

PNG 사진은 용량이 커질 수 있으니 모바일 로딩을 위해 긴 변 기준 1200-1800px 정도로 줄여서 넣는 것을 추천합니다. 파일 하나가 너무 크면 첫 화면 로딩이 느려질 수 있습니다.

## 배포 전 확인

사진을 교체한 뒤에는 아래 두 명령을 통과시키고 GitHub에 push합니다. `main` 브랜치에 push되면 GitHub Actions가 자동으로 Pages에 배포합니다.

```bash
npm run build
npm run test:e2e
```

카카오톡이나 메신저 공유 썸네일은 캐시가 남을 수 있습니다. 배포 후에도 예전 썸네일이 보이면 잠시 기다리거나 해당 서비스의 공유 디버거/캐시 초기화 도구를 사용합니다.

## 확인할 코드 위치

- 사진 목록: `src/main.jsx`의 `galleryImages`
- 첫 화면 사진: `src/main.jsx`의 `Hero` 컴포넌트, `galleryImages[0]` 사용
- 갤러리 화면: `src/main.jsx`의 `GallerySection`
- 크게 보기 화면: `src/main.jsx`의 `GalleryLightbox`
