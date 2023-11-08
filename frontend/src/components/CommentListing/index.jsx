import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Star, StarFill, ReplyFill } from 'react-bootstrap-icons';
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import './style.css';
import $ from 'jquery';
import * as Icon from 'react-bootstrap-icons';

const CommentListing = (props) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [authors, setAuthors] = useState({});
    const [replyTo, setReplyTo] = useState(0);
    const [replies, setReplies] = useState({});
    const [noReview, setNoReview] = useState(false);
    const [average, setAverage] = useState(0);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");
    
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
            `/api/listing_comments/${props.id}/`);
          setComments(response.data.comments)
          setNext(response.data.next);
          setPrevious(response.data.previous);
        }
        fetchData()
        setAuthors(prevState => ({...prevState, [props.host.id]: [props.host.username, `${axios.defaults.baseURL}${props.host.profile_picture}`]}))
    }, [user])

    useEffect(() => {
        if (comments) {
        const fetchData = async () => {
            var total = 0;
            await comments.forEach( async (comment) => {
                total += comment.rating;
                var author = comment.author
                const response = await axios.get(`/api/account/${author}/`);
                setAuthors(prevState => ({...prevState, [author]: [response.data.username, response.data.profile_picture]}))
                const response2 = await axios.get(`/api/reply/${comment.id}/`);
                setReplies(prevState => ({...prevState, [comment.id]: response2.data.replies}))
                if (user && comment.author === user.id) setNoReview(true)
            })
            setAverage(Math.round(total / comments.length))
            }
            fetchData();
    };
    }, [comments])

    useEffect(() => {
        if (Object.keys(authors).length > 1 && Object.keys(replies).length === comments.length) {
            setIsLoading(false)
        };
    }, [replies, authors])

    useEffect(() => {
        if (user && user.id === Number(props.host.id)) setNoReview(true)
    }, [user])

    const handleSubmitReply = async (event) => {
        event.preventDefault();
        await axios.post(`/api/reply/${event.target.id}/`,
        {
            "author": user.id,
            "text": event.target.response.value,
            "comment_id": event.target.id
        });
        const response = await axios.get(`/api/reply/${event.target.id}/`);
        setReplies(prevState => ({...prevState, [event.target.id]: response.data.replies}))
        setNoReview(true)
    }

    const handleSubmitReview = async (event) => {
        event.preventDefault();
        if (event.target.stars.value) {
        const response = await axios.post(`/api/listing_comments/${props.id}/`,
        {
            "author": user.id,
            "text": event.target.response.value,
            "rating": event.target.stars.value,
            "listing_id": props.id
        });
        const response2 = await axios.get(`/api/listing_comments/${props.id}/`);
        setComments(response2.data.comments)
        setAuthors(prevState => ({...prevState, [user.id]: [user.username, user.profile_picture]}))
        setReplies(prevState => ({...prevState, [response.data.id]: []}))
        setNoReview(true)
        }
        else {
            $('#no-rating').text("You must input a rating")
        }
    }

    return <><h3 id="reviews" className="fw-bold">Top Reviews</h3>
    {isLoading ? <div>
    <h5><div className="d-flex justify-content-left mb-2">
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    <Star className="text-warning"/>
    &nbsp;· {comments.length} reviews
    </div></h5>
    <h6 id="no-reviews">Be the first to submit a review!</h6>
    </div>
    : <div>
    <h5><div className="d-flex justify-content-left mb-4">
    {average > 0 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 1 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 2 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 3 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    {average > 4 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
    &nbsp;· {comments.length} reviews
    </div></h5>
        {
            comments.map((comment, index) => (
            <div className="col mb-4" key={index}>
                <div>
                    <div className="d-flex justify-content-left">
                        <Link to={`../../user/${comment.author}`}>
                            <img src={authors[comment.author][1] ? `${authors[comment.author][1]}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} className="rounded-circle me-2" height="50" alt="Profile"/>
                        </Link>

                        <div>
                            <h5><div className="d-flex">
                                <h5 className="mb-0 fw-bold users"><Link to={`../../user/${comment.author}`} className="users">{authors[comment.author][0]}</Link> ·&nbsp;</h5>
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
                {replies[comment.id].map((reply, index) => (
                    <div className="ps-4 mb-3" key={index}>
                        <div className="d-flex justify-content-left">
                            <Link to={`../../user/${reply.author}`}>
                                <img src={authors[reply.author][1] ? `${authors[reply.author][1]}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} className="rounded-circle me-2" height="50" alt="Profile"/>
                            </Link>

                            <div>
                                <h5><div className="d-flex">
                                    <h5 className="mb-0 fw-bold users"><Link to={`../../user/${reply.author}`} className="users">{authors[reply.author][0]}</Link></h5>
                                </div></h5>
                                <p className="text-secondary mb-1">{reply.created_date}</p>
                            </div>
                        </div>
                        <p>{reply.text}</p>
                    </div>
                ))}
                {(((replies[comment.id].length === 0 || replies[comment.id][replies[comment.id].length - 1].author === comment.author) && user.id === props.host.id) ||
                 (replies[comment.id][replies[comment.id].length - 1] && replies[comment.id][replies[comment.id].length - 1].author === props.host.id && user.id === comment.author)) && 
                <div className="ps-4"><button className="p-1 col-1 rounded d-flex justify-content-center align-items-center btn btn-outline-primary" 
                onClick={() => setReplyTo(index + 1)}><ReplyFill className="bi bi-x-circle"></ReplyFill> Reply</button>
                {replyTo === index + 1 && <div className="row mt-2">
                <form onSubmit={handleSubmitReply} id={comment.id}>
                    <textarea className="form-control" name="response" placeholder={`Reply to ${replies[comment.id].length > 0 ? authors[replies[comment.id][replies[comment.id].length - 1].author][0] : authors[comment.author][0]}`} rows="4" required></textarea>
                    <div className="d-grid gap-2 mb-2">
                        <input type="submit" className="btn btn-outline-primary mt-2" value="Send Reply"/>
                    </div>
                    {/* <div className="alert alert-info mt-1" role="alert">
                        Your review has been submitted!
                    </div> */}
                </form>
            </div>}
                </div>}

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
            <p className="text-secondary">Been to this property before? Leave a review for future customers!</p>
        </div>
        {/* TODO: CHANGE THIS ONCE RESERVATIONS FUNCTIONS DONE */}
        {false ? <h6 id="no-reviews">You can submit a review once you have reserved this listing!</h6>
        : noReview ? <h6 id="no-reviews">Either you are the host of this listing or you've already written a review!</h6>
        :  <div className="row">
            <form onSubmit={handleSubmitReview}>
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
			    <p className="error" id="no-rating"> </p>
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

export default CommentListing;