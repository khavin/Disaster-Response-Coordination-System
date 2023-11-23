import React, { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  // use navigate hook
  const navigate = useNavigate();

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

  const eOptions = [
    {
      value: "Bachelor of Science in Nursing",
      label: "Bachelor of Science in Nursing",
    },
    {
      value: "Nursing - Specialty Preparation",
      label: "Nursing - Specialty Preparation",
    },
    {
      value: "Graduate of an accredited nursing program",
      label: "Graduate of an accredited nursing program",
    },
  ];

  const certOptions = [
    {
      value:
        "AHJ certification equivalent to NFPA 1001: Standard for Fire Fighter Professional Qualifications, Firefighter Level II",
      label:
        "AHJ certification equivalent to NFPA 1001: Standard for Fire Fighter Professional Qualifications, Firefighter Level II",
    },
    {
      value: "AHJ-certified EMT",
      label: "AHJ-certified EMT",
    },
    {
      value:
        "Valid state driver’s license, with appropriate endorsements where applicable",
      label:
        "Valid state driver’s license, with appropriate endorsements where applicable",
    },
  ];

  const trainingOptions = [
    {
      value:
        "S-200: Basic Incident Command System for Initial Response, ICS-200",
      label:
        "S-200: Basic Incident Command System for Initial Response, ICS-200",
    },
    {
      value: "National Incident Management System, An Introduction, IS-700",
      label: "National Incident Management System, An Introduction, IS-700",
    },
    {
      value:
        "Training in accordance with Occupational Safety and Health Administration (OSHA) 29 Code of Federal Regulations (CFR) Part 1910.120: Hazardous Materials Awareness",
      label:
        "Training in accordance with Occupational Safety and Health Administration (OSHA) 29 Code of Federal Regulations (CFR) Part 1910.120: Hazardous Materials Awareness",
    },
  ];

  const profOptions = [
    {
      value: "Emergency driving",
      label: "Emergency driving",
    },
    {
      value: "Experience in a clinical practice setting",
      label: "Experience in a clinical practice setting",
    },
    {
      value: "Supervisory position within a healthcare setting",
      label: "Supervisory position within a healthcare setting",
    },
  ];

  const handleSubmit = async () => {
    await fetch("http://localhost:8067/api/register", {
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
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/dashboard");
      });
  };

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
        <input
          className="formInput"
          type="text"
          value={cityValue}
          onChange={(e) => setCityValue(e.target.value)}
        />
        <br></br>

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
