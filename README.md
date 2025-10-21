# ChartGPT

✨ **ChartGPT** is an AI-powered chart generation tool that allows users to generate stunning charts based on their input. The application uses Firebase for authentication and hosting, and Google Charts for data visualization.

#### 🚀 Demo :
- **Website**: https://chartgpt-tv.web.app/
- **YouTube Video**: https://youtu.be/6qq1pvhh9VI

## 📋 Table of Contents

- [Features](#features)
- [What's New](#whats-new)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- ✅ User authentication with email/password and Google Sign-In
- ✅ AI-powered chart generation (Gemini 2.0 Flash)
- ✅ Download generated charts as PNG files
- ✅ Fully responsive design (Desktop, Tablet, Mobile)
- ✅ Modern gradient UI with smooth animations
- ✅ Comprehensive error handling with funny messages
- ✅ Chart type selection (Column, Bar, Line, Pie)
- ✅ Real-time chat interface with AI
- ✅ Input validation and error messages
- ✅ Loading states and animations

## 🎨 What's New

### UI/UX Improvements
- **Modern Design**: Beautiful purple gradient theme with smooth animations
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Better Typography**: Enhanced fonts and spacing for better readability
- **Interactive Elements**: Smooth hover effects and transitions
- **Typing Animation**: Animated dots when AI is processing

### Error Handling & Validation
- ✅ Comprehensive error messages with emojis and humor
- ✅ Input validation for authentication fields
- ✅ Network error handling
- ✅ API quota exceeded handling with helpful tips
- ✅ Chart parsing error handling
- ✅ File download error handling
- ✅ Toast notifications for all actions

### Code Quality
- ✅ Try-catch blocks for all async operations
- ✅ Better state management
- ✅ Input sanitization
- ✅ Loading state indicators
- ✅ Button disable states during processing
- ✅ Keyboard support (Enter to send message)

## Architecture

### Frontend

- **HTML/CSS**: Modern, responsive frontend with mobile-first approach
- **JavaScript (ES6+)**: Handles user interactions, authentication, and chart generation
- **Google Charts**: Data visualization library
- **Google Generative AI (Gemini 2.0 Flash)**: AI-powered chart data generation

### Backend

- **Firebase Authentication**: Secure email/password and Google Sign-In
- **Firebase Hosting**: Fast, secure static file hosting

### CI/CD

- **GitHub Actions**: Automated deployment on push to main branch

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v14+)
- Firebase CLI
- Google account for Firebase
- Google AI API key

### Step 1: Clone Repository
```sh
git clone https://github.com/vighneshnilajakar/chartgpt.git
cd chartgpt
```

### Step 2: Create Configuration File
```sh
cp public/config.example.js public/config.js
```

### Step 3: Get Your API Keys

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firebase Authentication (Email/Password + Google Sign-In)
4. Copy the configuration from Project Settings

**Google Generative AI:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. ⚠️ **Keep this secret!** Don't commit it to GitHub!

### Step 4: Update config.js
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const GENERATIVE_AI_API_KEY = "YOUR_GOOGLE_AI_API_KEY";
```

### Step 5: Run Locally (Firebase Emulator)
```sh
firebase emulators:start --only hosting
```
Visit: `http://localhost:5000`

### Step 6: Deploy to Firebase
```sh
firebase login
firebase deploy
```

## 📖 Usage

### 1. **Sign In**
- Use email/password or Google Sign-In to authenticate
- Enter valid email and password
- Enjoy funny error messages if something goes wrong! 😄

### 2. **Generate Charts**
- Enter a keyword (e.g., "world population", "cryptocurrency prices")
- Select your preferred chart type:
  - 📊 Column Chart (default)
  - 📈 Bar Chart
  - 📉 Line Chart
  - 🥧 Pie Chart
- AI will generate relevant data and visualize it
- Watch the animated typing indicator while processing

### 3. **Download Chart**
- Click the "⬇️ Download Chart" button
- Chart will be saved as PNG to your downloads folder

### 4. **Sign Out**
- Click the Sign Out button to logout
- Your session will be cleared

## ❌ Error Handling

ChartGPT handles errors gracefully with helpful and funny messages:

### Authentication Errors
```
❌ User not found! Did you forget your email address? 😅
🔐 Wrong password! Your memory is as good as your password 🤦
📧 That email looks fishy... is it even valid? 🐟
```

### API/Quota Errors
```
💰 Quota exceeded! Dev made too many requests without paying. F for respect! 🪦
⏰ Oops! Dev forgot to upgrade the plan 💸 The API quota is exhausted!
🔑 Invalid API key! The dev exposed secrets on GitHub and now everything is broken! 🙈
```

### Validation Errors
```
📧 Please enter your email address! 👈
🔑 Password field is empty! Enter something! 👆
😅 Empty message! Type something, anything! 📝
```

## 🔧 Troubleshooting

### "Quota exceeded" Error
This means the API rate limit has been reached. Here's how to fix it:

1. **Request Quota Increase**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **APIs & Services** → **Quotas**
   - Search for `generativelanguage.googleapis.com/generate_content_requests`
   - Click on it and edit the quota
   - Request increase (e.g., to 100 requests/minute)
   - Wait for approval (usually instant)

2. **Enable Billing**:
   - Go to **Billing** in Google Cloud Console
   - Link a billing account (Google often gives $300 credits)
   - This usually provides immediate quota

3. **Wait and Retry**:
   - The API resets every minute
   - Try again after a minute

### "Invalid API Key" Error
- Check your `config.js` file
- Verify the API keys are copied correctly
- Make sure keys are not expired
- ⚠️ Never commit `config.js` to GitHub!

### Charts Not Loading
- Ensure JavaScript is enabled
- Check browser console for errors (F12)
- Verify Google Charts library is loading
- Try a different chart type

### Sign In Issues
- Clear browser cookies/cache
- Try incognito/private mode
- Verify Firebase project has authentication enabled
- Check if user account exists in Firebase

### Deployment Issues
```sh
# Login to Firebase
firebase login

# Check deployment status
firebase deploy --debug

# View logs
firebase functions:log
```

## 📱 Browser Compatibility

| Browser | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Chrome  | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari  | ✅ | ✅ | ✅ |
| Edge    | ✅ | ✅ | ✅ |

## 🏗️ Project Structure

```
ChartGPT/
├── public/
│   ├── index.html           # Login page
│   ├── prompt.html          # Main app page
│   ├── app.js              # Authentication logic
│   ├── prompt.js           # Chart generation logic
│   ├── styles.css          # Login page styles
│   ├── prompt.css          # Main app styles
│   ├── config.example.js   # API keys template
│   └── config.js           # API keys (not in git)
├── firebase.json           # Firebase config
├── package.json            # Dependencies
└── README.md              # This file
```

## 🚀 Performance

- **Response Time**: < 3 seconds for chart generation
- **File Size**: Optimized CSS/JS with no unnecessary dependencies
- **Load Time**: ~2-3 seconds on 4G connection
- **Mobile Friendly**: Optimized for all screen sizes

## 🔐 Security

⚠️ **Important Security Tips**:
1. ✅ Never commit `config.js` to GitHub
2. ✅ Use environment variables for sensitive data in production
3. ✅ Enable Firebase rules for authentication
4. ✅ Regularly rotate API keys
5. ✅ Use `.gitignore` to exclude `config.js`

### .gitignore Example
```
# API Keys
public/config.js
.env
.env.local

# Dependencies
node_modules/

# Firebase
.firebase/
.firebaserc
```

## 📊 Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **UI Library** | Google Charts |
| **AI** | Google Generative AI (Gemini 2.0 Flash) |
| **Authentication** | Firebase Auth |
| **Hosting** | Firebase Hosting |
| **Fonts** | Google Fonts (Poppins) |
| **Icons** | Emojis 🎉 |

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Vighnesh Nilajakar**
- GitHub: [@VighneshNilajakar](https://github.com/VighneshNilajakar)

## 🆘 Support

Having issues? Here's what to try:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review your Firebase configuration
3. Check browser console for errors (F12)
4. Open an issue on GitHub

## 🎉 Special Thanks

- Google Firebase team for excellent authentication and hosting
- Google AI team for the amazing Generative AI API
- Google Charts for powerful visualization tools

---

**Enjoy creating amazing charts with AI! 🚀✨**
