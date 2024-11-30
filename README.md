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


### Detailed Explanation

#### 1. **Authentication**

- **Files Involved**: [`public/index.html`](public/index.html), [`public/app.js`](public/app.js), [`public/styles.css`](public/styles.css)
- **Functionality**:
  - **Sign Up**: Users can sign up using an email and password.
  - **Sign In**: Users can sign in using their credentials.
  - **Sign Out**: Users can sign out of their account.
  - **Auth State**: The application checks the authentication state and displays the appropriate UI.

#### 2. **Chart Generation and Display**

- **Files Involved**: [`public/prompt/prompt.html`](public/prompt/prompt.html), [`public/prompt/prompt.js`](public/prompt/prompt.js), [`public/prompt/prompt.css`](public/prompt/prompt.css)
- **Functionality**:
  - **Chat Interface**: Users can input keywords to generate data visualizations.
  - **Google Charts**: The application uses Google Charts to visualize data based on user input.
  - **Download Chart**: Users can download the generated chart as a PNG file.

#### 3. **Firebase Hosting**

- **Files Involved**: [`firebase.json`](firebase.json), [`.firebaserc`](.firebaserc), [`.github/workflows/firebase-hosting-merge.yml`](.github/workflows/firebase-hosting-merge.yml), [`.github/workflows/firebase-hosting-pull-request.yml`](.github/workflows/firebase-hosting-pull-request.yml)
- **Functionality**:
  - **Hosting Configuration**: The [`firebase.json`](firebase.json) file configures the public directory and rewrites for hosting.
  - **GitHub Actions**: CI/CD workflows for deploying the application to Firebase Hosting on merge and pull requests.

#### 4. **Styling**

- **Files Involved**: [`public/styles.css`](public/styles.css), [`public/prompt/prompt.css`](public/prompt/prompt.css)
- **Functionality**:
  - **Global Styles**: Basic styling for the entire application.
  - **Component Styles**: Specific styles for the login form, chat interface, and chart controls.

#### 5. **JavaScript Functionality**

- **Files Involved**: [`public/app.js`](public/app.js), [`public/prompt/prompt.js`](public/prompt/prompt.js)
- **Functionality**:
  - **Event Listeners**: Handling user interactions such as sign up, sign in, sign out, and sending chat messages.
  - **API Integration**: Using Google Generative AI for generating responses and Google Charts for data visualization.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
