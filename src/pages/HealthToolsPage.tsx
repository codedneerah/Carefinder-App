import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";

type ResultKey = "haemoglobin" | "glucose" | "cholesterol" | "wbc";

const resultGuidance: Record<
  ResultKey,
  { label: string; plain: string; range: string; unit: string }
> = {
  haemoglobin: {
    label: "Haemoglobin",
    plain:
      "Haemoglobin carries oxygen around your body. A low result can be linked with anaemia and may leave you tired or short of breath.",
    range: "Typical adult reference: about 12–17",
    unit: "g/dL",
  },
  glucose: {
    label: "Fasting blood glucose",
    plain:
      "This measures sugar in your blood after you have not eaten. A high result can happen with diabetes, but one result alone does not confirm a diagnosis.",
    range: "Typical fasting reference: about 70–99",
    unit: "mg/dL",
  },
  cholesterol: {
    label: "Total cholesterol",
    plain:
      "Cholesterol is a fatty substance your body needs in small amounts. Higher levels may increase heart and blood vessel risk over time.",
    range: "A common target is below 200",
    unit: "mg/dL",
  },
  wbc: {
    label: "White blood cell count",
    plain:
      "White blood cells help fight infection. A result outside the reference range may be caused by infection, inflammation, medicine, or other conditions.",
    range: "Typical adult reference: about 4.0–11.0",
    unit: "×10⁹/L",
  },
};

const medicineGuidance: Record<string, string[]> = {
  amoxicillin: [
    "Take it exactly for the number of days prescribed, even if you feel better.",
    "Doses should be spaced evenly. It can usually be taken with or without food.",
    "Get urgent help for swelling, breathing difficulty, or a severe rash.",
  ],
  metformin: [
    "Take it with or just after food to reduce stomach upset.",
    "Use it at the same time each day and follow your prescribed dose.",
    "Contact your clinician if you have severe vomiting, weakness, or breathing difficulty.",
  ],
  paracetamol: [
    "Follow the dose on your prescription or pack and leave the stated time between doses.",
    "Do not combine it with another product that also contains paracetamol.",
    "Too much can seriously damage the liver. Seek urgent help after an overdose.",
  ],
};

export function HealthToolsPage() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") === "medicine" ? "medicine" : "results";
  const [result, setResult] = useState<ResultKey>("haemoglobin");
  const [value, setValue] = useState("");
  const [explained, setExplained] = useState(false);
  const [medicine, setMedicine] = useState("");
  const [medicineResult, setMedicineResult] = useState<string[] | null>(null);

  function selectTab(tab: string) {
    setParams(tab === "medicine" ? { tab: "medicine" } : {});
  }

  function checkMedicine(event: React.FormEvent) {
    event.preventDefault();
    const key = medicine.trim().toLowerCase();
    setMedicineResult(
      medicineGuidance[key] ?? [
        "Follow the instructions written by your prescriber and on the pharmacy label.",
        "Ask a pharmacist to explain timing, food interactions, and missed doses.",
        "Do not stop, share, or change the dose without professional advice.",
      ],
    );
  }

  const guidance = resultGuidance[result];

  return (
    <div className="tools-page">
      <section className="tools-header">
        <span className="eyebrow">Health information, made clearer</span>
        <h1>Understand your care.</h1>
        <p>
          Get a simple explanation of common test results and prescribed
          medicine instructions. This tool does not diagnose illness.
        </p>
      </section>

      <div className="tool-tabs">
        <button
          className={activeTab === "results" ? "active" : ""}
          onClick={() => selectTab("results")}
        >
          Explain test results
        </button>
        <button
          className={activeTab === "medicine" ? "active" : ""}
          onClick={() => selectTab("medicine")}
        >
          Medicine guidance
        </button>
      </div>

      {activeTab === "results" ? (
        <section className="tool-workspace">
          <div className="tool-form">
            <span className="tool-number">01</span>
            <h2>Tell us what is on your result.</h2>
            <p>
              Choose a common test and enter the value exactly as it appears on
              your report.
            </p>
            <label>
              Test name
              <select
                value={result}
                onChange={(event) => {
                  setResult(event.target.value as ResultKey);
                  setExplained(false);
                }}
              >
                {Object.entries(resultGuidance).map(([key, item]) => (
                  <option value={key} key={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Your result
              <div className="unit-input">
                <input
                  inputMode="decimal"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder="Enter value"
                />
                <span>{guidance.unit}</span>
              </div>
            </label>
            <button
              className="button primary"
              disabled={!value.trim()}
              onClick={() => setExplained(true)}
            >
              Explain this result
            </button>
          </div>
          <div className={explained ? "explanation-card visible" : "explanation-card"}>
            {explained ? (
              <>
                <span className="tool-number">02</span>
                <span className="eyebrow">In everyday English</span>
                <h2>{guidance.label}</h2>
                <div className="result-value">
                  <strong>{value}</strong> {guidance.unit}
                </div>
                <p>{guidance.plain}</p>
                <div className="reference-box">
                  <Icon name="heart" />
                  <div>
                    <strong>General reference</strong>
                    <span>{guidance.range}</span>
                  </div>
                </div>
                <div className="safety-note">
                  <Icon name="shield" />
                  <p>
                    Reference ranges vary by laboratory, age, sex, pregnancy,
                    and medical history. A clinician must interpret this result
                    with your symptoms and full report.
                  </p>
                </div>
              </>
            ) : (
              <div className="placeholder-content">
                <span className="large-icon">
                  <Icon name="heart" size={36} />
                </span>
                <h2>Your explanation will appear here.</h2>
                <p>We will use simple language and highlight what to ask your clinician.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="medicine-workspace">
          <div className="medicine-intro">
            <span className="tool-number">01</span>
            <h2>Check how to use your medicine.</h2>
            <p>
              Enter the generic medicine name from your prescription or
              pharmacy label.
            </p>
            <form onSubmit={checkMedicine}>
              <label>
                Medicine name
                <input
                  value={medicine}
                  onChange={(event) => setMedicine(event.target.value)}
                  placeholder="e.g. Amoxicillin"
                />
              </label>
              <button className="button primary" disabled={!medicine.trim()}>
                Show guidance
              </button>
            </form>
          </div>
          <div className="medicine-guide">
            <span className="eyebrow">Safe medicine use</span>
            <h2>{medicineResult ? medicine : "Before you take a dose"}</h2>
            {medicineResult ? (
              <ol>
                {medicineResult.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ol>
                <li>Check the correct person, medicine, dose, and time.</li>
                <li>Read the pharmacy label and any warning stickers.</li>
                <li>Ask a pharmacist when any instruction is unclear.</li>
              </ol>
            )}
            <div className="safety-note">
              <Icon name="shield" />
              <p>
                This general information cannot replace your prescription.
                Call your prescriber or pharmacist before changing a dose.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
