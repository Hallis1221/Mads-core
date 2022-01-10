import TopAuth from "../auth/topbar";
import CornerLogo from "../logo";

export default function NavBar({ }) {
  return (
    // CSS row
    <div className="flex flex-wrap-reverse justify-between bg-transparent">
      <CornerLogo />
      < TopAuth />
    </div>

  );
}