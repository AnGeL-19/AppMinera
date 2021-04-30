import axios from 'axios';

const url = 'https://984b11671680.ngrok.io/api/congestions/';

export const mostrarZonas = () => {

    axios.get('https://984b11671680.ngrok.io/api/congestions/')
        .then(response => {
        console.log(response.data)
        })
        .catch(error => {
        console.log(error)
    });


}

export const agregarZona = (objZona) => {

    axios.post('https://984b11671680.ngrok.io/api/congestions/',objZona)
        .then(response => {
        console.log(response.data)
        })
        .catch(error => {
        console.log(error)
    });

}
              