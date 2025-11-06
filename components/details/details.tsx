import {Title, CardList} from "@/components";

export default function Details() {
    return (<>
        <Title title={"по-\nсмотри\nв окно"} />
        <div className={"grid gap-[30px] w-[390px] h-auto overflow-y-auto scrollbar"}>
            <CardList />
        </div>
    </>);
}