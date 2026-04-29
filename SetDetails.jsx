
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/SetDetails.css";
import { FaRegTrashCan } from "react-icons/fa6";

const SetDetails = () => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const passwordInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

const [patterns, setPatterns] = useState([]);
const [newPattern, setNewPattern] = useState("");
const [showInput, setShowInput] = useState(false);
const [showDeleteBox, setShowDeleteBox] = useState(false); // 👈 toggle delete mode
  const fetchPatterns = async () => {
    try {
      const res = await axios.get(
        "https://result-analyserr.onrender.com/api/testpatterns"
      );
      setPatterns(res.data);
    } catch (error) {
      console.error("Error fetching patterns:", error);
    }
  };

  useEffect(() => {
    fetchPatterns();
  }, []);
const handleAddPattern = async () => {
  if (!newPattern.trim()) return;

  try {
    const res = await axios.post("https://result-analyserr.onrender.com/api/testpatterns/add", {
      name: newPattern.trim(),
    });

    // The backend sends { pattern: { _id, name } }
    const addedPattern = res.data.pattern;

    // Update patterns list safely
    setPatterns((prev) => [...prev, addedPattern]);

    // Reset input and close box
    setNewPattern("");
    setShowInput(false);

    // Normalize testType and set it in form
    setFormData((prev) => ({
      ...prev,
      testType: addedPattern.name.toLowerCase(),
    }));
  } catch (err) {
    console.error("Error adding pattern:", err);
  }
};
  const columns = [
    { key: "totalMark", label: "Total Marks" },
    { key: "correctMark", label: "Positive Marks" },
    { key: "incorrectMark", label: "Negative Marks" },
    { key: "obtainedMark", label: "Obtained Marks" }
  ];
  const [formData, setFormData] = useState({
    testDate: "",
    studentCode: "",
    testType: "",
    subjectMarks: {
physics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
chemistry: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
biology: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
mathematics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
    },
    totalMarks: 0,
  });

  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };


const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prevData) => {
    let updatedSubjectMarks = { ...prevData.subjectMarks };

    if (name === "testType") {
      // normalize just for logic
      const normalized = value.toLowerCase().replace(/[^a-z]/g, "");

      if (["jeemains", "jeemainsparttest", "jeemainscumulativetest","crashcourse"].includes(normalized)
        || normalized.includes("jeemains") || normalized.includes("jee")) {
        updatedSubjectMarks = {
          physics: { ...updatedSubjectMarks.physics, totalMark: 100 },
          chemistry: { ...updatedSubjectMarks.chemistry, totalMark: 100 },
          mathematics: { ...updatedSubjectMarks.mathematics, totalMark: 100 },
          biology: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
        };
      } else if (["neet", "neetparttest", "neetmoderate", "neettough"].includes(normalized)
        || normalized.includes("neet")) {
        updatedSubjectMarks = {
          physics: { ...updatedSubjectMarks.physics, totalMark: 180 },
          chemistry: { ...updatedSubjectMarks.chemistry, totalMark: 180 },
          biology: { ...updatedSubjectMarks.biology, totalMark: 360 },
          mathematics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
        };
      } else {
        updatedSubjectMarks = {
          physics: { ...updatedSubjectMarks.physics, totalMark: null },
          chemistry: { ...updatedSubjectMarks.chemistry, totalMark: null },
          mathematics: { ...updatedSubjectMarks.mathematics, totalMark: null },
          biology: { ...updatedSubjectMarks.biology, totalMark: null },
        };
      }
    }

    return {
      ...prevData,
      [name]: value, // ✅ keep real value for dropdown
      subjectMarks: updatedSubjectMarks,
    };
  });
};

  const fetchStudentByCode = async (code) => {
    if (!code || code.length !== 5) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/studentByCode/${code}`
      );
      if (res.data) {
        setStudentInfo(res.data);
      } else {
        alert("❌ Failed to fetch student.");
        setStudentInfo(null);
      }
    } catch {
      setStudentInfo(null);
      alert("⚠️ Student not found for this Student code.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (formData.studentCode && formData.testDate && formData.testType) {
      fetchStudentByCode(formData.studentCode);
    }
  }, [formData.studentCode, formData.testDate, formData.testType]);

 
const handleSubjectChange = (subject, field, value) => {
  setFormData((prevData) => {
    const parsedValue = value === "" ? null : Number(value);

    const updatedSubject = {
      ...prevData.subjectMarks[subject],
      [field]: parsedValue,
    };

    if (field === "correctMark" || field === "incorrectMark") {
      updatedSubject.obtainedMark =
        (updatedSubject.correctMark || 0) - (updatedSubject.incorrectMark || 0);
    }

    const updatedSubjectMarks = {
      ...prevData.subjectMarks,
      [subject]: updatedSubject,
    };

    let totalMarks = 0;
    if (["neet", "neettough", "neetmoderate"].includes(prevData.testType)) {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.biology?.obtainedMark || 0);
    } else if (
      prevData.testType === "other" ||
      studentInfo?.batch?.toLowerCase() === "z"
    ) {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.mathematics?.obtainedMark || 0) +
        (updatedSubjectMarks.biology?.obtainedMark || 0);
    } else {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.mathematics?.obtainedMark || 0);
    }

    return {
      ...prevData,
      subjectMarks: updatedSubjectMarks,
      totalMarks,
    };
  });
};


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!studentInfo) {
//     alert("⚠️ Student details not found for this code.");
//     return;
//   }
//   setSubmitting(true);

//   let totalMarks = 0;
//   let maxMarks = 0;

//   // Physics + Chemistry always
// totalMarks += formData.subjectMarks.physics.obtainedMark || 0;
// totalMarks += formData.subjectMarks.chemistry.obtainedMark || 0;
// maxMarks += formData.subjectMarks.physics.totalMark || 0;
// maxMarks += formData.subjectMarks.chemistry.totalMark || 0;

//   // NEET types → Biology
//  // NEET
// if (["neet", "neettough", "neetparttest", "neetmoderate","crashcourseneet"].includes(formData.testType) ||
//   formData.testType?.toLowerCase().includes("neet")) 
//   {
//   totalMarks += formData.subjectMarks.biology.obtainedMark || 0;
//   maxMarks += formData.subjectMarks.biology.totalMark || 0;
// }
//   // "other" + Z batch → Math + Bio
// // Other + Z batch
// else if (formData.testType === "other" || studentInfo?.batch?.toLowerCase() === "z") {
//   totalMarks += formData.subjectMarks.mathematics.obtainedMark || 0;
//   totalMarks += formData.subjectMarks.biology.obtainedMark || 0;
//   maxMarks += formData.subjectMarks.mathematics.totalMark || 0;
//   maxMarks += formData.subjectMarks.biology.totalMark || 0;
// }
// // Default → Math
// else {
//   totalMarks += formData.subjectMarks.mathematics.obtainedMark || 0;
//   maxMarks += formData.subjectMarks.mathematics.totalMark || 0;
// }

//   const payload = {
//     studentCode: formData.studentCode,
//      testType: formData.testType
//     ?.toLowerCase()
//     .replace(/[^a-z]/g, ""), 
//     testDate: formData.testDate,
//     name: studentInfo.name,
//     fatherName: studentInfo.fatherName,
//     batch: studentInfo.batch,
//     subjectMarks: formData.subjectMarks,
//     totalMarks, // sum of obtained marks
//     maxMarks,   // sum of total marks
//   };

//   try {
//     await axios.post(
//       "https://result-analyserr.onrender.com/api/results",
//       payload
//     );
//     alert("✅ Result Saved Successfully!");
// //     setFormData({
// //       testDate: "",
// //       studentCode: "",
// //       testType: "",
// //       subjectMarks: {

// // physics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
// // chemistry: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
// // biology: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
// // mathematics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },

// //       },
// //       totalMarks: 0,
// //       maxMarks: 0,
// //     });

//   // ✅ Preserve testDate & testType, reset rest
//     setFormData((prev) => ({
//       ...prev,
//       studentCode: "",
//       subjectMarks: {
//         physics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
//         chemistry: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
//         biology: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
//         mathematics: { totalMark: null, correctMark: null, incorrectMark: null, obtainedMark: null },
//       },
//       totalMarks: 0,
//       maxMarks: 0,
//       // ✅ keep same date and type
//       testDate: prev.testDate,
//       testType: prev.testType,
//     }));
//     setStudentInfo(null);
//   } catch (err) {
//     if (err.response?.status === 409) {
//       alert("⚠️ Result already exists for this student, test type, and date.");
//     } else {
//       alert("❌ Something went wrong while saving.");
//     }
//   }
//   setSubmitting(false);
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!studentInfo) {
    alert("⚠️ Student details not found for this code.");
    return;
  }
  setSubmitting(true);

  let totalMarks = 0;
  let maxMarks = 0;

  // Physics + Chemistry always
  totalMarks += formData.subjectMarks.physics.obtainedMark || 0;
  totalMarks += formData.subjectMarks.chemistry.obtainedMark || 0;
  maxMarks += formData.subjectMarks.physics.totalMark || 0;
  maxMarks += formData.subjectMarks.chemistry.totalMark || 0;

  // NEET types → Biology
  if (
    ["neet", "neettough", "neetparttest", "neetmoderate", "crashcourseneet"].includes(
      formData.testType?.toLowerCase()
    ) ||
    formData.testType?.toLowerCase().includes("neet")
  ) {
    totalMarks += formData.subjectMarks.biology.obtainedMark || 0;
    maxMarks += formData.subjectMarks.biology.totalMark || 0;
  }
  // "other" + Z batch → Math + Bio
  else if (
    formData.testType === "other" ||
    studentInfo?.batch?.toLowerCase() === "z"
  ) {
    totalMarks += formData.subjectMarks.mathematics.obtainedMark || 0;
    totalMarks += formData.subjectMarks.biology.obtainedMark || 0;
    maxMarks += formData.subjectMarks.mathematics.totalMark || 0;
    maxMarks += formData.subjectMarks.biology.totalMark || 0;
  }
  // Default → Math
  else {
    totalMarks += formData.subjectMarks.mathematics.obtainedMark || 0;
    maxMarks += formData.subjectMarks.mathematics.totalMark || 0;
  }

  const payload = {
    studentCode: formData.studentCode,
    testType: formData.testType
      ?.toLowerCase()
      .replace(/[^a-z]/g, ""),
    testDate: formData.testDate,
    name: studentInfo.name,
    fatherName: studentInfo.fatherName,
    batch: studentInfo.batch,
    subjectMarks: formData.subjectMarks,
    totalMarks,
    maxMarks,
  };

  try {
    await axios.post(
      "https://result-analyserr.onrender.com/api/results",
      payload
    );
    alert("✅ Result Saved Successfully!");

    // ✅ Preserve testDate, testType, and totalMarks for each subject
    setFormData((prev) => ({
      ...prev,
      studentCode: "",
      subjectMarks: {
        physics: {
          ...prev.subjectMarks.physics,
          correctMark: null,
          incorrectMark: null,
          obtainedMark: null,
          // ✅ keep totalMark same
        },
        chemistry: {
          ...prev.subjectMarks.chemistry,
          correctMark: null,
          incorrectMark: null,
          obtainedMark: null,
        },
        biology: {
          ...prev.subjectMarks.biology,
          correctMark: null,
          incorrectMark: null,
          obtainedMark: null,
        },
        mathematics: {
          ...prev.subjectMarks.mathematics,
          correctMark: null,
          incorrectMark: null,
          obtainedMark: null,
        },
      },
      totalMarks: 0,
      maxMarks: 0,
      testDate: prev.testDate, // ✅ preserve
      testType: prev.testType, // ✅ preserve
    }));

    setStudentInfo(null);
  } catch (err) {
    if (err.response?.status === 409) {
      alert("⚠️ Result already exists for this student, test type, and date.");
    } else {
      alert("❌ Something went wrong while saving.");
    }
  }

  setSubmitting(false);
};


// Add this to your state declarations
const [deletePattern, setDeletePattern] = useState("");

  // ✅ Delete pattern
  const handleDeletePattern = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test pattern?"))
      return;

    try {
      await axios.delete(`https://result-analyserr.onrender.com/api/patterns/${id}`);
      alert("🗑️ Test Pattern deleted successfully!");
      fetchPatterns();
      setDeletePattern("");
      setShowDeleteBox(false);
    } catch (error) {
      console.error("Error deleting pattern:", error);
      alert("❌ Failed to delete pattern.");
    }
  };


  if (!isAuthorized) {
    return (
      <div className="set-auth-bg">
        <form
          className="set-auth-card"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <h2>🔐 Admin Access</h2>
          <input
            ref={passwordInputRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inputcl"
          />
          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="setdetails-bg">
    
      <div className="setdetails-card">
        <div className="setresult-header">📖 STUDENT RESULT PORTAL</div>
        <div className="setdetails-card-content">
        <form
          id="student-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const form = e.target.form;
              const index = Array.prototype.indexOf.call(form, e.target);
              if (index > -1 && index + 1 < form.elements.length) {
                e.preventDefault();
                form.elements[index + 1].focus();
              }
            }
          }}
        >
          <div className="flex-row">
            <div className="form-group">
              <label className="label-text">Test Date</label>
              <input
                type="date"
                name="testDate"
                className="inputcl"
                value={formData.testDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="label-text" >Student Code</label>
              <input
                type="text"
                name="studentCode"
                className="inputcl"
                placeholder="5-digit Code"
                value={formData.studentCode}
                onChange={handleChange}
                maxLength={5}
                required
                autoFocus
              />
            </div>
            
<div className="form-group">
  <label className="label-text">Test Pattern</label>

  {/* Main select dropdown */}
  <select
    name="testType"
    className="selectcl"
    value={formData.testType || ""}
    onChange={(e) => {
      const selectedValue = e.target.value;

      if (selectedValue === "add_new") {
        setShowInput(true);
        setShowDeleteBox(false); // hide delete box
        setFormData((prev) => ({ ...prev, testType: "" }));
      } else if (selectedValue === "delete") {
        setShowDeleteBox(true); // show delete section
        setShowInput(false); // hide add section
      } else {
        setShowDeleteBox(false);
        setShowInput(false);
        handleChange(e);
      }
    }}
  >
    <option value="">Select Pattern</option>
    {patterns.map((pattern) => (
      <option key={pattern._id} value={pattern.name.toLowerCase()}>
        {pattern.name}
      </option>
    ))}
    <option value="add_new">➕ Add New Test Pattern</option>
    <option value="delete">&#10060; Delete Test Pattern</option>
  </select>

  {/* ➕ Add new pattern input */}
  {showInput && (
    <div className="add-pattern-box">
      <input
        type="text"
        placeholder="Enter new test pattern"
        value={newPattern}
        onChange={(e) => setNewPattern(e.target.value)}
      />
      <button
        type="button"
        className="add-save-button"
        onClick={handleAddPattern}
      >
        Save
      </button>
      <button
        type="button"
        className="add-cancel-button"
        onClick={() => setShowInput(false)}
      >
        Cancel
      </button>
    </div>
  )}

  {/* 🗑️ Delete pattern section — only shown when "Delete" is selected */}
  {showDeleteBox && (
    <div className="delete-pattern-box">
      <label className="delete-label">Select Pattern to Delete</label>
      <select
        className="selectcl"
        value={deletePattern || ""}
        onChange={(e) => setDeletePattern(e.target.value)}
      >
        <option value="">Select Pattern</option>
        {patterns.map((pattern) => (
          <option key={pattern._id} value={pattern._id}>
            {pattern.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="delete-button"
        disabled={!deletePattern}
        onClick={() => handleDeletePattern(deletePattern)}
      >
       Delete
      </button>

      <button
        type="button"
        className="cancel-delete-button"
        onClick={() => setShowDeleteBox(false)}
      >
        Cancel
      </button>
    </div>
  )}
</div>



          </div>

          {loading && <p className="info-msg">Loading student details...</p>}

          {studentInfo && (
            <div className="student-info-card bounce-in">
              <div>
                <span className="icon user">&#128100;</span>
                <b>{studentInfo.name}</b>
              </div>
              <div>
                <span className="icon">&#128106;</span>
                {studentInfo.fatherName}
              </div>
              <div>
                <span className="icon">&#127891;</span>
                Batch: <b>{studentInfo.batch}</b>
              </div>
            </div>
          )}
<div className="subject-section">
  <table className="marks-table">
    <thead>
      <tr>
        <th>Subject</th>
        {columns.map((col) => (
          <th key={col.key}>{col.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {["physics", "chemistry"].map((subject) => (
        <tr key={subject}>
          <td className="subject-name">{subject.toUpperCase()}</td>
          {columns.map((col) => (
            <td key={col.key}>
              <input
                type="number"
                placeholder={col.label}
                value={
                  formData.subjectMarks[subject][col.key] === null ||
                  formData.subjectMarks[subject][col.key] === undefined
                    ? ""
                    : formData.subjectMarks[subject][col.key]
                }
                onChange={(e) =>
                  col.key !== "obtainedMark" &&
                  handleSubjectChange(subject, col.key, e.target.value)
                }
                className="marks-input"
                min={0}
                required={col.key !== "obtainedMark"}
                readOnly={col.key === "obtainedMark"}
              />
            </td>
          ))}
        </tr>
      ))}

      {/* {[
    "neet",
    "neetparttest",
    "neettough",
    "neetmoderate"].includes(formData.testType
    ?.toLowerCase()
    .replace(/[^a-z]/g, "")) ? (
        <tr>
          <td className="subject-name">BIOLOGY</td>
          {columns.map((col) => (
            <td key={col.key}>
              <input
                type="number"
                placeholder={col.label}
                value={
                  formData.subjectMarks.biology[col.key] === null ||
                  formData.subjectMarks.biology[col.key] === undefined
                    ? ""
                    : formData.subjectMarks.biology[col.key]
                }
                onChange={(e) =>
                  col.key !== "obtainedMark" &&
                  handleSubjectChange("biology", col.key, e.target.value)
                }
                className="marks-input"
                min={0}
                required={col.key !== "obtainedMark"}
                readOnly={col.key === "obtainedMark"}
              />
            </td>
          ))}
        </tr>
      )  */}
      {formData.testType &&
  (
    [
      "neet",
      "neetparttest",
      "neettough",
      "neetmoderate",
    ].includes(formData.testType?.toLowerCase().replace(/[^a-z]/g, "")) ||
    formData.testType.toLowerCase().includes("neet")
  ) ? (
    <tr>
      <td className="subject-name">BIOLOGY</td>
      {columns.map((col) => (
        <td key={col.key}>
          <input
            type="number"
            placeholder={col.label}
            value={
              formData.subjectMarks.biology[col.key] === null ||
              formData.subjectMarks.biology[col.key] === undefined
                ? ""
                : formData.subjectMarks.biology[col.key]
            }
            onChange={(e) =>
              col.key !== "obtainedMark" &&
              handleSubjectChange("biology", col.key, e.target.value)
            }
            className="marks-input"
            min={0}
            required={col.key !== "obtainedMark"}
            readOnly={col.key === "obtainedMark"}
          />
        </td>
      ))}
    </tr>
  ): formData.testType.toLowerCase() === "other" || formData.testType?.toLowerCase() === "quiz test"
      || studentInfo?.batch === "Z"  ? (
        ["mathematics", "biology"].map((subject) => (
          <tr key={subject}>
            <td className="subject-name">{subject.toUpperCase()}</td>
            {columns.map((col) => (
              <td key={col.key}>
                <input
                  type="number"
                  placeholder={col.label}
                  value={
                    formData.subjectMarks[subject][col.key] === null ||
                    formData.subjectMarks[subject][col.key] === undefined
                      ? ""
                      : formData.subjectMarks[subject][col.key]
                  }
                  onChange={(e) =>
                    col.key !== "obtainedMark" &&
                    handleSubjectChange(subject, col.key, e.target.value)
                  }
                  className="marks-input"
                  min={0}
                  required={col.key !== "obtainedMark"}
                  readOnly={col.key === "obtainedMark"}
                />
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td className="subject-name">MATHEMATICS</td>
          {columns.map((col) => (
            <td key={col.key}>
              <input
                type="number"
                placeholder={col.label}
                value={
                  formData.subjectMarks.mathematics[col.key] === null ||
                  formData.subjectMarks.mathematics[col.key] === undefined
                    ? ""
                    : formData.subjectMarks.mathematics[col.key]
                }
                onChange={(e) =>
                  col.key !== "obtainedMark" &&
                  handleSubjectChange("mathematics", col.key, e.target.value)
                }
                className="marks-input"
                min={0}
                required={col.key !== "obtainedMark"}
                readOnly={col.key === "obtainedMark"}
              />
            </td>
          ))}
        </tr>
      )}
    </tbody>
  </table>
</div>

       
          <button className="Resultbutton" type="submit" disabled={submitting}>
            <span className="btn-text">
              {submitting ? "Saving..." : "Save Result"}
            </span>
            <span className="btn-icon">➤</span>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SetDetails;
