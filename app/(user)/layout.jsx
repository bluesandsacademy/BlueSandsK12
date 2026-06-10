import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
