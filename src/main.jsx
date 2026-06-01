import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Heart,
  Images,
  MapPin,
  Share2,
  Sparkles,
  Train,
  X,
} from "lucide-react";
import "./styles.css";

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const wedding = {
  groom: {
    name: "최지성",
    shortName: "지성",
    parents: "최정재 · 신순채의 아들",
  },
  bride: {
    name: "이솔",
    shortName: "솔",
    parents: "이돈형 · 임혜경의 딸",
  },
  date: {
    year: "2026",
    month: "10",
    day: "17",
    weekday: "토요일",
    time: "오전 10시 40분",
    localIso: "2026-10-17T10:40:00+09:00",
  },
  venue: {
    name: "더링크호텔서울",
    displayName: "더링크 웨딩홀",
    hall: "2F 링크홀",
    address: "서울특별시 구로구 경인로 610",
    subway: "1호선 구로역 도보 약 5~7분 · 1/2호선 신도림역 도보 약 10분",
    parking: "지하주차장 600대, 외부주차장 200대 규모로 총 800여대 주차가 가능하며 하객 1시간 30분 무료 주차로 안내되어 있습니다.",
  },
  message:
    "서로의 계절을 천천히 지나온 두 사람이 이제 같은 방향을 바라보려 합니다. 이른 토요일의 빛 안에서, 가장 가까운 분들과 조용하고 선명한 시작을 나누고 싶습니다.",
  note: "격식은 가볍게, 마음은 깊게. 편안한 걸음으로 와 주세요.",
  rsvpUrl: "https://forms.gle/example-rsvp",
  accounts: [
    { side: "groom", owner: "신랑 최지성", bank: "국민은행", number: "123456-01-234567" },
    { side: "groom", owner: "혼주 최정재", bank: "하나은행", number: "456-910123-45607" },
    { side: "bride", owner: "신부 이솔", bank: "신한은행", number: "110-123-456789" },
    { side: "bride", owner: "혼주 이돈형", bank: "우리은행", number: "1002-234-567890" },
  ],
};

const calendarDays = Array.from({ length: 17 }, (_, index) => index + 1);

const infoCards = [
  {
    title: "주차 안내",
    text: wedding.venue.parking,
  },
  {
    title: "삼성전자 배차 안내",
    text: "출발 장소: 삼성전자 화성캠퍼스 H3\n출발 시간: 오전 9시 10분\n선탑자: 김수지",
  },
  {
    title: "화환 안내",
    text: "축하의 마음만 감사히 받겠습니다. 편안한 마음으로 참석해 주세요.",
  },
];

const transportCards = [
  {
    icon: Train,
    label: "Subway",
    title: "구로역 · 신도림역",
    text: wedding.venue.subway,
  },
];

// 사진 교체/추가 방법은 PHOTO_GUIDE.md를 참고하세요.
// 첫 번째 사진은 첫 화면 메인 사진과 갤러리 첫 장에 함께 사용됩니다.
const galleryImages = [
  {
    src: asset("wedding-hero.png"),
    alt: "부케를 든 웨딩 무드 사진",
  },
  {
    src: asset("gallery-detail.png"),
    alt: "꽃과 리본이 놓인 웨딩 디테일 사진",
  },
  {
    src: asset("gallery-venue.png"),
    alt: "플라워 아치가 있는 웨딩홀 사진",
  },
];

const DAY_MS = 1000 * 60 * 60 * 24;

function encodedVenueQuery() {
  return encodeURIComponent(`${wedding.venue.name} ${wedding.venue.address}`);
}

function naverMapUrl() {
  return `https://map.naver.com/p/search/${encodedVenueQuery()}`;
}

function getDday() {
  const target = new Date(wedding.date.localIso);
  const diff = Math.ceil((target - new Date()) / DAY_MS);
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

function getCountdown() {
  const target = new Date(wedding.date.localIso).getTime();
  const diff = Math.max(0, target - Date.now());
  const day = Math.floor(diff / DAY_MS);
  const hour = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minute = Math.floor((diff / (1000 * 60)) % 60);
  const second = Math.floor((diff / 1000) % 60);
  return { day, hour, minute, second };
}

async function copySafeText(text, done, fail) {
  if (!navigator.clipboard) {
    fail?.();
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    done?.();
    return true;
  } catch {
    fail?.();
    return false;
  }
}

function useToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef(0);

  function show(nextMessage) {
    setMessage(nextMessage);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setMessage(""), 1800);
  }

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return [message, show];
}

function useCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return countdown;
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal], [data-card]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.14 }
    );

    items.forEach((item, index) => {
      const cardIndex = Number(item.getAttribute("data-card-index") ?? index);
      const delay = item.hasAttribute("data-card") ? Math.min(cardIndex * 80, 260) : Math.min(index * 36, 220);
      item.style.setProperty("--delay", `${delay}ms`);
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);
}

function useScrollEffects() {
  useEffect(() => {
    let frame = 0;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      const heroShift = Math.min(window.scrollY * 0.1, 80);

      document.documentElement.style.setProperty("--scroll-progress", `${progress}`);
      document.documentElement.style.setProperty("--hero-shift", `${heroShift}px`);
      frame = 0;
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
}

function Hero({ onShare }) {
  return (
    <section id="intro" className="hero-section" data-reveal>
      <img
        className="hero-photo protected-photo"
        src={galleryImages[0].src}
        alt={galleryImages[0].alt}
        draggable="false"
        decoding="async"
        fetchPriority="high"
        data-protected-image
      />
      <div className="hero-overlay" />
      <div className="hero-copy">
        <p>We are getting married</p>
        <h1>
          {wedding.groom.shortName}
          <span>&</span>
          {wedding.bride.shortName}
        </h1>
        <strong>
          {wedding.date.year}. {wedding.date.month}. {wedding.date.day} {wedding.date.weekday}
        </strong>
      </div>
      <button className="hero-share" type="button" onClick={onShare} aria-label="청첩장 공유">
        <Share2 size={16} />
      </button>
    </section>
  );
}

function DateMark() {
  return (
    <section className="date-mark-section" data-reveal aria-label="예식 날짜">
      <div className="date-mark">
        <span>{wedding.date.year}</span>
        <span>{wedding.date.month}.{wedding.date.day}</span>
      </div>
    </section>
  );
}

function InvitationLetter() {
  return (
    <section className="letter-section" data-reveal>
      <Heart className="letter-heart" size={38} strokeWidth={1.3} />
      <p>{wedding.message}</p>
      <div className="couple-sign">
        신랑 {wedding.groom.shortName} · 신부 {wedding.bride.shortName}
      </div>
    </section>
  );
}

function CountdownStrip() {
  const countdown = useCountdown();
  const units = [
    ["days", countdown.day],
    ["hours", countdown.hour],
    ["minutes", countdown.minute],
    ["seconds", countdown.second],
  ];

  return (
    <div className="countdown-strip" aria-label="예식까지 남은 시간">
      {units.map(([label, value]) => (
        <div key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function CalendarMonth() {
  return (
    <div className="calendar-card" aria-label="2026년 10월 달력">
      <div className="calendar-title">
        <span>{wedding.date.year}</span>
        <strong>{Number(wedding.date.month)}월</strong>
      </div>
      <div className="calendar-month">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <b key={day}>{day}</b>
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <i key={`blank-${index}`} aria-hidden="true" />
        ))}
        {calendarDays.map((day) => (
          <span key={day} className={day === 17 ? "is-wedding-day" : ""}>
            {day === 17 && <Heart className="calendar-heart" size={35} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />}
            <em>{day}</em>
          </span>
        ))}
      </div>
    </div>
  );
}

function WeddingDaySection() {
  return (
    <section className="wedding-day-section section-block" data-reveal>
      <div className="section-head centered">
        <p>Wedding Day</p>
        <h2>
          {wedding.date.year}년 {Number(wedding.date.month)}월 {Number(wedding.date.day)}일 {wedding.date.weekday}
        </h2>
        <span>{wedding.date.time} | {wedding.venue.displayName} | {wedding.venue.hall}</span>
      </div>
      <CalendarMonth />
      <CountdownStrip />
      <p className="dday-copy">
        {wedding.groom.shortName}
        <Heart size={13} fill="currentColor" />
        {wedding.bride.shortName} 결혼식까지 {getDday()} 남았습니다
      </p>
    </section>
  );
}

function FamilySection() {
  return (
    <section className="family-section section-block lavender-block" data-reveal>
      <div className="family-row">
        <span>{wedding.groom.parents}</span>
        <b>신랑 {wedding.groom.shortName}</b>
      </div>
      <div className="family-row">
        <span>{wedding.bride.parents}</span>
        <b>신부 {wedding.bride.shortName}</b>
      </div>
      <a className="wide-action" href="#rsvp">
        참석 의사 전하기
        <ChevronDown size={16} />
      </a>
    </section>
  );
}

function InformationSection() {
  return (
    <section className="information-section section-block lavender-block" data-reveal>
      <div className="section-head centered">
        <p>Information</p>
        <h2>안내사항</h2>
        <span>저희 웨딩에 대한 사전 안내를 드립니다.</span>
      </div>
      <div className="info-list">
        {infoCards.map((item, index) => (
          <article key={item.title} className="info-card" data-card data-card-index={index}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ onOpen, triggerRef }) {
  const [index, setIndex] = useState(0);
  const active = galleryImages[index];

  function move(step) {
    setIndex((current) => (current + step + galleryImages.length) % galleryImages.length);
  }

  return (
    <section id="gallery" className="gallery-section section-block" data-reveal>
      <div className="section-head centered">
        <p>Gallery</p>
      </div>
      <button
        ref={triggerRef}
        className="gallery-frame"
        type="button"
        onClick={() => onOpen(index)}
        onContextMenu={(event) => event.preventDefault()}
        aria-label="사진 크게 보기"
        data-protected-image
      >
        <img className="protected-photo" src={active.src} alt={active.alt} draggable="false" loading="lazy" decoding="async" />
      </button>
      <div className="gallery-controls" aria-label="사진 넘기기">
        <button type="button" onClick={() => move(-1)} aria-label="이전 사진">
          <ChevronLeft size={22} />
        </button>
        <strong>
          {index + 1} / {galleryImages.length}
        </strong>
        <button type="button" onClick={() => move(1)} aria-label="다음 사진">
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}

function TransportSection({ showToast }) {
  const mapLinks = useMemo(
    () => [
      {
        label: "네이버",
        href: naverMapUrl(),
      },
      {
        label: "카카오맵",
        href: `https://map.kakao.com/link/search/${encodedVenueQuery()}`,
      },
      {
        label: "구글맵",
        href: `https://www.google.com/maps/search/?api=1&query=${encodedVenueQuery()}`,
      },
    ],
    []
  );

  return (
    <section id="route" className="transport-section section-block lavender-block" data-reveal>
      <div className="section-head centered">
        <p>Location</p>
        <h2>{wedding.venue.displayName}</h2>
        <span>
          {wedding.venue.hall}
          <br />
          {wedding.venue.address}
        </span>
      </div>

      <div className="map-card" aria-label="더링크호텔서울 위치 안내" data-card data-card-index="0">
        <div className="map-card-head">
          <MapPin size={18} />
          <div>
            <strong>{wedding.venue.displayName}</strong>
            <span>{wedding.venue.hall}</span>
          </div>
        </div>
        <a className="naver-map-preview" href={naverMapUrl()} target="_blank" rel="noreferrer" aria-label="네이버 지도에서 더링크호텔서울 보기">
          <span className="naver-map-badge">NAVER MAP</span>
          <span className="naver-road road-a" />
          <span className="naver-road road-b" />
          <span className="naver-road road-c" />
          <span className="naver-subway">1</span>
          <span className="naver-place station-guro">구로역</span>
          <span className="naver-place station-sindorim">신도림역</span>
          <span className="naver-pin">
            <MapPin size={20} fill="currentColor" />
            <strong>{wedding.venue.displayName}</strong>
          </span>
          <span className="naver-open">
            네이버 지도에서 보기
            <ExternalLink size={14} />
          </span>
        </a>
      </div>

      <div className="map-links">
        {mapLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
            <ExternalLink size={14} />
          </a>
        ))}
      </div>

      <div className="transport-list">
        {transportCards.map(({ icon: Icon, label, title, text }, index) => (
          <article key={label} className="transport-card" data-card data-card-index={index + 1}>
            <Icon size={18} />
            <div>
              <span>{label}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="button-grid">
        <button
          className="ghost-action wide"
          type="button"
          onClick={() =>
            copySafeText(
              wedding.venue.address,
              () => showToast("주소를 복사했습니다."),
              () => showToast("복사가 지원되지 않는 브라우저입니다.")
            )
          }
        >
          주소 복사
          <Copy size={15} />
        </button>
      </div>
    </section>
  );
}

function GiftSection({ showToast }) {
  const [side, setSide] = useState("groom");
  const accounts = wedding.accounts.filter((account) => account.side === side);
  const brideTabRef = useRef(null);
  const groomTabRef = useRef(null);

  function handleAccountTabKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextSide = side === "groom" ? "bride" : "groom";
    setSide(nextSide);
    window.requestAnimationFrame(() => {
      (nextSide === "groom" ? groomTabRef : brideTabRef).current?.focus();
    });
  }

  return (
    <section className="gift-section section-block" data-reveal>
      <div className="divider-line" aria-hidden="true" />
      <div className="section-head centered">
        <p>For Your Heart</p>
        <h2>마음 전하실 곳</h2>
      </div>
      <div className="account-tabs" role="tablist" aria-label="계좌 구분" onKeyDown={handleAccountTabKeyDown}>
        <button
          id="account-tab-groom"
          ref={groomTabRef}
          type="button"
          role="tab"
          aria-selected={side === "groom"}
          aria-controls="account-panel"
          className={side === "groom" ? "is-active" : ""}
          onClick={() => setSide("groom")}
        >
          신랑측에게
        </button>
        <button
          id="account-tab-bride"
          ref={brideTabRef}
          type="button"
          role="tab"
          aria-selected={side === "bride"}
          aria-controls="account-panel"
          className={side === "bride" ? "is-active" : ""}
          onClick={() => setSide("bride")}
        >
          신부측에게
        </button>
      </div>
      <div id="account-panel" className="account-list" role="tabpanel" aria-labelledby={`account-tab-${side}`}>
        {accounts.map((account, index) => (
          <article className="account-card is-visible" key={`${account.owner}-${account.number}`}>
            <div>
              <strong>{account.owner}</strong>
              <span>
                {account.bank} {account.number}
              </span>
            </div>
            <button
              className="copy-button"
              type="button"
              onClick={() =>
                copySafeText(
                  `${account.bank} ${account.number}`,
                  () => showToast(`${account.owner} 계좌를 복사했습니다.`),
                  () => showToast("복사가 지원되지 않는 브라우저입니다.")
                )
              }
            >
              <Copy size={15} />
              복사
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function RsvpSection({ onShare }) {
  return (
    <section id="rsvp" className="rsvp-section section-block lavender-block" data-reveal>
      <Sparkles size={22} />
      <h2>함께해 주신다면 큰 기쁨입니다</h2>
      <p>{wedding.note}</p>
      <div className="button-grid">
        <a className="primary-action wide" href={wedding.rsvpUrl} target="_blank" rel="noreferrer">
          참석 의사 남기기
          <Check size={16} />
        </a>
        <button className="ghost-action wide" type="button" onClick={onShare}>
          청첩장 공유하기
          <Share2 size={16} />
        </button>
      </div>
    </section>
  );
}

function FloatingDock({ onShare, isHidden }) {
  return (
    <nav className="floating-dock" aria-label="빠른 이동" aria-hidden={isHidden}>
      <a href="#route">
        <MapPin size={16} />
        지도
      </a>
      <a href="#gallery">
        <Images size={16} />
        사진
      </a>
      <a href="#rsvp">
        <Check size={16} />
        RSVP
      </a>
      <button type="button" onClick={onShare}>
        <Share2 size={16} />
        공유
      </button>
    </nav>
  );
}

function GalleryLightbox({ item, onClose, returnFocusRef }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (item === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 0);

    function handleModalKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleModalKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleModalKeyDown);
      returnFocusRef?.current?.focus({ preventScroll: true });
    };
  }, [item, onClose, returnFocusRef]);

  if (item === null) return null;
  const active = galleryImages[item];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={onClose}>
      <div className="lightbox-panel" onClick={(event) => event.stopPropagation()} onContextMenu={(event) => event.preventDefault()} data-protected-image>
        <button ref={closeButtonRef} type="button" className="lightbox-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <img className="lightbox-photo protected-photo" src={active.src} alt={active.alt} draggable="false" decoding="async" />
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

function App() {
  const [toast, showToast] = useToast();
  const [lightboxItem, setLightboxItem] = useState(null);
  const galleryTriggerRef = useRef(null);

  useReveal();
  useScrollEffects();

  useEffect(() => {
    function preventProtectedImageAction(event) {
      if (event.target instanceof Element && event.target.closest("[data-protected-image]")) {
        event.preventDefault();
      }
    }

    document.addEventListener("contextmenu", preventProtectedImageAction);
    document.addEventListener("dragstart", preventProtectedImageAction);
    return () => {
      document.removeEventListener("contextmenu", preventProtectedImageAction);
      document.removeEventListener("dragstart", preventProtectedImageAction);
    };
  }, []);

  function closeLightbox() {
    setLightboxItem(null);
  }

  async function handleShare() {
    const shareData = {
      title: `${wedding.groom.shortName} & ${wedding.bride.shortName} 모바일 청첩장`,
      text: `${wedding.date.year}.${wedding.date.month}.${wedding.date.day} ${wedding.venue.name} ${wedding.venue.hall}`,
      url: window.location.href.split("#")[0],
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    await copySafeText(
      shareData.url,
      () => showToast("청첩장 링크를 복사했습니다."),
      () => showToast("공유가 지원되지 않아 링크 복사에 실패했습니다.")
    );
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <main className="app-shell" aria-hidden={lightboxItem !== null}>
        <Hero onShare={handleShare} />
        <DateMark />
        <InvitationLetter />
        <WeddingDaySection />
        <FamilySection />
        <InformationSection />
        <GallerySection onOpen={setLightboxItem} triggerRef={galleryTriggerRef} />
        <TransportSection showToast={showToast} />
        <GiftSection showToast={showToast} />
        <RsvpSection onShare={handleShare} />
      </main>
      <FloatingDock onShare={handleShare} isHidden={lightboxItem !== null} />
      <footer className="site-footer" aria-hidden={lightboxItem !== null}>
        {wedding.groom.shortName} & {wedding.bride.shortName}
        <br />
        {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
      </footer>
      <GalleryLightbox item={lightboxItem} onClose={closeLightbox} returnFocusRef={galleryTriggerRef} />
      <Toast message={toast} />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = rootElement._weddingRoot ?? createRoot(rootElement);
rootElement._weddingRoot = root;
root.render(<App />);
