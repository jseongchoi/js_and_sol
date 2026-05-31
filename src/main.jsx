import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Heart,
  Images,
  MapPin,
  Navigation,
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
    parents: "최도윤 · 이혜진의 아들",
  },
  bride: {
    name: "이솔",
    shortName: "솔",
    parents: "이재호 · 박민아의 딸",
  },
  date: {
    year: "2026",
    month: "10",
    day: "17",
    weekday: "토요일",
    time: "오전 10시 40분",
    isoStartUtc: "20261017T014000Z",
    isoEndUtc: "20261017T034000Z",
    localIso: "2026-10-17T10:40:00+09:00",
  },
  venue: {
    name: "더링크호텔서울",
    displayName: "더링크 웨딩홀",
    hall: "2F 링크홀",
    address: "서울특별시 구로구 경인로 610",
    subway: "1호선 구로역 도보 약 5~7분 · 1/2호선 신도림역 도보 약 10분",
    shuttle: "신도림역 셔틀 운행 여부는 예식장 당일 안내 기준으로 확인해 주세요.",
    parking: "주차 약 800대 가능으로 소개되어 있습니다.",
  },
  message:
    "서로의 계절을 천천히 지나온 두 사람이 이제 같은 방향을 바라보려 합니다. 이른 토요일의 빛 안에서, 가장 가까운 분들과 조용하고 선명한 시작을 나누고 싶습니다.",
  note: "격식은 가볍게, 마음은 깊게. 편안한 걸음으로 와 주세요.",
  rsvpUrl: "https://forms.gle/example-rsvp",
  accounts: [
    { side: "groom", owner: "신랑 최지성", bank: "국민은행", number: "123456-01-234567" },
    { side: "groom", owner: "혼주 최도윤", bank: "하나은행", number: "456-910123-45607" },
    { side: "bride", owner: "신부 이솔", bank: "신한은행", number: "110-123-456789" },
    { side: "bride", owner: "혼주 이재호", bank: "우리은행", number: "1002-234-567890" },
  ],
};

const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);

const infoCards = [
  {
    title: "예식 안내",
    text: "예식은 2F 링크홀에서 진행됩니다. 여유로운 인사를 위해 예식 20분 전 도착을 권합니다.",
  },
  {
    title: "식사 안내",
    text: "예식 후 같은 건물 연회장에서 식사가 준비됩니다. 현장 안내에 따라 이동해 주세요.",
  },
  {
    title: "화환 안내",
    text: "축하의 마음만 감사히 받겠습니다. 편안한 마음으로 참석해 주세요.",
  },
];

const timeline = [
  { time: "10:00", title: "도착 및 인사", text: "로비 안내에 따라 2F 링크홀로 이동해 주세요." },
  { time: "10:40", title: "예식 시작", text: "지성과 이솔의 첫 장면이 시작됩니다." },
  { time: "11:20", title: "사진 촬영", text: "예식 직후 홀 앞에서 함께 기록을 남깁니다." },
];

const transportCards = [
  {
    icon: Train,
    label: "Subway",
    title: "구로역 · 신도림역",
    text: wedding.venue.subway,
  },
  {
    icon: Navigation,
    label: "Shuttle",
    title: "셔틀 안내",
    text: wedding.venue.shuttle,
  },
  {
    icon: MapPin,
    label: "Parking",
    title: "주차 안내",
    text: wedding.venue.parking,
  },
];

const galleryImages = [
  {
    src: asset("wedding-hero.png"),
    alt: "부케를 든 웨딩 무드 사진",
    caption: "Together",
  },
  {
    src: asset("gallery-detail.png"),
    alt: "꽃과 리본이 놓인 웨딩 디테일 사진",
    caption: "Details",
  },
  {
    src: asset("gallery-venue.png"),
    alt: "플라워 아치가 있는 웨딩홀 사진",
    caption: "Ceremony",
  },
];

const heroPetals = Array.from({ length: 12 }, (_, index) => index);

function encodedVenueQuery() {
  return encodeURIComponent(`${wedding.venue.name} ${wedding.venue.address}`);
}

function googleCalendarUrl() {
  const title = encodeURIComponent(`${wedding.groom.shortName} & ${wedding.bride.shortName} 결혼식`);
  const details = encodeURIComponent(`${wedding.venue.name} ${wedding.venue.hall}`);
  const location = encodeURIComponent(wedding.venue.address);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${wedding.date.isoStartUtc}/${wedding.date.isoEndUtc}&details=${details}&location=${location}`;
}

function getDday() {
  const target = new Date(wedding.date.localIso);
  const diff = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-Day";
  return `D+${Math.abs(diff)}`;
}

function getCountdown() {
  const target = new Date(wedding.date.localIso).getTime();
  const diff = Math.max(0, target - Date.now());
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
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
    const items = document.querySelectorAll("[data-reveal]");
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
      item.style.setProperty("--delay", `${Math.min(index * 36, 220)}ms`);
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
      <img className="hero-photo" src={galleryImages[0].src} alt={galleryImages[0].alt} />
      <div className="hero-overlay" />
      <div className="hero-petals" aria-hidden="true">
        {heroPetals.map((item) => (
          <span key={item} />
        ))}
      </div>
      <div className="line-flower" aria-hidden="true">
        <span />
        <span />
      </div>
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
        <span>
          {wedding.date.month}
          {wedding.date.day}
        </span>
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
    <div className="calendar-month" aria-label="2026년 10월 달력">
      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
        <b key={day}>{day}</b>
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <i key={`blank-${index}`} aria-hidden="true" />
      ))}
      {calendarDays.map((day) => (
        <span key={day} className={day === 17 ? "is-wedding-day" : ""}>
          {day}
        </span>
      ))}
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
        <span>{wedding.date.time} | {wedding.venue.displayName}</span>
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
        {infoCards.map((item) => (
          <article key={item.title} className="info-card">
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="timeline-list">
        {timeline.map((item, index) => (
          <article key={item.time} style={{ "--step": index }}>
            <time>{item.time}</time>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ onOpen }) {
  const [index, setIndex] = useState(0);
  const active = galleryImages[index];

  function move(step) {
    setIndex((current) => (current + step + galleryImages.length) % galleryImages.length);
  }

  return (
    <section id="gallery" className="gallery-section section-block" data-reveal>
      <div className="section-head centered">
        <p>Gallery</p>
        <h2>우리의 장면</h2>
        <span>꽃과 빛, 공간의 온도를 차분히 담았습니다.</span>
      </div>
      <button className="gallery-frame" type="button" onClick={() => onOpen(index)} aria-label={`${active.caption} 사진 크게 보기`}>
        <img src={active.src} alt={active.alt} />
        <span>{active.caption}</span>
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
        label: "카카오맵",
        href: `https://map.kakao.com/link/search/${encodedVenueQuery()}`,
      },
      {
        label: "네이버",
        href: `https://map.naver.com/p/search/${encodedVenueQuery()}`,
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

      <div className="map-card" aria-label="더링크호텔서울 위치 안내">
        <svg className="route-svg" viewBox="0 0 320 220" aria-hidden="true">
          <path className="road road-main" d="M22 56 C92 34, 150 114, 302 82" />
          <path className="road road-sub" d="M-8 166 C80 112, 180 202, 332 128" />
          <path className="road road-thin" d="M76 -8 L244 232" />
          <path className="road road-thin" d="M-14 96 L332 196" />
        </svg>
        <span className="station station-a">구로역</span>
        <span className="station station-b">신도림역</span>
        <div className="map-pin">
          <MapPin size={20} />
          <span>VENUE</span>
        </div>
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
        {transportCards.map(({ icon: Icon, label, title, text }) => (
          <article key={label} className="transport-card">
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
        <a className="primary-action wide" href={googleCalendarUrl()} target="_blank" rel="noreferrer">
          캘린더에 추가
          <CalendarPlus size={16} />
        </a>
      </div>
    </section>
  );
}

function GiftSection({ showToast }) {
  const [side, setSide] = useState("groom");
  const accounts = wedding.accounts.filter((account) => account.side === side);

  return (
    <section className="gift-section section-block" data-reveal>
      <div className="divider-line" aria-hidden="true" />
      <div className="section-head centered">
        <p>For Your Heart</p>
        <h2>마음 전하실 곳</h2>
      </div>
      <div className="account-tabs" role="tablist" aria-label="계좌 구분">
        <button type="button" className={side === "groom" ? "is-active" : ""} onClick={() => setSide("groom")}>
          신랑측에게
        </button>
        <button type="button" className={side === "bride" ? "is-active" : ""} onClick={() => setSide("bride")}>
          신부측에게
        </button>
      </div>
      <div className="account-list">
        {accounts.map((account) => (
          <article className="account-card" key={`${account.owner}-${account.number}`}>
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

function FloatingDock({ onShare }) {
  return (
    <nav className="floating-dock" aria-label="빠른 이동">
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

function GalleryLightbox({ item, onClose }) {
  if (item === null) return null;
  const active = galleryImages[item];

  return (
    <div className="lightbox" role="dialog" aria-label="사진 크게 보기">
      <div className="lightbox-panel">
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <img className="lightbox-photo" src={active.src} alt={active.alt} />
        <p>{active.caption}</p>
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

  useReveal();
  useScrollEffects();

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
      <main className="app-shell">
        <Hero onShare={handleShare} />
        <DateMark />
        <InvitationLetter />
        <WeddingDaySection />
        <FamilySection />
        <InformationSection />
        <GallerySection onOpen={setLightboxItem} />
        <TransportSection showToast={showToast} />
        <GiftSection showToast={showToast} />
        <RsvpSection onShare={handleShare} />
      </main>
      <FloatingDock onShare={handleShare} />
      <footer className="site-footer">
        {wedding.groom.shortName} & {wedding.bride.shortName}
        <br />
        {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
      </footer>
      <GalleryLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      <Toast message={toast} />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = rootElement._weddingRoot ?? createRoot(rootElement);
rootElement._weddingRoot = root;
root.render(<App />);
