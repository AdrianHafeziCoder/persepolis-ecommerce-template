"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Faravahar, Rosette } from "./Art";

const Door = ({ c }) => (
  <div className={"door " + c}>
    <div className="pn">
      <Rosette />
    </div>
    <div className="pn">
      <Faravahar s={70} />
    </div>
    <div className="pn">
      <Rosette />
    </div>
  </div>
);

export default function Gate() {
  const ref = useRef();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // scrub: the animation is tied to scroll position, so scrolling back reverses it (the gates close)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        })
        .to(".hint", { opacity: 0, duration: 0.1 }, 0)
        .to(
          ".door.l",
          { xPercent: -100, duration: 1, ease: "power2.inOut" },
          0.1,
        )
        .to(
          ".door.r",
          { xPercent: 100, duration: 1, ease: "power2.inOut" },
          0.1,
        )
        .fromTo(
          ".reveal",
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
          0.3,
        );
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="gate" ref={ref}>
      <div className="stage">
        <div className="reveal">
          <Faravahar s={130} />
          <h1>Cyrus the Great, Emperor of Persia</h1>
          <p>
            Welcome to the Royal Bazaar: handicrafts and gifts inspired by
            Persepolis and the glory of the Achaemenids.
          </p>
          <a className="btn" style={{ marginTop: 20 }} href="#shop">
            Enter the Bazaar
          </a>
        </div>
        <Door c="l" />
        <Door c="r" />
        <div className="hint">▼ Scroll to open the gates of Persepolis ▼</div>
      </div>
    </section>
  );
}
