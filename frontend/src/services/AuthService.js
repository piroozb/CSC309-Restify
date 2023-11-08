import axios from './apiService';
import Cookies from "js-cookie";

class AuthService {
  setTokens(data) {
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
  }

  async login(username, password) {
    try {
      const response = await axios.post(
        `/api/token/`,
        {
          username,
          password,
        }
      );

      this.setTokens(response.data);

      return {
        status: 200,
        message: "user logged in successfully",
        data: response.data,
      };
    } catch (error) {
      const loginError = error.response.data.error;
      return {
        status: 400,
        error: loginError
          ? loginError
          : "There was an error processing your request please try again",
      };
    }
  }

  async sign_up(username, first_name, last_name, email, password, password2) {
    try {

      const formData = new FormData()

      formData.append("username", username)
      formData.append("first_name", first_name)
      formData.append("last_name", last_name)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("password2", password2)

      const response = await axios.post(
        `/api/account/`,
        formData
      );
      if (response.status === 201) {

        return {
          status: 200,
          message: "user created successfully",
          data: response.data,
        };
      }
    } catch (e) {
      console.log(e)
      let error = "";

      const data = e.response.data;
      // if ("email" in data.errors) {
      //   error = data.errors["email"][0];
      // } else if ("name" in data.errors) {
      //   error = data.errors["name"][0];
      // } else {
      //   error = data.errors["password"][0];
      // }

      error = data
      return {
        status: 400,
        error: error
          ? error
          : "There was an error processing your request please try again",
      };
    }
  }

  async logout() {
    var data = new FormData()
    data.append("refresh", Cookies.get("Refresh"))

    var config = {
      method: 'post',
      url: `/api/logout/`,
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    Cookies.remove("Access");
    Cookies.remove("Refresh");
  }

  async getCurrentUser() {
    const response = await axios.get(
      `/api/account/`,
    );
    localStorage.setItem("useInfo", JSON.stringify(response.data));

    return response.data[0];
  }
}

export default new AuthService();
