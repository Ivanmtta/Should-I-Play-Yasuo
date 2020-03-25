/** 
 * Class representing a Bayes Classifier.
 * https://en.wikipedia.org/wiki/Naive_Bayes_classifier
 * @author Ivan Mota
 * @version 1.0
 */
class BayesClassifier{
  /**
   * Create an instance of the classifier
   * @constructor
   */
  constructor(){
    // Initialize instance variables
    this.documents = new Map();
    this.ids = new Map();
    this.bias = new Map();
  }

  /**
   * Insert a document into the document list
   * @param {number array} data - Data in the document
   * @param {string} classification - Classification of the document.
   */
  addDocument(data, classification){
    // Create the classification entries if they dont exist
    if(!this.documents.has(classification)){
      this.documents.set(classification, new Map());
      this.bias.set(classification, 0);
    }
    // Calculate the bias
    this.bias.set(classification, this.bias.get(classification) + 1);
    // For each element in the data array
    data.forEach((element)=>{
      if(!this.ids.has(element)){
        // Insert the element and add a map for the classifications
        this.ids.set(element, new Map());
      }
      // Add the element to the corresponding document class
      if(this.documents.get(classification).has(element)){
        this.documents.get(classification).set(element,
          this.documents.get(classification).get(element) + 1);
      }
      else{
        this.documents.get(classification).set(element, 1);
      }
    });
  }

  /**
   * Calculate probability of each classification for each of the elements
   * present in the vocabulary by using Bayes theorem.
   */
  train(){
    for(let [key, value] of this.ids){
      // Calculate probability for all of the classifications
      for(let classification of this.documents.keys()){
        let repetitionsInClass = this.documents.get(classification).get(key) + 1;
        if(isNaN(repetitionsInClass)){
          repetitionsInClass = 1;
        }
        let totalWordsInClass = this.documents.get(classification).size;
        let totalWordsInVocabulary = this.ids.size;
        // Calculate probability equation for each element
        let probability = repetitionsInClass / (totalWordsInClass + totalWordsInVocabulary);
        this.ids.get(key).set(classification, probability);
      }
    }
    // Calculate bias for each classification
    let totalDocuments = 0;
    for(let total of this.bias.values()){
      totalDocuments += total;
    }
    for(let key of this.bias.keys()){
      this.bias.set(key, this.bias.get(key) / totalDocuments);
    }
  }

  /**
   * Calculate the probabilities that the data provided is part of
   * each of the classifications.
   * @param {number array} data - Data in the test document.
   * @return {Map} probabilities - Map containing probabilities
   * for each classification.
   */
  getClassifications(data){
    let classifications = new Map();
    // For each of the classifications
    for(let classification of this.documents.keys()){
      // Calculate the probabilities using combination of each probability
      let probability = this.bias.get(classification);
      data.forEach((element)=>{
        if(this.ids.get(element) != null){
          probability *= this.ids.get(element).get(classification);
        }
      });
      // Add probability to each classification;
      classifications.set(classification, probability);
    }
    return classifications;
  }
}

module.exports = BayesClassifier;