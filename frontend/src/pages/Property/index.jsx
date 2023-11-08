import React, { useState, useEffect } from "react";
import { Star, StarHalf, StarFill } from 'react-bootstrap-icons';
import CommentListing from "../../components/CommentListing";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';


const Property = () => {
    const { listingID } = useParams();
    const [property, setProperty] = useState({});
    const [guests, setGuests] = useState([]);
    const [amenities, setAmenities] = useState([]);
    let half = Math.ceil(amenities.length / 2);
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([])
    const [days, setDays] = useState(0);
    const [checkIn, setCheckIn] = useState(property.available_start)
    const [checkOut, setCheckOut] = useState(property.available_end)
    const [approveIn, setApproveIn] = useState(0)
    const [numGuests, setNumGuests] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
        const response = await axios.get(`/listing-list/`);
        setProperty(response.data.find(c => c.id === Number(listingID)))
        const response2 = await axios.get(`/images/${listingID}/`)
        setImages(response2.data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (Object.keys(property).length !== 0 && images.length !== 0) {
        setIsLoading(false)
        var list = []
        for (let i = 0; i < property.number_of_guests; i++) {
            list.push(i + 1);
        };
        setGuests(list);
        setAmenities(property.amentites.split(","));
        setDays(Math.floor((Date.parse(property.available_end) - Date.parse(property.available_start)) / 86400000));
    };
    }, [property, images])

    const getDate = () => {
        var joinDate = new Date(property.user_created_info.date_joined);
        return joinDate.toLocaleString('default', { month: 'long' }) + " " + joinDate.getFullYear()
    }

    const handleRender = (e) => {
        if (e.target.id === "check-in")
            property.available_start = e.target.value;
        else
            property.available_end = e.target.value;
        console.log(Math.floor((Date.parse(property.available_end) - Date.parse(property.available_start)) / 86400000))
        setDays(Math.floor((Date.parse(property.available_end) - Date.parse(property.available_start)) / 86400000))
        if (e.target.id === 'check-in') {
            setCheckIn(e.target.value);
        }
        if (e.target.id === 'check-out') {
            setCheckOut(e.target.value);
        }
        if (e.target.id === 'approve-in') {
            setApproveIn(e.target.value);
        }
        if (e.target.id === 'guests') {
            setNumGuests(e.target.value);
        }}

    const handleReserve = async (event) => {
        event.preventDefault();
        console.log(checkIn, checkOut, numGuests, approveIn, property.id)
        if (typeof(checkIn) === undefined) {
            setCheckIn(property.available_start)
        }
        if (typeof(checkOut) === undefined) {
            setCheckOut(property.available_end)
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/reservations/`, {
                status: 'pending',
                reserved_from: checkIn,
                reserved_to: checkOut,
                num_guests: numGuests,
                approve_in: parseInt(approveIn),
                property: property.id
            });
        }
        catch(error) {
            console.log(error)
        }
    }

    return <div style={{paddingTop: "18vh", paddingBottom: "10vh"}}>
                {isLoading ? <></>
                : <Container className="p-5 px-lg-5 mt-5" style={{background: "white", borderRadius: "15px"}}>
                    <h1 className=" fw-bold">{property.title}</h1>
                    <div className="d-flex justify-content-left">
                    <p>     {property.rating > 1 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {property.rating > 2 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {property.rating > 3 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {property.rating > 4 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                            {property.rating > 5 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                        &nbsp;·&nbsp;{property.location}
                    </p>
                    </div>
                
                    <Row className="row-cols-1 row-cols-md-2 row-cols-xl-2">
                            <Carousel className="carousel-inner w-100 h-100" id="carousel">
                                {images.map((img, index) => (
                                        <Carousel.Item className="carousel-item" key={index}>
                                        <img className="d-block fit" width="100%" height="600rem"
                                            src={`${axios.defaults.baseURL}${img.image}`}
                                            alt="inside-img" />
                                    </Carousel.Item>
                                    ))}
                            </Carousel>
                    </Row>

                <Row className="row-cols-1 row-cols-md-2 row-cols-xl-2 mt-5 mb-4 gx-5">
                    <Col className="col-md-6 col-xl-7">
                        <div className="d-flex justify-content-between">
                            <div>
                                <h3 className="fw-bold">Entire home hosted by <Link to={`/user/${property.user_created_info.id}`} className="text-decoration-none users">{property.user_created_info.username}</Link></h3>
                                <p>{property.number_of_guests} guests · {property.number_of_bedroom} bedrooms · {property.number_of_washroom} baths</p>
                            </div>
                            <div>
                            <Link to={`/user/${property.user_created_info.id}`} className="text-decoration-none users"><img src={property.user_created_info.profile_picture ? `${axios.defaults.baseURL}${property.user_created_info.profile_picture}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} className="rounded-circle" height="75" alt="Host profile"/></Link>
                            </div>
                        </div>
                        <hr/>
                        <div className="col">
                            <h3 className="fw-bold">About this place</h3>
                            <p>{property.description}</p>
                        </div>

                        <div className="row">
                            <h3 className="fw-bold">What this place offers</h3>
                            <div className="col">
                                <ul>
                                {amenities.slice(0, half).map((amenity, index) => (<li key={index}>{amenity}</li>))}
                                </ul>
                            </div>

                            <div className="col">
                                <ul>
                                {amenities.slice(half).map((amenity, index) => (<li key={index}>{amenity}</li>))}
                                </ul>
                            </div>
                        </div>
                    </Col>

                    <Col className="col-md-6 col-xl-5">
                        <div className="border border-dark rounded shadow p-4 d-flex flex-column position-sticky" id="pricing">
                            <h4><div className="d-flex flex-row justify-content-between">
                                <h4 className="fw-bold">${property.price_per_day} CAD per night</h4>
                                <div className="d-flex justify-content-left">
                                {property.rating > 1 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                                {property.rating > 2 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                                {property.rating > 3 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                                {property.rating > 4 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                                {property.rating > 5 ? <StarFill className="text-warning"/> : <Star className="text-warning"/>}
                                </div>
                            </div></h4>
                            <form action="/reservations">
                                <Row className="pb-2">
                                    <div className="col">
                                    <label htmlFor="check-in">Check in:</label>
                                        <input className="rounded p-2 w-100" type="date" id="check-in" name="check-in" defaultValue={property.available_start} onChange={handleRender} required />
                                    </div>

                                    <div className="col">
                                        <label htmlFor="check-out">Check out:</label>
                                        <input className="rounded p-2 w-100" type="date" id="check-out" name="check-out" defaultValue={property.available_end} onChange={handleRender} required />
                                    </div>
                                </Row>

                                <div className="d-flex justify-content-center pb-4">
                                    <label htmlFor="guests" className="pe-3 pt-1">Guests:</label>
                                    <select className="rounded p-2 w-100" id="guests" name="guests" onChange={handleRender} required>
                                        {guests.map(num => (<option value={num} key={num}>{num} {num === 1 ? "guest" : "guests"}</option>))}
                                    </select>
                                </div>

                                <div className="d-flex justify-content-center pb-4">
                                    <label htmlFor="guests" className="pe-3 pt-1">Approve In (days):</label>
                                    <input className="rounded p-2 w-100" id="approve-in" name="approve-in" type='num' onChange={handleRender} required/>
                                </div>

                                <div className="d-flex justify-content-center pb-1">
                                    <button type="submit" id="reserve" className="p-1 rounded btn btn-primary w-100" onClick={handleReserve}>Reserve</button>
                                </div>

                                <div className="d-flex justify-content-center pb-4">
                                    <label>Continue to payment process</label>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <label>${property.price_per_day} CAD x {days}</label>
                                    <label>${property.price_per_day * days} CAD</label>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <label>Taxes</label>
                                    <label>${Math.ceil(property.price_per_day * days * 0.13)} CAD</label>
                                </div>

                                <hr/>

                                <div className="d-flex justify-content-between">
                                    <label>Total</label>
                                    <label>${Math.ceil(property.price_per_day * days * 1.13)} CAD</label>
                                </div>

                            </form>
                        </div>
                    </Col>
                </Row>
                <hr/>
                <CommentListing id={property.id} host={property.user_created_info}/>
                <hr/>
                <div>
                    <div className="d-flex">
                        <div>
                        <Link to={`/user/${property.user_created_info.id}`} className="users"><img src={property.user_created_info.profile_picture ? `${axios.defaults.baseURL}${property.user_created_info.profile_picture}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} className="rounded-circle me-2" height="50" alt="profile"/></Link>
                        </div>

                        <div>
                            <h3 className="mb-0 fw-bold"><Link to={`/user/${property.user_created_info.id}`} className="users">Hosted by {property.user_created_info.username}</Link></h3>
                            <div className="d-flex">
                                <p className="text-secondary">Joined in {getDate()}</p>
                            </div>
                        </div>
                    </div>
                    
                            <h4 className="fw-bold">Before your stay</h4>
                            <p>If you have any inquiries about the place, feel free to email or call {property.user_created_info.username}.</p>

                            {(property.user_created_info.email || property.user_created_info.phone_number) && <h4 className="fw-bold">Contact Information</h4>}
                            {property.user_created_info.email &&
                            <p>Email address:&nbsp;
                                <Link to={`mailto:${property.user_created_info.email}`}>{property.user_created_info.email}</Link>
                            </p>}
                            {property.user_created_info.phone_number && <p>Phone number: {property.user_created_info.phone_number}</p>}
                </div>
            </Container>}
        </div>
}

export default Property;