import { useNavigate } from "react-router-dom";
import styles from "../styles/Card.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketball } from '@fortawesome/free-solid-svg-icons';
function Card({friend}){
    if (!friend){
        return <div>No friend data</div>
    }
    const navigate = useNavigate()
    const navigateToPlayer = (member_id) => {
        navigate('/pickup/player/', {state: {member_id: member_id}})
    }
    const formatDate = (rawDate) => {
        const date = new Date(rawDate);

        const month = date.getMonth() + 1
        const day = date.getDate()

        return `${month}/${day}`
    }
    const getWinPercentage = (wins, losses) => {
        if(wins==0 && losses==0){
            return ".000"
        }
        const percentage = wins/(wins+losses)
        if (percentage === 1){
            return "1.000"
        }
        return percentage.toFixed(3).toString().substring(1)
    }
    return <div className={styles['card-wrapper']}>
        <div className={styles['header']}>
            <div className={styles['header-left']}>
                <h1 className={styles['name']} onClick={() => navigateToPlayer(friend.id)}>
                    {friend.name}
                </h1>
            </div>

            <div className={styles['header-right']}>
                <h1 className={styles['h1']}>
                    {friend.pickup_wins} - {friend.pickup_losses} | {getWinPercentage(friend.pickup_wins, friend.pickup_losses)}
                </h1>
            </div>
        </div>

        <div className={styles['body']}>
            <div className={styles['body-left']}>
                <h2 className={styles['h2']}>Upcoming Games</h2>
                <div className={styles['games-upcoming']}>
                    {friend.upcoming_games && friend.upcoming_games.length > 0 && friend.upcoming_games.map(game => (
                        <div className={styles['row']} key={game.id}>
                            <div className={styles['row-main']}>
                                {game.format}v{game.format} | {game.location}
                            </div>
                            <div className={styles['row-secondary']}>
                                {formatDate(game.date)}
                            </div>
                        </div>
                    ))}
                    {(!friend.upcoming_games || friend.upcoming_games.length === 0) && <div className={styles['row']}>
                        None
                    </div>
                    }           
                </div>

                <h2 className={styles['h2']}>Recent Games</h2>
                <div className={styles['games-recent']}>
                    {friend.recent_games && friend.recent_games.length > 0 && friend.recent_games.map(game => (
                        <div className={styles['row']} key={game.id}>
                            <div className={styles['row-format']}>
                                {game.format}v{game.format}
                            </div>
                            <div className={styles['row-center']}>
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
                            <div className={styles['row-secondary']}>
                                {formatDate(game.date)}
                            </div>
                        </div>
                    ))}
                    {(!friend.recent_games || friend.recent_games.length === 0) && <div className={styles['row']}>
                        None
                    </div>
                    }
                </div>
            </div>
            
            <div className={styles['body-right']}>
                <h2 className={styles['h2']}>Record</h2>
                <div className={styles['players-wrapper']}>
                    <div className={styles['row-header']}>
                        3v3
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['row-left']}>
                            {friend.wins_3v3} - {friend.losses_3v3}
                        </div>
                        <div className={styles['row-right']}>
                            {getWinPercentage(friend.wins_3v3, friend.losses_3v3)}
                        </div>
                    </div>
                    <div className={styles['row-header']}>
                        4v4
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['row-left']}>
                            {friend.wins_4v4} - {friend.losses_4v4}
                        </div>
                        <div className={styles['row-right']}>
                            {getWinPercentage(friend.wins_4v4, friend.losses_4v4)}
                        </div>
                    </div>
                    <div className={styles['row-header']}>
                        5v5
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['row-left']}>
                            {friend.wins_5v5} - {friend.losses_5v5}
                        </div>
                        <div className={styles['row-right']}>
                            {getWinPercentage(friend.wins_5v5, friend.losses_5v5)}
                        </div>
                    </div>
                    <div className={styles['row-header']}>
                        Overall
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['row-left']}>
                            {friend.pickup_wins} - {friend.pickup_losses}
                        </div>
                        <div className={styles['row-right']}>
                            {getWinPercentage(friend.pickup_wins, friend.pickup_losses)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
export default Card;