import styles from "./spinner.module.css"

export default function Spinner({ width=50, height=50 }: { width?: number, height?: number }) {
    return (
        <div className={styles.spinner} style={{ width, height }}>
            <svg viewBox={`0 0 ${width} ${height}`}>
                <circle className={styles.path} cx={`${width /2}`} cy={`${height/2}`} r={Math.min(width, height) / 2 - 5} />
            </svg>
        </div>
    )
}