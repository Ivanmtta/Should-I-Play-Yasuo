![Should I Play Yasuo?](./logo.png)
# Description
*Should I Play Yasuo?* is a tool that uses the [Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier) machine learning model to predict the outcome of a [League of Legends](https://na.leagueoflegends.com/en-us/) game if you use the champion Yasuo by providing the list of the enemy team's champions.

### Demo
![Demo](./demo.gif)

### Technologies
Full-Stack web application that uses:
* Node.js and Express for the Back-End
* HTML, CSS, JS and Boostrap 4 for the Front-End
* NeDB for the database.

### How it works?
* Using the previewsly extracted data from 1000 league games stored in the NeDB database
* The application trains the classifier to calculate the probabilities for each champion
* Once the user makes a selection, it uses that trained data to make a prediction
* All of this using Bayes theorem

### License
Copyright (c) 2020 [Ivan Mota](https://ivanmtta.github.io/)
Released under the MIT License