/* Global Variables */

// keys and urls varables
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip='
let apiKey = '&appid=9a871e4cf743ae688aedeafbcd30440d&units=metric'
let apiUrl = 'http://localhost:8000'

//basics variables
let errorElemnt = document.getElementById('error')
let zip =  document.querySelector('#zip')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', event => {
    let params = {
        zipCode: zip.value,
        content: document.getElementById('feelings').value,
        date: newDate
    }
    getZipCodeWeatherInfo(params.zipCode).then(response => {
        if (response) {
            console.log(response);
            params.temp = response.main.temp
            postData(`${apiUrl}/add`, params)
            updateUIElemnts();
        }
    })
  })

const getZipCodeWeatherInfo = async (zipCode) => {
  
    const url = `${baseURL}${zipCode}${apiKey}`
    try {
        const data = await (await fetch(url)).json()
        if (data.cod != 200) {
            errorElemnt.innerHTML = data.message
            setTimeout(() => {
                errorElemnt.innerHTML = ''
            }, "5000")
        }
        return data
    } catch (error) {
        console.log(error);
        errorElemnt.innerHTML = error.message
    }

}


// Async POST
const postData = async (url = '', weatherParams = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherParams), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        return newData
    } catch (error) {
        console.log("error", error);
    }
}

const  updateUIElemnts = async()=> {
    let response = await fetch(`${apiUrl}/all`);
    try {
        const finalData = await response.json() 
        document.getElementById('temp').innerHTML =  Math.round(finalData.temp) + ' degrees';
        document.getElementById('content').innerHTML = finalData.feelings;
        document.getElementById('date').innerHTML = finalData.currentDate;
    } catch (error) {
        console.log(error);
    }
}
