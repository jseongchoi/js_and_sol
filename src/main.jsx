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
  Info,
  MapPin,
  MessageCircle,
  Share2,
  Train,
  Trash2,
  X,
} from "lucide-react";
import "./styles.css";

const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
const supabaseApiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const isGuestbookEnabled = Boolean(supabaseUrl && supabaseApiKey);
const GUESTBOOK_PAGE_SIZE = 10;

const wedding = {
  groom: {
    name: "최지성",
    shortName: "지성",
    parents: "🌼 최정재 · 신순채의 아들",
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
    parking: "하객 주차는 1시간 30분 이용 가능합니다.",
  },
  note: "격식은 가볍게, 마음은 깊게. 편안한 걸음으로 와 주세요.",
  accounts: [
    { side: "groom", owner: "신랑 최지성", bank: "국민은행", number: "123456-01-234567" },
    { side: "groom", owner: "혼주 신순채", bank: "하나은행", number: "456-910123-45607" },
    { side: "bride", owner: "신부 이솔", bank: "신한은행", number: "110-123-456789" },
    { side: "bride", owner: "혼주 이돈형", bank: "우리은행", number: "1002-234-567890" },
    { side: "bride", owner: "혼주 임혜경", bank: "우리은행", number: "1002-345-678901" },
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
];

const invitationLines = [
  "함께일 때 가장 나다워지는 사람을 만났습니다.",
  "서로 존중하며 한결같은 마음으로 살아가겠습니다.",
  "",
  "귀한 걸음 하시어 축복해 주시면",
  "더없는 기쁨으로 간직하겠습니다.",
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
const heroImage = {
  src: asset("10.jpg"),
  alt: "웨딩 갤러리 사진 10",
};

const galleryImages = Array.from({ length: 16 }, (_, index) => ({
  src: asset(`${index + 1}.jpg`),
  alt: `웨딩 갤러리 사진 ${index + 1}`,
}));

const heroKicker = "We are getting married!";
const heroPetals = [
  { left: "6%", size: "13px", delay: "0.1s", duration: "12s", sway: "34px", end: "12px", rotate: "-18deg", alpha: 0.58, mark: "♡" },
  { left: "14%", size: "9px", delay: "2.3s", duration: "15s", sway: "-24px", end: "-8px", rotate: "12deg", alpha: 0.46, mark: "♥" },
  { left: "23%", size: "15px", delay: "4.7s", duration: "13s", sway: "28px", end: "44px", rotate: "-8deg", alpha: 0.52, mark: "♡" },
  { left: "32%", size: "10px", delay: "1.1s", duration: "16s", sway: "-38px", end: "-18px", rotate: "20deg", alpha: 0.42, mark: "♥" },
  { left: "41%", size: "12px", delay: "6.2s", duration: "14s", sway: "26px", end: "2px", rotate: "-24deg", alpha: 0.5, mark: "♡" },
  { left: "52%", size: "8px", delay: "3.4s", duration: "17s", sway: "-20px", end: "-40px", rotate: "18deg", alpha: 0.38, mark: "♥" },
  { left: "61%", size: "16px", delay: "0.9s", duration: "15s", sway: "42px", end: "18px", rotate: "-10deg", alpha: 0.48, mark: "♡" },
  { left: "70%", size: "11px", delay: "5.2s", duration: "13s", sway: "-34px", end: "-14px", rotate: "26deg", alpha: 0.44, mark: "♥" },
  { left: "78%", size: "14px", delay: "2.0s", duration: "16s", sway: "24px", end: "46px", rotate: "-16deg", alpha: 0.54, mark: "♡" },
  { left: "88%", size: "9px", delay: "7.1s", duration: "14s", sway: "-28px", end: "-4px", rotate: "10deg", alpha: 0.4, mark: "♥" },
  { left: "96%", size: "12px", delay: "4.0s", duration: "18s", sway: "-42px", end: "-54px", rotate: "-20deg", alpha: 0.46, mark: "♡" },
];
const saveDateHearts = [
  { left: "8%", size: "18px", delay: "0.2s", duration: "11s", sway: "34px", end: "18px", rotate: "-18deg", alpha: 0.74, mark: "♡" },
  { left: "17%", size: "12px", delay: "2.6s", duration: "13s", sway: "-26px", end: "-8px", rotate: "14deg", alpha: 0.62, mark: "♥" },
  { left: "27%", size: "15px", delay: "5.2s", duration: "12s", sway: "28px", end: "48px", rotate: "-8deg", alpha: 0.7, mark: "♡" },
  { left: "38%", size: "11px", delay: "1.4s", duration: "14s", sway: "-38px", end: "-18px", rotate: "22deg", alpha: 0.58, mark: "♥" },
  { left: "49%", size: "20px", delay: "3.9s", duration: "13s", sway: "18px", end: "2px", rotate: "-24deg", alpha: 0.7, mark: "♡" },
  { left: "58%", size: "13px", delay: "6.2s", duration: "15s", sway: "-22px", end: "-38px", rotate: "18deg", alpha: 0.6, mark: "♥" },
  { left: "68%", size: "17px", delay: "0.9s", duration: "12s", sway: "42px", end: "26px", rotate: "-10deg", alpha: 0.72, mark: "♡" },
  { left: "79%", size: "12px", delay: "4.8s", duration: "14s", sway: "-34px", end: "-12px", rotate: "26deg", alpha: 0.58, mark: "♥" },
  { left: "91%", size: "16px", delay: "2.1s", duration: "13s", sway: "-40px", end: "-58px", rotate: "-16deg", alpha: 0.68, mark: "♡" },
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

async function supabaseRequest(path, options = {}) {
  if (!isGuestbookEnabled) throw new Error("Guestbook is not configured.");

  const headers = {
    apikey: supabaseApiKey,
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!supabaseApiKey.startsWith("sb_publishable_")) {
    headers.Authorization = `Bearer ${supabaseApiKey}`;
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function listGuestbookEntries(page) {
  return supabaseRequest("/rest/v1/rpc/list_guestbook_entries", {
    method: "POST",
    body: JSON.stringify({
      page_size: GUESTBOOK_PAGE_SIZE + 1,
      page_number: page,
    }),
  });
}

function createGuestbookEntry({ name, password, message }) {
  return supabaseRequest("/rest/v1/guestbook_entries", {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      message,
      entry_password: password,
    }),
  });
}

function createRsvpResponse({ name, attending }) {
  return supabaseRequest("/rest/v1/rsvp_responses", {
    method: "POST",
    headers: {
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      attending,
    }),
  });
}

function deleteGuestbookEntry(id, password) {
  return supabaseRequest("/rest/v1/rpc/delete_guestbook_entry", {
    method: "POST",
    body: JSON.stringify({
      entry_id: id,
      input_password: password,
    }),
  });
}

const guestbookDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatGuestbookDate(value) {
  try {
    return guestbookDateFormatter.format(new Date(value));
  } catch {
    return "";
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
  const [isCopyVisible, setIsCopyVisible] = useState(false);
  const imageRef = useRef(null);
  const revealTimerRef = useRef(null);

  function revealCopy() {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current);
    }

    revealTimerRef.current = window.setTimeout(() => {
      setIsCopyVisible(true);
    }, 650);
  }

  useEffect(() => {
    if (imageRef.current?.complete) {
      revealCopy();
    }

    return () => {
      if (revealTimerRef.current) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, []);

  return (
    <section id="intro" className="hero-section" data-reveal>
      <img
        ref={imageRef}
        className="hero-photo protected-photo"
        src={heroImage.src}
        alt={heroImage.alt}
        draggable="false"
        decoding="async"
        fetchPriority="high"
        onLoad={revealCopy}
        onError={revealCopy}
        data-protected-image
      />
      <span className="photo-guard" aria-hidden="true" data-protected-image />
      <div className="hero-overlay" />
      <div className="hero-petals" aria-hidden="true">
        {heroPetals.map((petal, index) => (
          <span
            className="hero-petal"
            key={`${petal.left}-${index}`}
            style={{
              "--petal-alpha": petal.alpha,
              "--petal-delay": petal.delay,
              "--petal-duration": petal.duration,
              "--petal-end": petal.end,
              "--petal-left": petal.left,
              "--petal-rotate": petal.rotate,
              "--petal-size": petal.size,
              "--petal-sway": petal.sway,
            }}
          >
            {petal.mark}
          </span>
        ))}
      </div>
      <div className={`hero-copy ${isCopyVisible ? "is-visible" : ""}`}>
        <p className="hero-kicker" aria-label={heroKicker}>
          <span aria-hidden="true">
            {Array.from(heroKicker).map((char, index) => (
              <span
                className={`hero-typo-char ${char === " " ? "is-space" : ""}`}
                key={`${char}-${index}`}
                style={{ "--char-index": index }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </p>
        <h1>
          <span className="hero-name">{wedding.groom.shortName}</span>
          <span className="hero-amp">&</span>
          <span className="hero-name">{wedding.bride.shortName}</span>
        </h1>
        <strong className="hero-meta">
          <span>
            {wedding.date.year}. {wedding.date.month}. {wedding.date.day} {wedding.date.weekday}
          </span>
          <span>더링크호텔</span>
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
      <div className="save-date-heartfall" aria-hidden="true">
        {saveDateHearts.map((heart, index) => (
          <span
            className="save-date-heart"
            key={`${heart.left}-${index}`}
            style={{
              "--heart-alpha": heart.alpha,
              "--heart-delay": heart.delay,
              "--heart-duration": heart.duration,
              "--heart-end": heart.end,
              "--heart-left": heart.left,
              "--heart-rotate": heart.rotate,
              "--heart-size": heart.size,
              "--heart-sway": heart.sway,
            }}
          >
            {heart.mark}
          </span>
        ))}
      </div>
      <div className="save-date-card">
        <svg className="save-date-art" viewBox="0 0 320 470" aria-hidden="true">
          <path className="save-ribbon" d="M93 48 C118 12 147 28 160 52 C173 28 202 12 227 48" />
          <path className="save-ribbon" d="M95 49 C122 76 145 74 160 55 C175 74 198 76 225 49" />
          <path className="save-ribbon-fill" d="M103 43 C124 23 145 35 158 53 C141 65 119 66 103 43Z" />
          <path className="save-ribbon-fill" d="M217 43 C196 23 175 35 162 53 C179 65 201 66 217 43Z" />
          <path className="save-line" d="M154 49 C154 44 166 44 166 49 C166 57 154 57 154 49Z" />

          <path className="save-ribbon" d="M88 72 C46 80 36 104 42 130 C50 164 79 156 72 129" />
          <path className="save-ribbon" d="M232 72 C274 80 284 104 278 130 C270 164 241 156 248 129" />

          <g className="save-bird save-bird-left">
            <path d="M52 116 C63 101 80 105 83 119 C92 116 101 120 104 129 C94 130 86 127 80 122 C74 136 58 138 47 126" />
            <path d="M66 117 C58 114 53 109 49 101" />
            <path d="M79 116 C86 110 94 108 102 109" />
            <path d="M104 127 L119 120" />
            <circle cx="74" cy="115" r="1.5" />
          </g>
          <g className="save-bird save-bird-right">
            <path d="M268 116 C257 101 240 105 237 119 C228 116 219 120 216 129 C226 130 234 127 240 122 C246 136 262 138 273 126" />
            <path d="M254 117 C262 114 267 109 271 101" />
            <path d="M241 116 C234 110 226 108 218 109" />
            <path d="M216 127 L201 120" />
            <circle cx="246" cy="115" r="1.5" />
          </g>

          <g className="save-column save-column-left">
            <path d="M54 205 H104" />
            <path d="M60 218 H98" />
            <path d="M68 219 V393" />
            <path d="M91 219 V393" />
            <path d="M74 222 C70 270 70 334 74 389" />
            <path d="M85 222 C89 270 89 334 85 389" />
            <path d="M58 393 H102" />
            <path d="M52 407 H108" />
            <path d="M58 421 H102" />
            <path className="save-vine" d="M91 244 C73 274 103 298 79 329 C66 347 84 366 72 386" />
            <path className="save-leaf" d="M81 278 C71 275 68 266 75 260 C84 264 87 272 81 278Z" />
            <path className="save-leaf" d="M92 314 C103 314 108 323 101 330 C91 327 88 320 92 314Z" />
            <path className="save-leaf" d="M75 353 C65 351 61 342 68 336 C78 339 81 347 75 353Z" />
          </g>

          <g className="save-column save-column-right">
            <path d="M216 205 H266" />
            <path d="M222 218 H260" />
            <path d="M230 219 V393" />
            <path d="M253 219 V393" />
            <path d="M236 222 C232 270 232 334 236 389" />
            <path d="M247 222 C251 270 251 334 247 389" />
            <path d="M220 393 H264" />
            <path d="M214 407 H270" />
            <path d="M220 421 H264" />
            <path className="save-vine" d="M230 244 C248 274 218 298 242 329 C255 347 237 366 249 386" />
            <path className="save-leaf" d="M240 278 C250 275 253 266 246 260 C237 264 234 272 240 278Z" />
            <path className="save-leaf" d="M229 314 C218 314 213 323 220 330 C230 327 233 320 229 314Z" />
            <path className="save-leaf" d="M246 353 C256 351 260 342 253 336 C243 339 240 347 246 353Z" />
          </g>

          <g className="save-planter save-planter-left">
            <path d="M45 177 C61 167 99 167 115 177 L108 203 H52Z" />
            <path d="M55 191 H105" />
            <path className="save-leaf" d="M63 169 C60 151 74 145 82 160 C74 162 70 167 63 169Z" />
            <path className="save-leaf" d="M88 169 C90 151 106 151 107 168 C100 165 94 166 88 169Z" />
            <circle className="save-flower" cx="58" cy="160" r="4" />
            <circle className="save-flower" cx="78" cy="151" r="4" />
            <circle className="save-flower" cx="102" cy="160" r="4" />
            <circle className="save-flower" cx="91" cy="145" r="3" />
          </g>

          <g className="save-planter save-planter-right">
            <path d="M205 177 C221 167 259 167 275 177 L268 203 H212Z" />
            <path d="M215 191 H265" />
            <path className="save-leaf" d="M223 169 C220 151 234 145 242 160 C234 162 230 167 223 169Z" />
            <path className="save-leaf" d="M248 169 C250 151 266 151 267 168 C260 165 254 166 248 169Z" />
            <circle className="save-flower" cx="218" cy="160" r="4" />
            <circle className="save-flower" cx="238" cy="151" r="4" />
            <circle className="save-flower" cx="262" cy="160" r="4" />
            <circle className="save-flower" cx="251" cy="145" r="3" />
          </g>

          <g className="save-fountain">
            <path className="save-water" d="M132 334 C142 317 177 317 188 334 C184 350 136 350 132 334Z" />
            <path d="M126 356 C139 369 181 369 194 356" />
            <path d="M107 383 C126 404 194 404 213 383" />
            <path d="M99 389 C115 431 205 431 221 389" />
            <path className="save-water" d="M123 360 C140 375 180 375 197 360 C190 386 130 386 123 360Z" />
            <path d="M151 291 C154 314 145 322 133 335" />
            <path d="M169 291 C166 314 175 322 187 335" />
            <path className="save-water-line" d="M160 281 C153 302 145 314 136 326" />
            <path className="save-water-line" d="M160 281 C167 302 175 314 184 326" />
            <path d="M143 284 C153 276 167 276 177 284 L170 301 H150Z" />
            <path className="save-leaf" d="M153 273 C144 263 151 253 161 262 C159 267 157 270 153 273Z" />
            <path className="save-leaf" d="M169 274 C179 263 172 252 161 262 C163 267 166 271 169 274Z" />
            <circle className="save-flower" cx="150" cy="262" r="4" />
            <circle className="save-flower" cx="162" cy="254" r="4" />
            <circle className="save-flower" cx="174" cy="263" r="4" />
          </g>

          <g className="save-petals">
            <path d="M121 195 C117 188 124 184 129 189 C127 195 124 197 121 195Z" />
            <path d="M197 192 C193 185 200 181 205 186 C203 192 200 195 197 192Z" />
            <path d="M117 238 C113 232 119 228 124 232 C123 238 120 240 117 238Z" />
            <path d="M205 238 C201 232 207 228 212 232 C211 238 208 240 205 238Z" />
            <path d="M134 252 C130 246 137 242 142 247 C140 252 137 254 134 252Z" />
            <path d="M184 252 C180 246 187 242 192 247 C190 252 187 254 184 252Z" />
          </g>
        </svg>

        <div className="save-date-content">
          <p className="save-date-title">
            Save
            <span>The Date</span>
          </p>
          <p className="save-date-names">
            <span>JI SEONG</span>
            <small>and</small>
            <span>SOL</span>
          </p>
          <p className="save-date-venue">
            THE LINK HOTEL
            <span>LINK HALL.</span>
          </p>
          <p className="save-date-date">
            {wedding.date.year}.{wedding.date.month}.{wedding.date.day} SAT 10:40
          </p>
        </div>
      </div>
    </section>
  );
}

function InvitationLetter() {
  return (
    <section className="letter-section" data-reveal>
      <svg className="letter-heart" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <clipPath id="letter-heart-fill-clip">
            <path d="M24 39.6 C13.8 31.2 8 25.4 8 18.3 C8 13.1 11.9 9.2 17 9.2 C19.9 9.2 22.4 10.6 24 12.9 C25.6 10.6 28.1 9.2 31 9.2 C36.1 9.2 40 13.1 40 18.3 C40 25.4 34.2 31.2 24 39.6Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#letter-heart-fill-clip)">
          <rect className="letter-heart-fill" x="6" y="42" width="36" height="0" />
        </g>
        <path
          className="letter-heart-outline"
          d="M24 39.6 C13.8 31.2 8 25.4 8 18.3 C8 13.1 11.9 9.2 17 9.2 C19.9 9.2 22.4 10.6 24 12.9 C25.6 10.6 28.1 9.2 31 9.2 C36.1 9.2 40 13.1 40 18.3 C40 25.4 34.2 31.2 24 39.6Z"
        />
      </svg>
      <p className="letter-lines">
        {invitationLines.map((line, index) => (
          <span key={index} data-card data-card-index={index}>
            {line}
          </span>
        ))}
      </p>
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
        <b>신랑 {wedding.groom.name}</b>
      </div>
      <div className="family-row">
        <span>{wedding.bride.parents}</span>
        <b>신부 {wedding.bride.name}</b>
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
    <section id="information" className="information-section section-block lavender-block" data-reveal>
      <div className="section-head centered">
        <p>Information</p>
        <h2>안내사항</h2>
        <span>저희 결혼식에 대한 사전 안내를 드립니다.</span>
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
  return (
    <section id="gallery" className="gallery-section section-block" data-reveal>
      <div className="section-head centered">
        <p>Gallery</p>
      </div>
      <div className="gallery-grid" aria-label="사진 모음">
        {galleryImages.map((image, index) => (
          <button
            ref={index === 0 ? triggerRef : null}
            className="gallery-tile"
            type="button"
            key={image.src}
            onClick={() => onOpen(index)}
            onContextMenu={(event) => event.preventDefault()}
            aria-label={index === 0 ? "사진 크게 보기" : `사진 ${index + 1} 크게 보기`}
            data-protected-image
          >
            <img className="protected-photo" src={image.src} alt={image.alt} draggable="false" loading="lazy" decoding="async" />
            <span className="photo-guard" aria-hidden="true" data-protected-image />
          </button>
        ))}
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
      <p className="gift-note">
        부득이하게 참석이 어려우신 분들을 위해 마음 전하실 곳을 남겨두었습니다. 너른 양해 부탁드립니다.
      </p>
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

function GuestbookSection({ showToast }) {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [form, setForm] = useState({ name: "", password: "", message: "" });
  const [deleteDraft, setDeleteDraft] = useState({ id: null, password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadEntries(nextPage = page) {
    if (!isGuestbookEnabled) return;

    setIsLoading(true);
    try {
      const loadedEntries = (await listGuestbookEntries(nextPage)) ?? [];
      setEntries(loadedEntries.slice(0, GUESTBOOK_PAGE_SIZE));
      setHasNextPage(loadedEntries.length > GUESTBOOK_PAGE_SIZE);
      setPage(nextPage);
      setDeleteDraft({ id: null, password: "" });
    } catch {
      showToast("축하 메시지를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextEntry = {
      name: form.name.trim(),
      password: form.password.trim(),
      message: form.message.trim(),
    };

    if (!nextEntry.name || !nextEntry.password || !nextEntry.message) {
      showToast("이름, 암호, 메시지를 모두 입력해주세요.");
      return;
    }

    if (!isGuestbookEnabled) {
      showToast("댓글 저장 기능을 연결해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createGuestbookEntry(nextEntry);
      setForm({ name: "", password: "", message: "" });
      await loadEntries(1);
      showToast("축하 메시지를 남겼습니다.");
    } catch {
      showToast("메시지를 남기지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();

    const password = deleteDraft.password.trim();
    if (!deleteDraft.id || !password) {
      showToast("암호를 입력해주세요.");
      return;
    }

    setIsDeleting(true);
    try {
      const deleted = await deleteGuestbookEntry(deleteDraft.id, password);
      if (!deleted) {
        showToast("암호가 맞지 않습니다.");
        return;
      }

      setDeleteDraft({ id: null, password: "" });
      await loadEntries(page);
      showToast("메시지를 삭제했습니다.");
    } catch {
      showToast("메시지를 삭제하지 못했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="guestbook-section section-block lavender-block" data-reveal>
      <div className="section-head centered">
        <p>Guest Book</p>
        <h2>축하 메시지</h2>
      </div>

      <div className="guestbook-list" aria-live="polite">
        {!isGuestbookEnabled && <p className="guestbook-empty">댓글 저장 기능을 연결하면 축하 메시지가 표시됩니다.</p>}
        {isGuestbookEnabled && isLoading && <p className="guestbook-empty">불러오는 중입니다.</p>}
        {isGuestbookEnabled && !isLoading && entries.length === 0 && <p className="guestbook-empty">아직 남겨진 메시지가 없습니다.</p>}
        {isGuestbookEnabled &&
          !isLoading &&
          entries.map((entry) => (
            <article className="guestbook-card" key={entry.id}>
              <div className="guestbook-card-head">
                <strong>{entry.name}</strong>
                <span>{formatGuestbookDate(entry.created_at)}</span>
                <button
                  type="button"
                  className="guestbook-delete"
                  aria-label={`${entry.name} 메시지 삭제`}
                  onClick={() => setDeleteDraft({ id: entry.id, password: "" })}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p>{entry.message}</p>
              {deleteDraft.id === entry.id && (
                <form className="guestbook-delete-form" onSubmit={handleDelete}>
                  <input
                    type="password"
                    value={deleteDraft.password}
                    maxLength={30}
                    autoComplete="current-password"
                    placeholder="암호"
                    onChange={(event) => setDeleteDraft((current) => ({ ...current, password: event.target.value }))}
                  />
                  <button type="submit" disabled={isDeleting}>
                    삭제
                  </button>
                  <button type="button" onClick={() => setDeleteDraft({ id: null, password: "" })}>
                    취소
                  </button>
                </form>
              )}
            </article>
          ))}
      </div>

      {isGuestbookEnabled && (page > 1 || hasNextPage) && (
        <div className="guestbook-pagination" aria-label="축하 메시지 페이지">
          <button type="button" onClick={() => loadEntries(page - 1)} disabled={isLoading || page === 1}>
            이전
          </button>
          <span>{page}</span>
          <button type="button" onClick={() => loadEntries(page + 1)} disabled={isLoading || !hasNextPage}>
            다음
          </button>
        </div>
      )}

      <form className="guestbook-form" onSubmit={handleSubmit}>
        <div className="guestbook-fields">
          <label>
            <span>이름</span>
            <input
              type="text"
              value={form.name}
              maxLength={20}
              autoComplete="name"
              onChange={(event) => updateForm("name", event.target.value)}
            />
          </label>
          <label>
            <span>암호</span>
            <input
              type="password"
              value={form.password}
              maxLength={30}
              autoComplete="new-password"
              onChange={(event) => updateForm("password", event.target.value)}
            />
          </label>
        </div>
        <label>
          <span>댓글 작성</span>
          <textarea
            value={form.message}
            maxLength={300}
            rows={4}
            onChange={(event) => updateForm("message", event.target.value)}
          />
        </label>
        <button className="primary-action wide" type="submit" disabled={isSubmitting}>
          댓글 남기기
          <MessageCircle size={16} />
        </button>
      </form>
    </section>
  );
}

function RsvpSection({ onShare, showToast }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const nextName = name.trim();
    if (!nextName) {
      showToast("이름을 입력해주세요.");
      return;
    }

    if (!isGuestbookEnabled) {
      showToast("참석 의사 기능을 준비 중입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRsvpResponse({ name: nextName, attending });
      setName("");
      setAttending(true);
      showToast("참석 의사를 남겼습니다.");
    } catch {
      showToast("참석 의사를 남기지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="rsvp" className="rsvp-section section-block lavender-block" data-reveal>
      <div className="section-head centered">
        <p>Attendance</p>
        <h2>참석 의사를 남겨주세요</h2>
        <span>{wedding.note}</span>
      </div>

      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label>
          <span>이름</span>
          <input
            type="text"
            value={name}
            maxLength={20}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <div className="rsvp-choice" role="group" aria-label="참석 의사">
          <button type="button" className={attending ? "is-active" : ""} onClick={() => setAttending(true)}>
            참석
          </button>
          <button type="button" className={!attending ? "is-active" : ""} onClick={() => setAttending(false)}>
            불참
          </button>
        </div>

        <button className="primary-action wide" type="submit" disabled={isSubmitting}>
          의사 남기기
          <Check size={16} />
        </button>
      </form>

      <div className="button-grid">
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
      <a href="#information">
        <Info size={16} />
        INFO
      </a>
      <button type="button" onClick={onShare}>
        <Share2 size={16} />
        공유
      </button>
    </nav>
  );
}

function GalleryLightbox({ item, onClose, onMove, returnFocusRef }) {
  const closeButtonRef = useRef(null);
  const previousButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const isOpen = item !== null;

  useEffect(() => {
    if (!isOpen) return undefined;

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

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onMove(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onMove(1);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const focusableButtons = [closeButtonRef.current, previousButtonRef.current, nextButtonRef.current].filter(Boolean);
        const currentIndex = focusableButtons.indexOf(document.activeElement);
        const nextIndex = event.shiftKey
          ? (currentIndex - 1 + focusableButtons.length) % focusableButtons.length
          : (currentIndex + 1) % focusableButtons.length;
        focusableButtons[nextIndex]?.focus();
      }
    }

    window.addEventListener("keydown", handleModalKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleModalKeyDown);
      returnFocusRef?.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (item === null) return null;
  const active = galleryImages[item];

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={onClose}>
      <div className="lightbox-panel" onClick={(event) => event.stopPropagation()} onContextMenu={(event) => event.preventDefault()} data-protected-image>
        <button ref={closeButtonRef} type="button" className="lightbox-close" onClick={onClose} aria-label="닫기">
          <X size={18} />
        </button>
        <button ref={previousButtonRef} type="button" className="lightbox-nav lightbox-prev" onClick={() => onMove(-1)} aria-label="이전 사진">
          <ChevronLeft size={22} />
        </button>
        <img className="lightbox-photo protected-photo" src={active.src} alt={active.alt} draggable="false" decoding="async" />
        <span className="photo-guard" aria-hidden="true" data-protected-image />
        <button ref={nextButtonRef} type="button" className="lightbox-nav lightbox-next" onClick={() => onMove(1)} aria-label="다음 사진">
          <ChevronRight size={22} />
        </button>
        <span className="lightbox-count" aria-live="polite">
          {item + 1} / {galleryImages.length}
        </span>
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

    const blockedEvents = ["contextmenu", "dragstart", "selectstart", "copy"];
    blockedEvents.forEach((eventName) => {
      document.addEventListener(eventName, preventProtectedImageAction);
    });
    return () => {
      blockedEvents.forEach((eventName) => {
        document.removeEventListener(eventName, preventProtectedImageAction);
      });
    };
  }, []);

  function closeLightbox() {
    setLightboxItem(null);
  }

  function moveLightbox(step) {
    setLightboxItem((current) => {
      if (current === null) return null;
      return (current + step + galleryImages.length) % galleryImages.length;
    });
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
        <GallerySection onOpen={setLightboxItem} triggerRef={galleryTriggerRef} />
        <GuestbookSection showToast={showToast} />
        <RsvpSection onShare={handleShare} showToast={showToast} />
        <TransportSection showToast={showToast} />
        <InformationSection />
        <GiftSection showToast={showToast} />
      </main>
      <FloatingDock onShare={handleShare} isHidden={lightboxItem !== null} />
      <footer className="site-footer" aria-hidden={lightboxItem !== null}>
        {wedding.groom.shortName} & {wedding.bride.shortName}
        <br />
        {wedding.date.year}.{wedding.date.month}.{wedding.date.day}
      </footer>
      <GalleryLightbox item={lightboxItem} onClose={closeLightbox} onMove={moveLightbox} returnFocusRef={galleryTriggerRef} />
      <Toast message={toast} />
    </>
  );
}

const rootElement = document.getElementById("root");
const root = rootElement._weddingRoot ?? createRoot(rootElement);
rootElement._weddingRoot = root;
root.render(<App />);
