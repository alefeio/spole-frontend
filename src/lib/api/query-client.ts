import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        /**
         * Padrão é `online`: com `navigator.onLine === false` o fetch fica em
         * `fetchStatus: "paused"` e nunca chama a API (ex.: aba "Offline" no DevTools).
         * Em dev isso costuma confundir; `always` ainda falha de rede de forma visível.
         */
        networkMode: "always"
      }
    }
  });
}
