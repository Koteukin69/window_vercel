import { BgMusic } from "@/components"

export default function Data({data}: {data: {type: "title"|"text"|"component"|"bgMusic"|"picture", text?: string, component?: React.ReactNode, src?: string, width?: string|number}[]}) {
    return (
        <div className="flex flex-col justify-start text-white overflow-auto scrollbar h-[calc(100%-200px)] w-[calc(100%-100px)] sm:w-[calc(100%-200px)] md:w-[calc(100%-300px)] lg:w-[calc(100%-400px)] gap-[20px]">
            {
                data.map((item, index) => {
                    switch (item.type) {
                        case "title":
                            return <div key={index} className="text-white text-[30px]" style={{width: item.width}}>{item.text}</div>
                        case "text":
                            return <div key={index} className="text-white text-[20px] mr-[10px]" style={{width: item.width}}>{item.text}</div>
                        case "bgMusic":
                            return <div key={index} style={{width: item.width}}><BgMusic src={item.src} /></div>
                        case "picture":
                            return <div key={index} style={{width: item.width}}><img className="w-full object-cover" src={item.src} alt="picture" /></div>
                        case "component":
                            return <div key={index} style={{width: item.width}}>{item.component}</div>
                    }
                })
            }
        </div>
    )
}