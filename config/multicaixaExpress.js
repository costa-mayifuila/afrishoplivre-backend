import axios from 'axios';

const multicaixaExpress = axios.create({
  baseURL: 'https://pagamentonline.emis.ao', // URL da API do Multicaixa Express
  headers: {
    'Authorization': `Bearer ${process.env.MULTICAIXA_EXPRESS_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export default multicaixaExpress;
