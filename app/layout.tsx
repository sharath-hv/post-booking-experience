import type { Metadata } from "next";
import "./globals.scss";
import styles from "./layout.module.scss";

import { EUCLID_FONT_ORIGIN, EUCLID_PRELOAD_FONT_FILES, euclidFontHref } from "@/lib/euclid-font-preload";
import { AnimationProvider } from "@/components/providers";
import { AppToastHost } from "@/components/ui/AppToastHost";

export const metadata: Metadata = {
  title: "Post-booking experience",
  description: "ACKO Drive quote",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={EUCLID_FONT_ORIGIN} crossOrigin="anonymous" />
        {EUCLID_PRELOAD_FONT_FILES.map((file) => (
          <link
            key={file}
            rel="preload"
            href={euclidFontHref(file)}
            as="font"
            type="font/otf"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body className={styles.body}>
        <AnimationProvider>
          <div className={styles.shell}>{children}</div>
          <AppToastHost />
        </AnimationProvider>
      </body>
    </html>
  );
}
