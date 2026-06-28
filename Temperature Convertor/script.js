
function convertTemp() {

    let temp = parseFloat(document.getElementById("temp").value);
    let unit = document.getElementById("unit").value;

    if(isNaN(temp)){
        document.getElementById("result").innerHTML =
        "Please enter a valid number";
        return;
    }

    if(unit === "c"){
        let result = (temp * 9/5) + 32;

        document.getElementById("result").innerHTML =
        temp + " °C = " + result.toFixed(2) + " °F";
    }
    else{
        let result = (temp - 32) * 5/9;

        document.getElementById("result").innerHTML =
        temp + " °F = " + result.toFixed(2) + " °C";
    }
}
