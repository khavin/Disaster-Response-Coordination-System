import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  // use navigate hook
  const navigate = useNavigate();
  const [eOptions, setEOptions] = useState([]);
  const [certOptions, setCertOptions] = useState([]);
  const [trainingOptions, setTrainingOptions] = useState([]);
  const [profOptions, setProfOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [dataAvail, setDataAvail] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  // form states
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [aptValue, setAptValue] = useState("");
  const [streetValue, setStreetValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [zipCodeValue, setZipCodeValue] = useState("");
  const [dlValue, setDLValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [confirmPassValue, setConfirmPassValue] = useState("");
  const [certValue, setCertValue] = useState("");
  const [trainValue, setTrainValue] = useState("");
  const [eduValue, setEduValue] = useState("");
  const [profValue, setProfValue] = useState("");

  useEffect(() => {
    if (dataLoading == false) {
      setDataLoading(true);

      fetch("http://localhost:8067/getResources", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          let temp = [];
          for (let entry of data["Profession"]) {
            temp.push({ label: entry, value: entry });
          }
          setProfOptions(temp);

          temp = [];
          for (let entry of data["City"]) {
            temp.push({ label: entry, value: entry });
          }
          setCityOptions(temp);

          temp = [];
          for (let entry of data["Certification"]) {
            temp.push({ label: entry, value: entry });
          }
          setCertOptions(temp);

          temp = [];
          for (let entry of data["Education"]) {
            temp.push({ label: entry, value: entry });
          }
          setEOptions(temp);

          temp = [];
          for (let entry of data["Training"]) {
            temp.push({ label: entry, value: entry });
          }
          setTrainingOptions(temp);

          setDataAvail(true);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [dataAvail, eOptions, trainingOptions, certOptions, profOptions]);

  const handleSubmit = async () => {
    await fetch("http://localhost:8067/api/signUp", {
      method: "POST",
      body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        gender: genderValue,
        age: ageValue,
        phone: phoneValue,
        apt: aptValue,
        street: streetValue,
        city: cityValue,
        state: "VA",
        zipCode: zipCodeValue,
        dl: dlValue,
        password: passValue,
        confirmPassword: confirmPassValue,
        certValue: certValue,
        eduValue: eduValue,
        profValue: profValue,
        trainValue: trainValue,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  if (!dataAvail) {
    return <div>Loading resources ...</div>;
  }

  return (
    <div className="loginForm signUpForm">
      <div className="loginTitle">Register as a Volunteer</div>
      <form>
        <label>Name</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
        />
        <br></br>

        <label>Email</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
        />
        <br></br>

        <label>Gender</label>
        <br></br>
        <select
          className="formInput formSelect"
          value={genderValue}
          onChange={(e) => setGenderValue(e.target.value)}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br></br>

        <label>Age</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={ageValue}
          onChange={(e) => setAgeValue(e.target.value)}
        />
        <br></br>

        <label>Phone Number</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
        />
        <br></br>

        <label>Apartment Number</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={aptValue}
          onChange={(e) => setAptValue(e.target.value)}
        />
        <br></br>

        <label>Street</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={streetValue}
          onChange={(e) => setStreetValue(e.target.value)}
        />
        <br></br>

        <label>City</label>
        <br></br>
        <Select
          name="colors"
          options={cityOptions}
          onChange={(e) => {
            setCityValue(e.value);
          }}
          className="formInput multi-select"
          classNamePrefix="select"
        />

        <label>Zipcode</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={zipCodeValue}
          onChange={(e) => setZipCodeValue(e.target.value)}
        />
        <br></br>

        <label>Driving License</label>
        <br></br>
        <input
          className="formInput"
          type="text"
          value={dlValue}
          onChange={(e) => setDLValue(e.target.value)}
        />
        <br></br>

        <label>Education</label>
        <br></br>
        <Select
          isMulti
          name="colors"
          options={eOptions}
          onChange={(e) => {
            setEduValue(
              e.map(function (entry) {
                return entry.value;
              })
            );
          }}
          className="formInput multi-select"
          classNamePrefix="select"
        />

        <label>Certification</label>
        <br></br>
        <Select
          isMulti
          name="colors"
          options={certOptions}
          onChange={(e) => {
            setCertValue(
              e.map(function (entry) {
                return entry.value;
              })
            );
          }}
          className="formInput multi-select"
          classNamePrefix="select"
        />

        <label>Training</label>
        <br></br>
        <Select
          isMulti
          name="colors"
          options={trainingOptions}
          onChange={(e) => {
            setTrainValue(
              e.map(function (entry) {
                return entry.value;
              })
            );
          }}
          className="formInput multi-select"
          classNamePrefix="select"
        />

        <label>Profession</label>
        <br></br>
        <Select
          isMulti
          name="colors"
          options={profOptions}
          onChange={(e) => {
            setProfValue(
              e.map(function (entry) {
                return entry.value;
              })
            );
          }}
          className="formInput multi-select"
          classNamePrefix="select"
        />

        <label>Password</label>
        <br></br>
        <input
          className="formInput"
          type="password"
          value={passValue}
          onChange={(e) => setPassValue(e.target.value)}
        />
        <br></br>

        <label>Confirm Password</label>
        <br></br>
        <input
          className="formInput"
          type="password"
          value={confirmPassValue}
          onChange={(e) => setConfirmPassValue(e.target.value)}
        />
        <br></br>

        <div className="registerButton" onClick={handleSubmit}>
          Register
        </div>
      </form>
    </div>
  );
}
