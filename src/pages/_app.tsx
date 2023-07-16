import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import { MantineProvider } from '@mantine/core';
import "~/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
