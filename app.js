const fileInput = document.getElementById("fileInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

// Your n8n Production Webhook URL
const WEBHOOK_URL = "https://n8n.akshitpratiush.online/webhook/upload-resume";

analyzeBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a resume file first.");
    return;
  }

  statusEl.textContent = "Uploading and analyzing resume...";
  analyzeBtn.disabled = true;

  const formData = new FormData();
  formData.append("data", file); // must match n8n "Field Name for Binary Data"

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    console.log("Response:", data);

    // Expecting: { questions: "...." }
    if (data.questions) {
      resultEl.textContent = data.questions;
    } else {
      resultEl.textContent = "No questions returned from server.";
    }

    statusEl.textContent = "Done!";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error: " + err.message;
    resultEl.textContent = "Failed to generate questions.";
  } finally {
    analyzeBtn.disabled = false;
  }
});
