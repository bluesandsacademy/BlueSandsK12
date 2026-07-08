import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import WhatsAppFab from "@/components/common/whatsapp-fab";
import { CurrencyProvider } from "@/components/common/currency-provider";
import { getUsdToNgn } from "@/lib/exchange-rate";

export default async function UserLayout({ children }) {
  const { rate } = await getUsdToNgn();
  return (
    <CurrencyProvider initialRate={rate}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </div>
    </CurrencyProvider>
  );
}
