import axios from 'axios';

export default class PixibayAPI {
  #API_KEY = '38110026-5bfbf894cc748013b74eb0441';
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1; 
  per_page = 40;

  total_hits = null;
  query = null;
  prevQuery = null;

  async fetchPhotos(page = null) {
    if (page !== null) {
      this.page = page;
    } else {
      this.page += 1;
    }

    const params = {
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.per_page,
      page: this.page,
    };

    try {
      const response = await axios.get(this.#BASE_URL, { params });

      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
}