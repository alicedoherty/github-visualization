// Called from index.html when "Let's Go!" is pressed
function main() {
    if (document.getElementById('username').value != '') {
        var username = document.getElementById('username').value;
    } else {
        alert('Please enter a valid username!');
    }

    if (document.getElementById('auth').value != '') {
        var auth = document.getElementById('auth').value;
    } else {
        var auth = null;
    }

    getUserData(username, auth);
}

async function apiCall(url, auth) {
    
    var headers = {
        "Authorization": `Token ${auth}`
    }


    const response = (auth == null) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    return data;
}

async function getUserData(username, auth) {
    let url = `https://api.github.com/users/${username}`;
    let userData = await apiCall(url, auth).catch(e => console.error(e));

    document.getElementById("test").innerHTML = userData.name;
}



//     const labels = [
//         username,
//         auth,
//         'March',
//         'April',
//         'May',
//         'June',
//       ];
    
//     const data = {
//     labels: labels,
//     datasets: [{
//         label: 'My First dataset',
//         backgroundColor: 'rgb(255, 99, 132)',
//         borderColor: 'rgb(255, 99, 132)',
//         data: [0, 10, 5, 2, 20, 30, 45],
//     }]
//     };
    
//     const config = {
//         type: 'line',
//         data: data,
//         options: {}
//     };
    
//     const myChart = new Chart(
//         document.getElementById('myChart'),
//         config
//     );
// }



