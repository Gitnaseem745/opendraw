import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout";
import { config } from "@/config";
import { MainMenu } from "@/components/layout";

export const metadata: Metadata = {
    title: "Open Draw",
    description: "A whiteboard to drawing things.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    themes={config.themes}
                    defaultTheme={config.defaultTheme}
                    enableSystem
                >
                    <MainMenu />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
