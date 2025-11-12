import { Video, SearchForm, Details } from "../../components";

export default function Main() {
  return (
    <div className="h-[534px] w-[1278px] grid grid-cols-[78px_711px_399px] gap-[30px]">
      <div className="grid grid-rows-[repeat(2,78px)_1fr_repeat(1,78px)] justify-items-center gap-[30px]">
        <a href="/login" className="w-full aspect-square border flex items-center justify-center">
            Аккаунт
        </a>
        <a href="/login" className="w-full aspect-square border flex items-center justify-center">
            Избранное
        </a>
        <div></div>
        <a href="/about" className="w-full aspect-square border flex items-center justify-center">
            О Проекте
        </a>
      </div>
      <div className="h-[456px]">
          <div className="mt-[78px]">
            <Video />
          </div>
          <div className="mt-4 h-[54px]">
            <SearchForm />
          </div>
      </div>
      <div className="h-[534px] grid grid-rows-[210px_1fr] gap-[26px]">
        <Details/>
      </div>
    </div>
  )
}
