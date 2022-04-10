interface ImportMetaEnv {
  readonly VITE_KITTEN_PASSWORD: string
  readonly VITE_PUPPY_PASSWORD: string
  readonly VITE_USE_EMULATORS: 'true' | 'false'
  readonly VITE_FIREBASE_CONFIG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
