import styles from "../styles/LandingPage.module.css"

const GridWrapperUpdate = ({children}) => {
    return <div className={styles['grid-wrapper-update']}>
        {children}
    </div>
}
export default GridWrapperUpdate