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

    if (commitDayChart != null)
        commitDayChart.destroy();

    if (commitTimeChart != null)
        commitDayChart.destroy();
    
    if (topicChart != null)
        commitDayChart.destroy();

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

    setUserCard(userData);

    url = `https://api.github.com/users/${username}/repos`;
    let repoList = await apiCall(url, auth).catch(e => console.error(e));

    getCommitDateData(repoList, username, auth);

    url = `https://api.github.com/users/${username}/starred?page=1&per_page=20`;
    let starredList = await apiCall(url, auth).catch(e => console.error(e));
    getTopics(starredList);
}

function setUserCard(data) {
    document.getElementById("avatar").src = data.avatar_url;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("bio").innerHTML = data.bio;
    document.getElementById("login").innerHTML = `<b>Username:</b> ${data.login}`;
    document.getElementById("location").innerHTML = `<b>Location:</b> ${data.location}`;
    document.getElementById("followers").innerHTML = `<b>Followers:</b> ${data.followers}`;
    document.getElementById("following").innerHTML = `<b>Following:</b> ${data.following}`;
    document.getElementById("html-url").href = data.html_url;
}

function displayUserCard() {
    document.getElementById('user-card').style.display = "block";
}

async function getCommitDateData(repoList, username, auth) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayCount = [0,0,0,0,0,0,0];

    var timeCount = [0,0,0,0];

    for (repo in repoList) {
        // TODO Come back and alter parameters
        let url = `https://api.github.com/repos/${username}/${repoList[repo].name}/commits?page=1&per_page=20`;
        let commitList = await apiCall(url, auth).catch(e => console.error(e));

        for (commit in commitList) {
            let date = new Date(commitList[commit].commit.author.date);
            let commitDay = days[date.getDay()];
            let commitHour = date.getUTCHours();
            
            for (let i = 0; i < days.length; i++) {
                if (commitDay == days[i]) {
                    dayCount[i] += 1;
                }
            }

            // Morning = 5am - 12pm
            // Afternoon = 12pm - 5pm 
            // Evening = 5pm - 9pm
            // Night = 9pm - 5am
            if (commitHour > 5 && commitHour < 12)
                timeCount[0] += 1;
            else if (commitHour > 12 && commitHour < 17)
                timeCount[1] += 1;
            else if (commitHour > 17 && commitHour < 21)
                timeCount[2] += 1;
            else
                timeCount[3] += 1;
        }   
    }
    // document.getElementById("test").innerHTML = timeCount;
    createCommitDayGraph(dayCount);
    createCommitTimeGraph(timeCount);
}

function createCommitDayGraph(dayData) {
    const labels = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday', 
        'Saturday',
    ];
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Your User\'s Commit Data',
                backgroundColor: '#557C55',
                borderColor: '#557C55',
                data: dayData,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Linus Torvalds\' Commit Data',
                backgroundColor: '#A6CF98',
                borderColor: '#A6CF98',
                data: [22,22,6,22,9,13,17],
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Commit Day Bar Chart'
            }
            }
        }
    };
    
    commitDayChart = new Chart(
        document.getElementById("commit-day-chart"),
        config
    );
}

function createCommitTimeGraph(timeData) {
    const labels = [
        'Morning',
        'Afternoon',
        'Evening',
        'Night',
    ];
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Your User\'s Commit Data',
                backgroundColor: '#A6CF98',
                borderColor: '#A6CF98',
                data: timeData,
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            },
            {
                label: 'Linus Torvalds\' Commit Data',
                backgroundColor: '#557C55',
                borderColor: '#557C55',
                data: [12,7,44,48],
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false,
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Commit Time Bar Chart'
            }
            }
        }
    };
    
    commitTimeChart = new Chart(
        document.getElementById("commit-time-chart"),
        config
    );
}

function getTopics(starredList) {
    let topicList = [];
    let topicCount = [];
    let colours = [];
    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

    for (star in starredList) {
        let topics = starredList[star].topics;
        for (let i = 0; i < topics.length; i++) {
            if (topicList.includes(topics[i])) {
                for (let j = 0; j < topicList.length; j++) {
                    if (topics[i] == topicList[j]) {
                        topicCount[j] = topicCount[j] + 1;
                    }
                }
            } else {
                topicList.push(topics[i]);
                topicCount.push(1);
                colours.push(`rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`);
            }
        }
    }
    createTopicsGraph(topicList, topicCount, colours)
    // document.getElementById("test").innerHTML = topicCount + topicList;
}

function createTopicsGraph(topicList, topicCount, colours) {
    const labels = topicList;
    
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Your User\'s Commit Data',
                backgroundColor: colours,
                data: topicCount,
            }
        ]
    };
    
    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Topics Bar Doughnut'
            }
            }
        }
    };
    
    topicChart = new Chart(
        document.getElementById("topics-chart"),
        config
    );
}

var commitDayChart = null;
var commitTimeChart = null;
var topicChart = null;