import styles from "./input.module.css";

export default function Input({label, placeholder, id, value, type="text", required=false}: {label: string, placeholder?: string, id?: string, value?: string, type?: string, required?: boolean}) {
    return (<div className={"grid grid-rows-[22px_27px] gap-[5px]"}>
        <label htmlFor={id} className={"text-[18px] font-400"}>{label}</label>
        <input id={id} name={id} type={type} className={styles.input} placeholder={placeholder} required={required} defaultValue={value} />
    </div>)
}