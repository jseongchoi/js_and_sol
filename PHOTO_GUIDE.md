# 사진 교체 가이드

모바일 청첩장의 사진은 모두 `public/assets/` 폴더에서 관리합니다. 새 갤러리 사진은 `1.jpg`처럼 숫자 순서로 넣으면 됩니다.

## 현재 사용 중인 사진

| 파일 | 사용 위치 | 추천 비율 |
| --- | --- | --- |
| `public/assets/10.jpg` | 첫 화면 메인 사진 | 세로형 2:3 |
| `public/assets/1.jpg` ~ `public/assets/16.jpg` | 갤러리 사진 | 세로형 또는 가로형 |
| `public/assets/share-preview-card.png` | 카카오톡/문자/메신저 공유 썸네일 | 1200x600 |

첫 화면 사진은 `src/main.jsx`의 `heroImage`에서 `10.jpg`를 사용합니다.

공유 썸네일은 `index.html`의 Open Graph 메타 태그에서 `share-preview-card.png`를 사용합니다. 배포 주소가 바뀌면 `og:image`, `twitter:image`, `og:url`, `canonical` URL도 함께 바꿔주세요.

## 사진만 교체하는 방법

1. 새 사진을 JPG로 준비합니다.
2. 위 표의 파일명과 똑같이 이름을 바꿉니다.
3. `public/assets/` 폴더에 덮어씁니다.
4. 공유 썸네일도 바뀌어야 하면 아래 명령으로 `public/assets/share-preview-card.png`를 새로 만듭니다.
5. 개발 서버를 켜고 화면을 확인합니다.

```bash
npm run generate:share-preview
npm run dev
```

파일명을 그대로 유지하면 코드를 수정하지 않아도 됩니다.

## 실제 사진 교체 체크리스트

- 첫 화면에 가장 중요한 세로 사진을 `10.jpg`로 저장합니다.
- 갤러리용 사진은 현재 `1.jpg`부터 `16.jpg`까지 씁니다.
- 파일을 바꾼 뒤 첫 화면, 갤러리, 크게 보기 화면에서 얼굴이 잘리지 않는지 확인합니다.
- 새 사진이 너무 어둡거나 밝으면 `src/styles.css`의 `.hero-overlay`만 조정하면 됩니다.
- `dist/` 폴더는 빌드 결과물이므로 직접 수정하지 않습니다.

## 갤러리 사진 추가하기

새 사진을 추가하려면 먼저 `public/assets/`에 JPG 파일을 넣습니다.

예시:

```text
public/assets/17.jpg
```

그 다음 `src/main.jsx`의 `galleryImages` 숫자를 1장 늘립니다.

```jsx
const galleryImages = Array.from({ length: 17 }, (_, index) => ({
  src: asset(`${index + 1}.jpg`),
  alt: `웨딩 갤러리 사진 ${index + 1}`,
}));
```

갤러리의 `1 / 17` 숫자, 좌우 넘기기, 크게 보기 화면은 자동으로 따라갑니다.

## 사진 용량 팁

사진은 모바일 로딩을 위해 긴 변 기준 1200-1800px 정도로 줄여서 넣는 것을 추천합니다. 파일 하나가 너무 크면 첫 화면 로딩이 느려질 수 있습니다.

## 배포 전 확인

사진을 교체한 뒤에는 아래 두 명령을 통과시키고 GitHub에 push합니다. `main` 브랜치에 push되면 GitHub Actions가 자동으로 Pages에 배포합니다.

```bash
npm run build
npm run test:e2e
```

카카오톡이나 메신저 공유 썸네일은 캐시가 남을 수 있습니다. 배포 후에도 예전 썸네일이 보이면 잠시 기다리거나 해당 서비스의 공유 디버거/캐시 초기화 도구를 사용합니다.

## 확인할 코드 위치

- 사진 목록: `src/main.jsx`의 `galleryImages`
- 첫 화면 사진: `src/main.jsx`의 `heroImage`
- 갤러리 화면: `src/main.jsx`의 `GallerySection`
- 크게 보기 화면: `src/main.jsx`의 `GalleryLightbox`
- 공유 썸네일 생성: `scripts/generate-share-preview.mjs`
