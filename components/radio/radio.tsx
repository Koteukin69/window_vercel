import styles from "./radio.module.css";

export default function Radio({label, id, radio, defaultChecked, required=false}: {label: string, id: string, radio: {id: string, label: string}[], defaultChecked?: string, required?: boolean}) {
    return (<div className={"grid grid-rows-[22px_22px] gap-[5px] mb-[5px]"}>
        <label className={"text-[18px] font-400"}>{label}</label>
        <div className={`grid grid-flow-col items-center h-[22px] ${styles.radio}`}>
            {radio.map((radio: {id: string, label: string }, i) => {
                return (
                    <div key={i} className="grid grid-rows-[22px] grid-cols-[22px_1fr] items-center">
                        <input id={radio.id} type="radio" name={id} value={radio.id} className={styles.input} required={required} defaultChecked={radio.id == defaultChecked}/>
                        <label htmlFor={radio.id} className={"cursor-pointer hover:underline"}>{radio.label}</label>
                    </div>
                )
            })}
        </div>
    </div>)
}

