import { useState } from "react";
import { Button, Typography } from "@mui/material";
import { checkFile, readFile } from "../utils/files";

// Upload box for one required document (ID, property title). Accepts JPG, PNG, WEBP or PDF up to 5 MB.
export default function DocumentPicker({ label, hint, value, onChange, error }) {
  const [problem, setProblem] = useState("");

  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const bad = checkFile(file, { allowPdf: true });
    if (bad) return setProblem(bad);
    setProblem("");
    onChange(await readFile(file));
  };

  return (
    <div style={{ border: `1px solid ${error || problem ? "#B23A1B" : "var(--border)"}`, borderRadius: 12, padding: 16 }}>
      <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{hint}</Typography>
      {value ? (
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14 }}>{value.name}</span>
          {value.url && <a href={value.url} target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontSize: 14 }}>Preview</a>}
          <Button size="small" color="error" onClick={() => onChange(null)}>Remove</Button>
        </div>
      ) : (
        <Button component="label" variant="outlined" color="inherit" sx={{ borderColor: "var(--border)" }}>
          Choose file
          <input hidden type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={pick} />
        </Button>
      )}
      {(problem || error) && <Typography variant="body2" sx={{ color: "#B23A1B", mt: 1 }}>{problem || error}</Typography>}
    </div>
  );
}
