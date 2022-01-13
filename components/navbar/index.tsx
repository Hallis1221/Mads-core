import TopAuth from "../auth/topbar";
import CornerLogo from "../logo";

export default function NavBar({ }) {
  return (
    // CSS row
  <div className="flex flex-row items-start justify-between h-0 z-1 ">
      <CornerLogo />
      < TopAuth />
    </div>

  );
}