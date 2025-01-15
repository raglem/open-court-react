import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import styles from "../styles/LandingPage.module.css"
import playerStyles from "../styles/Players.module.css"
import cardStyles from "../styles/Card.module.css"
import api from "../api"

function PlayerPage(){
    const navigate = useNavigate()
    const location = useLocation();
    
    const {member_id} = location.state || {}

    const[loading, setLoading] = useState(false)
    const [member, setMember] = useState([])

    useEffect(() => {
        getPlayer();
    }, [])

    const getPlayer = async () => {
        setLoading(true)
        try{
            const response = await api.get(`/users/membership/page/?member_id=${member_id}`)
            setMember(response.data)
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error);
            }
            console.log(err)
        }
        finally{
            setLoading(false)
        }
    }

    const formatMonthDay = (raw) => {
        const date = new Date(raw)
        const month = date.getMonth()+1
        const day = date.getDay()
        return `${month}/${day}`
    }

    return <div className={styles['full-screen-div-center']}>
        {loading && <LoadingIndicator/>}
        {!loading && <div className={styles['general-wrapper']}>
            <div className={styles['header']}>{member.name}</div>
            <div className={styles['subheader']}>
                <span style={{width: "fit-content", marginRight: "10px"}}>Friend ID: {member.friend_id}</span>
            </div>
            <div className={styles['grid-wrapper-columns-2']}>
                <div className={styles['grid-element-wrapper']}>
                    <div className={styles['label']}>Game Records</div>
                    <div className={playerStyles['players-wrapper-small']}>
                        <div className={playerStyles['row']}> 3v3 | {member.wins_3v3}-{member.losses_3v3} </div>
                        <div className={playerStyles['row']}> 4v4 | {member.wins_4v4}-{member.losses_4v4} </div>
                        <div className={playerStyles['row']}> 5v5 | {member.wins_5v5}-{member.losses_5v5} </div>
                    </div>
                </div>
                <div className={styles['grid-element-wrapper']}>
                    <div className={styles['label']}>Mutual Friends</div>
                    <div className={playerStyles['players-wrapper-small']}>
                        {member.mutual_friends && member.mutual_friends.length > 0 && member.mutual_friends.map(friend => (
                            <div className={playerStyles['row']} key={friend.id}>
                                {friend.name}
                            </div>
                        ))}
                        { (!member.mutual_friends || member.mutual_friends.length == 0) && <div className={cardStyles['row']}>
                            None
                        </div>
                        }
                    </div>
                </div>
            </div>
            <div className={styles['subheader-fit']}>Upcoming Games</div>
            <div className={cardStyles['schedule-wrapper']}>
                {
                    member.upcoming_games && member.upcoming_games.length > 0 && member.upcoming_games.map(game => (
                        <div className={cardStyles['row']} key={game.id}>
                            <div className={cardStyles['row-main']}>
                                {game.format}v{game.format} | {game.location} | Code: {game.join_code}
                            </div>
                            <div className={cardStyles['row-secondary']}>
                                {formatMonthDay(game.date)}
                            </div>
                        </div>
                    ))
                }
                {
                    (!member.upcoming_games || member.upcoming_games.length == 0) && <div className={cardStyles['row']}>
                        None
                    </div>
                }
            </div>
            <br/>
            <div className={styles['subheader-fit']}>Recent Games</div>
            <div className={cardStyles['schedule-wrapper']}>
                {
                    member.recent_games && member.recent_games.length > 0 && member.recent_games.map(game => (
                        <div className={cardStyles['row']} key={game.id}>
                            <div className={cardStyles['row-format']}>
                                {game.format}v{game.format}
                            </div>
                            <div className={cardStyles['row-center']}>
                                {game.player_team === game.winner && game.player_team === "Ringers" && <span>
                                    <span style={{color: 'green'}}>W &nbsp;</span>
                                    <span>{game.ringers_score} - {game.ballers_score}</span>
                                </span>
                                }
                                {game.player_team === game.winner && game.player_team === "Ballers" && <span>
                                    <span style={{color: 'green'}}>W &nbsp;</span>
                                    <span>{game.ballers_score} - {game.ringers_score}</span>
                                </span>
                                }
                                {game.player_team !== game.winner && game.player_team === "Ringers" && <span>
                                    <span style={{color: 'red'}}>L &nbsp;</span>
                                    <span>{game.ringers_score} - {game.ballers_score}</span>
                                </span>
                                }
                                {game.player_team !== game.winner && game.player_team === "Ballers" && <span>
                                    <span style={{color: 'red'}}>L &nbsp;</span>
                                    <span>{game.ballers_score} - {game.ringers_score}</span>
                                </span>
                                }

                            </div>
                            <div className={cardStyles['row-secondary']}>
                                {formatMonthDay(game.date)}
                            </div>
                        </div>
                    ))
                }
                {
                     (!member.recent_games || member.recent_games.length == 0) && <div className={cardStyles['row']}>
                        None
                    </div>
                }
            </div>
        </div>}
    </div>
}
export default PlayerPage;