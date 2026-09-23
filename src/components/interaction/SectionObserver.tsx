"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { sceneSections } from "@/config/scene";

export function SectionObserver() {
  const setActiveSection = useStore((state) => state.setActiveSection);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find which scene anchor corresponds to this DOM id
            const sceneKey = Object.keys(sceneSections).find(
              key => sceneSections[key].id === entry.target.id
            );
            if (sceneKey) {
              setActiveSection(sceneKey);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px", // Trigger when section is near the middle of screen
        threshold: 0
      }
    );

    // Observe all configured sections
    Object.values(sceneSections).forEach(section => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  return null;
}
