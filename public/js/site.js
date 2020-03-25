/** 
 * Should I Play Yasuo? Front-End
 * @author Ivan Mota
 * @version 1.0
 */
let searchBar = document.getElementById('searchBar');
let list = document.getElementById('list');
let championsDisplay = document.getElementById('selectionList');
let submitButton = document.getElementById('submitButton');
let graphics = document.getElementById('results').getContext('2d');
let enemyChampions = [];
let results = null;
// Riot Games API Calls
const CHAMPIONS_URL = 'http://ddragon.leagueoflegends.com/cdn/10.6.1/data/en_US/champion.json';
const IMAGE_URL = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash';
// Listener to detect user input on the search box
searchBar.addEventListener('input', ()=>{
  searchMatches(searchBar.value);
});
// Display hint message when the page loads
window.onload = ()=>{
  displayChampions();
}

/**
 * Search for a list of matches that match the provided input
 * @param {string} input - Text provided by the user for the champion name
 */
async function searchMatches(input){
  // Get a list of all the available champions from RIOT API
  let response = await fetch(CHAMPIONS_URL);
  let responseJson = await response.json();
  let matches = [];
  for(let champion in responseJson.data){
    // Check if the current champion matches the input
    let regex = new RegExp(`^${input}`, 'gi');
    if(responseJson.data[champion].name.match(regex)){
      matches.push(responseJson.data[champion]);
    }
  }
  // Clear the list if the input is empty
  if(input.length == 0){
    matches = [];
    list.innerHTML = '';
  }
  displayMatches(matches);
}

/**
 * Display a card for each match with the champion name and description
 * @param {Object Array} matches - Array of matches
 */
function displayMatches(matches){
  if(matches.length <= 0){
    return;
  }
  // For each match, create a HTML object and display it in the page
  let html = matches.map((match) => `
    <div class='card card-body mb-1'>
      <div class='row'>
        <div class='col-md-6'>
          <h5>${match.name}</h5>
          <p class='text-muted'>${match.title}</p>
        </div>
        <div class='col-md-6'>
          <button 
            class='btn btn-primary float-right' 
            onclick="addChampion('${match.id}', ${match.key});">
            Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
  list.innerHTML = html;
}

/**
 * Add a champion to the enemy champion list and display it
 * @param {String} championName - name of the champion
 * @param {Number} championKey - id of the champion
 */
function addChampion(championName, championKey){
  if(enemyChampions.length >= 5){
    return;
  }
  enemyChampions.push({
    "name": championName,
    "key": championKey
  });
  displayChampions();
}

/**
 * Remove a champion from the enemy champion list and display it
 * @param {Object} champion - Object containing champion properties
 */
function removeChampion(champion){
  // Find the champion that will be removed
  for(let i = 0; i < enemyChampions.length; i++){
    if(enemyChampions[i].name == champion){
      // Once found, delete it from the list
      enemyChampions.splice(i, 1);
      break;
    }
  }
  displayChampions();
}

/**
 * Display list of champions selected using RIOT Games API
 */
function displayChampions(){
  let championDisplay = '';
  for(let i = 0; i < enemyChampions.length; i++){
    championDisplay += `
    <img 
      class='mt-3 custom-image' 
      src='${IMAGE_URL}/${enemyChampions[i].name}_0.jpg' 
      onclick='removeChampion("${enemyChampions[i].name}")'
    >`;
  }
  championsDisplay.innerHTML = championDisplay;
  // If there are no champions selected, display hint to user
  if(championsDisplay.innerHTML == ''){
    championsDisplay.innerHTML = `
    <h5 class='text-muted text-center'>
      <i class="far fa-lightbulb"></i> 
      Start by adding champions
    </h5>`;
  }
  // Check if the max number of selections is met
  if(enemyChampions.length >= 5){
    // If it is met, display button to predict result
    submitButton.innerHTML = `
    <button 
      class='btn btn-primary' 
      onclick="sendServerRequest();">
      Should I?
    </button>`;
  }
  // Do not display button if is not met
  else{
    submitButton.innerHTML = '';
  }
}

/**
 * Send request to the server using the selection
 * list to get the chances of wining the game 
 */
async function sendServerRequest(){
  // Create options to send a JSON file
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(enemyChampions)
  }
  // Send the request and wait for the response
  let response = await fetch('/api', options);
  let responseData = await response.json();
  // Display the response
  displayData(responseData);
}

/**
 * Display a modal with a pie graph with the perfentages of winning and lossing
 * @param {Object} data - percentages of winning and lossing the game
 */
function displayData(data){
  // Display modal
  $("#resultModal").modal();
  // Create graph using data
  results = new Chart(graphics, {
    type: 'pie',
    data: {
      labels: ['YES', 'NO'],
      datasets: [{
        hoverBackgroundColor: ["#2796bc", "#e9422e"],
        backgroundColor: ["#2796bc", "#e9422e"],
        data: [
          data.positive.toFixed(2), 
          data.negative.toFixed(2)
        ]
      }]
    }
  });
}

// Destroy the graph when the modal is closed
$('#resultModal').on('hidden.bs.modal', (event)=>{
  if(results != null){
    results.destroy();
  }
});