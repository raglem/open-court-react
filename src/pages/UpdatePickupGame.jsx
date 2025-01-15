import GridWrapperUpdate from "../components/GridWrapperUpdate"
import LoadingIndicator from "../components/LoadingIndicator"
import styles from "../styles/LandingPage.module.css"
import inputStyles from "../styles/Input.module.css"
import playerStyles from "../styles/Players.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUserClock, faX, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import api from "../api"

function UpdatePickupGame(){
    const location = useLocation(); 
    const navigate = useNavigate();
    const {game_id} = location.state || {};

    const[loading, setLoading] = useState(false)

    const [friends, setFriends] = useState([])
    const [teams, setTeams] = useState({
        ringers: [],
        ballers: [],
    })
    const [scores, setScores] = useState({
        ringersScore: 0,
        ballersScore: 0,
    })
    const [gameInfo, setGameInfo] = useState({
        format: '',
        location: '',
        date: '',
        all_members: [],
        all_players: [],
        newly_invited_players: [],
        requesting_players: [],
        ringers: [],
        ballers: [],
        unassigned_players: [],
        pending_players: [],
    })
    
    useEffect(() => {
        if (!game_id) {
          console.error('No game_id provided. Redirecting to home.');
          navigate('/pickup/games/');
        } else {
          getUpdate()
        }
      }, [game_id, navigate]);

    const getUpdate = async () => {
        setLoading(true)
        try {
            const friendResponse = await api.get("/users/membership/");
            const friends = friendResponse.data.friends

            const gameResponse = await api.post("/users/pickup-game/", {"game_id": game_id})
            const game = gameResponse.data
            
            const formattedFriends = []
            formattedFriends.push({
                id: friendResponse.data.id,
                name: friendResponse.data.name,
                friend_id: friendResponse.data.friend_id,
                already_invited: game.all_members.includes(friendResponse.data.id)
            })
            friends.forEach(friend => {
                const formattedFriend = {
                    id: friend.id,
                    name: friend.name,
                    friend_id: friend.friend_id,
                    already_invited: game.all_members.includes(friend.id)
                }
                formattedFriends.push(formattedFriend)
            })

            const formattedGameData = formatGameData(game)

            setFriends(formattedFriends);
            setGameInfo(formattedGameData)

        } catch (err) {
            if(err?.data?.error){
                alert(err.data.error)
            }
            else if(err?.response?.data?.error){
                alert(err.response.data.error)
            }
            else{
                alert("Something went wrong. Please reload the page")
            }
        } finally {
            setLoading(false)
        }
    };

    const formatGameData = (game_data) => {
        const date = formatDjangoDateToLocalDatetime(game_data.date)
        const all_players = game_data.unassigned_players.concat(game_data.pending_players, game_data.requesting_players)
        const ringers = game_data.teams.find((team) => team.name === "Ringers").players
        const ballers = game_data.teams.find((team) => team.name === "Ballers").players

        const status = game_data.status === 1 ? "Pending" :
                        game_data.status === 2 ? "Completed" :
                        game_data.status === 3 ? "Canceled" : "unknown";

        const res = {
            format: game_data.format,
            location: game_data.location,
            date: date,
            join_code: game_data.join_code,
            all_members: game_data.all_members,
            all_players: all_players,
            newly_invited_players: [],
            ringers: ringers,
            ballers: ballers,
            unassigned_players: game_data.unassigned_players,
            pending_players: game_data.pending_players,
            requesting_players: game_data.requesting_players,
            status: status,
        }
        return res
    }

    const formatDateTimeLocalToDjango = (datetimeLocal) => {
        const utcDate = new Date(datetimeLocal + 'Z');
        return utcDate.toISOString();
    }

    const formatDjangoDateToLocalDatetime = (djangoDate) => {
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

    const handleScoreSubmit = async () => {
        if(scores.ringersScore === scores.ballersScore){
            alert("No ties are allowed in a pickup game. Please update the scores or discard the game")
            return
        }
        setLoading(true)
        try{
            const formattedRequest = {
                game_id: game_id,
                ringers_score: scores.ringersScore,
                ballers_score: scores.ballersScore
            }
            
            const response = await api.post("/users/pickup-games/score/", formattedRequest)
            alert(response?.data?.message)
            navigate("/pickup/games/")
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else if(err?.response?.data?.error){
                alert(err.response.data.error)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setGameInfo((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const value = parseInt(e.target.value, 10)
        const isChecked = e.target.checked

        setGameInfo((prev) => ({
            ...prev,
            newly_invited_players: isChecked 
                ? [...prev.newly_invited_players, value]
                : prev.newly_invited_players.filter((item) => item !== value)
        }))
    }

    const handleScoreChange = (e) => {
        const { name, value } = e.target
        const intValue = parseInt(value, 10)
        setScores((prev) => ({
            ...prev,
            [name]: isNaN(intValue) ? 0 : intValue,
        }))
    }

    const handleRadioChange = (e, teamType) => {
        const value = parseInt(e.target.value, 10)

        setTeams((prev) => {
            const newTeams = {
                ringers: prev.ringers.filter((id) => id !== value),
                ballers: prev.ballers.filter((id) => id !== value)
            };

            newTeams[teamType] = [...newTeams[teamType], value]
            return newTeams
        })
    }

    const handleUpdatedDetails = async () => {
        const formattedDetails = {
            game_id: game_id,
            format: gameInfo.format,
            location: gameInfo.location,
            date: formatDateTimeLocalToDjango(gameInfo.date)
        }
        setLoading(true)
        try{
            const detailsResponse = await api.post("/users/pickup-games/update-details/", formattedDetails)
            alert(detailsResponse.data.message)
            getUpdate()
        }
        catch (err){
            if(err?.data?.message){
                alert(err.data.message)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }

    const handleUpdatedInvites = async () => {
        if(gameInfo.newly_invited_players.length==0){
            alert("Invite a new friend")
            return;
        }
        setLoading(true)
        try{
            const formattedRequest = {
                id: game_id,
                invited_member_ids: gameInfo.newly_invited_players
            }

            const response = await api.post("/users/pickup-games/invite/", formattedRequest)
            alert(response?.data?.message)

            setGameInfo((prev) => ({
                ...prev,
                newly_invited_players: []
            }))

            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }

    const handleTeamAssignment = async () => {
        if(teams.ringers.length==0 && teams.ballers.length==0){
            alert("Assign at least one player to a team")
            return;
        }

        setLoading(true)
        try{
            const formattedRequest = {
                game_id: game_id,
                ringers_player_ids: teams.ringers,
                ballers_player_ids: teams.ballers
            }

            const response = await api.post("/users/pickup-games/team/assign/", formattedRequest)
            setTeams({
                ringers: [],
                ballers: []
            })
            alert(response.data.message)
            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }

    const handleTeamReassignment = async (player_id) => {
        setLoading(true)
        try{
            const response = await api.post("/users/pickup-games/team/reassign/", {game_id: game_id, player_id: player_id})
            alert(response.data.message)
            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            alert(err)
        }
        finally{
            setLoading(false)
        }
    }

    const handleTeamRemoval = async (player_id) => {
        setLoading(true)
        try{
            const response = await api.post("/users/pickup-games/team/remove/", {game_id: game_id, player_id: player_id})
            alert(response.data.message)
            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            alert(err)
        }
        finally{
            setLoading(false)
        }
    }

    const handlePlayerRemoval = async (playerId) => {
        setLoading(true)
        try{
            const formattedRequest = {
                game_id: game_id,
                player_id: playerId
            }

            const response = await api.post("/users/pickup-games/remove-player/", formattedRequest)
            alert(response?.data?.message)

            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else{
                alert(err)
            }
        }
        finally{
            setLoading(false)
        }
    }

    const handlePlayerRequestAccept = async (playerId) => {
        setLoading(true)
        try{
            const formattedRequest = {
                game_id: game_id,
                player_id: playerId
            }
            
            const response = await api.post("/users/pickup-games/request/accept/", formattedRequest)
            alert(response?.data?.message)

            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else{
                alert(err)
            }
        }
        finally{
            setLoading(false)
        }
    }

    const handlePlayerRequestReject = async (playerId) => {
        setLoading(true)
        try{
            const formattedRequest = {
                game_id: game_id,
                player_id: playerId
            }
            
            const response = await api.post("/users/pickup-games/request/reject/", formattedRequest)
            alert(response?.data?.message)

            getUpdate()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else{
                alert(err)
            }
        }
        finally{
            setLoading(false)
        }
    }

    return <div className={styles['full-screen-div-center']}>
        {loading && <LoadingIndicator/>}
        {!loading && <div className={styles['form-container']}>
            <div className={styles['header']}> Update Pickup Game | Game at {gameInfo.location} on {formatDjangoDateToHumanReadable(gameInfo.date)}</div>
            <div className={styles['subheader']}> Game Code: {gameInfo.join_code}</div>
            <br/>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
                <GridWrapperUpdate>
                    <div className={styles['grid-element-wrapper-left']}>
                        <div style={{width: "fit-content"}}>
                            <div className={styles['label']}>
                                <span>Format:</span>
                                &nbsp;
                                <select id="format" value={gameInfo.format} className={inputStyles['input-full']} onChange={handleInputChange}>
                                    <option value="3">3v3</option>
                                    <option value="4">4v4</option>
                                    <option value="5">5v5</option>
                                </select>
                            </div>
                            <br/>
                            <div className={styles['label']}>
                                <span>Location:</span>
                                &nbsp;
                                <input id="location" type="text" value={gameInfo.location} className={inputStyles['input-full']} onChange={handleInputChange}></input>
                            </div>
                            <br/>
                            <div className={styles['label']}>
                                <span>Date:</span>
                                &nbsp;
                                <input id="date" type="datetime-local" value={gameInfo.date} className={inputStyles['input-full']} onChange={handleInputChange}></input>
                            </div>
                            <br/>

                            <div className={inputStyles['input-footer']}>
                                <button className={inputStyles['input-footer-btn']} onClick={() => handleUpdatedDetails()}>Update</button>
                            </div>
                        </div>
                        <br/>

                        <div className={styles['label']}>Invite players:</div>
                        <div className={playerStyles['players-wrapper']}>
                            <div className={playerStyles['players-wrapper-header']}>
                                My Friend List
                            </div>
                            <div className={playerStyles['players-wrapper-body']}>
                                {friends.map(friend => (
                                    <div className={playerStyles['row']} key={friend.id}>
                                        <div className={playerStyles['row-main']}>
                                            {friend.name}
                                        </div>
                                        { !friend.already_invited && <div className={playerStyles['row-secondary']}>
                                            <input
                                                value={friend.id} 
                                                type="checkbox"
                                                checked={gameInfo.all_players.includes(friend.id) || gameInfo.newly_invited_players.includes(friend.id)}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                        }
                                        { friend.already_invited && <div className={playerStyles['row-secondary']}>
                                            <FontAwesomeIcon style={{color: 'green'}} icon={faCheck}/>
                                        </div>
                                        }
                                        
                                    </div>
                                ))}
                            </div>
                            {friends.length > 0 && <div className={playerStyles['players-wrapper-footer']}>
                                <button className={playerStyles['footer-button']} onClick={() => handleUpdatedInvites()}>Invite</button>
                            </div>
                            }
                        </div>
                    </div>

                    <div className={styles['grid-element-wrapper-left']}>
                        <div style={{width: "fit-content"}}>
                            <div className={styles['label']}>
                                Set Final Game Score:
                            </div>
                            <div className={inputStyles['input-score-wrapper']}>
                                <div className={inputStyles['score-body']}>
                                    <span className={inputStyles['score-label']}>Ringers:</span>
                                    <input type="text" value={scores.ringersScore} name="ringersScore" className={inputStyles['score-input']} onChange={(e) => handleScoreChange(e)}/>

                                    <span className={inputStyles['score-label']}>Ballers:</span>
                                    <input type="text" value={scores.ballersScore} name="ballersScore" className={inputStyles['score-input']} onChange={(e) => handleScoreChange(e)}/>
                                </div>
                                <div className={inputStyles['score-footer']}>
                                    <button className={playerStyles['footer-button']} onClick={() => handleScoreSubmit()}>Set Score</button>
                                </div>
                            </div>

                            <div className={styles['label']}>
                                Ringers
                            </div>
                            <div className={playerStyles['players-wrapper']}>
                                <div className={playerStyles['players-wrapper-body']}>
                                    {gameInfo.ringers.length > 0 && gameInfo.ringers.map(player => (
                                        <div className={playerStyles['row']} key={player.name}>
                                            <div className={playerStyles['row-main']}>
                                                {player.name}
                                            </div>
                                            <div className={playerStyles['row-secondary']}>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-swap']} icon={faRepeat} onClick={() => handleTeamReassignment(player.id)}/>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX} onClick={() => handleTeamRemoval(player.id)}/>
                                            </div>
                                        </div>
                                    ))}
                                    {gameInfo.ringers.length == 0 && <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>

                            <div className={styles['label']}>
                                Ballers
                            </div>
                            <div className={playerStyles['players-wrapper']}>
                                <div className={playerStyles['players-wrapper-body']}>
                                    {gameInfo.ballers.length > 0 && gameInfo.ballers.map(player => (
                                        <div className={playerStyles['row']} key={player.id}>
                                            <div className={playerStyles['row-main']}>
                                                {player.name}
                                            </div>
                                            <div className={playerStyles['row-secondary']}>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-swap']} icon={faRepeat} onClick={() => handleTeamReassignment(player.id)}/>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX} onClick={() => handleTeamRemoval(player.id)}/>
                                            </div>
                                        </div>
                                    ))}
                                    {gameInfo.ballers.length == 0 && <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>

                            <div className={styles['label']}>
                                Unassigned Players
                            </div>
                            <div className={playerStyles['players-wrapper']}>
                                <div className={playerStyles['players-wrapper-body']}>
                                    {gameInfo.unassigned_players.length > 0 && gameInfo.unassigned_players.map(player => (
                                        <div className={playerStyles['row']} key={player.id}>
                                            <div className={playerStyles['row-main']}>
                                                {player.name}
                                            </div>
                                            <div className={playerStyles['row-secondary']}>
                                                <span style={{whiteSpace: "noWrap"}}>Ringers</span>
                                                <input style={{height: "10px", marginRight: "5px"}} value={player.id} checked={teams.ringers.includes(player.id)} type="radio" name={`teamAssignment${player.id}`} onClick={(e) => handleRadioChange(e, "ringers")}/>
                                                <span style={{whiteSpace: "noWrap"}}>Ballers</span>
                                                <input style={{height: "10px", marginRight: "10px"}} value={player.id} checked={teams.ballers.includes(player.id)} type="radio" name={`teamAssignment${player.id}`} onClick={(e) => handleRadioChange(e, "ballers")}/>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX} onClick={() => handlePlayerRemoval(player.id)}/>
                                            </div>
                                        </div>
                                    ))}
                                    {gameInfo.unassigned_players.length == 0 && <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None
                                        </div>
                                    </div>
                                    }
                                    { gameInfo.unassigned_players.length > 0 && <div className={playerStyles['players-wrapper-footer']}>
                                            <button className={playerStyles['footer-button']} onClick={() => handleTeamAssignment()}>Assign</button>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className={styles['label']}>
                                Pending Players
                            </div>
                            <div className={playerStyles['players-wrapper']}>
                                <div className={playerStyles['players-wrapper-body']}>
                                    { gameInfo.pending_players.length > 0 && gameInfo.pending_players.map(player => (
                                        <div className={playerStyles['row']} key={player.id}>
                                            <div className={playerStyles['row-main']}>
                                                {player.name}
                                            </div>
                                            <div className={playerStyles['row-secondary']}>
                                                <FontAwesomeIcon style={{color: "darkgrey", marginRight:"10px"}} icon={faUserClock}/>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX} onClick={() => handlePlayerRemoval(player.id)}/>
                                            </div>
                                        </div>
                                    ))}
                                    { gameInfo.pending_players.length == 0 && <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>

                            <div className={styles['label']}>
                                Requesting Players
                            </div>
                            <div className={playerStyles['players-wrapper']}>
                                <div className={playerStyles['players-wrapper-body']}>
                                    { gameInfo.requesting_players.length > 0 && gameInfo.requesting_players.map(player => (
                                        <div className={playerStyles['row']} key={player.id}>
                                            <div className={playerStyles['row-main']}>
                                                {player.name}
                                            </div>
                                            <div className={playerStyles['row-secondary']}>
                                            <FontAwesomeIcon className={playerStyles['assigned-players-add']} icon={faCheck} onClick={() => handlePlayerRequestAccept(player.id)}/>
                                                <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX} onClick={() => handlePlayerRequestReject(player.id)}/>
                                            </div>
                                        </div>
                                    ))}
                                    { gameInfo.requesting_players.length == 0 && <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>
                            <div className={inputStyles['input-footer']}>
                                <button className={styles['btn-submit']} onClick={() => navigate("/pickup/games/")}>
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </GridWrapperUpdate>
            </div>
        </div>}
    </div>
}
export default UpdatePickupGame;