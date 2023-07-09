import axios from "axios";


const apiKey = '38110026-5bfbf894cc748013b74eb0441';
export async function searchImages(query, page, apiKey) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    throw new Error('Error searching images:', error);
  }
}