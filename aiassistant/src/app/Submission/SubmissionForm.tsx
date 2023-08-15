"use client";

import React, { useState } from "react";
import "../styling/submission.css";
import Spinner from "../Components/spinner";
import ResultBox from "../Components/result";
import dynamic from "next/dynamic";

const ParticlesComponent = dynamic(
  () => import("../Components/ParticlesComponent"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);
export default function SubmissionForm() {
  const [formData, setFormData] = useState({
    resume: "",
    portfolio: "",
    vacancy: "",
    country: "USA",
    laborMarket: "Highly Competitive Labor Market",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chatResp, setChatResp] = useState("");
  const [hasResponse, setHasResponse] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  const isValidWordCount = (value: string, maxWords: number) => {
    const words = value.split(/\s+/).filter(Boolean);
    return words.length <= maxWords;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (
      (e.target.name === "resume" || e.target.name === "portfolio") &&
      !isValidWordCount(e.target.value, 150)
    ) {
      alert("You can only enter a maximum of 150 words.");
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await fetch("http://localhost:3000/Submission/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!resp.ok) {
        throw new Error("Network response was not ok");
      }
      const respData = await resp.json();
      const finalResult = respData.content;
      const currCount = respData.rateLimit;
      console.log(finalResult);
      setChatResp(finalResult);
      setCurrentCount(currCount);
      setHasResponse(true);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ParticlesComponent />
      <div className="submissiondiv">
        {hasResponse ? (
          <ResultBox response={chatResp} currCount={currentCount} />
        ) : isLoading ? (
          <Spinner />
        ) : (
          <form className="submissionform" onSubmit={handleSubmit}>
            <label className="submissionlabel" htmlFor="Resume">
              Work Experience and Qualifications{" "}
            </label>
            <textarea
              id="resume"
              name="resume"
              placeholder="Copy and paste or add a summary of your work experience, tasks completed, tech stack, qualifications and any additional info (have you built a company?)"
              required
              minLength={100}
              value={formData.resume}
              onChange={handleChange}
              rows={5}
              cols={50}
            />

            <label className="submissionlabel" htmlFor="Portfolio">
              Key Projects
            </label>
            <textarea
              id="portfolio"
              name="portfolio"
              placeholder="Copy and paste or add details highlighting your key projects, features you built and tech stack used"
              required
              minLength={50}
              value={formData.portfolio}
              onChange={handleChange}
              rows={5}
              cols={50}
            />

            <label className="submissionlabel" htmlFor="Vacancy">
              Job Description and Company Details
            </label>
            <textarea
              id="vacancy"
              name="vacancy"
              placeholder="Copy and paste or add job description and company details from job ad"
              required
              minLength={20}
              value={formData.vacancy}
              onChange={handleChange}
              rows={5}
              cols={50}
            />
            <label className="submissionlabel" htmlFor="Vacancy">
              Country of Vacancy{" "}
            </label>
            <select
              id="CountryOfVacancy"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
            >
              <option>USA</option>
              <option>South Africa</option>
              <option>Canada</option>
            </select>
            <label className="submissionlabel" htmlFor="Vacancy">
              Labor Market Conditions{" "}
            </label>
            <select
              id="LaborMarketConditions"
              name="laborMarket"
              required
              value={formData.laborMarket}
              onChange={handleChange}
            >
              <option>Highly Competitive Labor Market</option>
              <option>Normal</option>
              <option>Employee Market</option>
            </select>

            <button className="submissionbutton" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
}
