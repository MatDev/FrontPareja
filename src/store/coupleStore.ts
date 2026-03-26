import { create } from 'zustand';

interface Partner {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

interface CoupleState {
  coupleId: string | null;
  partner: Partner | null;
  setCoupleId: (id: string) => void;
  setPartner: (partner: Partner) => void;
  clearCouple: () => void;
}

export const useCoupleStore = create<CoupleState>((set) => ({
  coupleId: null,
  partner: null,
  setCoupleId: (id) => set({ coupleId: id }),
  setPartner: (partner) => set({ partner }),
  clearCouple: () => set({ coupleId: null, partner: null }),
}));
