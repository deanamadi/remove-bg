const rapidApiKey = "755bbed88emsh8e7066c05d8fa53p1f994fjsnac108a86089e";

async function removeBackground() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("outputImage").style.display = "none";
    document.getElementById("downloadButton").style.display = "none";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://background-removal4.p.rapidapi.com/v1/results", {
            method: "POST",
            headers: {
                "X-RapidAPI-Key": rapidApiKey,
                "X-RapidAPI-Host": "background-removal4.p.rapidapi.com"
            },
            body: formData
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error("Response body:", errorText);
            alert("Failed to process the image.");
            document.getElementById("loading").style.display = "none";
            return;
        }

        const data = await response.json();
        console.log("API Response:", data);

        const base64Image = data.results[0].entities[0].image;

        document.getElementById("loading").style.display = "none";
        const outputImage = document.getElementById("outputImage");
        outputImage.src = `data:image/png;base64,${base64Image}`;
        outputImage.style.display = "block";

        // Show the download button
        document.getElementById("downloadButton").style.display = "inline-block";
    } catch (error) {
        console.error("Error processing image:", error);
        alert("There was an error processing your image.");
        document.getElementById("loading").style.display = "none";
    }
}

// Use a temporary <a> element to download the image
function downloadImage() {
    const outputImage = document.getElementById("outputImage");
    const imageUrl = outputImage.src;

    // Create a temporary <a> element for download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "processed_image.png"; // Set desired filename
    document.body.appendChild(link); // Append link to body
    link.click(); // Programmatically click to trigger download
    document.body.removeChild(link); // Clean up by removing link
}
