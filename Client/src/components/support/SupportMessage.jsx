import styles from "./SupportMessage.module.css";

export default function MessageThread({ messages }) {
  return (
    <div className={styles["thread"]}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles["message-wrapper"]} ${
            message.isSupport ? styles["support"] : styles["user"]
          }`}
        >
          <div
            className={`${styles["message"]} ${
              message.isSupport
                ? styles["message-support"]
                : styles["message-user"]
            }`}
          >
            <div className={styles["meta"]}>
              <span className={styles["author"]}>{message.author}</span>
              <span className={styles["time"]}>{message.timestamp}</span>
            </div>
            <p className={styles["content"]}>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
