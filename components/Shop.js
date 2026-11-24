"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api, fa, CUR } from "@/lib/api";
import { getCart, setCart } from "@/lib/cart";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const ref = useRef();
  useEffect(() => {
    api("products").then((j) => setItems(j.products));
  }, []);
  useEffect(() => {
    if (!items.length) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(".item", { opacity: 0 });
      ScrollTrigger.batch(".item", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.fromTo(
            b,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.7 },
          ),
        onLeaveBack: (b) => gsap.set(b, { opacity: 0 }),
      });
    }, ref);
    return () => ctx.revert();
  }, [items]);
  const add = (id) => {
    setCart([...getCart(), id]);
    setMsg("Added to cart ✓");
    setTimeout(() => setMsg(""), 1500);
  };
  return (
    <section className="sec" id="shop" ref={ref}>
      <h2>Royal Treasures</h2>
      <div className="sub">
        Hand-picked Persian gifts{" "}
        {msg && <b style={{ color: "var(--gold2)" }}> — {msg}</b>}
      </div>
      <div className="grid">
        {items.map((p) => (
          <div className="card item" key={p.id}>
            <div className="ico">{p.ico}</div>
            <b>{p.name}</b>
            <div className="price">{fa(p.price)} {CUR}</div>
            <button className="btn s" onClick={() => add(p.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
