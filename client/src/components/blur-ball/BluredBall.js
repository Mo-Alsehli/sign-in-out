import React from "react";
import styles from "./blured-ball.module.css";

const BluredBall = () => {
  return (
    <div>
      <div className={styles.ball}>
        <div className={styles.blur}></div>
      </div>
    </div>
  );
};

export default BluredBall;
