import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarPlus,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Images,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  Train,
  X,
} from "lucide-react";
import "./styles.css";

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
    { owner: "신랑 최지성", bank: "국민은행", number: "123456-01-234567" },
    { owner: "신부 이솔", bank: "신한은행", number: "110-123-456789" },
    { owner: "혼주 최도윤", bank: "하나은행", number: "456-910123-45607" },
    { owner: "혼주 이재호", bank: "우리은행", number: "1002-234-567890" },
  ],
};

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
  return { day, hour, minute };
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

  function show(nextMessage) {
    setMessage(nextMessage);
    window.clearTimeout(show.timer);
    show.timer = window.setTimeout(() => setMessage(""), 1800);
  }

  return [message, show];
}

function useCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60 * 1000);
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    items.forEach((item, index) => {
      item.style.setProperty("--delay", `${Math.min(index * 42, 240)}ms`);
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
      const heroShift = Math.min(window.scrollY * 0.12, 96);

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

function OpeningScene({ onOpen }) {
  const [leaving, setLeaving] = useState(false);
  const sceneRef = useRef(null);

  function handleOpen() {
    setLeaving(true);
    window.setTimeout(onOpen, 980);
  }

  function handlePointerMove(event) {
    if (!sceneRef.current || leaving) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    sceneRef.current.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    sceneRef.current.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
    sceneRef.current.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    sceneRef.current.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function resetPointer() {
    if (!sceneRef.current) return;
    sceneRef.current.style.setProperty("--tilt-x", "0deg");
    sceneRef.current.style.setProperty("--tilt-y", "0deg");
    sceneRef.current.style.setProperty("--glow-x", "50%");
    sceneRef.current.style.setProperty("--glow-y", "42%");
  }

  return (
    <div
      ref={sceneRef}
      className={`opening-scene ${leaving ? "is-leaving" : ""}`}
      role="dialog"
      aria-label="청첩장 열기"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="opening-halo" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="opening-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="opening-envelope">
        <div className="envelope-back" />
        <div className="invitation-peek">
          <p>Wedding Invitation</p>
          <h1>
            {wedding.groom.shortName}
            <span>&</span>
            {wedding.bride.shortName}
          </h1>
          <small>
            {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
          </small>
        </div>
        <div className="envelope-pocket" />
        <div className="envelope-flap" />
        <div className="opening-seal">J&S</div>
      </div>
      <div className="opening-copy">
        <p>THE LINK HOTEL SEOUL</p>
        <h2>
          지성
          <span>&</span>
          솔
        </h2>
        <button type="button" onClick={handleOpen} disabled={leaving}>
          초대장 열기
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}

function TopBar({ onShare }) {
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="topbar" aria-label="모바일 청첩장">
        <a className="brand" href="#intro" aria-label="처음으로 이동">
          <span className="brand-mark">J</span>
          <span>
            <strong>Jisung & Sol</strong>
            <small>Wedding Invitation</small>
          </span>
        </a>
        <button className="share-mini" type="button" onClick={onShare}>
          <Share2 size={16} strokeWidth={2.2} />
          공유
        </button>
      </header>
    </>
  );
}

function CountdownStrip() {
  const countdown = useCountdown();
  const units = [
    ["Days", countdown.day],
    ["Hours", countdown.hour],
    ["Min", countdown.minute],
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

function Hero({ onShare }) {
  return (
    <section id="intro" className="hero-section" data-reveal>
      <div className="hero-visual" aria-label="메인 사진 자리">
        <div className="photo-stack" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="photo-frame">
          <span>MAIN PHOTO</span>
        </div>
        <div className="floating-date" aria-label="예식 날짜">
          <b>{wedding.date.day}</b>
          <span>
            {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
            <br />
            {wedding.date.weekday} {wedding.date.time}
          </span>
        </div>
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Wedding Invitation</p>
        <h1>
          {wedding.groom.shortName}
          <span>&</span>
          {wedding.bride.shortName}
        </h1>
        <p>{wedding.message}</p>
        <CountdownStrip />
        <div className="hero-actions">
          <a className="primary-action" href="#rsvp">
            참석 여부
            <ChevronDown size={16} />
          </a>
          <button className="secondary-action" type="button" onClick={onShare}>
            <Share2 size={16} />
            공유하기
          </button>
        </div>
      </div>
    </section>
  );
}

function CeremonyCard() {
  return (
    <section className="ceremony-section section-band" data-reveal>
      <div className="section-head">
        <p className="eyebrow">The Ceremony</p>
        <h2>예식 안내</h2>
      </div>
      <div className="ceremony-grid">
        <div>
          <span>DATE</span>
          <strong>
            {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
          </strong>
          <p>
            {wedding.date.weekday} {wedding.date.time} · {getDday()}
          </p>
        </div>
        <div>
          <span>VENUE</span>
          <strong>{wedding.venue.displayName}</strong>
          <p>
            {wedding.venue.hall}
            <br />
            {wedding.venue.address}
          </p>
        </div>
      </div>
      <div className="couple-row" aria-label="신랑 신부">
        <div>
          <b>{wedding.groom.name}</b>
          <span>{wedding.groom.parents}</span>
        </div>
        <i>&</i>
        <div>
          <b>{wedding.bride.name}</b>
          <span>{wedding.bride.parents}</span>
        </div>
      </div>
    </section>
  );
}

function VenueExperience() {
  return (
    <section className="venue-experience section-band" data-reveal>
      <div className="venue-art" aria-hidden="true">
        <span className="arch arch-large" />
        <span className="arch arch-small" />
        <span className="aisle" />
        <span className="light-line light-line-a" />
        <span className="light-line light-line-b" />
      </div>
      <div className="section-head centered">
        <p className="eyebrow">The Link Hall</p>
        <h2>2F 링크홀에서 만나요</h2>
        <p>
          높은 층고, 긴 버진로드, 미디어월 연출이 강점으로 소개되는 공간입니다. 실제 예식 안내는 당일
          현장 안내를 우선해 주세요.
        </p>
      </div>
      <div className="mood-tags" aria-label="예식 분위기">
        <span>호텔 웨딩</span>
        <span>10:40 Ceremony</span>
        <span>2F Link Hall</span>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="timeline-section section-band" data-reveal>
      <div className="section-head">
        <p className="eyebrow">Schedule</p>
        <h2>그날의 흐름</h2>
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

function TransportSection({ showToast }) {
  const mapLinks = useMemo(
    () => [
      {
        label: "카카오맵",
        href: `https://map.kakao.com/link/search/${encodedVenueQuery()}`,
      },
      {
        label: "네이버맵",
        href: `https://map.naver.com/p/search/${encodedVenueQuery()}`,
      },
    ],
    []
  );

  return (
    <section id="route" className="transport-section section-band" data-reveal>
      <div className="section-head">
        <p className="eyebrow">Route</p>
        <h2>오시는 길</h2>
      </div>

      <div className="map-card" aria-label="더링크호텔서울 위치 안내">
        <svg className="route-svg" viewBox="0 0 320 240" aria-hidden="true">
          <path className="route-path path-a" d="M18 92 C92 38, 168 162, 302 84" />
          <path className="route-path path-b" d="M-12 178 C92 126, 186 220, 336 144" />
        </svg>
        <span className="station station-a">구로역</span>
        <span className="station station-b">신도림</span>
        <div className="map-pin">
          <MapPin size={20} />
          <span>THE LINK</span>
        </div>
      </div>

      <div className="transport-list">
        {transportCards.map(({ icon: Icon, label, title, text }) => (
          <article key={label} className="transport-card">
            <div className="transport-icon">
              <Icon size={18} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="button-grid">
        {mapLinks.map((link) => (
          <a className="ghost-action" key={link.label} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
            <ExternalLink size={15} />
          </a>
        ))}
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
          캘린더 추가
          <CalendarPlus size={16} />
        </a>
      </div>
    </section>
  );
}

function GallerySection({ onOpen }) {
  return (
    <section id="gallery" className="gallery-section section-band" data-reveal>
      <div className="section-head">
        <p className="eyebrow">Gallery</p>
        <h2>곧 사진이 채워질 자리</h2>
        <p>메인 웨딩 사진이 들어오면 이 레이아웃은 더 에디토리얼하게 살아납니다.</p>
      </div>
      <div className="gallery-grid" aria-label="사진 자리">
        {[1, 2, 3, 4].map((item) => (
          <button className="gallery-tile" key={item} type="button" onClick={() => onOpen(item)}>
            <Images size={20} />
            <span>PHOTO {item}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function GiftSection({ showToast }) {
  return (
    <section className="gift-section section-band" data-reveal>
      <div className="section-head">
        <p className="eyebrow">For Your Heart</p>
        <h2>마음 전하실 곳</h2>
      </div>
      <div className="account-list">
        {wedding.accounts.map((account) => (
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
    <section id="rsvp" className="rsvp-section section-band" data-reveal>
      <Sparkles size={22} />
      <h2>함께해 주실 수 있나요?</h2>
      <p>{wedding.note}</p>
      <div className="button-grid">
        <a className="primary-action wide" href={wedding.rsvpUrl} target="_blank" rel="noreferrer">
          참석 여부 남기기
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
  if (!item) return null;

  return (
    <div className="lightbox" role="dialog" aria-label="사진 미리보기">
      <div className="lightbox-panel">
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <div className="lightbox-photo">
          <span>PHOTO {item}</span>
        </div>
        <p>실제 사진이 준비되면 이 영역에 크게 보여지도록 연결할 수 있습니다.</p>
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
  const [opened, setOpened] = useState(() => sessionStorage.getItem("invitation-opened-v2") === "true");
  const [lightboxItem, setLightboxItem] = useState(null);

  useReveal();
  useScrollEffects();

  function openInvitation() {
    sessionStorage.setItem("invitation-opened-v2", "true");
    setOpened(true);
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
      () => showToast("공유가 지원되지 않아 링크 복사도 실패했습니다.")
    );
  }

  return (
    <>
      {!opened && <OpeningScene onOpen={openInvitation} />}
      <TopBar onShare={handleShare} />
      <main className="app-shell">
        <Hero onShare={handleShare} />
        <CeremonyCard />
        <VenueExperience />
        <TimelineSection />
        <TransportSection showToast={showToast} />
        <GallerySection onOpen={setLightboxItem} />
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

createRoot(document.getElementById("root")).render(<App />);
