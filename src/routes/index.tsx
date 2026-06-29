import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mainframe — Meet A.R.I.A" },
      { name: "description", content: "Mainframe's Adaptive Response Interface Agent. Good taste tends to find us." },
      { property: "og:title", content: "Mainframe" },
      { property: "og:description", content: "Mainframe's Adaptive Response Interface Agent." },
    ],
  }),
  component: Index,
});

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4";
const TYPED = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
const SENSITIVITY = 0.8;

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(t);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const { displayed, done } = useTypewriter(TYPED);

  useEffect(() => {
    const t = setTimeout(() => setPillsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const seekNext = () => {
      if (!v.duration) return;
      const clamped = Math.max(0, Math.min(targetTime.current, v.duration));
      if (Math.abs(clamped - v.currentTime) < 0.001) return;
      seeking.current = true;
      v.currentTime = clamped;
    };

    const onSeeked = () => {
      seeking.current = false;
      const clamped = Math.max(0, Math.min(targetTime.current, v.duration || 0));
      if (Math.abs(clamped - v.currentTime) > 0.001) seekNext();
    };

    const onLoaded = () => {
      targetTime.current = v.currentTime;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      const dur = v.duration;
      if (!dur || !isFinite(dur)) return;
      const offset = (delta / window.innerWidth) * SENSITIVITY * dur;
      targetTime.current = Math.max(0, Math.min(dur, targetTime.current + offset));
      if (!seeking.current) seekNext();
    };

    v.addEventListener("seeked", onSeeked);
    v.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@mainframe.co").catch(() => {});
    }
  };

  const navLinks = ["Labs", "Studio", "Openings", "Shop"];

  return (
    <div className="relative min-h-screen w-full bg-white text-black overflow-hidden" style={{ fontFamily: "var(--font-body)" }}>
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: 0, objectPosition: "70% center" }}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mainframe<sup>®</sup>
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: "-0.02em" }}
            aria-hidden
          >
            ✳︎
          </span>
        </div>

        <div className="hidden md:flex flex-row text-[23px] text-black">
          {navLinks.map((l, i) => (
            <span key={l}>
              <a href="#" className="hover:opacity-60 transition-opacity">{l}</a>
              {i < navLinks.length - 1 && <span>, </span>}
            </span>
          ))}
        </div>

        <a
          href="mailto:hello@mainframe.co"
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        <button
          className="md:hidden flex flex-col items-center justify-center"
          style={{ gap: "5px" }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="w-6 bg-black transition-all duration-300"
            style={{ height: "2px", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }}
          />
          <span
            className="w-6 bg-black transition-all duration-300"
            style={{ height: "2px", opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="w-6 bg-black transition-all duration-300"
            style={{ height: "2px", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-opacity duration-300"
        style={{
          zIndex: 9,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {navLinks.map((l) => (
          <a key={l} href="#" className="text-[32px] font-medium text-black" onClick={() => setMenuOpen(false)}>
            {l}
          </a>
        ))}
        <a href="mailto:hello@mainframe.co" className="text-[32px] font-medium text-black underline underline-offset-2">
          Get in touch
        </a>
      </div>

      {/* Hero */}
      <section
        className="relative h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-xl relative z-10">
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#000",
              filter: "blur(4px)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          <p
            className="mb-5 sm:mb-6 text-black"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span
                className="cursor-blink inline-block align-middle"
                style={{ width: "2px", height: "1.1em", background: "#000", marginLeft: "2px" }}
              />
            )}
          </p>

          <div
            className="flex flex-wrap"
            style={{
              rowGap: "0.25rem",
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {["Pitch us an idea", "Come work here", "Send a brief hello", "See how we operate"].map((label) => (
              <button
                key={label}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 hover:bg-black hover:text-white transition-colors duration-200"
                style={{ padding: "0.3em 1.1em", margin: "0 0.2em 0.4em", whiteSpace: "nowrap" }}
              >
                {label}
              </button>
            ))}

            <button
              onClick={copyEmail}
              className="inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200"
              style={{ padding: "0.3em 1.1em", margin: "0 0.2em 0.4em", whiteSpace: "nowrap" }}
            >
              <span>
                Reach us: <span className="underline underline-offset-1">hello@mainframe.co</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
