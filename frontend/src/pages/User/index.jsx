import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import CommentUser from "../../components/CommentUser";
import { useParams } from "react-router-dom";

const User = () => {
    const { userID } = useParams();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`/api/account/${userID}/`);
            console.log(response.data)
            setUser(response.data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (Object.keys(user).length !== 0) {
            setIsLoading(false)
    };
    }, [user])

    return <div className="body-container " style={{paddingTop: "23vh"}}>
    { isLoading ? <></> : <main className="container">
        <div className="row">
            <div className="col-lg-3 mb-5 mx-3 my-3">
                <div className="osahan-account-page-left shadow-sm bg-white h-10" style={{borderRadius: "15px"}}>
                    <div className="border-bottom p-4">
                        <div className="osahan-user text-center">
                            {console.log(user)}
                          {user ? <div className="d-flex flex-column justify-content-center align-items-center osahan-user-media">
                                <img className="rounded-circle shadow-sm mt-1"
                                    src={`${user.profile_picture}`} width="80%"
                                    alt="profile"/>
                                <div className="osahan-user-media-body">
                                    <h6 className="mb-2">{user.username}</h6>
                                    {user.first_name && <p className="mb-1">{user.first_name} {user.last_name}</p>}
                                    {user.phone_number && <p className="mb-1">{user.phone_number}</p>}
                                    {user.email && <p>{user.email}</p>}
                                </div>
                            </div> : <div className="d-flex flex-column justify-content-center align-items-center osahan-user-media">
                                <img className="rounded-circle shadow-sm mt-1"
                                    src="https://img.freepik.com/free-icon/professor_318-177005.jpg?w=2000" width="50%"
                                    alt="profile"/>
                                <div className="osahan-user-media-body">
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8 mb-5 mx-3 my-3" style={{background: "white", borderRadius: "15px"}}>
                <div className="d-flex flex-column justify-content-center mx-3">
                    <div className="container" id="user-reviews-by-host">
                        <CommentUser id={userID}/>
                    </div>
                </div>
            </div>
        </div>
    </main>}
</div>}

export default User;