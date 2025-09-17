import Footer from "../(default)/component/Footer";
import Header from "../(default)/component/Header";

const DefaultLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
