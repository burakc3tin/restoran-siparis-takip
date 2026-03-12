import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../src/services/firebase', () => ({
  addUrun: vi.fn(p => Promise.resolve({ id: '1', ...p })),
  updateUrun: vi.fn((id, p) => Promise.resolve({ id, ...p })),
  deleteUrun: vi.fn(() => Promise.resolve()),
  addUrunGrubu: vi.fn(g => Promise.resolve({ id: '1', ...g })),
  updateUrunGrubu: vi.fn((id, g) => Promise.resolve({ id, ...g })),
  deleteUrunGrubu: vi.fn(() => Promise.resolve()),
  getUrunler: vi.fn(() => Promise.resolve([])),
  getUrunGruplari: vi.fn(() => Promise.resolve([])),
  addOdeme: vi.fn(() => Promise.resolve({ id: '1' })),
}));

vi.mock('../src/context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => key,
    lang: 'tr'
  }),
  LanguageProvider: ({ children }) => <div>{children}</div>
}));

vi.mock('../src/services/cloudinary', () => ({
  uploadImage: vi.fn(() => Promise.resolve('mock-url')),
}));

vi.mock('../src/services/aiService', () => ({
  generateProductDescription: vi.fn(() => Promise.resolve('AI Description')),
}));

vi.mock('../src/services/qrService', () => ({
  generateQRCode: vi.fn(() => Promise.resolve('qr-data-url')),
}));

global.Audio = class {
  constructor() {
    this.play = vi.fn().mockResolvedValue();
    this.pause = vi.fn();
    this.volume = 0;
  }
};

window.location = {
  ...window.location,
  origin: 'http://localhost:3000'
};
