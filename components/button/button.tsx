"use client";

import styles from "./button.module.css";

export default function Button({ text, type, action, href, id }: {text: string, type: "button"|"link"|"submit", action?: () => void, id?: string, href?:string}) {
  switch (type) {
    case "button":
      return <button id={id} className={styles.button} onClick={action}>{text}</button>
    case "submit":
      return <input id={id} className={styles.button} type="submit" value={text}></input>
    case "link":
      return <a id={id} className={styles.button} href={href}>{text}</a>
  }
}