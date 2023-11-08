import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";
import { ClockFill, GeoAltFill, Bank } from 'react-bootstrap-icons';
import { Link, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { AuthContext } from '../../contexts/AuthContext';

const styles = {
    borderRadius:{
        borderRadius: '15px'
    },
    textDecoration:{"textDecoration":"none"},
    marginTop:{"marginTop":"10px"},
    mt10:{
            "marginTop":"10rem",
            "border":"none"
        },
        textCenter:{"textAlign":"center",
        "marginBottom": '1rem'}
    }

function Reservations() {
    const { user } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            const response = await axios.get('/api/reservations/');
            const reservationsWithListing = await Promise.all(
                response.data.map(async (reservation) => {
                const listingResponse = await axios.get(`/listing-list/?id=${reservation.property}`);
                const imagesResponse = await axios.get(`/images/${reservation.property}/`);
                const reservationWithListing = {
                    ...reservation,
                    listing: listingResponse.data,
                    images: imagesResponse.data
                };
                return reservationWithListing;
                })
            );
            setReservations(reservationsWithListing);
        };
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        try {
          const response = await axios.put(`/api/reservations/${id}/`, {
            status: 'request cancellation'
          });
          window.location.reload()
        } catch (error) {
          setError(error.message);
        }
    };
    if (error) {
        return <div>{error}</div>;
    }

    console.log("Reservations: ");
    console.log(reservations);

    return (
        <Container className="container reservations" style={{marginTop: "100px", marginBottom: "100px"}}>
            <Row className="mt-5">
                <Col md="4">
                    <div className="osahan-account-page-left shadow-sm bg-white h-10" style={{borderRadius: "15px"}}>
                        <div className="border-bottom p-4">
                            <div className="osahan-user text-center">
                            {user ? <div className="d-flex flex-column justify-content-center align-items-center osahan-user-media">
                                <img className="rounded-circle shadow-sm"
                                    src={`${user.profile_picture}`} width="80%"
                                    alt="profile"/>
                                <div className="osahan-user-media-body">
                                    <h6 className="mb-2">{user.username}</h6>
                                </div>
                            </div> : <div className="d-flex flex-column justify-content-center align-items-center osahan-user-media">
                                <img className="rounded-circle shadow-sm"
                                    src="https://img.freepik.com/free-icon/professor_318-177005.jpg?w=2000" width="50%"
                                    alt="profile"/>
                                <div className="osahan-user-media-body">
                                </div>
                            </div>}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md="8">
                <Card id="maincard">
                    <Card.Body>
                        <Card.Title style={styles.textCenter}>My Reservations</Card.Title>
                        {reservations.map( (reservation) => (
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md="8">
                                            <div className="p-3">
                                                <h6 className="mb-2">
                                                    <Link to={`/property/${reservation.property}`} className="text-black">{reservation.listing[0].title}</Link>
                                                </h6>
                                                <p className="text-gray mb-1"><GeoAltFill className="icofont-location-arrow"></GeoAltFill> Location: {reservation.listing[0].location}
                                                </p>
                                                <p className="text-gray mb-1"><ClockFill className="icofont-list"></ClockFill> Availability: {reservation.listing[0].available_start} - {reservation.listing[0].available_end}</p>
                                                <p className="text-dark"><Bank></Bank> List Price: ${reservation.listing[0].price_per_day}/day
                                                </p>
                                                {reservation.status === 'approved' ? (
                                                <div key={reservation.id}>
                                                <div>
                                                    <p style={{fontWeight: 'bold'}}>This reservation has been approved.</p>
                                                </div>
                                                <div>
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleCancel(reservation.id)}>Cancel</button>
                                                </div>
                                                </div>
                                                ) :
                                                <p style={{fontWeight: 'bold'}}>This reservation is {reservation.status}</p>}
                                            </div>
                                        </Col>
                                        <Col md="4">
                                        <Carousel className="carousel-inner w-100 h-100">
                                        {reservation.images && reservation.images.map((img, index) => (
                                        <Carousel.Item className="carousel-item" key={index}>
                                        <img className="d-block fit" width="100%" height="200rem"
                                            src={`${axios.defaults.baseURL}${img.image}`}
                                            alt="inside-img" />
                                    </Carousel.Item>
                                    ))}
                                        </Carousel>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Reservations;