"use client";

import { useState } from "react";

/* Parallel content that should be compared side by side on a desktop, but
   would otherwise stack into an enormous column on a phone.

   The four science disciplines carry 27 topics between them and the audience
   benefits carry another 20. Stacked, that is well over two screens of scroll
   on a 390px device before a visitor reaches anything they can act on. Below
   `lg` this shows a tab bar and one panel at a time; at `lg` and up every panel
   renders in the grid, because on a wide screen comparing them at a glance is
   the point.

   One DOM tree, not two: the panels are always rendered and the inactive ones
   are hidden with a class, so nothing is duplicated for crawlers and the
   desktop grid needs no JavaScript to be complete. */
export default function ResponsivePanels({
  items,
  getKey,
  getTabLabel,
  renderPanel,
  gridClassName = "lg:grid-cols-4",
  color,
}) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div
        role="tablist"
        aria-label="Choose a section"
        className="flex flex-wrap gap-2 mb-5 lg:hidden"
      >
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={getKey(item)}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-2 text-sm font-bold border-2 transition-colors ${
                isActive
                  ? "text-white"
                  : "border-secondary/15 text-secondary/70 hover:border-secondary/40"
              }`}
              style={
                isActive
                  ? {
                      background: item.accent || color,
                      borderColor: item.accent || color,
                    }
                  : undefined
              }
            >
              {getTabLabel(item)}
            </button>
          );
        })}
      </div>

      <div className={`grid gap-5 ${gridClassName}`}>
        {items.map((item, i) => (
          <div
            key={getKey(item)}
            className={i === active ? "" : "hidden lg:block"}
          >
            {renderPanel(item, i)}
          </div>
        ))}
      </div>
    </>
  );
}
