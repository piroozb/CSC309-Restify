import React, { useState, useContext, useEffect } from "react";
import logo from "../../assets/restify-logo.png"
import { Search, Cart, Bell } from 'react-bootstrap-icons';
import { AuthContext } from "../../contexts/AuthContext";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Icon from 'react-bootstrap-icons';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [showDropdown3, setShowDropdown3] = useState(false);
    const [showDropdown4, setShowDropdown4] = useState(false);
    const [showDropdown5, setShowDropdown5] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [previous, setPrevious] = useState("");
    const [next, setNext] = useState("");
    const access_token = Cookies.get('Access');
    const { logout } = useContext(AuthContext);
    const [imgData, setImgData] = useState(null);
    const [title, setTitle] = useState('');
    const [number_of_bedroom, setBedrooms] = useState('');
    const [number_of_washroom, setWashrooms] = useState('');
    const [number_of_guests, setGuests] = useState('');
    const [search_data, setSearchData] = useState({});

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };
    const handleDropdownToggle2 = () => {
        setShowDropdown2(!showDropdown2);
    };
    const handleDropdownToggle3 = () => {
        setShowDropdown3(!showDropdown3);
    };
    const handleDropdownToggle4 = () => {
        setShowDropdown4(!showDropdown4);
    };
    const handleDropdownToggle5 = () => {
        setShowDropdown5(!showDropdown5);
    };
    const reloadNotifications = () => {
        var config = {
            method: 'get',
            url: `/api/notifications/`,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setNotifications(response.data.results);
                setNext(response.data.next);
                setPrevious(response.data.previous);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        if (access_token) {
            reloadNotifications();
            fetchData();
        }
    }, [])
    const fetchData = async () => {
        const response = await axios.get(
            `/api/account/`);
        setImgData(response.data[0].profile_picture)
    }
    const handleLogout = () => {
        logout()
    }
    const loadNext = () => {
        if (next) {
            var config = {
                method: 'get',
                url: next,
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    setNotifications(response.data.results);
                    setNext(response.data.next);
                    setPrevious(response.data.previous);
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
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    setNotifications(response.data.results);
                    setNext(response.data.next);
                    setPrevious(response.data.previous);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }
    const handleRead = (e, notification_id) => {
        var url = `/api/notifications/${notification_id}/read/`
        console.log(url)
        var config = {
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                reloadNotifications();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleReadAll = () => {
        var url = `/api/notifications/read-all/`
        console.log(url)
        var config = {
            method: 'get',
            url: url,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                reloadNotifications();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const handleDelete = (e, notification_id) => {
        var url = `/api/notifications/${notification_id}/`
        console.log(url)
        var config = {
            method: 'delete',
            url: url,
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                reloadNotifications();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useEffect(() => {
        setSearchData({
            title,
            number_of_bedroom,
            number_of_washroom,
            number_of_guests
        })
    }, [number_of_bedroom, number_of_washroom, number_of_guests, title])


    return <nav className="navbar navbar-expand-lg fixed-top navbar-dark" style={{ height: "15vh" }}>
        {/* Container wrapper */}
        <div className="container-fluid mx-5 my-3" id="header-wrapper">

            <div className="dropdown">
                {/* Toggle button */}
                <button className="navbar-toggler dropdown-toggle" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation" data-bs-auto-close="outside" onClick={handleDropdownToggle5}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className={`dropdown-menu navbarCustomMenu ${showDropdown5 ? 'show' : ''}`} id="navbarSupportedContent" style={{ backgroundColor: "#411B21" }}>
                    <li><Link className="dropdown-item" style={{ color: "#efefe7" }} to="/">Home</Link></li>
                    <li><Link className="dropdown-item" style={{ color: "#efefe7" }} to="/profile">My Profile</Link></li>
                    <li><Link className="dropdown-item" style={{ color: "#efefe7" }} to="/reservations">My Reservations</Link></li>
                    <li><Link className="dropdown-item" style={{ color: "#efefe7" }} to="/listing_page">My Listings</Link></li>
                    <li><a className="dropdown-item" style={{ color: "#efefe7" }} onClick={handleLogout}>Logout</a></li>
                    <li>
                        <div className="dropdown-item">
                            <div className="dropdown">
                                <Link className="hidden-arrow" data-bs-toggle="dropdown" to="#" data-toggle="dropdown"
                                    id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false"
                                    style={{ color: "#efefe7", textDecoration: "none" }} onClick={handleDropdownToggle4}>
                                    Notifications
                                </Link>
                                <ul className={`dropdown-menu dropdown-menu-end ${showDropdown4 ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                                    {notifications.map((notification, index) => (
                                        <li className="d-flex" style={{ borderBottom: "groove", alignItems: "center" }}>
                                            <Link className="dropdown-item rounded" to="#">
                                                <div className="d-grid">
                                                    {notification.heading} <span style={{ fontSize: "12px", color: "gray" }}>{notification.created}</span>
                                                </div>
                                            </Link>
                                            <a className="p-2" onClick={event => handleRead(event, notification.id)}>{!notification.read ? <Icon.Envelope /> : <Icon.EnvelopeOpen />}</a>
                                            <a className="p-2" style={{ color: "red" }} onClick={event => handleDelete(event, notification.id)}><Icon.Trash /></a>
                                        </li>
                                    ))}
                                    <li className="d-flex" style={{ justifyContent: "space-around" }}>
                                        <a className={`${previous ? 'text-primary' : 'text-secondary'}`} onClick={loadPrevious}><Icon.ArrowLeft /></a>
                                        <a onClick={handleReadAll}>Mark all as read <Icon.Check2Circle /></a>
                                        <a className={`${next ? 'text-primary' : 'text-secondary'}`} onClick={loadNext}><Icon.ArrowRight /></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="dropdown" style={{ width: "200px" }}>
                            <div className='search-btn d-block d-lg-none' type="button"
                                data-bs-toggle="dropdown" data-toggle="dropdown" href="#" id="navbarDropdownMenuAvatar" role="button">
                                <a className="dropdown-item" style={{ color: "#efefe7" }} onClick={handleDropdownToggle3}>Search</a>
                            </div>
                            <ul className={`dropdown-menu text-white ${showDropdown3 ? 'show' : ''}`} style={{ backgroundColor: "#411B21", width: "200px" }}>
                                <form>
                                    <div className="bar-dropdown d-grid h-100 mx-1 my-1" style={{ backgroundColor: "#411B21", width: "90%" }}>
                                        <div className="search w-100" style={{ color: "#efefe7", fontSize: "15px", paddingRight: "10px", paddingLeft: "10px" }}>
                                            <p className="mb-0">Search</p>
                                            <input id="search-txt" style={{fontSize: '0.5rem'}} placeholder="search text" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                                        </div>
                                        <div className="bedrooms w-100" style={{ color: "#efefe7", fontSize: "15px", paddingRight: "10px", paddingLeft: "10px" }}>
                                            <p className="mt-1 mb-0">Bedrooms</p>
                                            <input id="bedrooms" style={{fontSize: '0.5rem'}} placeholder="no of bedrooms" type="text" value={number_of_bedroom} onChange={e => setBedrooms(e.target.value)} />
                                        </div>
                                        <div className="washrooms w-100" style={{ color: "#efefe7", fontSize: "15px", paddingRight: "10px", paddingLeft: "10px" }}>
                                            <p className="mt-1 mb-0">Washrooms</p>
                                            <input id="washrooms" style={{fontSize: '0.5rem'}} placeholder="no of washrooms" type="text" value={number_of_washroom} onChange={e => setWashrooms(e.target.value)} />
                                        </div>
                                        <div className="guests w-100" style={{ color: "#efefe7", fontSize: "15px", paddingRight: "10px", paddingLeft: "10px" }}>
                                            <p className="mt-1 mb-0">Guests</p>
                                            <input id="guests" style={{fontSize: '0.5rem'}} placeholder="no of guests" type="text" value={number_of_guests} onChange={e => setGuests(e.target.value)} />
                                        </div>
                                        <div className='search-btn w-50 mt-2 mx-2' style={{ alignItems: "right" }}>
                                            <Link
                                                to={{
                                                    pathname: "/search",
                                                    state: search_data
                                                }}
                                            ><a id="search_button" style={{color:"white"}}><span><Search className="bi bi-search" id="search-icon" /></span></a></Link>
                                        </div>
                                    </div>
                                </form>

                            </ul>
                        </div>
                    </li>
                </ul>
            </div>

            {/* Brand Logo */}
            <div className="header-elements mx-3" style={{ padding: "0px" }}>
                {/* Navbar brand */}
                <a className="navbar-brand" href="/" style={{ margin: "0px" }}>
                    <img src={logo} height="45" alt="Restify" />
                </a>
            </div>
            {/* Search Bar */}
            <div className="collapse navbar-collapse form-inline d-none mx-4 search-bar" id="navbarSupportedContent">
                <form>
                    <div className="bar header-elements ">
                        <div className="search">
                            <p>Search</p>
                            <input id="search-txt" placeholder="search text" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="bedrooms">
                            <p>Bedrooms</p>
                            <input id="bedrooms" placeholder="no of bedrooms" type="text" value={number_of_bedroom} onChange={e => setBedrooms(e.target.value)} />
                        </div>
                        <div className="washrooms">
                            <p>Washrooms</p>
                            <input id="washrooms" placeholder="no of washrooms" type="text" value={number_of_washroom} onChange={e => setWashrooms(e.target.value)} />
                        </div>
                        <div className="guests">
                            <p>Guests</p>
                            <input id="guests" placeholder="no of guests" type="text" value={number_of_guests} onChange={e => setGuests(e.target.value)} />
                        </div>
                        <div className='search-btn'>
                            <Link
                                to={{
                                    pathname: "/search",
                                    state: search_data
                                }}
                            ><a id="search_button2"><span><Search className="bi bi-search" id="search-icon" /></span></a></Link>

                        </div>
                    </div>
                </form>
            </div>
            {/* <!-- Right elements --> */}
            {!access_token && (
                <div className="collapse navbar-collapse header-elements d-none" id="navbarSupportedContent" style={{ padding: "2px" }}>
                    {/* <!-- Avatar --> */}
                    <div className="dropdown">
                        <a className="btn btn-outline-light mt-auto" href="/login">Login</a>
                        <a className="btn btn-outline-light mt-auto" href="/register">Register</a>
                    </div>
                </div>
            )}
            {access_token &&
                (<div className="collapse navbar-collapse header-elements d-none" id="navbarSupportedContent" style={{ padding: "0" }}>
                    {/* <!-- Icon --> */}
                    <a className="link-secondary me-4" href="#">
                        <Cart className="bi bi-cart text-white" />
                    </a>
                    {/* <!-- Notifications --> */}
                    <div className="dropdown me-2">
                        <a className="link-secondary me-3 hidden-arrow" data-bs-toggle="dropdown" data-toggle="dropdown" href="#"
                            id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false" onClick={handleDropdownToggle2}>
                            <Bell className="bi text-white" />
                        </a>
                        <ul className={`dropdown-menu dropdown-menu-end ${showDropdown2 ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                            {notifications.map((notification, index) => (
                                <li className="d-flex" style={{ borderBottom: "groove", alignItems: "center" }}>
                                    <a className="dropdown-item rounded" href="#">
                                        <div className="d-grid">
                                            {notification.heading} <span style={{ fontSize: "12px", color: "gray" }}>{notification.created}</span>
                                        </div>
                                    </a>
                                    <a className="p-2" onClick={event => handleRead(event, notification.id)}>{!notification.read ? <Icon.Envelope /> : <Icon.EnvelopeOpen />}</a>
                                    <a className="p-2" style={{ color: "red" }} onClick={event => handleDelete(event, notification.id)}><Icon.Trash /></a>
                                </li>
                            ))}
                            <li className="d-flex" style={{ justifyContent: "space-around" }}>
                                <a className={`${previous ? 'text-primary' : 'text-secondary'}`} onClick={loadPrevious}><Icon.ArrowLeft /></a>
                                <a onClick={handleReadAll}>Mark all as read <Icon.Check2Circle /></a>
                                <a className={`${next ? 'text-primary' : 'text-secondary'}`} onClick={loadNext}><Icon.ArrowRight /></a>
                            </li>
                        </ul>

                    </div>

                    {/* <!-- Avatar --> */}
                    <div className="dropdown">
                        <Link className="dropdown-toggle d-flex align-items-center hidden-arrow text-white"
                            data-bs-toggle="dropdown" data-toggle="dropdown" to="#" id="navbarDropdownMenuAvatar" role="button"
                            data-mdb-toggle="dropdown" aria-expanded="false" onClick={handleDropdownToggle}>
                            <img src={imgData !== null ? imgData : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"}
                                className="bi bi-person rounded-circle" height="30" alt="My Profile" />
                        </Link>
                        <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuAvatar">
                            <li>
                                <Link className="dropdown-item" to="/profile">My Profile</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/reservations">My Reservations</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/listing_page">My Listings</Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="#" onClick={handleLogout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                )
            }


        </div>
        {/* <!-- Container wrapper -->         */}
    </nav>
}

export default Navbar;