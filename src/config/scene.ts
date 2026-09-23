export type SceneAnchor = {
  id: string;
  targetZ: number;
  rotation?: [number, number, number];
};

export const sceneSections: Record<string, SceneAnchor> = {
  hero: { id: "home", targetZ: 6 },
  about: { id: "about", targetZ: 5 },
  skills: { id: "skills", targetZ: 4 },
  projects: { id: "projects", targetZ: 3 },
  experience: { id: "experience", targetZ: 3 },
  contact: { id: "contact", targetZ: 6 },
};
