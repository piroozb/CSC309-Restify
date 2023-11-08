import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Star, StarFill } from 'react-bootstrap-icons';
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';

const CommentUser = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [authors, setAuthors] = useState({});
    const [noReview, setNoReview] = useState(false);
    const [average, setAverage] = useState(0);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");

    const { user } = useContext(AuthContext);
  
    const loadNext = async () => {
        if (next) {
            const response = await axios.get(next);
            setComments(response.data.comments)
            setNext(response.data.next);
            setPrevious(response.data.previous);
        }
    }

    const loadPrevious = async () => {
        if (previous) {
            const response = await axios.get(previous);
            setComments(response.data.comments)
            setNext(response.data.next);
            setPrevious(response.data.previous);
        }
    
    }

    useEffect(() => {
        const fetchData = async () => {
        const response = await axios.get(
            `/api/user_comments/${props.id}/`);
          setComments(response.data.comments)
          setNext(response.data.next);
          setPrevious(response.data.previous);
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (comments) {
        const fetchData = async () => {
            var total = 0;
            await comments.forEach( async (comment) => {
                total += comment.rating;
                var author = comment.author
                const response = await axios.get(`/api/account/${author}/`);
                setAuthors(prevState => ({...prevState, [author]: [response.data.username, response.data.profile_picture]}))
                if (user && comment.author === user.id) setNoReview(true)
            })
            setAverage(Math.round(total / comments.length))
            }
            fetchData();

    };
    }, [comments])

    useEffect(() => {
        if (user && user.id === Number(props.id)) setNoReview(true)
    }, [user])

    useEffect(() => {
        if ((comments.length > 0 && Object.keys(authors).length === comments.length)) {
            setIsLoading(false) };
    }, [authors])

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`/api/user_comments/${props.id}/`,
        {
            "author": user.id,
            "text": event.target.response.value,
            "rating": event.target.stars.value,
            "user_id": props.id
        });
        const response = await axios.get(`/api/user_comments/${props.id}/`);
        setComments(response.data.comments)
        setAuthors(prevState => ({...prevState, [user.id]: [user.username, user.profile_picture]}))
        setNoReview(true)
    }

    return <><h3 id="reviews" className="fw-bold">Past Host Reviews</h3>
    {isLoading ? <>
    <p className="text-secondary mb-2">See what this user's former hosts said about them.</p>
    <h5><div className="d-flex justify-content-left mb-2">
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    &nbsp;· {comments.length} reviews
    </div></h5>
    <h6 id="no-reviews">Be the first to submit a review!</h6></>

    : <div>
    <p className="text-secondary mb-2">See what this user's former hosts said about them.</p>
    <h5><div className="d-flex justify-content-left mb-2">
    {average > 0 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 1 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 2 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 3 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 4 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    &nbsp;· {comments.length} reviews
    </div></h5>
    {/* <h6 id="no-reviews">You can view these reviews once you have hosted this user at one of your listings!</h6> */}
        {
            comments.map(comment => (
                <div className="col mb-4" key={comment.id}>
                <div className="d-flex justify-content-left">
                    <div>
                        <img src={authors[comment.author] ? `${authors[comment.author][1]}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} className="rounded-circle me-2" height="50" alt="profile"/>
                    </div>

                    <div>
                        <h5><div className="d-flex">
                            <h5 className="mb-0 fw-bold users"><Link to={`../../user/${comment.author}/`} className="users">{authors[comment.author][0]}</Link> ·&nbsp;</h5>
                            {comment.rating > 0 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {comment.rating > 1 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {comment.rating > 2 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {comment.rating > 3 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {comment.rating > 4 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                        </div></h5>
                        <p className="text-secondary mb-1">{comment.created_date}</p>
                    </div>
                </div>
                <p>{comment.text}</p>
            </div>
            ))
        }
            <li className="d-flex" style={{ justifyContent: "space-around" }}>
        <a className={`${previous ? 'text-primary' : 'text-secondary'}`} onClick={loadPrevious}><Icon.ArrowLeft /></a>
        <a className={`${next ? 'text-primary' : 'text-secondary'}`} onClick={loadNext}><Icon.ArrowRight /></a>
    </li>
        </div>}
           <hr/>
    <div className="row" id="host-reviews">
        <div className="row mb-0">
            <h3 className="fw-bold mb-0" id="past-reviews">Leave a Review</h3>
            <p className="text-secondary">Hosted them before? Leave a review for future hosts!</p>
        </div>
        {/* TODO: CHANGE THIS ONCE RESERVATIONS FUNCTIONS DONE */}
        {false ? <h6 id="no-reviews">You can submit a review once you have hosted this user at one of your listings!</h6>
        : noReview ? <h6 id="no-reviews">Either this is you or you've already written a review!</h6>
        :  <div className="row">
            <form onSubmit={handleSubmit}>
                {/* <!-- Code for star rating mostly from https://codepen.io/jennych/pen/yLYeMQm --> */}
                <div className="star-rating mb-2">
                    <div className="stars">
                        <input type="radio" name="stars" id="star-a" value="5" className="mr-1"/> 
                        <label htmlFor="star-a"><h5><StarFill className="fas fa-star d-inline-block"></StarFill></h5></label>

                        <input type="radio" name="stars" id="star-b" value="4" />
                        <label htmlFor="star-b"><h5><StarFill className="fas fa-star d-inline-block"></StarFill></h5></label>

                        <input type="radio" name="stars" id="star-c" value="3" />
                        <label htmlFor="star-c"><h5><StarFill className="fas fa-star d-inline-block"></StarFill></h5></label>

                        <input type="radio" name="stars" id="star-d" value="2" />
                        <label htmlFor="star-d"><h5><StarFill className="fas fa-star d-inline-block"></StarFill></h5></label>

                        <input type="radio" name="stars" id="star-e" value="1" /> 
                        <label htmlFor="star-e"><h5><StarFill className="fas fa-star d-inline-block"></StarFill></h5></label>
                    </div>
                </div>
                <textarea className="form-control" name="response" placeholder="Leave a review here" id="floatingTextarea" rows="4" required></textarea>
                <div className="d-grid gap-2 mb-2">
                    <input type="submit" className="btn btn-outline-primary mt-2" value="Submit Review"/>
                </div>
                {/* <div className="alert alert-info mt-1" role="alert">
                    Your review has been submitted!
                </div> */}
            </form>
        </div>}
    </div>
    </>
}

export default CommentUser;