import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import ClientProviders from "@/components/ClientProvider";
import Player from "@/components/Player";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import MenuMobile from "@/components/MenuMobile";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <ClientProviders session={session}>
      <html lang="en">
        <body className={`${inter.className} scrollbar-hide`}>
          <main className="flex">
            {session && <Sidebar />}
            <div className="flex-1 scrollbar-hide relative">
              {session && <Header />}
              {children}
              <Footer />
            </div>
          </main>
          {session && (
            <div className="sticky bottom-0">
              <Player />
              <MenuMobile />
            </div>
          )}
        </body>
      </html>
    </ClientProviders>
  );
}
