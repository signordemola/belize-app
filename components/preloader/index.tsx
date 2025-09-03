import styles from "./preloader.module.css";

const Preloader = () => {
  return (
    <div className={styles.loaderWrap}>
      <div className={styles.preloader}>
        <div className={styles.animationPreloader}>
          <div className={styles.spinner}></div>
          <div className={styles.txtLoading}>
            {["b", "e", "l", "i", "z", "e", "b", "a", "n", "k"].map(
              (letter, index) => (
                <span
                  key={index}
                  data-text-preloader={letter}
                  className={styles.lettersLoading}
                  style={{ animationDelay: `${index * 0.2 + 0.2}s` }}
                >
                  {letter}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
