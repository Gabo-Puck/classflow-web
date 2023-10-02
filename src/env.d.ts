/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLASS_FLOW_API: string
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }