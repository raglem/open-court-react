import styles from "../styles/LandingPage.module.css"
import notificationStyles from "../styles/Notifications.module.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import LoadingIndicator from "../components/LoadingIndicator"

function NotificationCenter(){
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const[notifications, setNotifications] = useState({
        'games': [],
        'friends': []
    })

    useEffect(() => {
        getNotifications()
      }, [])

    const getNotifications = async () => {
        setLoading(true)
        try{
            const response = await api.get("/users/membership/notifications/")
            setNotifications({
                'games': response.data.games,
                'friends': response.data.friends
            })
        }
        catch(err){
            if(err?.data?.message){
                alert(err.data.message)
            }
            else{
                console.log(err)
            }
        }
        finally{
            setLoading(false)
        }
    }
    const clearGameNotifications = async(game_id) => {
        if(notifications.games.length == 0){
            alert("There are no game notifications currently")
            return;
        }
        setLoading(true)
        try{
            const response = await api.post("/users/membership/notifications/clear/game/", {'game_id': game_id})
            alert(response?.data?.message)
            getNotifications()
        }
        catch(err){
            if(err?.data?.message){
                alert(err.data.message)
            }
            else{
                console.log(err)
            }
        }
        finally{
            setLoading(false)
        }
    }
    const clearFriendNotifications = async() => {
        if(notifications.friends.length == 0){
            alert("There are no friend notifications currently")
            return;
        }
        setLoading(true)
        try{
            const response = await api.post("/users/membership/notifications/clear/friends/")
            alert(response?.data?.message)
            getNotifications()
        }
        catch(err){
            if(err?.data?.message){
                alert(err.data.message)
            }
            else{
                console.log(err)
            }
        } finally{
            setLoading(false)
        }
    }
    const clearAllNotifications = async() => {
        if(notifications.games.length == 0 && notifications.friends.length == 0){
            alert("There are no notifications currently")
            return;
        }
        setLoading(true)
        try{
            const response = await api.post("/users/membership/notifications/clear/")
            alert(response?.data?.message)
            getNotifications()
        }
        catch(err){
            if(err?.data?.message){
                alert(err.data.message)
            }
            else{
                console.log(err)
            }
        } finally{
            setLoading(false)
        }
    }
    return <div>
        {loading && <div className={styles['full-screen-div-center']}><LoadingIndicator/></div>}
        {!loading && <div>
            <div className={styles['header']}>
                <span className={styles['row-main-no-border']}>Notification Center</span>
                {(notifications.games.length > 0 || notifications.friends.length > 0) && <span className={styles['row-secondary']}>
                    <button className={styles['btn-submit']} onClick={() => clearAllNotifications()}>Clear All</button>
                </span>}
            </div>
            <br/>
            <div className={notificationStyles['notification-group']}>Games</div>
            {notifications.games.length > 0 && notifications.games.map(game =>(<div key={game.id}>
                <div className={notificationStyles['notifications-header']}>
                    <div className={styles['row-main-no-border']}>
                        {game.title}
                    </div>
                    <div className={styles['row-secondary']}>
                        <button className={notificationStyles['clear-btn']} onClick={() => clearGameNotifications(game.id)}>Clear</button>
                    </div>
                </div>
                <div className={notificationStyles['notifications-wrapper']}>
                    {game.messages.length > 0 && game.messages.map((message, index) => (<div className={notificationStyles['notification-row']}>
                        <div className={notificationStyles['row-main']} key={index}>
                            {message}
                        </div>
                        <div className={notificationStyles['row-secondary']}>
                            <button className={notificationStyles['btn-view']} onClick={() => navigate("/pickup/games/")}> View </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            ))}
            {notifications.games.length == 0 && <div>
                <div className={notificationStyles['notifications-wrapper']}>
                    <div className={notificationStyles['notification-row']}>
                        <div className={notificationStyles['row-main']}>
                            None
                        </div>
                        <div className={notificationStyles['row-secondary']}>
                            <button className={notificationStyles['btn-view']} onClick={() => navigate("/pickup/games/")}>View</button>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className={notificationStyles['notification-group']}>
                <span className={styles['row-main-no-border']}>Friends</span>
                <span className={styles['row-secondary']}>
                    {notifications.friends.length > 0 && <button className={notificationStyles['clear-btn']} onClick={(() => clearFriendNotifications())}>Clear</button>}
                </span>
            </div>
        {notifications.friends.length > 0 && <div className={notificationStyles['notifications-wrapper']}>
                {notifications.friends.map((friend, index) => (<div className={notificationStyles['notification-row']} key={index}>
                    <div className={notificationStyles['row-main']}>
                        {friend.message}
                    </div>
                    <div className={notificationStyles['row-secondary']}>
                        <button className={notificationStyles['btn-view']} onClick={() => navigate("/")} >View</button>
                    </div>
                </div>
                ))}
            </div>}
            {notifications.friends.length == 0 && <div>
                <div className={notificationStyles['notifications-wrapper']}>
                    <div className={notificationStyles['notification-row']}>
                        <div className={notificationStyles['row-main']}>
                            None
                        </div>
                        <div className={notificationStyles['row-secondary']}>
                            <button className={notificationStyles['btn-view']} onClick={() => navigate("/")}>View</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>}
    </div>
}
export default NotificationCenter