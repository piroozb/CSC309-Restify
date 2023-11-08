import { Star, StarHalf, StarFill } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import React, { useState, useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import axios from "axios";
import Carousel from 'react-bootstrap/Carousel';

function RatingStars({ rating }) {
    rating = parseFloat(rating)
    const wholeStars = Math.floor(rating);
    const halfStar = rating - wholeStars >= 0.5;
    const starComponents = [];

    for (let i = 0; i < wholeStars; i++) {
        starComponents.push(<StarFill key={i} />);
    }

    if (halfStar) {
        starComponents.push(<StarHalf key={wholeStars} />);
    }

    for (let i = starComponents.length; i < 5; i++) {
        starComponents.push(<Star key={i} />);
    }

    return <>{starComponents}</>;
}



const HomePage = () => {
    const [showSortDropdown, setSortShowDropdown] = useState(false);
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState({})
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");
    const [resultCount, setresultCount] = useState("");
    const location = useLocation();
    const [params, setParams] = useState({
        title: '',
        number_of_bedroom: 0,
        number_of_washroom: 0,
        number_of_guests: 0
    });
    // const [sort_order, setSelectedSortOption] = useState('asc');
    const [order_by, setOrderBy] = useState('ordering=asc');

    const handleDropdownToggle = () => {
        setSortShowDropdown(!showSortDropdown);
    };
    const handleSortOptionSelect = (event) => {
        // var selectedOption = event.target.getAttribute('ordering');
        // setSelectedSortOption(selectedOption);
        var option = event.target.getAttribute('order_by');
        setOrderBy(option);
        console.log(option);
        reloadResult(option);
    };
    const reloadResult = (option='') => {
        var search = document.getElementById("search-txt");
        var bedrooms = document.getElementById("bedrooms");
        var washrooms = document.getElementById("washrooms");
        var guests = document.getElementById("guests");

        var myparams = {
            search: search.value,
            number_of_bedroom: bedrooms.value,
            number_of_washroom: washrooms.value,
            number_of_guests: guests.value
        }

        const query_params = Object.entries(myparams)
            .map(([key, value]) => {
                if (value !== '0' & value !== '') {
                    return `${key}=${value}`;
                }
            })
            .filter(Boolean)
            .join('&');

        var config = {
            method: 'get',
            url: `/listing-list/?page=${1}&size=${1000}&${option}${query_params ? `&${query_params}` : ''}`
        };
        console.log(config)

        axios(config)
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                setListing(response.data.results);
                setNext(response.data.next);
                setPrevious(response.data.previous);
                setresultCount(response.data.count);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
            const responses = [];
            listing.map( async (obj, index) => {
                responses[index] = await axios.get(`/images/${obj.id}/`)
                setImages(prevState => ({...prevState, [obj.id]: responses[index].data}))
            })
    }, [listing])

    // useEffect(() => {
    //     if (images) {
    //         console.log(images)
    //     }
    // })

    useEffect(() => {
        const searchbutton = document.getElementById("search_button");
        searchbutton.addEventListener("click", reloadResult);
        const searchbutton2 = document.getElementById("search_button2");
        searchbutton2.addEventListener("click", reloadResult);
        reloadResult();
    }, [])
    const loadNext = () => {
        if (next) {
            var config = {
                method: 'get',
                url: next,

            };

            axios(config)
                .then(function (response) {
                    setListing(response.data.results);
                    setNext(response.data.next);
                    setPrevious(response.data.previous);
                    setresultCount(response.data.count);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    const loadPrevious = () => {
        if (previous) {
            var config = {
                method: 'get',
                url: previous,

            };

            axios(config)
                .then(function (response) {
                    setListing(response.data.results);
                    setNext(response.data.next);
                    setPrevious(response.data.previous);
                    setresultCount(response.data.count);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    return <>
        {/* Header */}
        <header className="py-1">
            <div className="container px-4 px-lg-5 my-2">
                <div className="text-center">
                    <h1 className="display-4 fw-bolder" style={{ color: "black", marginTop: "200px" }}>Restify Your Stay</h1>
                    <p className="lead fw-normal mb-0" style={{ color: "black" }}>Choose from thousands of listings!</p>
                    <hr />
                </div>
                <div className="btn-group" onClick={handleDropdownToggle}>
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="sortbyMenuButton"
                        data-bs-toggle="dropdown" data-toggle="dropdown" aria-expanded="false" style={{color:"black", background:"none", border: "none"}}>
                        Sort by
                    </button>
                    <ul className={`dropdown-menu dropdown-menu-end ${showSortDropdown ? 'show' : ''}`} aria-labelledby="sortbyMenuButton">
                        <li><a className="dropdown-item" href="#" order_by="ordering=asc" onClick={handleSortOptionSelect}>Price Ascending</a></li>
                        <li><a className="dropdown-item" href="#" order_by="ordering=dsc" onClick={handleSortOptionSelect}>Price Descending</a></li>
                        <li><a className="dropdown-item" href="#" order_by="rating=asc" onClick={handleSortOptionSelect}>Rating Ascending</a></li>
                        <li><a className="dropdown-item" href="#" order_by="rating=dsc" onClick={handleSortOptionSelect}>Rating Descending</a></li>
                    </ul>
                </div>
            </div>
        </header>
        {/* <!-- Section--> */}
        <section className="" style={{ paddingBottom: "100px" }}>
            <div className="container px-4 px-lg-5 mt-2">
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {listing.map((obj, index) => (
                        <div className="col mb-5" id="property-display" obj-id={obj.id}>
                            <div className="card h-100 carousel slide" id="property" data-bs-ride="carousel"
                                data-bs-keyboard="true">
                                <Carousel className="carousel-inner h-100 w-100" id="carousel">
                                    {images[obj.id] ? images[obj.id].map((img) => (
                                            <Carousel.Item className="carousel-item" key={index}>
                                            <img className="d-block fit" width="100%" height="200rem"
                                                src={`${axios.defaults.baseURL}${img.image}`}
                                                alt="inside-img" />
                                        </Carousel.Item>
                                        )) : <></>}
                                </Carousel>

                                {/* <!-- Product details--> */}
                                <div className="card-body p-4">
                                    <div className="text-center">
                                        {/* <!-- Product name--> */}
                                        <h5 className="fw-bolder">{obj.title}</h5>
                                        <p>{obj.number_of_bedroom} bedrooms <br/>
                                        {obj.number_of_washroom} washrooms <br/>
                                        {obj.number_of_guests} guests</p>

                                        {/* <!-- Product reviews--> */}
                                        <div className="d-flex justify-content-center small text-warning mb-2">
                                            <RatingStars rating={obj.rating} />
                                        </div>
                                        {/* <!-- Product price--> */}
                                        ${obj.price_per_day}
                                    </div>
                                </div>
                                {/* <!-- Product actions--> */}
                                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    <div className="text-center"><Link className="btn btn-outline-dark mt-auto" to={`/property/${obj.id}`}>View
                                        Details</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {/* <!-- Bootstrap core JS--> */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        {/* <!-- Core theme JS--> */}
        <script src="js/scripts.js"></script>
    </>
}

export default HomePage;