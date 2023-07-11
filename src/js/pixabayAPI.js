import axios from 'axios';

export default class PixabayAPI {
  #API_KEY = '38110026-5bfbf894cc748013b74eb0441';
  #BASE_URL = 'https://pixabay.com/api/';

  per_page = 40;

  total_hits = null;
  query = null;

  async fetchPhotos(page = 1) {
    try {
      const config = {
        params: {
          key: this.#API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.per_page,
          page: page,
        },
      };

      const response = await axios.get(this.#BASE_URL, config);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new Error('Oops! Error occurred. Please try again later.');
    }
  }
}