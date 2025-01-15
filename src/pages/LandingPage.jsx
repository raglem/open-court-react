import { useState, useEffect } from "react"
import api from "../api"

import Card from "../components/Card"
import GridWrapper from "../components/GridWrapper"
import LoadingIndicator from "../components/LoadingIndicator.jsx"
import styles from "../styles/LandingPage.module.css"
import inputStyles from "../styles/Input.module.css"
import playerStyles from "../styles/Players.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons"

function LandingPage(){
    const [loading, setLoading] = useState(true)

    const [membership, setMembership] = useState({})
    const [friends, setFriends] = useState([])
    const [friendCards, setFriendCards] = useState([])
    const [joinCode, setJoinCode] = useState("")
    const [friendId, setFriendId] = useState("")
    const [sentRequests, setSentRequests] = useState([])
    const [receivedRequests, setReceivedRequests] = useState([])

    useEffect(()=>{
        getFriends();
    }, []) 

    const getFriends = async () => {
        setLoading(true)
        try {
            const response = await api.get("/users/membership/");
            const cardResponses = await api.get("/users/membership/cards/")
            const formatMembership = {
                name: response.data.name,
                friend_id: response.data.friend_id,
            };
            setMembership(formatMembership);
            setFriends(response.data.friends);
            setFriendCards(cardResponses.data.friends)
            setSentRequests(response.data.sent_requests);
            setReceivedRequests(response.data.received_requests);
        } catch (err) {
            alert(err.response.data.error);
        } finally {
            setLoading(false)
        }
    };

    const handleJoinCodeInputChange = (e) => {
        setJoinCode(e.target.value)
    }

    const handleJoinCodeSubmit = async () => {
        if(joinCode.length!=8){
            alert("Invalid join code. The code is an 8-length pin.")
            return;
        }

        setLoading(true)
        try{
            const response = await api.post("/users/pickup-games/request/", {"game_code": joinCode})
            alert(response.data.message)
            setJoinCode("")
        }
        catch(err){
            console.log(err)
            if(err?.data?.error){
                alert(err.data.error)
            }
            else if(err?.response?.data?.error){
                alert(err?.response?.data?.error)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }

    const handleFriendIdInputChange = (e) => {
        setFriendId(e.target.value)
    }

    const handleFriendRequest = async () => {
        if(friendId.length!=8){
            alert("Invalid friend id. A friend id must be an 8-length code.")
            return;
        }
        setLoading(true)
        try{
            const response = await api.post("/users/add-friend/", {friend_id: friendId})
            alert(response?.data?.message)
            setFriendId("")
            getFriends()
        }
        catch(err){
            if(err?.data?.error){
                alert(err.data.error)
            }
            else if(err?.response?.data?.error){
                alert(err?.response?.data?.error)
            }
            else{
                alert(err)
            }
        } finally{
            setLoading(false)
        }
    }
    
    const acceptFriend = async (friend_id) => {
        setLoading(true)
        try {
            const res = await api.post("users/accept-friend/", { friend_id });
            await getFriends();
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.error);
        } finally{
            setLoading(false)
        }
    };
    
    const deleteFriend = async (friend_id) => {
        setLoading(true)
        try {
            const res = await api.post("/users/delete-friend/", { friend_id });
            await getFriends(); // Refresh friends list
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.error);
        } finally{
            setLoading(false)
        }
    };
    
    const cancelFriendRequest = async (friend_id) => {
        setLoading(true)
        try {
            const res = await api.post("users/cancel-friend-request/", { friend_id });
            await getFriends(); // Refresh friends list
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.error);
        } finally{
            setLoading(false)
        }
    };

    return <div>
        {loading && <div className={styles['full-screen-div-center']}><LoadingIndicator/></div>}
        {!loading && <div>
            <div className={styles['category']}>
                <div className={styles['header']}>
                    <span style={{marginRight: "20px"}}>Join a Pickup Game</span>
                    <div className={inputStyles['input-wrapper']}>
                        <input type="text" value={joinCode} placeholder="Enter a game code" className={inputStyles['input']} onChange={(e) => handleJoinCodeInputChange(e)}/>
                        <button className={inputStyles['btn-join']} onClick={() => handleJoinCodeSubmit()}>Join</button>
                    </div>
                </div>
            </div>
            
            <div className={styles['category']}>
                <div className={styles['header']}>
                    <span style={{marginRight: "20px"}}>My Friend List</span>
                    <div className={inputStyles['input-wrapper']}>
                        <input type="text" value={friendId} placeholder="Enter friend id" className={inputStyles['input']} onChange={(e) => handleFriendIdInputChange(e)}/>
                        <button className={inputStyles['btn-join']} onClick={() => handleFriendRequest()}>Enter</button>
                    </div>
                </div>
                <div className={styles['subheader']}>
                    <span>My Player ID: {membership.friend_id} </span>
                </div>
                <div className={styles['center']}>
                <GridWrapper>
                    <div className={styles['grid-element-wrapper']}>
                        <div className={styles['label']}>
                            My Friends
                        </div>
                        <div className={playerStyles['players-wrapper']}>
                            <div className={playerStyles['players-wrapper-body']}>
                                {(friends || friends.length > 0) && friends.map(friend => (
                                    <div className={playerStyles['row']} key={friend.friend_id}>
                                        <div className={playerStyles['row-main']}>
                                            {friend.name}
                                        </div>
                                        <div 
                                            className={playerStyles['row-secondary']}
                                            onClick={() => deleteFriend(friend.friend_id)}
                                        >
                                            <FontAwesomeIcon className={playerStyles['assigned-players-delete']} icon={faX}/>
                                        </div>
                                    </div>
                                ))}
                                {(!friends || friends.length < 1) &&
                                    <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None. Share your id with a friend!
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles['grid-element-wrapper']}>
                        <span className={styles['label']}>My Received Friend Requests</span>
                        <div className={playerStyles['players-wrapper']}>
                            <div className={playerStyles['players-wrapper-body']}>
                                {(receivedRequests || receivedRequests.length > 0) && receivedRequests.map(request => (
                                    <div className={playerStyles['row']} key={request.friend_id}>
                                        <div className={playerStyles['row-main']}>
                                            {request.name}
                                        </div>
                                        <div className={playerStyles['row-secondary']}>
                                            <FontAwesomeIcon onClick={() => acceptFriend(request.friend_id)} 
                                                className={playerStyles['assigned-players-add']} 
                                                icon={faCheck}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!receivedRequests || receivedRequests.length < 1) &&
                                    <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None. Share your id with a friend!
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className={styles['label']}>My Sent Friend Requests</div>
                        <div className={playerStyles['players-wrapper']}>
                            <div className={playerStyles['players-wrapper-body']}>
                                {(sentRequests || sentRequests.length > 0) && sentRequests.map(request => (
                                    <div className={playerStyles['row']} key={request.friend_id}>
                                        <div className={playerStyles['row-main']}>
                                            {request.name}
                                        </div>
                                        <div className={playerStyles['row-secondary']}>
                                            <FontAwesomeIcon 
                                                onClick={() => cancelFriendRequest(request.friend_id)}
                                                className={playerStyles['assigned-players-delete']} icon={faX}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!sentRequests || sentRequests.length < 1) &&
                                    <div className={playerStyles['row']}>
                                        <div className={playerStyles['row-main']}>
                                            None. Ask a friend for their id!
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </GridWrapper>
                </div>
            </div>

            <div className={styles['category']}>
                <div className={styles['header']}>My Friends' Player Cards</div>
                <div className={styles['center']}>
                <GridWrapper>
                    {friendCards && friendCards.length > 0 && friendCards.map(friend => (
                        <div className={styles['grid-element-wrapper']} key={friend.id}>
                            <Card
                                friend={friend}
                            />
                        </div>
                    ))}
                </GridWrapper>
                </div>
            </div>
        </div>
        }
    </div>
}

export default LandingPage