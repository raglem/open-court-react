import styles from "../styles/LandingPage.module.css"

const GridWrapper = ({children}) => {
    return <div className={styles['grid-wrapper']}>
        {children}
    </div>
}
export default GridWrapper