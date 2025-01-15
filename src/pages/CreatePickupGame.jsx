import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LoadingIndicator from "../components/LoadingIndicator"
import styles from "../styles/LandingPage.module.css"
import inputStyles from "../styles/Input.module.css"
import playerStyles from "../styles/Players.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUserClock, faX } from '@fortawesome/free-solid-svg-icons';
import api from "../api"

function CreatePickupGame(){
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [game, setGame] = useState({
        format: 3,
        location: '',
        date: '',
        invited_players: [],
    })
    const [friends, setFriends] = useState([])
    
    useEffect(() => {
        getFriends()
      }, []);

    
    
    const getFriends = async () => {
        setLoading(true)
        try {
            const res = await api.get("/users/membership/");
            const friends = res.data.friends
            const format = []
            const user = {
                id: res.data.id,
                name: res.data.name,
                friend_id: res.data.friend_id,
            }
            format.push(user)
            friends.forEach(friend => {
                const formattedFriend = {
                    id: friend.id,
                    name: friend.name,
                    friend_id: friend.friend_id,
                }
                format.push(formattedFriend)
            })
            setFriends(format);
        } catch (err) {
            alert(err?.response?.data.error);
        } finally {
            setLoading(false)
        }
    };

    const formatDateTimeLocalToDjango = (datetimeLocal) => {
        const utcDate = new Date(datetimeLocal + 'Z');
        return utcDate.toISOString();
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setGame((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleCheckboxChange = (e) => {
        const value = parseInt(e.target.value, 10)
        const isChecked = e.target.checked;

        setGame((prev) => ({
            ...prev,
            invited_players: isChecked 
                ? [...prev.invited_players, value]
                :prev.invited_players.filter((item) => item !== value)
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        try{
            const formatted = {
                ...game,
                [date]: formatDateTimeLocalToDjango(game.date),
                all_players: game.invited_players
            }
            const response = await api.post("/users/pickup-games/create/", formatted)
            alert(response?.data?.message)
            navigate("/pickup/games/")
        }
        catch (err){
            alert(err)
        }
        finally{
            setLoading(false)
        }
       
    }
    return <div className={styles['full-screen-div-center']}>
        {loading && <LoadingIndicator/>}
        {!loading && <div className={styles['form-container']}>
            <div className={styles['header']}> Create Pickup Game </div>
            <br/>
            <div>
                <div>
                    <div className={styles['label']}>
                        Format: &nbsp;
                        <select id="format" value={game.format} className={inputStyles['input-full']} onChange={handleInputChange}>
                            <option value="3">3v3</option>
                            <option value="4">4v4</option>
                            <option value="5">5v5</option>
                        </select>
                    </div>
                    <br/>
                    <div className={styles['label']}>
                        Location: &nbsp;
                        <input id="location" type="text" value={game.location} className={inputStyles['input-full']} onChange={handleInputChange}></input>
                    </div>
                    <br/>
                    <div className={styles['label']}>
                        Date: &nbsp;
                        <input id="date" type="datetime-local" value={game.date} className={inputStyles['input-full']} onChange={handleInputChange}></input>
                    </div>
                </div>
                <br/>

                <div>
                    <div className={styles['label']}>Invite players:</div>
                    <div className={playerStyles['players-wrapper']}>
                        <div className={playerStyles['players-wrapper-header']}>
                            My Friend List
                        </div>
                        <div className={playerStyles['players-wrapper-body']}>
                            {friends && friends.map(friend => (
                                <div className={playerStyles['row']} key={friend.id}>
                                    <div className={playerStyles['row-main']}>
                                        {friend.name}
                                    </div>
                                    <div className={playerStyles['row-secondary']}>
                                        <input 
                                            value={friend.id}
                                            type="checkbox"
                                            checked={game.invited_players.includes(friend.id)}
                                            onChange={handleCheckboxChange}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent:"flex-end"}}>
                        <button className={styles['btn-submit']} onClick={() => handleSubmit()}>
                            Create
                        </button>
                    </div>  
                </div>
            </div>
        </div>}
    </div>
}
export default CreatePickupGame;