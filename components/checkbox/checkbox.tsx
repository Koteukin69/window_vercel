import styles from "./checkbox.module.css"

export default function Checkbox({ id, label }: { id: string, label: string }) {
    return (<div className={styles.checkbox}>
        <input type="checkbox" name={id} id={id} className={styles.input} />
        <label htmlFor={id}>{label}</label>
    </div>)
}