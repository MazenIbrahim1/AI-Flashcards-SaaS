// utils/fetchImage.js
export async function fetchImage(query) {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    console.log("Fetched data:", data); // Log the entire response to inspect the structure
    const imageUrl = data.results[0]?.urls?.regular;
    console.log("Image URL:", imageUrl); // Log the image URL to ensure it's correct
    return imageUrl;
}
