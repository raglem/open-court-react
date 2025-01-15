import LoadingIndicator from "../components/LoadingIndicator"
import PickupGame from "../components/PickupGame"
import GridWrapper from "../components/GridWrapper"
import inputStyles from "../styles/Input.module.css"
import cardStyles from "../styles/Card.module.css"
import styles from "../styles/LandingPage.module.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
function PickupGames(){
    const [ownedGames, setOwnedGames] = useState([])
    const [unupdatedGames, setUnupdatedGames] = useState([])
    const [upcomingGames, setUpcomingGames] = useState([])
    const [invitedGames, setInvitedGames] = useState([])
    const [requestingGames, setRequestingGames] = useState([])
    const [completedGames, setCompletedGames] = useState([])
    const [joinCode, setJoinCode] = useState("")
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(()=>{
        getGames();
    }, []) 

    const getGames = async () => {
        setLoading(true);
        try{
            const userResponse = await api.get("/users/membership/")
            const userId = userResponse.data.user

            const response = await api.get("/users/pickup-games/")

            const rawOwnedGames = response.data.owned_games;
            const rawUnupdatedGames = response.data.owned_unupdated_games;
            const upcomingGames = response.data.upcoming_games
            const rawInvitedGames = response.data.invited_games;
            const requestingGames = response.data.requesting_games;
            const completedGames = response.data.completed_games;

            const formattedOwnedGames = formatGames(rawOwnedGames, userId)
            const formattedUnupdatedGames = formatGames(rawUnupdatedGames, userId)
            const formattedUpcomingGames = formatGames(upcomingGames, userId)
            const formattedInvitedGames = formatGames(rawInvitedGames, userId)
            const formattedRequestingGames = formatGames(requestingGames, userId)
            const formattedCompletedGames = formatGames(completedGames, userId)

            setOwnedGames(formattedOwnedGames);
            setUnupdatedGames(formattedUnupdatedGames)
            setUpcomingGames(formattedUpcomingGames);
            setInvitedGames(formattedInvitedGames);
            setRequestingGames(formattedRequestingGames);
            setCompletedGames(formattedCompletedGames);
        }
        catch (err) {
            alert(err)
        }
        finally{
            setLoading(false)
        }
    }

    const formatDate = (djangoDate) => {
        if (!djangoDate) return '';
    
        const date = new Date(djangoDate);
    
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDjangoDateToHumanReadable = (djangoDate) => {
        if (!djangoDate) return '';
    
        const date = new Date(djangoDate);
    
        let hours = date.getHours();
        const isPM = hours >= 12;
        hours = hours % 12 || 12; 
    
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const amPm = isPM ? 'PM' : 'AM';
    
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        return `${month}/${day}, ${hours}:${minutes} ${amPm}`;
    };

    const formatGames = (games, userId) => {
        const formattedGame = games.map((game) => {
            const ringersTeam = game.teams.find((team) => team.name === "Ringers");
            const ballersTeam = game.teams.find((team) => team.name === "Ballers");

            const ringers = ringersTeam ? ringersTeam.players.map((player) => ({
                    id: player.id,
                    name: player.name,
                })) : [];
            const ballers = ballersTeam ? ballersTeam.players.map((player) => ({
                id: player.id,
                name: player.name,
            })) : [];
            return {
                ...game,
                date: formatDate(game.date),
                ringers: ringers,
                ballers: ballers,
                ringers_score: parseInt(game.ringers_score, 10),
                ballers_score: parseInt(game.ballers_score, 10),
                isOwner: game.owner.id === userId,
                owner: game.owner.username,
                status: game.status === 1 ? "Pending":
                        game.status === 2 ? "Completed":
                        "Canceled"
            }
        });
        return formattedGame
    }

    return <div>
        {loading && <div className={styles['full-screen-div-center']}><LoadingIndicator/></div>}
        {!loading && <div className={styles['center']}>
            <div className={styles['header']}>My Schedule</div>
            <GridWrapper>
                <div className={styles['grid-element-wrapper']}>
                    <div className={styles['subheader']}>Upcoming</div>
                    <div className={cardStyles['schedule-wrapper']}>
                        {upcomingGames.length > 0 && upcomingGames.map(game => (
                            <div className={cardStyles['row']} key={game.id}>
                                <div className={cardStyles['row-main']}>
                                    {game.format}v{game.format} | {game.location}
                                </div>
                                <div className={cardStyles['row-secondary']}>
                                    {formatDjangoDateToHumanReadable(game.date)}
                                </div>
                            </div>
                        ))}
                        {upcomingGames.length === 0 && <div className={cardStyles['row']}>
                            None
                        </div>
                        }
                    </div>
                </div>
                <div className={styles['grid-element-wrapper']}>
                    <div className={styles['subheader']}>Recent</div>
                    <div className={cardStyles['schedule-wrapper']}>
                        {completedGames.length > 0 && completedGames.map(game => (
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
                                    {formatDjangoDateToHumanReadable(game.date)}
                                </div>
                            </div>
                        ))}
                        {completedGames.length === 0 && <div className={cardStyles['row']}>
                            None
                        </div>
                        }
                    </div>
                </div>
            </GridWrapper>
            <br/>
            <div className={styles['header-no-change']}>
                My Owned Games &nbsp;
                <button className={styles['btn-submit']} onClick={()=>navigate("/pickup/create/")}>
                    Create
                </button>
            </div>
            {ownedGames.length > 0 && <div className={styles['subheader']}>Pending</div>}
            <GridWrapper>
                {ownedGames.length > 0 && ownedGames.map(game => (
                    <div className={styles['grid-element-wrapper']} key={game.id}>
                        <PickupGame
                            game={{
                                id: game.id,
                                join_code: game.join_code,
                                format: game.format,
                                location: game.location,
                                date: formatDjangoDateToHumanReadable(game.date),
                                ringers: game.ringers,
                                ballers: game.ballers,
                                pendingPlayers: game.pending_players,
                                unassignedPlayers: game.unassigned_players,
                                isOwner: game.isOwner,
                                owner: game.owner,
                                status: game.status,
                                category: "Owned"
                            }}
                            updateGames={getGames}
                        />
                    </div>
                ))}
            </GridWrapper>
            <br/>
            {unupdatedGames.length > 0 && <div className={styles['subheader']}>Needs Updating</div>}
            <GridWrapper>
                {
                    unupdatedGames.length > 0 && unupdatedGames.map(game => (
                        <div className={styles['grid-element-wrapper']} key={game.id}>
                            <PickupGame
                                game={{
                                    id: game.id,
                                    join_code: game.join_code,
                                    format: game.format,
                                    location: game.location,
                                    date: formatDjangoDateToHumanReadable(game.date),
                                    ringers: game.ringers,
                                    ballers: game.ballers,
                                    pendingPlayers: game.pending_players,
                                    unassignedPlayers: game.unassigned_players,
                                    isOwner: game.isOwner,
                                    owner: game.owner,
                                    status: game.status,
                                    category: "Owned"
                                }}
                                updateGames={getGames}
                            />
                                
                        </div>
                ))}
            </GridWrapper>
            <br/>


            {upcomingGames.length > 0 && <div className={styles['header']}>Upcoming Games</div>}
            <GridWrapper>
                {
                    upcomingGames.length > 0 && upcomingGames.map(game => (
                        <div className={styles['grid-element-wrapper']} key={game.id}>
                            <PickupGame
                                game={{
                                    id: game.id,
                                    join_code: game.join_code,
                                    format: game.format,
                                    location: game.location,
                                    date: formatDjangoDateToHumanReadable(game.date),
                                    ringers: game.ringers,
                                    ballers: game.ballers,
                                    pendingPlayers: game.pending_players,
                                    unassignedPlayers: game.unassigned_players,
                                    isOwner: game.isOwner,
                                    owner: game.owner,
                                    status: game.status,
                                    category: "Upcoming"
                                }}
                                updateGames={getGames}
                            />
                                
                        </div>
                ))}
            </GridWrapper>
            <br/>
            <GridWrapper>
                {invitedGames.length > 0 && <div className={styles['grid-element-wrapper']}>
                    <div className={styles['header']}>Invited Games</div>
                    {
                        invitedGames.map(game => (
                            <div className={styles['grid-element-wrapper']}>
                                <PickupGame
                                    game={{
                                        id: game.id,
                                        join_code: game.join_code,
                                        format: game.format,
                                        location: game.location,
                                        date: formatDjangoDateToHumanReadable(game.date),
                                        ringers: game.ringers,
                                        ballers: game.ballers,
                                        pendingPlayers: game.pending_players,
                                        unassignedPlayers: game.unassigned_players,
                                        isOwner: game.isOwner,
                                        owner: game.owner,
                                        status: game.status,
                                        category: "Invited"
                                    }}
                                    updateGames={getGames}
                                />
                                <div style={{height: "10px"}}></div>
                            </div>
                    ))}
                </div>}

                {requestingGames.length < 0 && <div className={styles['grid-element-wrapper']}>
                    <div className={styles['header']}>Requested Games</div>
                    {
                        requestingGames.map(game => (
                            <div className={styles['grid-element-wrapper']}>
                                <PickupGame
                                    game={{
                                        id: game.id,
                                        join_code: game.join_code,
                                        format: game.format,
                                        location: game.location,
                                        date: formatDjangoDateToHumanReadable(game.date),
                                        ringers: game.ringers,
                                        ballers: game.ballers,
                                        pendingPlayers: game.pending_players,
                                        unassignedPlayers: game.unassigned_players,
                                        isOwner: game.isOwner,
                                        owner: game.owner,
                                        status: game.status,
                                    }}
                                    updateGames={getGames}
                                />
                                <div style={{height: "10px"}}></div>
                            </div>
                    ))}
                </div>}
            </GridWrapper>

        {completedGames.length > 0 && <div className={styles['header']}>Completed Games</div>}
            <GridWrapper>
                {
                    completedGames.length > 0 && completedGames.map(game => (
                        <div className={styles['grid-element-wrapper']}>
                            <PickupGame
                                game={{
                                    id: game.id,
                                    format: game.format,
                                    location: game.location,
                                    date: formatDjangoDateToHumanReadable(game.date),
                                    ringers: game.ringers,
                                    ballers: game.ballers,
                                    ringers_score: game.ringers_score,
                                    ballers_score: game.ballers_score,
                                    pendingPlayers: game.pending_players,
                                    unassignedPlayers: game.unassigned_players,
                                    isOwner: game.isOwner,
                                    owner: game.owner,
                                    status: game.status,
                                    category: "Completed"
                                }}
                                updateGames={getGames}
                            />
                                
                        </div>
                ))}
            </GridWrapper>
            <br/>
        </div>}
    </div>

    
}
export default PickupGames