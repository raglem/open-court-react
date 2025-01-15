import LoadingIndicator from "../components/LoadingIndicator.jsx"
import styles from "../styles/LandingPage.module.css"
import loginStyles from "../styles/Login.module.css"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        setLoading(true);
        e.preventDefault();

        try{
            const res = await api.post("/users/token/", {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            navigate("/")
        }
        catch(error){
            alert("Invalid credentials")
        } finally{
            setLoading(false)
        }
    };

    const handleRegister = async(e) => {
        setLoading(true);
        e.preventDefault();
        try{
            const res = await api.post("/users/register/", {username, password})
            alert("User successfully created. Please login with same credentials")
            navigate("/")
        }
        catch(error){
            alert(error)
        }
        finally{
            setLoading(false)
        }
    }

    return <div className = {styles["full-screen-div"]}>
        <form className={styles['form-container']}>
            <div className={loginStyles['header']}>
                Login | Register
            </div>
            <input
                className = {styles['form-input']}
                type = "text"
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}
                placeholder = "Username"
            />
            <input
                className = {styles['form-input']}
                type = "password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                placeholder = "Password"
            />
            {loading && <div className={loginStyles['header']}><LoadingIndicator/></div>}
            <div className={loginStyles['form-button-group']}>
                <button className = {loginStyles['form-button-login']} type="submit" onClick={(e) => handleLogin(e)}>
                    Login
                </button>
                <button className = {loginStyles['form-button-register']} type="submit" onClick={(e) => handleRegister(e)}>
                    Register
                </button>
            </div>
        </form>
    </div>
}

export default Login