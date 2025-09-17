import type { Metadata } from "next";
import { ThemeRegistry } from "../@core/theme/ThemeRegistry";
import "./globals.css";
import QueryClientProvider from "../../providers/ReactQueryProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import AuthSessionProvider from "@/contexts/next-auth-session";
import Script from "next/script";

export const metadata: Metadata = {
  title: "TBO",
  description: "Talent Management Application Website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Zoho SalesIQ Script */}
        <Script id="zoho-salesiq-init" strategy="lazyOnload">
          {`
            window.$zoho = window.$zoho || {};
            $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
          `}
        </Script>
        <Script
          id="zoho-salesiq-script"
          src="https://salesiq.zohopublic.com/widget?wc=siq0904106491165f582da5aff585dc5813cdd4b2d5b309237329829b1e01f46c7c"
          strategy="lazyOnload"
        />
      </head>
      <AuthSessionProvider session={session}>
        <QueryClientProvider>
          <ThemeRegistry>
            <body>{children}</body>
          </ThemeRegistry>
        </QueryClientProvider>
      </AuthSessionProvider>
    </html>
  );
}
