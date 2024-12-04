# cardking

## Overview
This app aims to create a modern web-based application designed to support effective learning through flashcards. Users can create personalized quizzes, set learning goals and track their progress. The app focuses on providing a user-friendly interface and includes features for importing and exporting flashcards, making it a versatile tool for learners.

## Accessability
The app is developed as a web-based solution accessible via browser on both desktop and mobile devices. While the app requires an internet connection, this approach ensures platform independence and seamless access across devices. Offline functionality is not supported.

This application is ideal for students, professionals and lifelong learners aiming to enhance knowledge through structured, interactive and personalized study methods.

## Features
- **Flashcard Management**:
  Create, organize and edit flashcards with ease. Cards can be categorised, searched and filtered to maintain clarity even with large collections.
- **Interactive Quiz Modes**:
  Test your knowledge through various formats, including:
    - Mutliple-Choice
    - Single-Choice
    - True/False questions
- **Spaced Repetition**:
  OPtimize lerning with an algorithm that schedules review sessions based on individual progress, promoting long-term memory retention.
- **Gamification**:
  Stay motivated with badges, leaderboards and progress tracking.
- **Learning Analytics**:
  Visualize your progress with charts and reports to identify areas needing improvement. Set learning goals and monitor your achievements.
## Project setup
Its neccessary to install needed node_modules separately for the server and client. Follow the instructions of your IDE to do so or else execute the following code snippets:
##### Server side installation of modules
```
cd server
npm install
```
##### Change to base directory
```
cd ..
```
##### Client side installation of modules
```
cd client
npm install
cd ..
```
### Storing serverside process variables
Process variables such as API keys and DB connection variables should be stored in `server/.env` in the format
```
PORT=6000
API_KEY=1234
DB_USER='username'
DB_PASSWD='password'
```
wheread `1234` represents the API key
#### Start Server
```
npm run server
```
#### Start Client
```
npm run client
```