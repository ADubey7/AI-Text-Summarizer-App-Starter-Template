const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("upload-button");

submitButton.disabled = true;

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);
uploadButton.addEventListener("click", uploadFile);

function verifyTextLength(e) {
    const textarea = e.target;

    if (textarea.value.length > 200 && textarea.value.length < 100000) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

function submitData(e) {
    submitButton.classList.add("submit-button--loading");

    const text_to_summarize = textArea.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "text_to_summarize": text_to_summarize
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch('/summarize', requestOptions)
        .then(response => response.json())
        .then(data => {
            summarizedTextArea.value = data.summary;
            submitButton.classList.remove("submit-button--loading");
        })
        .catch(error => {
            console.log(error.message);
        });
}

// File upload function
function uploadFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadButton.classList.add("submit-button--loading");

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        summarizedTextArea.value = data.summary;
        uploadButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
        console.error("Error:", error);
        uploadButton.classList.remove("submit-button--loading");
    });
}
