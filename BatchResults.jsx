// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import { useNavigate } from "react-router-dom";

// const BatchResults = () => {
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [testDate, setTestDate] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const navigate = useNavigate();

//   const passwordInputRef = useRef(null);

//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       const response = await axios.get(
//         "https://result-analyserr.onrender.com/api/batches"
//       );
//       setBatches(response.data);
//     } catch (error) {
//       console.error("Error fetching batches:", error);
//     }
//   };

//   const fetchBatchResults = async () => {
//     if (!batch || !testType || !testDate) {
//       setError("Please select batch, test type and test date.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       // Sort by totalMarks descending
//       const sorted = response.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );
//       setResults(sorted);
//     } catch (err) {
//       setResults([]);
//       if (err.response && err.response.status === 404) {
//         setError(err.response.data.message || "No results found.");
//       } else {
//         setError("Something went wrong while fetching data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Determine subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";

//    if (!isAuthorized) {
//     return (
//       <div className="set-auth-bg">
//         <form
//           className="set-auth-card"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePasswordSubmit();
//           }}
//         >
//           <h2>🔐 Admin Access</h2>
//           <input
//             ref={passwordInputRef}
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="inputcl"
//           />
//           <button className="primary-btn" type="submit">
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="batch-results-container">
//       <div className="header-container">
//         <h1 className="header-title">Search Batch Results</h1>
//       </div>

//       <div className="filters-container">
//         {/* Batch Dropdown */}
//         <div className="filter-item">
//           <select
//             className="filter-select"
//             name="batch"
//             onChange={(e) => setBatch(e.target.value)}
//             value={batch}
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b._id} value={b.name}>
//                 {b.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Test Type Dropdown */}
//         <div className="filter-item">
//           <select
//             className="filter-select"
//             onChange={(e) => setTestType(e.target.value)}
//             value={testType}
//           >
//                 <option value="jeemains">JEE Mains</option>
//                 <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                 <option value="jeemainscumulativetest">JEE Mains-Cumulative Test</option>
//                 <option value="jeeadvanced">JEE Advanced</option>
//                 <option value="neet">NEET</option>
//                 <option value="neetparttest">NEET Part Test</option>
//                 <option value="neettough">NEET Tough</option>
//                 <option value="neetmoderate">NEET Moderate</option>
//                 <option value="topictest">Topic Test</option>
//                 <option value="quiztest">Quiz Test</option>
//                 <option value="other">Other</option>
//           </select>
//         </div>

//         {/* Date Input */}
//         <div className="filter-item">
//           <input
//             type="date"
//             className="filter-input"
//             value={testDate}
//             onChange={(e) => setTestDate(e.target.value)}
//           />
//         </div>

//         {/* Search Button */}
//         <div className="filter-item">
//           <button className="filter-button" onClick={fetchBatchResults}>
//             Search
//           </button>
//         </div>
      
//       </div>

//       {error && <p className="error-message">{error}</p>}
//       {loading && (
//         <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
//           Searching...
//         </p>
//       )}

//       {results.length > 0 ? (
//         <table className="results-table">
//           <thead>
//             <tr>
//               <th>Rank</th>
//               <th>Name</th>
//               <th>Father's Name</th>
//               <th>Student Code</th>
//               <th>Batch</th>
//               <th>Test Type</th>
//               <th>Physics (Correct)</th>
//               <th>Physics (Incorrect)</th>
//               <th>Physics (Total)</th>
//               <th>Chemistry (Correct)</th>
//               <th>Chemistry (Incorrect)</th>
//               <th>Chemistry (Total)</th>
//               {isNeetBatch && (
//                 <>
//                   <th>Biology (Correct)</th>
//                   <th>Biology (Incorrect)</th>
//                   <th>Biology (Total)</th>
//                 </>
//               )}
//               {isZBatchOther && (
//                 <>
//                   <th>Mathematics (Correct)</th>
//                   <th>Mathematics (Incorrect)</th>
//                   <th>Mathematics (Total)</th>
//                   <th>Biology (Correct)</th>
//                   <th>Biology (Incorrect)</th>
//                   <th>Biology (Total)</th>
//                 </>
//               )}
//               {!isNeetBatch && !isZBatchOther && (
//                 <>
//                   <th>Mathematics (Correct)</th>
//                   <th>Mathematics (Incorrect)</th>
//                   <th>Mathematics (Total)</th>
//                 </>
//               )}
//               <th>Total Marks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(() => {
//               let rankMap = {};
//               let rankCounter = 1;

//               results.forEach((r) => {
//                 if (!(r.totalMarks in rankMap)) {
//                   rankMap[r.totalMarks] = rankCounter++;
//                 }
//               });

//               return results.map((result, index) => {
//                 const rank = rankMap[result.totalMarks];

//                 return (
//                   <tr key={index}>
//                     <td>
//                       {rank === 1
//                         ? "🥇"
//                         : rank === 2
//                         ? "🥈"
//                         : rank === 3
//                         ? "🥉"
//                         : rank}
//                     </td>
//                     <td>{result.name}</td>
//                     <td>{result.fatherName}</td>
//                     <td className="code-cell">{result.studentCode}</td>
//                     <td>{result.batch}</td>
//                     <td>{result.testType}</td>
//                     <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>

//                     {isNeetBatch && (
//                       <>
//                         <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     {isZBatchOther && (
//                       <>
//                         <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     {!isNeetBatch && !isZBatchOther && (
//                       <>
//                         <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     <td className="marks-cell">{result.totalMarks ?? "-"}</td>
//                   </tr>
//                 );
//               });
//             })()}
//           </tbody>
//         </table>
//       ) : (
//         <p className="ptag">No results found.</p>
//       )}
//     </div>
//   );
// };

// export default BatchResults;


// updated working
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import { FaGreaterThan } from "react-icons/fa6";

// const BatchResults = () => {
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [tests, setTests] = useState([]); // store available test dates
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [step, setStep] = useState(1);

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       const res = await axios.get(
//         "https://result-analyserr.onrender.com/api/batches"
//       );
//       setBatches(res.data);
//     } catch (err) {
//       console.error("Error fetching batches", err);
//     }
//   };

//   // 🔹 Step 1 → fetch test dates for batch & testType
//   const handleBatchTypeSubmit = async (e) => {
//     e.preventDefault();
//     if (!batch || !testType) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `http://result-analyserr.onrender.com/api/testdates?batch=${batch}&testType=${testType}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No test dates found for this selection.");
//         setTests([]);
//         return;
//       }

//       setTests(res.data);
//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching test dates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Step 2 → fetch results for selected test
//   const handleViewResult = async (testDate) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No results found for this test.");
//         setResults([]);
//         return;
//       }

//       // sort by marks
//       const sorted = res.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );

//       setResults(sorted);
//       setSelectedTest({ testDate });
//       setStep(3);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";

//   return (
//     <div className="viewresult-bg">
//       <div className="viewresult-container">
//         {/* 🔹 STEP 1 */}
//         {step === 1 && (
//           <div className="step1-container">
//             <div className="viewresult-card">
//               <div className="viewresult-header">
//                 Select Batch & Test Type To View Results
//               </div>

//               <form onSubmit={handleBatchTypeSubmit} className="viewresult-form">
//                 <label className="form-label">Batch</label>
//                 <select
//                   value={batch}
//                   onChange={(e) => setBatch(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Batch</option>
//                   {batches.map((b) => (
//                     <option key={b._id} value={b.name}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="form-label">Test Type</label>
//                 <select
//                   value={testType}
//                   onChange={(e) => setTestType(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Test Type</option>
//                   <option value="jeemains">JEE Mains</option>
//                   <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                   <option value="jeemainscumulativetest">
//                     JEE Mains-Cumulative Test
//                   </option>
//                   <option value="jeeadvanced">JEE Advanced</option>
//                   <option value="neet">NEET</option>
//                   <option value="neetparttest">NEET Part Test</option>
//                   <option value="neettough">NEET Tough</option>
//                   <option value="neetmoderate">NEET Moderate</option>
//                   <option value="topictest">Topic Test</option>
//                   <option value="quiztest">Quiz Test</option>
//                   <option value="other">Other</option>
//                 </select>

//                 <button type="submit">
//                   <span>{loading ? "Loading..." : "Next"}</span>
//                   <FaGreaterThan className="arrow" />
//                 </button>
//               </form>
//               {error && <p className="error-message">{error}</p>}
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 2 */}
//         {step === 2 && (
//           <div className="step2-container">
//             <div className="step2-card">
//               <div className="step2-header">
//                 Click on Test Date To View Result
//               </div>

//               <table className="step2-table">
//                 <thead>
//                   <tr>
//                     <th>Test Date</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tests.map((t, idx) => (
//                     <tr key={idx}>
//                       <td>{t}</td>
//                       <td>
//                         <button
//                           className="step2-btn"
//                           onClick={() => handleViewResult(t)}
//                         >
//                           View Result <span className="arrow">➜</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <button
//                 className="secondary-btn"
//                 onClick={() => {
//                   setStep(1);
//                   setTests([]);
//                 }}
//               >
//                 ⬅ Back
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 3 */}
//         {step === 3 && (
//           <div className="step3-container">
//             <div className="step3-card">
//               <div className="step3-header">
//                 Results of {batch} ({testType}) - {selectedTest?.testDate}
//                 <button
//                   className="back-btn"
//                   onClick={() => {
//                     setStep(2);
//                     setResults([]);
//                   }}
//                 >
//                   ⬅ Back
//                 </button>
//               </div>

//               {/* ✅ Results Table */}
//               <div className="result-table">
//                 {results.length > 0 ? (
//                   <table className="results-table">
//                     <thead>
//                       <tr>
//                         <th>Rank</th>
//                         <th>Name</th>
//                         <th>Father's Name</th>
//                         <th>Student Code</th>
//                         <th>Batch</th>
//                         <th>Test Type</th>
//                         <th>Physics (Correct)</th>
//                         <th>Physics (Incorrect)</th>
//                         <th>Physics (Total)</th>
//                         <th>Chemistry (Correct)</th>
//                         <th>Chemistry (Incorrect)</th>
//                         <th>Chemistry (Total)</th>

//                         {isNeetBatch && (
//                           <>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {!isNeetBatch && !isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                           </>
//                         )}

//                         <th>Total Marks</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(() => {
//                         let rankMap = {};
//                         let rankCounter = 1;

//                         results.forEach((r) => {
//                           if (!(r.totalMarks in rankMap)) {
//                             rankMap[r.totalMarks] = rankCounter++;
//                           }
//                         });

//                         return results.map((result, index) => {
//                           const rank = rankMap[result.totalMarks];
//                           return (
//                             <tr key={index}>
//                               <td>
//                                 {rank === 1
//                                   ? "🥇"
//                                   : rank === 2
//                                   ? "🥈"
//                                   : rank === 3
//                                   ? "🥉"
//                                   : rank}
//                               </td>
//                               <td>{result.name}</td>
//                               <td>{result.fatherName}</td>
//                               <td className="code-cell">
//                                 {result.studentCode}
//                               </td>
//                               <td>{result.batch}</td>
//                               <td>{result.testType}</td>
//                               <td>
//                                 {result.subjectMarks?.physics?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.totalMark ?? "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.totalMark ??
//                                   "-"}
//                               </td>

//                               {isNeetBatch && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {!isNeetBatch && !isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                 </>
//                               )}

//                               <td className="marks-cell">
//                                 {result.totalMarks ?? "-"}
//                               </td>
//                             </tr>
//                           );
//                         });
//                       })()}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="ptag">No results found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchResults;


// import React, { useState, useEffect,useRef} from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import { FaArrowRight } from "react-icons/fa6";


// const BatchResults = () => {
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [tests, setTests] = useState([]); // store available test dates
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [step, setStep] = useState(1);
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const passwordInputRef = useRef(null);
//   useEffect(() => {
    
//   const fetchBatches = async () => {
//     try {
//       const res = await axios.get(
//         "https://result-analyserr.onrender.com/api/batches"
//       );
//       setBatches(res.data);
//     } catch (err) {
//       console.error("Error fetching batches", err);
//     }
//   };
//     fetchBatches();
//   }, []);


//   // 🔹 Step 1 → fetch test dates for batch & testType
//   const handleBatchTypeSubmit = async (e) => {
//     e.preventDefault();
//     if (!batch || !testType) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/testdates?batch=${batch}&testType=${testType}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No test dates found for this selection.");
//         setTests([]);
//         return;
//       }

//       setTests(res.data);
     
//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching test dates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Step 2 → fetch results for selected test
//   const handleViewResult = async (testDate) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No results found for this test.");
//         setResults([]);
//         return;
//       }

//       // sort by marks
//       const sorted = res.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );

//       setResults(sorted);
//       setSelectedTest({ testDate });
//       setStep(3);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";
//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };
//   if (!isAuthorized) {
//     return (
//       <div className="set-auth-bg">
//         <form
//           className="set-auth-card"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePasswordSubmit();
//           }}
//         >
//           <h2>🔐 Admin Access</h2>
//           <input
//             ref={passwordInputRef}
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="inputcl"
//           />
//           <button className="primary-btn" type="submit">
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }
//   return (
//     <div className="viewresult-bg-batch">
//       <div className="viewresult-container-batch">
//         {/* 🔹 STEP 1 */}
//         {step === 1 && (
//           <div className="step1-container-batch">
//             <div className="viewresult-card-batch">
//               <div className="viewresult-header-batch">
//                 Select Batch & Test Type To View Results
//               </div>

//               <form
//                 onSubmit={handleBatchTypeSubmit}
//                 className="viewresult-form-batch"
//               >
//                 <label className="form-label-batch">Batch</label>
//                 <select
//                   value={batch}
//                   onChange={(e) => setBatch(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Batch</option>
//                   {batches.map((b) => (
//                     <option key={b._id} value={b.name}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="form-label-batch">Test Type</label>
//                 <select
//                   value={testType}
//                   onChange={(e) => setTestType(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Test Type</option>
//                   <option value="jeemains">JEE Mains</option>
//                   <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                   <option value="jeemainscumulativetest">
//                     JEE Mains-Cumulative Test
//                   </option>
//                   <option value="jeeadvanced">JEE Advanced</option>
//                   <option value="neet">NEET</option>
//                   <option value="neetparttest">NEET Part Test</option>
//                   <option value="neettough">NEET Tough</option>
//                   <option value="neetmoderate">NEET Moderate</option>
//                   <option value="topictest">Topic Test</option>
//                   <option value="quiztest">Quiz Test</option>
//                   <option value="other">Other</option>
//                 </select>

//                 <button  className= "resbtn" type="submit">
//                   <span className="viewresultbatchbtn">{loading ? "Loading..." : "View Result"}</span>
//                   {/* <FaGreaterThan className="arrow-batch" /> */}
//                    <FaArrowRight className="arrow-batch"/>
//                 </button>
//               </form>
//               {error && <p className="error-message-batch">{error}</p>}
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 2 */}
//         {step === 2 && (
//           <div className="step2-container-batch">
//             <div className="step2-card-batch">
//               <div className="step2-header-batch">
//                 Click on Test Date To View Result
//                 <button
//                 className="secondary-btn-batch"
//                 onClick={() => {
//                   setStep(1);
//                   setTests([]);
//                 }}
//               >
//                 ⬅ Back
//               </button>
//               </div>

//               <table className="step2-table-batch">
//                 <thead>
//                   <tr>
//                     <th>Test Date</th>
//                     <th>View Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tests.map((t, idx) => (
//                     <tr key={idx}>
//                       <td>{t}</td>
//                       <td>
//                         <button
//                           className="step2-btn-batch"
//                           onClick={() => handleViewResult(t)}
//                         >
//                           View Result <span className="arrow-batch">➜</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 3 */}
//         {step === 3 && (
//           <div className="step3-container-batch">
//             <div className="step3-card-batch">
//               <div className="step3-header-batch">
//                 Results of {batch} ({testType}) - {selectedTest?.testDate}
//                 <button
//                   className="back-btn-batch"
//                   onClick={() => {
//                     setStep(2);
//                     setResults([]);
//                   }}
//                 >
//                   ⬅ Back
//                 </button>
//               </div>

//               {/* ✅ Results Table */}
//               <div className="result-table-batch">
//                 {results.length > 0 ? (
//                   <table className="results-table-batch">
//                     <thead>
//                       <tr>
//                         <th>Rank</th>
//                         <th>Name</th>
//                         <th>Father's Name</th>
//                         <th>Student Code</th>
//                         <th>Batch</th>
//                         <th>Test Type</th>
//                         <th>Physics (Correct)</th>
//                         <th>Physics (Incorrect)</th>
//                         <th>Physics (Total)</th>
//                         <th>Chemistry (Correct)</th>
//                         <th>Chemistry (Incorrect)</th>
//                         <th>Chemistry (Total)</th>

//                         {isNeetBatch && (
//                           <>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {!isNeetBatch && !isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                           </>
//                         )}

//                         <th>Total Marks</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(() => {
//                         let rankMap = {};
//                         let rankCounter = 1;

//                         results.forEach((r) => {
//                           if (!(r.totalMarks in rankMap)) {
//                             rankMap[r.totalMarks] = rankCounter++;
//                           }
//                         });

//                         return results.map((result, index) => {
//                           const rank = rankMap[result.totalMarks];
//                           return (
//                             <tr key={index}>
//                               <td>
//                                 {rank === 1
//                                   ? "🥇"
//                                   : rank === 2
//                                   ? "🥈"
//                                   : rank === 3
//                                   ? "🥉"
//                                   : rank}
//                               </td>
//                               <td>{result.name}</td>
//                               <td>{result.fatherName}</td>
//                               <td className="code-cell-batch">
//                                 {result.studentCode}
//                               </td>
//                               <td>{result.batch}</td>
//                               <td>{result.testType}</td>
//                               <td>
//                                 {result.subjectMarks?.physics?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.totalMark ?? "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.totalMark ??
//                                   "-"}
//                               </td>

//                               {isNeetBatch && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {!isNeetBatch && !isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                 </>
//                               )}

//                               <td className="marks-cell-batch">
//                                 {result.totalMarks ?? "-"}
//                               </td>
//                             </tr>
//                           );
//                         });
//                       })()}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="ptag-batch">No results found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchResults;





// new working code
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";

// import { FaRegTrashCan, FaDownload } from "react-icons/fa6";
// import { FaArrowRight } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// const BatchResults = () => {
//   const navigate = useNavigate();
//   const [batch, setBatch] = useState("");
//   const [tests, setTests] = useState([]); // store available test dates with testType
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [step, setStep] = useState(1);
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const passwordInputRef = useRef(null);

//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await axios.get(
//           "https://result-analyserr.onrender.com/api/batches"
//         );
//         setBatches(res.data);
//       } catch (err) {
//         console.error("Error fetching batches", err);
//       }
//     };
//     fetchBatches();
//   }, []);

//   // 🔹 Step 1 → fetch test dates for batch only
//   const handleBatchTypeSubmit = async (e) => {
//     e.preventDefault();
//     if (!batch) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/testdates?batch=${batch}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No test dates found for this batch.");
//         setTests([]);
//         return;
//       }

//       setTests(res.data); // Expecting [{ testDate, testType }]
//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching test dates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Step 2 → fetch results for selected test
//   const handleViewResult = async (testDate, testType) => {
  
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No results found for this test.");
//         setResults([]);
//         return;
//       }

//       // sort by marks
//       const sorted = res.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );

//       setResults(sorted);
//       console.log(sorted,"results are here");
//       setSelectedTest({ testDate, testType });
//       setStep(3);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching results.");
//     } finally {
//       setLoading(false);
//     }
//   };
// const handleDelete = async (id) => {
//   if (!window.confirm("Are you sure you want to delete this result?")) return;

//   try {
//     await axios.delete(`https://result-analyserr.onrender.com/api/results/${id}`);
//     // remove from UI immediately
//     setResults((prev) => prev.filter((r) => r._id !== id));
//   } catch (err) {
//     console.error("Error deleting result:", err);
//     alert("Failed to delete result");
//   }
// };
//   // 🔹 Subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";

//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };
// const handleDownloadPDF = () => {
//   const doc = new jsPDF("landscape");

//   doc.setFontSize(14);
//   doc.text(
//     `Results of ${batch} (${selectedTest?.testType}) - ${selectedTest?.testDate}`,
//     14,
//     15
//   );

//   const tableColumn = [
//     "Rank",
//     "Name",
//     "Father's Name",
//     "Student Code",
//     "Physics (C)",
//     "Physics (I)",
//     "Physics (T)",
//     "Chemistry (C)",
//     "Chemistry (I)",
//     "Chemistry (T)",
//   ];

//   if (isNeetBatch) {
//     tableColumn.push("Biology (C)", "Biology (I)", "Biology (T)");
//   } else if (isZBatchOther) {
//     tableColumn.push(
//       "Math (C)",
//       "Math (I)",
//       "Math (T)",
//       "Biology (C)",
//       "Biology (I)",
//       "Biology (T)"
//     );
//   } else {
//     tableColumn.push("Math (C)", "Math (I)", "Math (T)");
//   }

//   tableColumn.push("Total Marks");

//   const rankMap = {};
//   let rankCounter = 1;
//   results.forEach((r) => {
//     if (!(r.totalMarks in rankMap)) {
//       rankMap[r.totalMarks] = rankCounter++;
//     }
//   });

//   const tableRows = results.map((result) => {
//     const rank = rankMap[result.totalMarks];
//     const rankSymbol =
//       rank === 1 ? "1" : rank === 2 ? "2" : rank === 3 ? "3" : rank;

//     const row = [
//       rankSymbol,
//       result.name,
//       result.fatherName,
//       result.studentCode,
//       result.subjectMarks?.physics?.correctMark ?? "-",
//       result.subjectMarks?.physics?.incorrectMark ?? "-",
//       result.subjectMarks?.physics?.totalMark ?? "-",
//       result.subjectMarks?.chemistry?.correctMark ?? "-",
//       result.subjectMarks?.chemistry?.incorrectMark ?? "-",
//       result.subjectMarks?.chemistry?.totalMark ?? "-",
//     ];

//     if (isNeetBatch) {
//       row.push(
//         result.subjectMarks?.biology?.correctMark ?? "-",
//         result.subjectMarks?.biology?.incorrectMark ?? "-",
//         result.subjectMarks?.biology?.totalMark ?? "-"
//       );
//     } else if (isZBatchOther) {
//       row.push(
//         result.subjectMarks?.mathematics?.correctMark ?? "-",
//         result.subjectMarks?.mathematics?.incorrectMark ?? "-",
//         result.subjectMarks?.mathematics?.totalMark ?? "-",
//         result.subjectMarks?.biology?.correctMark ?? "-",
//         result.subjectMarks?.biology?.incorrectMark ?? "-",
//         result.subjectMarks?.biology?.totalMark ?? "-"
//       );
//     } else {
//       row.push(
//         result.subjectMarks?.mathematics?.correctMark ?? "-",
//         result.subjectMarks?.mathematics?.incorrectMark ?? "-",
//         result.subjectMarks?.mathematics?.totalMark ?? "-"
//       );
//     }

//     row.push(result.totalMarks ?? "-");

//     return row;
//   });

//   autoTable(doc, {
//     head: [tableColumn],
//     body: tableRows,
//     startY: 25,
//     styles: { fontSize: 9 },
//     headStyles: { fillColor: [0, 102, 204] },
//   });

//   doc.save(`Results_${batch}_${selectedTest?.testDate}.pdf`);
// };



//   if (!isAuthorized) {
//     return (
//       <div className="set-auth-bg">
//         <form
//           className="set-auth-card"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePasswordSubmit();
//           }}
//         >
//           <h2>🔐 Admin Access</h2>
//           <input
//             ref={passwordInputRef}
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="inputcl"
//           />
//           <button className="primary-btn" type="submit">
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="viewresult-bg-batch">
//       <div className="viewresult-container-batch">
//         {/* 🔹 STEP 1 */}
//         {step === 1 && (
//           <div className="step1-container-batch">
//             <div className="viewresult-card-batch">
//               <div className="viewresult-header-batch">
//                 Select Batch To View Results
//                 <button className="Add-batch" onClick={() => navigate("/batch-management")}>Add Batch</button>
//               </div>

//               <form
//                 onSubmit={handleBatchTypeSubmit}
//                 className="viewresult-form-batch"
//               >
//                 <label className="form-label-batch">Batch</label>
//                 <select
//                   value={batch}
//                   onChange={(e) => setBatch(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Batch</option>
//                   {batches.map((b) => (
//                     <option key={b._id} value={b.name}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>

//                 <button className="resbtn" type="submit">
//                   <span className="viewresultbatchbtn">
//                     {loading ? "Loading..." : "View Result"}
//                   </span>
//                   <FaArrowRight className="arrow-batch" />
//                 </button>
//               </form>
//               {error && <p className="error-message-batch">{error}</p>}
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 2 */}
//         {step === 2 && (
//           <div className="step2-container-batch">
//             <div className="step2-card-batch">
//               <div className="step2-header-batch">
//                 Click on Test Date To View Result
//                 <button
//                   className="secondary-btn-batch"
//                   onClick={() => {
//                     setStep(1);
//                     setTests([]);
//                   }}
//                 >
//                   ⬅ Back
//                 </button>
//               </div>

//               <table className="step2-table-batch">
//                 <thead>
//                   <tr>
//                     <th>Test Date</th>
//                     <th>Test Pattern</th>
//                     <th>View Result</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tests.map((t, idx) => (
//                     <tr key={idx}>
//                       <td>{t.testDate}</td>
//                       <td>{t.testType}</td>
//                       <td>
//                         <button
//                           className="step2-btn-batch"
//                           onClick={() => handleViewResult(t.testDate, t.testType)}
//                         >
//                           View Result <span className="arrow-batch">➜</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 3 */}
//         {step === 3 && (
//           <div className="step3-container-batch">
//             <div className="step3-card-batch">
//               <div className="step3-header-batch">
//                 Results of {batch} ({selectedTest?.testType}) -{" "}
//                 {selectedTest?.testDate}
//                 <button
//                   className="back-btn-batch"
//                   onClick={() => {
//                     setStep(2);
//                     setResults([]);
//                   }}
//                 >
//                   ⬅ Back
//                 </button>
//                  <button className="download-btn-batch" onClick={handleDownloadPDF}>
//       <FaDownload /> Download PDF
//     </button>
//               </div>
//               {/* <div className="step3-header-batch">
//   Results of {batch} ({selectedTest?.testType}) - {selectedTest?.testDate}
//   <div style={{ display: "flex", gap: "1px" }}>
//     <button
//       className="back-btn-batch"
//       onClick={() => {
//         setStep(2);
//         setResults([]);
//       }}
//     >
//       ⬅ Back
//     </button>

//     <button className="download-btn-batch" onClick={handleDownloadPDF}>
//       <FaDownload /> Download PDF
//     </button>
//   </div>
// </div> */}

//               {/* ✅ Results Table */}
//               <div className="result-table-batch">
//                 {results.length > 0 ? (
//                   <table className="results-table-batch">
//                     <thead>
//                       <tr>
//                         <th>Rank</th>
//                         <th>Name</th>
//                         <th>Father's Name</th>
//                         <th>Student Code</th>              
//                         <th>Physics (Correct)</th>
//                         <th>Physics (Incorrect)</th>
//                         <th>Physics (Total)</th>
//                         <th>Chemistry (Correct)</th>
//                         <th>Chemistry (Incorrect)</th>
//                         <th>Chemistry (Total)</th>
//                         {isNeetBatch && (
//                           <>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}
//                         {isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}
//                         {!isNeetBatch && !isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                           </>
//                         )}
//                         <th>Total Marks</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(() => {
//                         let rankMap = {};
//                         let rankCounter = 1;
//                         results.forEach((r) => {
//                           if (!(r.totalMarks in rankMap)) {
//                             rankMap[r.totalMarks] = rankCounter++;
//                           }
//                         });
//                         return results.map((result, index) => {
//                           const rank = rankMap[result.totalMarks];
//                           return (
//                             <tr key={index}>
//                               <td>
//                                 {rank === 1
//                                   ? "🥇"
//                                   : rank === 2
//                                   ? "🥈"
//                                   : rank === 3
//                                   ? "🥉"
//                                   : rank}
//                               </td>
//                               <td>{result.name}</td>
//                               <td>{result.fatherName}</td>
//                               <td className="code-cell-batch">
//                                 {result.studentCode}
//                               </td>

//                               <td>
//                                 {result.subjectMarks?.physics?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.totalMark ?? "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.totalMark ??
//                                   "-"}
//                               </td>
//                               {isNeetBatch && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}
//                               {isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}
//                               {!isNeetBatch && !isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                 </>
//                               )}
//                               <td className="marks-cell-batch">
//                                 {result.totalMarks ?? "-"}
//                               </td>
//                               <td>
//   <button
//     className="dlete-btn-batch"
//     onClick={() => handleDelete(result._id)}
//   >
//     <FaRegTrashCan />
//   </button>
// </td>

//                             </tr>
//                           );
//                         });
//                       })()}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="ptag-batch">No results found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchResults;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/BatchResults.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { FaRegTrashCan, FaDownload } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BatchResults = () => {
  const navigate = useNavigate();
  const [batch, setBatch] = useState("");
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get(
          "https://result-analyserr.onrender.com/api/batches"
        );
        setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batches", err);
      }
    };
    fetchBatches();
  }, []);

  const handleBatchTypeSubmit = async (e) => {
    e.preventDefault();
    if (!batch) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/testdates?batch=${batch}`
      );
      if (!res.data || res.data.length === 0) {
        setError("No test dates found for this batch.");
        setTests([]);
        return;
      }
      setTests(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching test dates.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (testDate, testType) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
      );
      if (!res.data || res.data.length === 0) {
        setError("No results found for this test.");
        setResults([]);
        return;
      }
      const sorted = res.data.sort(
        (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
      );
      setResults(sorted);
      setSelectedTest({ testDate, testType });
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching results.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    try {
      await axios.delete(`https://result-analyserr.onrender.com/api/results/${id}`);
      setResults((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting result:", err);
      alert("Failed to delete result");
    }
  };

  // const handleEditClick = (result) => {
  //   setEditingId(result._id);
  //   setEditForm({
  //     name: result.name,
  //     fatherName: result.fatherName,
  //     studentCode: result.studentCode,
  //     physics: {
  //       correctMark: result.subjectMarks?.physics?.correctMark || 0,
  //       incorrectMark: result.subjectMarks?.physics?.incorrectMark || 0,
  //       totalMark: result.subjectMarks?.physics?.totalMark || 0,
  //     },
  //     chemistry: {
  //       correctMark: result.subjectMarks?.chemistry?.correctMark || 0,
  //       incorrectMark: result.subjectMarks?.chemistry?.incorrectMark || 0,
  //       totalMark: result.subjectMarks?.chemistry?.totalMark || 0,
  //     },
  //     mathematics: {
  //       correctMark: result.subjectMarks?.mathematics?.correctMark || 0,
  //       incorrectMark: result.subjectMarks?.mathematics?.incorrectMark || 0,
  //       totalMark: result.subjectMarks?.mathematics?.totalMark || 0,
  //     },
  //     biology: {
  //       correctMark: result.subjectMarks?.biology?.correctMark || 0,
  //       incorrectMark: result.subjectMarks?.biology?.incorrectMark || 0,
  //       totalMark: result.subjectMarks?.biology?.totalMark || 0,
  //     },
  //     totalMarks: result.totalMarks || 0,
  //   });
  // };

const handleEditClick = (result) => {
  setEditingId(result._id);

  const getSubjectData = (sub) => ({
    correctMark: sub?.correctMark ?? 0,
    incorrectMark: sub?.incorrectMark ?? 0,
    totalMark: sub?.totalMark ?? 0,
    obtainedMark: sub?.obtainedMark,   // load if exists
  });

  setEditForm({
    name: result.name,
    fatherName: result.fatherName,
    studentCode: result.studentCode,

    physics: getSubjectData(result.subjectMarks?.physics),
    chemistry: getSubjectData(result.subjectMarks?.chemistry),
    mathematics: getSubjectData(result.subjectMarks?.mathematics),
    biology: getSubjectData(result.subjectMarks?.biology),

    totalMarks: result.totalMarks ?? 0,
  });
};

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

//  const handleEditSave = async (id) => {
//   try {
//     // Build subjectMarks only for those actually present for the current row
//     let subjectMarks = {};
//     if (editForm.physics) subjectMarks.physics = editForm.physics;
//     if (editForm.chemistry) subjectMarks.chemistry = editForm.chemistry;

//     // Only include mathematics if present for this batch/test
//     if (
//       isZBatchOther ||                      // Math for Z batch "other"
//       (!isNeetBatch && !isZBatchOther)      // Math for regular batches (not NEET)
//     ) {
//       if (editForm.mathematics) subjectMarks.mathematics = editForm.mathematics;
//     }

//     // Only include biology for NEET batches or Z batch "other"
//     if (isNeetBatch || isZBatchOther) {
//       if (editForm.biology) subjectMarks.biology = editForm.biology;
//     }

//     const updatedData = {
//       name: editForm.name,
//       fatherName: editForm.fatherName,
//       studentCode: editForm.studentCode,
//       subjectMarks,          // only included subjects per batch/test
//       totalMarks: editForm.totalMarks,
//     };
//     const res = await axios.put(
//       `https://result-analyserr.onrender.com/api/results/${id}`,
//       updatedData
//     );
//     setResults((prev) =>
//       prev.map((r) => (r._id === id ? res.data : r)).sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       )
//     );
//     setEditingId(null);
//     setEditForm({});
//   } catch (err) {
//     console.error("Error updating result:", err);
//     alert("Failed to update result");
//   }
// };

const handleEditSave = async (id) => {
  try {
    // find current result (to preserve other fields if needed)
    const current = results.find(r => r._id === id) || {};

    // helper to build a subject object with numeric values and obtainedMark
  const buildSubject = (sub) => {
  if (!sub) return undefined;

  const correct = Number(sub.correctMark) || 0;
  const incorrect = Number(sub.incorrectMark) || 0;

  return {
    correctMark: correct,
    incorrectMark: incorrect,
    totalMark: Number(sub.totalMark) || 0,
    obtainedMark: correct - incorrect,   // always recomputed
  };
};


    let subjectMarks = {};
    if (editForm.physics) subjectMarks.physics = buildSubject(editForm.physics);
    if (editForm.chemistry) subjectMarks.chemistry = buildSubject(editForm.chemistry);

    if (isZBatchOther || (!isNeetBatch && !isZBatchOther)) {
      if (editForm.mathematics) subjectMarks.mathematics = buildSubject(editForm.mathematics);
    }

    if (isNeetBatch || isZBatchOther) {
      if (editForm.biology) subjectMarks.biology = buildSubject(editForm.biology);
    }

    const updatedData = {
      name: editForm.name,
      fatherName: editForm.fatherName,
      studentCode: editForm.studentCode,
      subjectMarks,
      totalMarks: Number(editForm.totalMarks) || 0,
    };

    const res = await axios.put(
      `https://result-analyserr.onrender.com/api/results/${id}`,
      updatedData
    );

    setResults((prev) =>
      prev.map((r) => (r._id === id ? res.data : r)).sort(
        (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
      )
    );

    setEditingId(null);
    setEditForm({});
  } catch (err) {
    console.error("Error updating result:", err);
    alert("Failed to update result");
  }
};

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSubjectChange = (subject, field, value) => {
  setEditForm((prev) => {
    const subData = prev[subject] || {};

    // Decide which field to update:
    const keyToUpdate =
      field === "autoMark"
        ? (subData.obtainedMark !== undefined ? "obtainedMark" : "totalMark")
        : field;

    return {
      ...prev,
      [subject]: {
        ...subData,
        [keyToUpdate]: Number(value),
      },
    };
  });
};


  // const isNeetBatch =
  //   results.length > 0 &&
  //   ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
  //     results[0]?.testType?.toLowerCase()
  //   );
  const isNeetBatch =
  results.length > 0 &&
  (["neet", "neettough", "neetmoderate", "neetparttest"].includes(
    results[0]?.testType?.toLowerCase()
  ) ||
    results[0]?.testType?.toLowerCase().includes("neet"));


  const isZBatchOther =
    results.length > 0 &&
    results[0]?.batch?.toLowerCase() === "z" &&
    results[0]?.testType?.toLowerCase() === "other";

  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };
const getSubjectTotal = (subject) => {
  return subject?.obtainedMark ?? subject?.totalMark ?? "-";
};

  const handleDownloadPDF = () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(14);
    doc.text(
      `Results of ${batch} (${selectedTest?.testType}) - ${selectedTest?.testDate}`,
      14,
      15
    );
    const tableColumn = [
      "Rank",
      "Name",
      "Father's Name",
      "Student Code",
      "Physics (C)",
      "Physics (I)",
      "Physics (T)",
      "Chemistry (C)",
      "Chemistry (I)",
      "Chemistry (T)",
    ];
    if (isNeetBatch) {
      tableColumn.push("Biology (C)", "Biology (I)", "Biology (T)");
    } else if (isZBatchOther) {
      tableColumn.push(
        "Math (C)",
        "Math (I)",
        "Math (T)",
        "Biology (C)",
        "Biology (I)",
        "Biology (T)"
      );
    } else {
      tableColumn.push("Math (C)", "Math (I)", "Math (T)");
    }
    tableColumn.push("Total Marks");
    const rankMap = {};
    let rankCounter = 1;
    results.forEach((r) => {
      if (!(r.totalMarks in rankMap)) {
        rankMap[r.totalMarks] = rankCounter++;
      }
    });
    const tableRows = results.map((result) => {
  const rank = rankMap[result.totalMarks];
  const rankSymbol =
    rank === 1 ? "1" : rank === 2 ? "2" : rank === 3 ? "3" : rank;

  const row = [
    rankSymbol,
    result.name,
    result.fatherName,
    result.studentCode,

    result.subjectMarks?.physics?.correctMark ?? "-",
    result.subjectMarks?.physics?.incorrectMark ?? "-",
    getSubjectTotal(result.subjectMarks?.physics),

    result.subjectMarks?.chemistry?.correctMark ?? "-",
    result.subjectMarks?.chemistry?.incorrectMark ?? "-",
    getSubjectTotal(result.subjectMarks?.chemistry),
  ];

  if (isNeetBatch) {
    row.push(
      result.subjectMarks?.biology?.correctMark ?? "-",
      result.subjectMarks?.biology?.incorrectMark ?? "-",
      getSubjectTotal(result.subjectMarks?.biology)
    );
  } 
  else if (isZBatchOther) {
    row.push(
      result.subjectMarks?.mathematics?.correctMark ?? "-",
      result.subjectMarks?.mathematics?.incorrectMark ?? "-",
      getSubjectTotal(result.subjectMarks?.mathematics),

      result.subjectMarks?.biology?.correctMark ?? "-",
      result.subjectMarks?.biology?.incorrectMark ?? "-",
      getSubjectTotal(result.subjectMarks?.biology)
    );
  } 
  else {
    row.push(
      result.subjectMarks?.mathematics?.correctMark ?? "-",
      result.subjectMarks?.mathematics?.incorrectMark ?? "-",
      getSubjectTotal(result.subjectMarks?.mathematics)
    );
  }

  row.push(result.totalMarks ?? "-");
  return row;
});

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 102, 204] },
    });
    doc.save(`Results_${batch}_${selectedTest?.testDate}.pdf`);
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
    <div className="viewresult-bg-batch">
      <div className="viewresult-container-batch">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="step1-container-batch">
            <div className="viewresult-card-batch">
              <div className="viewresult-header-batch">
                Select Batch To View Results
                <button className="Add-batch" onClick={() => navigate("/batch-management")}>Add Batch</button>
              </div>
              <form
                onSubmit={handleBatchTypeSubmit}
                className="viewresult-form-batch"
              >
                <label className="form-label-batch">Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <button className="resbtn" type="submit">
                  <span className="viewresultbatchbtn">
                    {loading ? "Loading..." : "View Result"}
                  </span>
                  <FaArrowRight className="arrow-batch" />
                </button>
              </form>
              {error && <p className="error-message-batch">{error}</p>}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step2-container-batch">
            <div className="step2-card-batch">
              <div className="step2-header-batch">
                Click on Test Date To View Result
                <button
                  className="secondary-btn-batch"
                  onClick={() => {
                    setStep(1);
                    setTests([]);
                  }}
                >
                  ⬅ Back
                </button>
              </div>
              <table className="step2-table-batch">
                <thead>
                  <tr>
                    <th>Test Date</th>
                    <th>Test Pattern</th>
                    <th>View Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.testDate}</td>
                      <td>{t.testType}</td>
                      <td>
                        <button
                          className="step2-btn-batch"
                          onClick={() => handleViewResult(t.testDate, t.testType)}
                        >
                          View Result <span className="arrow-batch">➜</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step3-container-batch">
            <div className="step3-card-batch">
              <div className="step3-header-batch">
                Results of {batch} ({selectedTest?.testType}) - {selectedTest?.testDate}
                <button
                  className="back-btn-batch"
                  onClick={() => {
                    setStep(2);
                    setResults([]);
                  }}
                >
                  ⬅ Back
                </button>
                <button className="download-btn-batch" onClick={handleDownloadPDF}>
                  <FaDownload /> Download PDF
                </button>
              </div>

              <div className="result-table-batch">
                {results.length > 0 ? (
                  <table className="results-table-batch">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Father's Name</th>
                        <th>Student Code</th>
                        <th>Physics (Correct)</th>
                        <th>Physics (Incorrect)</th>
                        <th>Physics (Total)</th>
                        <th>Chemistry (Correct)</th>
                        <th>Chemistry (Incorrect)</th>
                        <th>Chemistry (Total)</th>
                        {isNeetBatch && (
                          <>
                            <th>Biology (Correct)</th>
                            <th>Biology (Incorrect)</th>
                            <th>Biology (Total)</th>
                          </>
                        )}
                        {isZBatchOther && (
                          <>
                            <th>Mathematics (Correct)</th>
                            <th>Mathematics (Incorrect)</th>
                            <th>Mathematics (Total)</th>
                            <th>Biology (Correct)</th>
                            <th>Biology (Incorrect)</th>
                            <th>Biology (Total)</th>
                          </>
                        )}
                        {!isNeetBatch && !isZBatchOther && (
                          <>
                            <th>Mathematics (Correct)</th>
                            <th>Mathematics (Incorrect)</th>
                            <th>Mathematics (Total)</th>
                          </>
                        )}
                        <th>Total Marks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let rankMap = {};
                        let rankCounter = 1;
                        results.forEach((r) => {
                          if (!(r.totalMarks in rankMap)) {
                            rankMap[r.totalMarks] = rankCounter++;
                          }
                        });
                        return results.map((result) => {
                          const rank = rankMap[result.totalMarks];
                          const isEditing = editingId === result._id;
                          return (
                           <tr key={result._id} className={isEditing ? "result-table-row-editing-batch" : ""}>
  <td>
    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
  </td>

  {/* NAME */}
  <td>
    {isEditing ? (
      <input
        type="text"
        value={editForm.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.name
    )}
  </td>

  {/* FATHER NAME */}
  <td>
    {isEditing ? (
      <input
        type="text"
        value={editForm.fatherName}
        onChange={(e) => handleInputChange('fatherName', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.fatherName
    )}
  </td>

  {/* STUDENT CODE */}
  <td className="code-cell-batch">
    {isEditing ? (
      <input
        type="text"
        value={editForm.studentCode}
        onChange={(e) => handleInputChange('studentCode', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.studentCode
    )}
  </td>

  {/* ----------------------------------- PHYSICS ----------------------------------- */}
  <td>
    {isEditing ? (
      <input
        type="number"
        value={editForm.physics.correctMark}
        onChange={(e) => handleSubjectChange('physics', 'correctMark', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.physics?.correctMark ?? "-"
    )}
  </td>

  <td>
    {isEditing ? (
      <input
        type="number"
        value={editForm.physics.incorrectMark}
        onChange={(e) => handleSubjectChange('physics', 'incorrectMark', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.physics?.incorrectMark ?? "-"
    )}
  </td>

  {/* updated display + edit for physics total */}
  <td>
    {isEditing ? (
      <input
        type="number"
        value={
          editForm.physics.obtainedMark ??
          editForm.physics.totalMark ??
          ""
        }
        onChange={(e) =>
          handleSubjectChange("physics", "autoMark", e.target.value)

        }
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.physics?.obtainedMark ??
      result.subjectMarks?.physics?.totalMark ??
      "-"
    )}
  </td>

  {/* ----------------------------------- CHEMISTRY ----------------------------------- */}
  <td>
    {isEditing ? (
      <input
        type="number"
        value={editForm.chemistry.correctMark}
        onChange={(e) => handleSubjectChange('chemistry', 'correctMark', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.chemistry?.correctMark ?? "-"
    )}
  </td>

  <td>
    {isEditing ? (
      <input
        type="number"
        value={editForm.chemistry.incorrectMark}
        onChange={(e) => handleSubjectChange('chemistry', 'incorrectMark', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.chemistry?.incorrectMark ?? "-"
    )}
  </td>

  {/* updated display + edit for chemistry total */}
  <td>
    {isEditing ? (
      <input
        type="number"
        value={
          editForm.chemistry.obtainedMark ??
          editForm.chemistry.totalMark ??
          ""
        }
        onChange={(e) =>
          handleSubjectChange(
            "chemistry",
            "autoMark",
            e.target.value
          )
        }
        className="result-edit-input-batch"
      />
    ) : (
      result.subjectMarks?.chemistry?.obtainedMark ??
      result.subjectMarks?.chemistry?.totalMark ??
      "-"
    )}
  </td>

  {/* ----------------------------------- BIOLOGY (NEET) ----------------------------------- */}
  {isNeetBatch && (
    <>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.biology.correctMark}
            onChange={(e) => handleSubjectChange('biology', 'correctMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.correctMark ?? "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.biology.incorrectMark}
            onChange={(e) => handleSubjectChange('biology', 'incorrectMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.incorrectMark ?? "-"
        )}
      </td>

      {/* updated display + edit for biology total */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={
              editForm.biology.obtainedMark ??
              editForm.biology.totalMark ??
              ""
            }
            onChange={(e) =>
              handleSubjectChange(
                "biology",
                "autoMark",
                e.target.value
              )
            }
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.obtainedMark ??
          result.subjectMarks?.biology?.totalMark ??
          "-"
        )}
      </td>
    </>
  )}

  {/* ----------------------------------- Z BATCH OTHER ----------------------------------- */}
  {isZBatchOther && (
    <>
      {/* MATH */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.mathematics.correctMark}
            onChange={(e) => handleSubjectChange('mathematics', 'correctMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.correctMark ?? "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.mathematics.incorrectMark}
            onChange={(e) => handleSubjectChange('mathematics', 'incorrectMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.incorrectMark ?? "-"
        )}
      </td>

      {/* updated display + edit for math total */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={
              editForm.mathematics.obtainedMark ??
              editForm.mathematics.totalMark ??
              ""
            }
            onChange={(e) =>
              handleSubjectChange(
                "mathematics",
                "autoMark",
                e.target.value
              )
            }
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.obtainedMark ??
          result.subjectMarks?.mathematics?.totalMark ??
          "-"
        )}
      </td>

      {/* BIOLOGY */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.biology.correctMark}
            onChange={(e) => handleSubjectChange('biology', 'correctMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.correctMark ?? "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.biology.incorrectMark}
            onChange={(e) => handleSubjectChange('biology', 'incorrectMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.incorrectMark ?? "-"
        )}
      </td>

      {/* updated display + edit for biology total */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={
              editForm.biology.obtainedMark ??
              editForm.biology.totalMark ??
              ""
            }
            onChange={(e) =>
              handleSubjectChange(
                "biology",
                "autoMark",
                e.target.value
              )
            }
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.biology?.obtainedMark ??
          result.subjectMarks?.biology?.totalMark ??
          "-"
        )}
      </td>
    </>
  )}

  {/* ----------------------------------- REGULAR BATCH MATH ----------------------------------- */}
  {!isNeetBatch && !isZBatchOther && (
    <>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.mathematics.correctMark}
            onChange={(e) => handleSubjectChange('mathematics', 'correctMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.correctMark ?? "-"
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="number"
            value={editForm.mathematics.incorrectMark}
            onChange={(e) => handleSubjectChange('mathematics', 'incorrectMark', e.target.value)}
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.incorrectMark ?? "-"
        )}
      </td>

      {/* updated display + edit for math total */}
      <td>
        {isEditing ? (
          <input
            type="number"
            value={
              editForm.mathematics.obtainedMark ??
              editForm.mathematics.totalMark ??
              ""
            }
            onChange={(e) =>
              handleSubjectChange(
                "mathematics",
                "autoMark",
                e.target.value
              )
            }
            className="result-edit-input-batch"
          />
        ) : (
          result.subjectMarks?.mathematics?.obtainedMark ??
          result.subjectMarks?.mathematics?.totalMark ??
          "-"
        )}
      </td>
    </>
  )}

  {/* TOTAL MARKS */}
  <td className="marks-cell-batch">
    {isEditing ? (
      <input
        type="number"
        value={editForm.totalMarks}
        onChange={(e) => handleInputChange('totalMarks', e.target.value)}
        className="result-edit-input-batch"
      />
    ) : (
      result.totalMarks ?? "-"
    )}
  </td>

  {/* ACTIONS */}
  <td>
    {isEditing ? (
      <div className="result-edit-actions-batch">
        <button
          onClick={() => handleEditSave(result._id)}
          className="result-edit-btn-batch"
        >
          ✓ Save
        </button>
        <button
          onClick={handleEditCancel}
          className="result-edit-btn-batch result-edit-cancel-batch"
        >
          ✕ Cancel
        </button>
      </div>
    ) : (
      <div className="result-edit-actions-batch">
        <button
          onClick={() => handleEditClick(result)}
          className="result-edit-btn-batch result-edit-btn-edit-batch"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => handleDelete(result._id)}
          className="result-edit-btn-batch result-edit-btn-delete-batch"
        >
          <FaRegTrashCan />
        </button>
      </div>
    )}
  </td>
</tr>

                          );
                        });
                      })()}
                    </tbody>
                  </table>
                ) : (
                  <p className="ptag-batch">No results found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchResults;

