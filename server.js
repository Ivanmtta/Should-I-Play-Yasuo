/** 
 * Should I Play Yassuo? Back-end
 * @author Ivan Mota
 * @version 1.0
 */
let express = require('express');
let app = express();
let DataStore = require('nedb');
let BayesClassifier = require('./BayesClassifier.js');
// Set up the port
let port = process.env.PORT || 8000;
app.listen(port, ()=>{
  console.log('Server Running');
});
// Express configurations
app.use(express.static('public'));
app.use(express.json());
// Initialize database
let db = new DataStore('database.db');
db.loadDatabase();

let classifier = new BayesClassifier();

// Extract data from the database
db.find({}, (error, data)=>{
  if(error){
    console.log(error);
  }
  else{
    // For each element in the database
    data.forEach((match)=>{
      let classification = 'negative';
      if(match.win){
        classification = 'positive';
      }
      // Use each document to train the model
      classifier.addDocument(match.enemyChampions, classification);
    });
    classifier.train();
  }
})
// Client request to calculate probabilities
app.post('/api', (request, response)=>{
  // Initialize list from the client request
  let requestKeys = [];
  request.body.forEach((champion)=>{
    requestKeys.push(champion.key);
  });
  // Calculate actual percentages using the prediction results
  let classification = classifier.getClassifications(requestKeys);
  let totalPercentage = classification.get('positive') + classification.get('negative');
  let data = {
    'positive': classification.get('positive') / totalPercentage * 100,
    'negative': classification.get('negative') / totalPercentage * 100
  };
  // Send response to the client
  response.json(data);
});