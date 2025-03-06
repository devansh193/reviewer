import { HomeFooter } from "../components/home-footer";
import { HomeNavbar } from "../components/home-navbar";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeNavbar />
      <main className="mt-16">{children}</main>
      <HomeFooter />
    </div>
  );
};

export default LandingLayout;
