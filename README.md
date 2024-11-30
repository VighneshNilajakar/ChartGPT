# ChartGPT

ChartGPT is an AI-powered chart generation tool that allows users to generate charts based on their input. The application uses Firebase for authentication and hosting, and Google Charts for data visualization.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with email/password and Google Sign-In
- AI-powered chart generation
- Download generated charts as PNG files
- Responsive design

## Architecture

### Frontend

- **HTML/CSS**: The frontend is built using HTML and CSS for structure and styling.
- **JavaScript**: Handles user interactions, authentication, and chart generation.
- **Google Charts**: Used for data visualization.
- **Google Generative AI**: Used for generating responses based on user input.

### Backend

- **Firebase Authentication**: Manages user authentication with email/password and Google Sign-In.
- **Firebase Hosting**: Hosts the static files and serves the application.

### CI/CD

- **GitHub Actions**: Automates the deployment process to Firebase Hosting on merge and pull requests.

## Setup and Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/vighneshnilajakar/chartgpt.git
    cd chartgpt
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up Firebase**:
    - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
    - Add your Firebase configuration to `public/app.js`.

4. **Run the application locally**:
    ```sh
    npm start
    ```

5. **Deploy to Firebase Hosting**:
    ```sh
    firebase deploy
    ```

## Usage

1. **Sign In**:
    - Use email/password or Google Sign-In to authenticate.

2. **Generate Charts**:
    - Enter a keyword in the chat input to generate a chart.
    - Select the chart type from the dropdown menu.
    - Download the generated chart as a PNG file.

## Project Structure
