import playerStyles from "../styles/Players.module.css"
import gameStyles from "../styles/Game.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faUserClock, faCheck, faX, faTrash, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../api"

function PickupGame({game, updateGames}){
    const navigate = useNavigate()
    const handleAcceptedInvite = async () => {
        try{
            const response = await api.post("/users/pickup-games/accept/", {game_id: game.id})
            await updateGames()
            alert(response?.data?.message)
        }
        catch(err){
            console.log(err)
        }
    }

    const handleRejectedInvite = async () => {
        try{
            const response = await api.post("/users/pickup-games/reject/", {game_id: game.id})
            await updateGames()
            alert(response?.data?.message)
        }
        catch(err){
            console.log(err)
        }
    }

    const handleRemove = async () => {
        try{
            const response = await api.post("/users/pickup-games/remove-user/", {game_id: game.id})
            await updateGames()
            alert(response?.data?.message)
        }
        catch(err){
            console.log(err)
        }
    }

    const handleDelete = async () => {
        try{
            const response = await api.post("/users/pickup-games/delete/", {game_id: game.id})
            await updateGames()
            alert(response?.data?.message)
        }
        catch(err){
            console.log(err)
        }
    }

    const handleRevertStatus = async () => {
        try{
            const response = await api.post("/users/pickup-games/score/revert/", {game_id: game.id})
            await updateGames()
            alert(response?.data?.message)
        }
        catch(err){
            console.log(err)
        }
    }

    return <div>
        {game.status !== "Completed" && <div className={gameStyles['game-wrapper']}>
        <div className={gameStyles['game-wrapper-header']}>
            <div className={gameStyles['game-wrapper-header-left']}>
                {game.isOwner && <FontAwesomeIcon style={{marginRight: '5px', color: 'gold'}} icon={faCrown}/>}
                <span>
                    {game.format}v{game.format} | {game.location} | {game.date}
                </span>
            </div>
            {
                game.category === "Owned" &&  <div className={gameStyles['game-wrapper-header-right']}>
                    <button className={gameStyles['game-wrapper-header-button']} onClick={() => navigate('/pickup/game/update/', {state: {game_id: game.id}})}>Edit</button>
                    <FontAwesomeIcon className={gameStyles['game-wrapper-header-icon']} icon={faTrash} onClick={() => handleDelete()}/>
                </div>
            }
            {
                game.category === "Upcoming" &&  <div className={gameStyles['game-wrapper-header-right']}>
                    <FontAwesomeIcon className={gameStyles['game-wrapper-header-icon']} icon={faX} onClick={() => handleRemove()}/>
                </div>
            }
            {
                game.category === "Invited" &&  <div className={gameStyles['game-wrapper-header-right']}>
                    <button className={gameStyles['game-wrapper-header-button']} onClick={() => handleAcceptedInvite()}>Accept</button>
                    <FontAwesomeIcon className={gameStyles['game-wrapper-header-icon']} icon={faX} onClick={() => handleRejectedInvite()}/>
                </div>
            }
        </div>
        <div className={gameStyles['game-wrapper-subheader']}>
            Owned by {game.owner} | Game Code: {game.join_code} | Status: {game.status}
        </div>
        <div className={gameStyles['game-wrapper-body']}>
            <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Ringers</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                    {game.ringers && game.ringers.length > 0 && game.ringers.map(player => (
                        <div className={playerStyles['row']} key={player.id}>
                            <div className={playerStyles['row-main']}>
                                {player.name}
                            </div>
                            <div className={playerStyles['row-secondary']}>
                                {player.status==='added' && <FontAwesomeIcon style={{color:'green'}}icon={faCheck}/>}
                                {player.status==='pending' && <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>}
                            </div>
                        </div>
                        ))
                    }
                    {(!game.ringers || game.ringers.length==0) && <div className={playerStyles['row']}>
                        <div className={playerStyles['row-main']}>
                            None
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div style={{width: "20px"}}></div>
            <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Ballers</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                    {game.ballers && game.ballers.length > 0 && game.ballers.map(player => (
                        <div className={playerStyles['row']} key={player.id}>
                            <div className={playerStyles['row-main']}>
                                {player.name}
                            </div>
                            <div className={playerStyles['row-secondary']}>
                                {player.status==='added' && <FontAwesomeIcon style={{color:'green'}}icon={faCheck}/>}
                                {player.status==='pending' && <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>}
                            </div>
                        </div>
                        ))
                    }
                    {(!game.ballers || game.ballers.length==0) && <div className={playerStyles['row']}>
                        <div className={playerStyles['row-main']}>
                            None
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>

        <div className={gameStyles['game-wrapper-body']}>
            <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Pending Invites</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                {
                    game.pendingPlayers && game.pendingPlayers.length > 0 && game.pendingPlayers.map(player => (
                        <div className={playerStyles['row']} key={player.id}>
                            <div className={playerStyles['row-main']}>
                                {player.name}
                            </div>
                            <div className={playerStyles['row-secondary']}>
                                <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>
                            </div>
                        </div>
                    ))
                }
                {
                    (!game.pendingPlayers || game.pendingPlayers.length == 0) && <div className={playerStyles['row']}>
                        <div className={playerStyles['row-main']}>
                            None
                        </div>
                    </div>
                }
                </div>
            </div>
            <div style={{width: "20px"}}></div>
            <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Unassigned</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                    {
                        game.unassignedPlayers && game.unassignedPlayers.length > 0 && game.unassignedPlayers.map(player => (
                            <div className={playerStyles['row']} key={player.id}>
                                <div className={playerStyles['row-main']}>
                                    {player.name}
                                </div>
                                <div className={playerStyles['row-secondary']}>
                                    <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>
                                </div>
                            </div>
                        ))
                    }
                    {
                        (!game.unassignedPlayers || game.unassignedPlayers.length == 0) && <div className={playerStyles['row']}>
                            <div className={playerStyles['row-main']}>
                                None
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>}
    {game.status === "Completed" && <div className={gameStyles['game-wrapper-completed']}>
        <div className={gameStyles['game-wrapper-header']}>
            <div className={gameStyles['game-wrapper-header-left']}>
                {game.isOwner && <FontAwesomeIcon style={{marginRight: '5px', color: 'gold'}} icon={faCrown}/>}
                <span>{game.format}v{game.format} | {game.date} | Status: Completed</span>
            </div>
            {game.isOwner && <div className={gameStyles['game-wrapper-header-right']}>
                <button className={gameStyles['game-wrapper-header-button']} onClick={() => handleRevertStatus()}>Revert</button>
            </div>}
        </div>
        <div className={gameStyles['game-wrapper-subheader-center']}>
            {game.ringers_score > game.ballers_score && <FontAwesomeIcon style= {{color: 'gold '}}icon={faTrophy}/>}
            &nbsp; Ringers &nbsp;
            {game.ringers_score} - {game.ballers_score} &nbsp;
            {game.ballers_score > game.ringers_score && <FontAwesomeIcon style= {{color: 'gold '}}icon={faTrophy}/>}
            &nbsp;Ballers &nbsp;
        </div>
        <div className={gameStyles['game-wrapper-body']}>
        <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Ringers</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                    {game.ringers && game.ringers.length > 0 && game.ringers.map(player => (
                        <div className={playerStyles['row']} key={player.id}>
                            <div className={playerStyles['row-main']}>
                                {player.name}
                            </div>
                            <div className={playerStyles['row-secondary']}>
                                {player.status==='added' && <FontAwesomeIcon style={{color:'green'}}icon={faCheck}/>}
                                {player.status==='pending' && <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>}
                            </div>
                        </div>
                        ))
                    }
                    {(!game.ringers || game.ringers.length==0) && <div className={playerStyles['row']}>
                        <div className={playerStyles['row-main']}>
                            None
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div style={{width: "20px"}}></div>
            <div>
                <div className={gameStyles['game-wrapper-body-team-name']}>Ballers</div>
                <div className={gameStyles['game-wrapper-body-team-wrapper']}>
                    {game.ballers && game.ballers.length > 0 && game.ballers.map(player => (
                        <div className={playerStyles['row']} key={player.id}>
                            <div className={playerStyles['row-main']}>
                                {player.name}
                            </div>
                            <div className={playerStyles['row-secondary']}>
                                {player.status==='added' && <FontAwesomeIcon style={{color:'green'}}icon={faCheck}/>}
                                {player.status==='pending' && <FontAwesomeIcon style={{color:'darkgray'}} icon={faUserClock}/>}
                            </div>
                        </div>
                        ))
                    }
                    {(!game.ballers || game.ballers.length==0) && <div className={playerStyles['row']}>
                        <div className={playerStyles['row-main']}>
                            None
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>
    }
    </div>

}
export default PickupGame;