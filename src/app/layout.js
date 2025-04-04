import Provider from "@/components/Provider";

export const metadata = {
  title: "Table Component Demo",
  description: "By Manik :-)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
