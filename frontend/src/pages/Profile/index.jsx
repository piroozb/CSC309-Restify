import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

const Profile = () => {
    const [state, setState] = useState({
        id: 1,
        profile_picture: null,
        email: "",
        username: "",
        location: "",
        phone_number: "",
        first_name: "",
        last_name: "",
        birthday: "",
        orgname: ""
      })
      const [file, setFile] = useState({selectedFile: null})
      const [imgData, setImgData] = useState(null);
      const [success, setSuccess] = useState(false);


  
      useEffect(() => {
        fetchData()
    }, [])

    const onFileChange = (event) => {
        setFile({ selectedFile: event.target.files[0] });
        const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(event.target.files[0]);
      };
    const fetchData = async () => {
        const response = await axios.get(
            `/api/account/`);
            setImgData(response.data[0].profile_picture)
            setState(response.data[0])
        }

      const updateProfile = async () => {

        const formData = new FormData()
        const data = localStorage.getItem("useInfo");
        const pass = localStorage.getItem("password");

        formData.append("id", JSON.parse(data)[0].id)

        if(file.selectedFile !== null) {
            formData.append("profile_picture", file.selectedFile)
        }
        formData.append("email", state.email)
        formData.append("username", state.username)
        // formData.append("phone_number", state.phone_number)
        formData.append("first_name", state.first_name)
        formData.append("last_name", state.last_name)
        formData.append("password", pass)
        await axios.put(
            `/api/account/${JSON.parse(data)[0].id}/`, formData);
            setSuccess(true)
            window.location.reload();
    }

    const handleChange = (evt) => {
        const value = evt.target.value;
        setState({
          ...state,
          [evt.target.name]: value
        });
      }

    return   <div class="container-xl px-5 pt-5" style={{marginTop: "10vh",marginBottom: "10vh"}}>
                {success && (
                        <Alert variant="success">Profile updated successfully</Alert>
                      )}
    <div class="row mb-5 mx-3 my-3">
        <div class="col-xl-4">
            <div class="card mb-4 mb-xl-0">
                <div class="card-header">Profile Picture</div>
                <div class="card-body text-center">
                    <img class="img-account-profile rounded-circle mb-2" src={imgData !== null ? imgData : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"} width="50%" alt=""/>
                    <div class="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>

                <div class="upload-btn-wrapper">
  <button class="btn btn-primary px-2">Upload New Image</button>
  <input type="file" name="profile_picture" onChange={onFileChange} />
</div>
                </div>
            </div>
        </div>

        <div class="col-xl-8">
            <div class="card mb-4">
                <div class="card-header">Account Details</div>
                <div class="card-body">
                    <form>
                        <div class="mb-3">
                            <label class="small mb-1" for="inputUsername">Username (This is what other users will see)</label>
                            <input class="form-control" id="inputUsername" type="text" name="username" placeholder="Enter your username"           value={state.username}
          onChange={handleChange}
          />
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputFirstName">First name</label>
                                <input           onChange={handleChange}
 class="form-control" id="inputFirstName" type="text" placeholder="Enter your first name" name="first_name" value={state.first_name}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputLastName">Last name</label>
                                <input            onChange={handleChange}
class="form-control" id="inputLastName" type="text" placeholder="Enter your last name" name="last_name" value={state.last_name}/>
                            </div>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputOrgName">Organization Name</label>
                                <input            onChange={handleChange}
class="form-control" id="inputOrgName" type="text" placeholder="Enter your organization name" name="orgname" value={state.orgname}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputLocation">Location</label>
                                <input           onChange={handleChange}
 class="form-control" id="inputLocation" type="text" placeholder="Enter your location" name="location"  value={state.location}/>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="small mb-1" for="inputEmailAddress">Email Address</label>
                            <input           onChange={handleChange}
 class="form-control" id="inputEmailAddress" type="email" placeholder="Enter your email address" name="email" value={state.email}/>
                        </div>
                        <div class="row gx-3 mb-3">
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputPhone">Phone Number</label>
                                <input            onChange={handleChange}
class="form-control" id="inputPhone" type="tel" placeholder="Enter your phone number" name="phone_number" value={state.phone_number}/>
                            </div>
                            <div class="col-md-6">
                                <label class="small mb-1" for="inputBirthday">Birthday</label>
                                <input           onChange={handleChange}
 class="form-control" id="inputBirthday" type="text" name="birthday" placeholder="Enter your birthday" value={state.birthday}/>
                            </div>
                        </div>
                        <button class="btn btn-primary" type="button" onClick={updateProfile} >Save changes</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
    

}
export default Profile;