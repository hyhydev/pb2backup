import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import { Header } from "~/components/header/header";
import { Sidebar } from "~/components/sidebar/sidebar";
import { SidebarProvider } from "~/contexts/SidebarContext";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <Header />
        <div className="flex-grow-1 grid grid-cols-[auto,1fr] overflow-auto">
          <Sidebar />
          <Component {...pageProps} />
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
