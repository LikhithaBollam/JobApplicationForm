"use client";

import React, { useState, useEffect } from "react";

const useFormValidation = (initialState, validate, callback) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        callback();
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    }
  }, [errors, isSubmitting, callback]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "fullName") {
      if (value.length < 5) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Full Name must be at least 5 characters long",
        }));
      } else if (/\d/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Full Name cannot include a number",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }));
      }
    }

    if (name === "phoneNumber") {
      if (!value.trim().startsWith("+")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Phone Number must start with a country code (+)",
        }));
      } else if (!/^\+\d{1,3}\d{9}$/.test(value.trim())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]:
            "Phone Number must be in the format +Countrycode followed by Number (e.g., +1234567890)",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: null,
        }));
      }
    }

    if (type === "checkbox") {
      if (checked) {
        setValues((prevValues) => ({
          ...prevValues,
          additionalSkills: [...prevValues.additionalSkills, name],
        }));
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          additionalSkills: prevValues.additionalSkills.filter(
            (skill) => skill !== name
          ),
        }));
      }
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setIsSubmitting,
  };
};

const validate = (values) => {
  let errors = {};

  if (!values.fullName) {
    errors.fullName = "Full Name is required";
  } else if (values.fullName.length < 5) {
    errors.fullName = "Full Name must be at least 5 characters long";
  } else if (/\d/.test(values.fullName)) {
    errors.fullName = "Full Name cannot include a number";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email address is invalid";
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = "Phone Number is required";
  } else if (!values.phoneNumber.trim().startsWith("+")) {
    errors.phoneNumber = "Phone Number must start with a country code (+)";
  } else if (!/^\+\d{1,3}\d{9}$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber =
      "Phone Number must be in the format +CountrycodePhonenumber (e.g., +1234567890)";
  }

  if (!values.applyingForPosition) {
    errors.applyingForPosition = "Applying for Position is required";
  }

  if (
    values.applyingForPosition === "Developer" ||
    values.applyingForPosition === "Designer"
  ) {
    if (!values.relevantExperience) {
      errors.relevantExperience = "Relevant Experience is required";
    } else if (
      isNaN(values.relevantExperience) ||
      values.relevantExperience <= 0
    ) {
      errors.relevantExperience =
        "Relevant Experience must be a number greater than 0";
    }
  }

  if (values.applyingForPosition === "Designer") {
    if (!values.portfolioURL) {
      errors.portfolioURL = "Portfolio URL is required";
    } else if (!isValidUrl(values.portfolioURL)) {
      errors.portfolioURL = "Portfolio URL is not a valid URL";
    }
  }

  if (values.applyingForPosition === "Manager") {
    if (!values.managementExperience) {
      errors.managementExperience = "Management Experience is required";
    }
  }

  if (values.additionalSkills.length === 0) {
    errors.additionalSkills = "At least one Additional Skill must be selected";
  }

  if (!values.preferredInterviewTime) {
    errors.preferredInterviewTime = "Preferred Interview Time is required";
  }

  return errors;
};

const JobApplicationForm = () => {
  const initialFormState = {
    fullName: "",
    email: "",
    phoneNumber: "",
    applyingForPosition: "",
    relevantExperience: "",
    portfolioURL: "",
    managementExperience: "",
    additionalSkills: [],
    preferredInterviewTime: "",
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const submitForm = () => {
    alert(`Form submitted successfully!\n${JSON.stringify(values, null, 2)}`);
    setFormSubmitted(true);
    resetForm();
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setIsSubmitting,
  } = useFormValidation(initialFormState, validate, submitForm);

  const resetForm = () => {
    setValues(initialFormState);
    setIsSubmitting(false);
    setFormSubmitted(false);
  };

  const additionalSkillsOptions = [
    { id: "js", label: "JavaScript" },
    { id: "css", label: "CSS" },
    { id: "python", label: "Python" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Job Application Form
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            value={values.fullName}
            onChange={handleChange}
            disabled={formSubmitted}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
            value={values.email}
            onChange={handleChange}
            disabled={formSubmitted}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
            value={values.phoneNumber}
            onChange={handleChange}
            disabled={formSubmitted}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Applying for Position</label>
          <select
            name="applyingForPosition"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.applyingForPosition ? "border-red-500" : "border-gray-300"
              }`}
            value={values.applyingForPosition}
            onChange={handleChange}
            disabled={formSubmitted}
          >
            <option value="">Select a position</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.applyingForPosition && (
            <p className="text-red-500 text-sm">{errors.applyingForPosition}</p>
          )}
        </div>

        {(values.applyingForPosition === "Developer" ||
          values.applyingForPosition === "Designer") && (
            <div className="mb-4">
              <label className="block text-gray-700">
                Relevant Experience (years)
              </label>
              <input
                type="number"
                name="relevantExperience"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.relevantExperience ? "border-red-500" : "border-gray-300"
                  }`}
                value={values.relevantExperience}
                onChange={handleChange}
                disabled={formSubmitted}
              />
              {errors.relevantExperience && (
                <p className="text-red-500 text-sm">
                  {errors.relevantExperience}
                </p>
              )}
            </div>
          )}

        {values.applyingForPosition === "Designer" && (
          <div className="mb-4">
            <label className="block text-gray-700">Portfolio URL</label>
            <input
              type="url"
              name="portfolioURL"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.portfolioURL ? "border-red-500" : "border-gray-300"
                }`}
              value={values.portfolioURL}
              onChange={handleChange}
              disabled={formSubmitted}
            />
            {errors.portfolioURL && (
              <p className="text-red-500 text-sm">{errors.portfolioURL}</p>
            )}
          </div>
        )}

        {values.applyingForPosition === "Manager" && (
          <div className="mb-4">
            <label className="block text-gray-700">Management Experience</label>
            <textarea
              name="managementExperience"
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.managementExperience
                  ? "border-red-500"
                  : "border-gray-300"
                }`}
              value={values.managementExperience}
              onChange={handleChange}
              disabled={formSubmitted}
            />
            {errors.managementExperience && (
              <p className="text-red-500 text-sm">
                {errors.managementExperience}
              </p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700">Additional Skills</label>
          {additionalSkillsOptions.map((skill) => (
            <div key={skill.id} className="flex items-center">
              <input
                type="checkbox"
                id={skill.id}
                name={skill.id}
                className="mr-2"
                checked={values.additionalSkills.includes(skill.id)}
                onChange={handleChange}
                disabled={formSubmitted}
              />
              <label htmlFor={skill.id} className="text-gray-700">
                {skill.label}
              </label>
            </div>
          ))}
          {errors.additionalSkills && (
            <p className="text-red-500 text-sm">{errors.additionalSkills}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">
            Preferred Interview Time
          </label>
          <input
            type="datetime-local"
            name="preferredInterviewTime"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.preferredInterviewTime
                ? "border-red-500"
                : "border-gray-300"
              }`}
            value={values.preferredInterviewTime}
            onChange={handleChange}
            disabled={formSubmitted}
          />
          {errors.preferredInterviewTime && (
            <p className="text-red-500 text-sm">
              {errors.preferredInterviewTime}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            disabled={formSubmitted}
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

export default JobApplicationForm;
