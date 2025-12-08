import { Video, SearchForm, Details } from "@/components";
import SidebarNav from "@/components/sidebar_nav/sidebar_nav";

export default function Home() {
  return (
    <div className="h-[534px] w-[1278px] grid grid-cols-[78px_711px_399px] gap-[30px]">
      <SidebarNav />
      <div className="h-[456px]">
        <div className="mt-[78px]">
          <Video />
        </div>
        <div className="mt-4 h-[54px]">
          <SearchForm />
        </div>
      </div>
      <div className="h-[534px] grid grid-rows-[210px_1fr] gap-[26px]">
        <Details />
      </div>
    </div>
  );
}
