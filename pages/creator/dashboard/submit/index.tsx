import SideBar from "../../../../components/dashboard/sidebar";

export default function SubmissionPage({}) {
  return (
    <main>
      <div className="relative h-screen w-full bg-[#F2F7FF] flex flex-row font-mulish">
        <SideBar />
        <div className="px-16 ">
          <div className="text-3xl  font-bold pt-5 tracking-no">
            Submission Page
          </div>
          
        </div>
      </div>
    </main>
  );
}
