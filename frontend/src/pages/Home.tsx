import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Link to="/choose">
        <img className="block w-[70%] max-w-[420px] mx-auto my-16 drop-shadow-[6px_6px_0_rgba(0,0,0,0.35)]" src="/logo.png" alt="Pokemon Battle" />
      </Link>
      <Footer />
    </>
  );
}
