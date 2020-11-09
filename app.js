// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1 +'/'+ d.getDate()+'/'+ d.getFullYear();

/* Global Variables */

let temp,feeling;
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const APIKey = '&appid=2171490da55e05031f4e35873176d845';
const unitofDegree = '&units=metric';
document.getElementById('generate').addEventListener('click',performAction);
function performAction(){
    const zipInput = document.getElementById('zip').value;//85005
    if(zipInput===""){
        alert("Please Enter Zip Code")
    }
    else{
        getData(apiURL,zipInput,APIKey,unitofDegree)
        .then(function(data){
            postData('/tempresult',{Temperature:data})
            .then(function(){
                updateUI();
            }).catch(function(){
                updateUI();
            })
        });
        
        const textareaValue = document.getElementById('feelings').value;
        const lowertext = textareaValue.toLowerCase();
        if (lowertext.includes('feeling')){
            const index = lowertext.indexOf('feeling')+7;
            feeling = textareaValue.substring(index,textareaValue.length);
            console.log(feeling);
        }
        else{
            feeling = textareaValue;
            console.log(feeling);
        }
    }

};

const getData = async (apiURL,zipInput,APIKey,unitofDegree)=>{
    let returnData ;
    const result = await fetch(apiURL+zipInput+APIKey+unitofDegree);
    try{
        returnData = await result.json();
        if (returnData.cod ==="404"){
            alert('Please Enter zip code in USA');
        }
        else{
            return returnData.main.temp;    
        }
    }catch(err){
        console.log('this is not found');
    }   
};

const postData = async (url = "", data = {})=>{
    const response = await fetch(url,{
        method : 'POST',
        credentials:'same-origin',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try{
        const newdata = await response.json();
        return newdata;

    }catch (err){
        console.log(err);
    }
};

const updateUI = async ()=>{
    console.log('update');
    const request = await fetch('/tempresult');
    try{
        const allData = await request.json();
        console.log(allData);
        document.getElementById('date').innerHTML ='Date : '+ newDate;
        document.getElementById('temp').innerHTML ='Temperature : '+ allData.Temperature + ' C';
        document.getElementById('content').innerHTML ='Feeling : '+ feeling;
    }catch (err){
        console.log(err);
    }
};