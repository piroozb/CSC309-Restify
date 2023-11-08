import '../../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import React, { useState,  useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "../../services/apiService"
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ClockFill, GeoAltFill, Bank, InfoCircleFill } from 'react-bootstrap-icons';

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


const Listings = () => {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(0);
  const [edit, setEdit] = useState({});
  const editClose = () => setEdit({});
  const confirmShow = (id) => setConfirm(id);
  const confirmClose = () => setConfirm(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [data, setData] = useState([]);
  const [date, setDate] = useState({});
  const [listingImages, setListingImages] = useState([])
  const [images, setImages] = useState([])

  const editShow = (id) => {
    async function fetchData() {
        const result = await axios.get("/listing-list/");
        setEdit(result.data.find(c => c.id === Number(id)))
      }
      fetchData()
    };
    

  const [formData, setFormData] = useState({
    "title": "",
    "amentites": "",
    "available_start": "",
    "available_end": "",
    "number_of_guests": null,
    "location": "",
    "price_per_day": null,
    "number_of_washroom":null,
    "number_of_bedroom":null,
    "description": ""
  });

  const handleInputChange = (e) => {
    if (e.target.type === "file") {
      setImages(Array.from(e.target.files));
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // useEffect(() => console.log(images), [images])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("location", formData.location);
    formDataObj.append("available_start", formData.available_start);
    formDataObj.append("available_end", formData.available_end);
    formDataObj.append("number_of_guests", formData.number_of_guests);
    formDataObj.append("price_per_day", formData.price_per_day);
    formDataObj.append("amentites", formData.amentites);
    formDataObj.append("number_of_washroom", formData.number_of_washroom);
    formDataObj.append("number_of_bedroom", formData.number_of_bedroom);
    formDataObj.append("description", formData.description);

    const response = await axios.post('create-listing/', formDataObj)
    let data = new FormData();
    
    images.map(async (image) => {
      data.append("image", image);
      data.append("listing", response.data.id);
      await axios.post(`/create-image/`,
      data);
      data.delete("image")
      data.delete("listing")
    })
    async function fetchData() {
        if (user) {
            const result = await axios.get("/listing-list/");
            setData(result.data.filter(item => item.user_created_info.id === user.id));}
    }
    setFormData({
      "title": "",
      "amentites": "",
      "available_start": "",
      "available_end": "",
      "number_of_guests": null,
      "location": "",
      "price_per_day": null,
      "number_of_washroom":null,
      "number_of_bedroom":null,
      "description": ""
    })
    setImages([])
    fetchData();
    handleClose()
  };

  const confirmSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.delete(`create-listing/${confirm}/`)
    console.log(response)
    async function fetchData() {
        if (user) {
            const result = await axios.get("/listing-list/");
            setData(result.data.filter(item => item.user_created_info.id === user.id));}
      }
    fetchData()
    confirmClose()
  };

  const editSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formData.title ? formDataObj.append("title", formData.title) : formDataObj.append("title", edit.title)
    formData.location ? formDataObj.append("location", formData.location) : formDataObj.append("location", edit.location)
    formData.available_start ? formDataObj.append("available_start", formData.available_start) : formDataObj.append("available_start", edit.available_start)
    formData.available_end ? formDataObj.append("available_end", formData.available_end) : formDataObj.append("available_end", edit.available_end)
    formData.number_of_guests ? formDataObj.append("number_of_guests", Number(formData.number_of_guests)) : formDataObj.append("number_of_guests", edit.number_of_guests)
    formData.price_per_day ? formDataObj.append("price_per_day", Number(formData.price_per_day)) : formDataObj.append("price_per_day", edit.price_per_day)
    formData.amentites ? formDataObj.append("amentites", formData.amentites) : formDataObj.append("amentites", edit.amentites)
    formData.number_of_washroom ? formDataObj.append("number_of_washroom", Number(formData.number_of_washroom)) : formDataObj.append("number_of_washroom", edit.number_of_washroom)
    formData.number_of_bedroom ? formDataObj.append("number_of_bedroom", Number(formData.number_of_bedroom)) : formDataObj.append("number_of_bedroom", edit.number_of_bedroom)
    formData.description ? formDataObj.append("description", formData.description) : formDataObj.append("description", edit.description)
    for (const value of formDataObj.values()) {
        console.log(value);
      }
    const response = await axios.put(`create-listing/${edit.id}/`, formDataObj)
    
    if (images) {
    let data = new FormData();
    images.map(async (image) => {
      data.append("image", image);
      data.append("listing", response.data.id);
      await axios.post(`/create-image/`,
      data);
      data.delete("image")
      data.delete("listing")
    })}

    async function fetchData() {
        if (user) {
            const result = await axios.get("/listing-list/");
            setData(result.data.filter(item => item.user_created_info.id === user.id));}
          }
    setFormData({
      "title": "",
      "amentites": "",
      "available_start": "",
      "available_end": "",
      "number_of_guests": null,
      "location": "",
      "price_per_day": null,
      "number_of_washroom":null,
      "number_of_bedroom":null,
      "description": ""
    })
    setImages([])
    fetchData();
    editClose();
  };

  useEffect(() => {
    async function fetchData() {
        if (user) {
      const result = await axios.get("/listing-list/");
      const extra = await Promise.all(
        result.data.filter(item => item.user_created_info.id === user.id).map(async (item) => {
            const r = await axios.get(`api/reservations/${item.reservation[0]}/`)
            const new_d = {
                ...item,
                reservation_data: r.data
            }
            return new_d
        })
      )
      setData(extra);
    }}
  fetchData();
}, [user]);

  useEffect(() => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var currDate;
    var responses = [];
    data.map( async (item, index) => {
      responses[index] = await axios.get(`/images/${item.id}/`)
      setListingImages(prevState => ({...prevState, [item.id]: responses[index].data}))
      currDate = new Date(item.created_at)
      setDate(prevState => ({...prevState, [item.id]: currDate.toLocaleDateString("en-US", options)}))
    })
  }, [data])

    const handleApprove = async (item) => {
        try {
        const response = await axios.put(`/api/reservations/${item.reservation}/`, {
            status: 'approved'
        });
        window.location.reload()
        } catch (error) {
            console.log(error)
        }
    };

    const handleDeny = async (item) => {
        try {
        const response = await axios.put(`/api/reservations/${item.reservation}/`, {
            status: 'denied'
        });
        window.location.reload()
        } catch (error) {
            console.log(error)
        }
    };

    const handleApproveCancellation = async (item) => {
        try {
        const response = await axios.put(`/api/reservations/${item.reservation}/`, {
            status: 'canceled'
        });
        window.location.reload()
        } catch (error) {
            console.log(error)
        }
    };

    const handleDenyCancellation = async (item) => {
        try {
        const response = await axios.put(`/api/reservations/${item.reservation}/`, {
            status: 'pending'
        });
        window.location.reload()
        } catch (error) {
            console.log(error)
        }
    };

    const handleTerminate = async (item) => {
        try {
        const response = await axios.put(`/api/reservations/${item.reservation}/`, {
            status: 'terminated'
        });
        window.location.reload()
        } catch (error) {
            console.log(error)
        }
    };


  console.log(data)

  return (
    <>
    <Container className="mt-5">
        <Row className="mt-5">
            <Col md="4">
                <div className="osahan-account-page-left shadow-sm bg-white h-10" style={styles.borderRadius}>
                    <div className="border-bottom p-4">
                        <div className="osahan-user text-center">
                                {user ? <div className="d-flex flex-column justify-content-center align-items-center osahan-user-media">
                                <img className="rounded-circle shadow-sm mb-3"
                                    src={`${user.profile_picture}`} width="60%"
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
                            <button className="btn btn-sm btn-primary mr-2" onClick={handleShow}>
                                              Create new listing
                                            </button>
                        </div>
                    </div>
                </div>
            </Col>
            <Col md="8">
                
                
                <Card id="maincard">
                    <Card.Body>
                        <Card.Title style={styles.textCenter}>My Active Listings</Card.Title>
                        {data.map((item) => (
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md="8">
                                            <div className="p-3">
                                                <h6 className="mb-2">
                                                    <Link to={`/property/${item.id}`} className="text-black">{item.title}</Link>
                                                </h6>
                                                <p className="text-gray mb-1"><GeoAltFill className="icofont-location-arrow"></GeoAltFill> Location: {item.location}
                                                </p>
                                                <p className="text-gray mb-1"><ClockFill className="icofont-list"></ClockFill> Availability: {item.available_start} - {item.available_end}</p>
                                                <p className="text-gray mb-4"><InfoCircleFill></InfoCircleFill> {item.number_of_guests} guests · {item.number_of_bedroom} bedrooms · {item.number_of_washroom} baths</p>
                                                <p className="text-dark"><Bank></Bank> List Price: ${item.price_per_day}/day
                                                </p>
                                                { item.reservation_data.status === 'pending' ? (
                                                    <div>
                                                        <div><p style={{fontWeight: 'bold'}}>This property is pending reservation approval.</p></div>
                                                        <div><button className="btn btn-sm btn-primary" onClick={() => handleApprove(item)}>Approve</button>
                                                        <button className="btn btn-sm btn-primary" onClick={() => handleDeny(item)}>Deny</button></div>
                                                    </div>)
                                                    :
                                                    item.reservation_data.status === 'pending cancellation' ? (
                                                        <div>
                                                            <div><p style={{fontWeight: 'bold'}}>This property is pending reservation cancellation.</p></div>
                                                            <div><button className="btn btn-sm btn-primary" onClick={() => handleApproveCancellation(item)}>Approve</button>
                                                            <button className="btn btn-sm btn-primary" onClick={() => handleDenyCancellation(item)}>Deny</button></div>
                                                        </div>
                                                    ) :
                                                    item.reservation_data.status === 'approved' ? (
                                                        <div>
                                                            <div><p style={{fontWeight: 'bold'}}>This property has been approved for reservation.</p></div>
                                                            <div><button className="btn btn-sm btn-primary" onClick={() => handleTerminate(item)}>Terminate</button></div>
                                                        </div>
                                                    ) :
                                                    <div>
                                                        <p style={{fontWeight: 'bold'}}>This property is available for reservation.</p>
                                                    </div>
                                                }
                                            </div>
                                        </Col>
                                        <Col md="4">
                                        <Carousel className="carousel-inner w-100 h-100">
                                        {listingImages[item.id] && listingImages[item.id].map((img, index) => (
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
                                <Card.Footer>
                                    <div className="d-flex flex-row justify-content-between align-items-center">
                                        {date[item.id] ? <h6>Created on {date[item.id]}</h6> : <h6>Created on {item.created_at}</h6>}
                                        <div className='d-flex gap-3'>
                                            <button className="btn btn-sm btn-outline-primary mr-2" onClick={() => editShow(item.id)}>
                                                Edit Listing
                                            </button>

                                            <button className="btn btn-sm btn-primary" onClick={() => confirmShow(item.id)}>
                                                Remove Listing
                                            </button>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>

    
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><h5>Add a new Listing!</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleSubmit}>
            
            <div className="form-group mb-2">
              <Form.Label htmlFor="basic-url" className='mt-2'>Listing Title</Form.Label>
              <input type="text" className="form-control mb2" name="title" onChange={handleInputChange} aria-describedby="listing-title" placeholder="Enter the listing title" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="address">Location</label>
                <input type="text" className="form-control mb-2" name="location" onChange={handleInputChange} placeholder="Enter the location" required/>
            </div>
            <div className="form-group mb-2">
                    <label htmlFor="name">Availability From:</label>
                    <input type="date" className="form-control text-secondary mb-2" name="available_start" onChange={handleInputChange} required/>
                    <label htmlFor="to">Availability To:</label>
                    <input type="date" className="form-control text-secondary" id="availability" name="available_end" onChange={handleInputChange} required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Guests</label>
                <input type="number" className="form-control mb-2" name="number_of_guests" onChange={handleInputChange} placeholder="Enter the number of guests" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Price</label>
                <input type="number" className="form-control mb-2" name="price_per_day" onChange={handleInputChange} placeholder="Enter the price" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Washrooms</label>
                <input type="number" className="form-control mb-2" name="number_of_washroom" onChange={handleInputChange} placeholder="Enter the number of washrooms" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Bedrooms</label>
                <input type="number" className="form-control mb-2" name="number_of_bedroom" onChange={handleInputChange} placeholder="Enter the number of bedrooms" required/>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="description">Listing Description</label>
                <textarea type="text" className="form-control mb-2" rows="4" name="description" onChange={handleInputChange} placeholder="Enter the description" required></textarea>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="amentites">Amenities (separate them with commas)</label>
                <textarea type="text" className="form-control mb-2" name="amentites" onChange={handleInputChange} placeholder="Enter the amenities" required></textarea>
            </div>
            <div className="form-group mb-2">
                <Form.Label htmlFor="basic-url">Upload Images</Form.Label>
                <input type="file" multiple name="picture" onChange={handleInputChange} className='form-control' accept="image/*" required/>
            </div>
            <Modal.Footer>
                <Button type="submit" variant="primary">
                    Create Listing
                </Button>
            </Modal.Footer>
            </form>
        </Modal.Body>
    </Modal>

    <Modal show={confirm !== 0} onHide={confirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={confirmSubmit} className='d-flex row gap-2'>
                <Form.Label>Are you sure you want to permanently remove this listing?</Form.Label>
            <Button type="submit" variant="primary-outline">
                    Yes
                </Button>
                <Button variant="primary" onClick={confirmClose}>
                    No
                </Button>
            </form>
        </Modal.Body>
    </Modal>

    <Modal show={Object.keys(edit).length !== 0} onHide={editClose}>
        <Modal.Header closeButton>
          <Modal.Title><h5>Edit this listing!</h5></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={editSubmit}>
            
            <div className="form-group mb-2">
              <Form.Label htmlFor="basic-url" className='mt-2'>Listing Title</Form.Label>
              <input defaultValue={edit.title} type="text" className="form-control mb2" name="title" onChange={handleInputChange} aria-describedby="listing-title" placeholder="Enter the listing title" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="address">Location</label>
                <input defaultValue={edit.location} type="text" className="form-control mb-2" name="location" onChange={handleInputChange} placeholder="Enter the location" required/>
            </div>
            <div className="form-group mb-2">
                    <label htmlFor="name">Availability From:</label>
                    <input defaultValue={edit.available_start} type="date" className="form-control text-secondary mb-2" name="available_start" onChange={handleInputChange} required/>
                    <label htmlFor="to">Availability To:</label>
                    <input defaultValue={edit.available_end} type="date" className="form-control text-secondary" id="availability" name="available_end" onChange={handleInputChange} required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Guests</label>
                <input defaultValue={edit.number_of_guests} type="number" className="form-control mb-2" name="number_of_guests" onChange={handleInputChange} placeholder="Enter the number of guests" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Price</label>
                <input defaultValue={edit.price_per_day} type="number" className="form-control mb-2" name="price_per_day" onChange={handleInputChange} placeholder="Enter the price" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Washrooms</label>
                <input defaultValue={edit.number_of_washroom} type="number" className="form-control mb-2" name="number_of_washroom" onChange={handleInputChange} placeholder="Enter the number of washrooms" required/>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="price">Number of Bedrooms</label>
                <input defaultValue={edit.number_of_bedroom} type="number" className="form-control mb-2" name="number_of_bedroom" onChange={handleInputChange} placeholder="Enter the number of bedrooms" required/>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="description">Listing Description</label>
                <textarea defaultValue={edit.description} type="text" className="form-control mb-2" rows="4" name="description" onChange={handleInputChange} placeholder="Enter the description" required></textarea>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="amentites">Amenities (separate them with commas)</label>
                <textarea defaultValue={edit.amentites} type="text" className="form-control mb-2" name="amentites" onChange={handleInputChange} placeholder="Enter the amenities" required></textarea>
            </div>
            <div className="form-group mb-2">
                <Form.Label htmlFor="basic-url">Upload Images</Form.Label>
                <input type="file" multiple name="picture" onChange={handleInputChange} className='form-control' accept="image/*"/>
            </div>
            <Modal.Footer>
                <Button type="submit" variant="primary">
                    Update Listing
                </Button>
            </Modal.Footer>
            </form>
        </Modal.Body>
    </Modal>
    </>
  );
  }

export default Listings;