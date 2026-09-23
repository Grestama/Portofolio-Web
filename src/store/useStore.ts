import { create } from 'zustand';

type CursorState = 'default' | 'hover' | 'project' | 'image' | 'external' | 'drag';

interface StoreState {
  cursorState: CursorState;
  cursorText: string;
  setCursorState: (state: CursorState, text?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  focusedProjectId: number | null;
  setFocusedProjectId: (id: number | null) => void;
  projectFilter: string | null;
  setProjectFilter: (filter: string | null) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  // Debug & Performance
  perfTier: 'HIGH' | 'MEDIUM' | 'LOW';
  setPerfTier: (tier: 'HIGH' | 'MEDIUM' | 'LOW') => void;
  debugMode: boolean;
  setDebugMode: (debug: boolean) => void;
  toggles: {
    particles: boolean;
    shaders: boolean;
    cursorEffects: boolean;
  };
  setToggle: (key: keyof StoreState['toggles'], value: boolean) => void;
  // 3D Skill Graph state
  skillFocus: { active: boolean; skillId: string | null; worldPos?: [number, number, number] };
  setSkillFocus: (focus: { active: boolean; skillId: string | null; worldPos?: [number, number, number] }) => void;
  exploreMode: boolean;
  setExploreMode: (explore: boolean) => void;
  // 3D Experience Timeline state
  experienceFocus: { active: boolean; isHover: boolean; expId: number | null; worldPos?: [number, number, number]; scrollProgress: number };
  setExperienceFocus: (focus: { active: boolean; isHover: boolean; expId: number | null; worldPos?: [number, number, number]; scrollProgress: number }) => void;
}

export const useStore = create<StoreState>((set) => ({
  cursorState: 'default',
  cursorText: '',
  setCursorState: (state, text = '') => set({ cursorState: state, cursorText: text }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  focusedProjectId: null,
  setFocusedProjectId: (id) => set({ focusedProjectId: id }),
  projectFilter: null,
  setProjectFilter: (filter) => set({ projectFilter: filter }),
  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  perfTier: 'HIGH',
  setPerfTier: (tier) => set({ perfTier: tier }),
  debugMode: false,
  setDebugMode: (debug) => set({ debugMode: debug }),
  toggles: {
    particles: true,
    shaders: true,
    cursorEffects: true,
  },
  setToggle: (key, value) => set((state) => ({ toggles: { ...state.toggles, [key]: value } })),
  skillFocus: { active: false, skillId: null, worldPos: undefined },
  setSkillFocus: (focus) => set({ skillFocus: focus }),
  experienceFocus: { active: false, isHover: false, expId: null, worldPos: undefined, scrollProgress: 0 },
  setExperienceFocus: (focus) => set({ experienceFocus: focus }),
  exploreMode: false,
  setExploreMode: (explore) => set({ exploreMode: explore }),
}));
