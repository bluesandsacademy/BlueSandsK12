"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* Phone-only progressive disclosure.

   These pages carry everything a school needs to decide, which on a 390px
   screen becomes fourteen screens of scroll. Desktop can afford that: the eye
   skips. A phone cannot, and the sections a visitor must not miss (the price,
   the calculator, the call to action) end up buried behind the ones they only
   need once they are interested.

   So the buying path stays open on a phone and the reference material folds
   away behind a labelled button. Nothing is removed and nothing is hidden from
   crawlers: the content is always in the DOM and always visible from `lg` up,
   where the layout has the room for it. */
export default function MobileDisclosure({ label, children, count }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="lg:hidden w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-secondary/12 bg-white px-5 py-4 font-display font-bold text-secondary shadow-[0_4px_0_rgba(0,0,0,0.04)]"
      >
        <span>
          {open ? "Show less" : label}
          {!open && count != null && (
            <span className="ml-2 text-secondary/40 tabular-nums">{count}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-secondary/40 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2.5}
        />
      </button>

      <div className={`${open ? "mt-6" : "hidden"} lg:block lg:mt-0`}>
        {children}
      </div>
    </>
  );
}

/* Long checklists on a phone: show enough to make the point, keep the rest one
   tap away. Above `lg` the whole list renders with no control at all. */
export function ExpandableList({ items, renderItem, initial = 5, label }) {
  const [open, setOpen] = useState(false);
  const hidden = items.length - initial;

  return (
    <>
      <ul className="border-t-2 border-secondary/[0.08]">
        {items.map((item, i) => (
          <li
            key={item}
            className={`${
              !open && i >= initial ? "hidden lg:flex" : "flex"
            } items-start gap-3 py-3.5 border-b-2 border-secondary/[0.08]`}
          >
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="lg:hidden mt-4 inline-flex items-center gap-1.5 font-display font-bold text-primary text-sm"
        >
          {open ? "Show fewer" : `${label} (${hidden} more)`}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={2.5}
          />
        </button>
      )}
    </>
  );
}
