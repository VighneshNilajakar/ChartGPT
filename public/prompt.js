// script.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GENERATIVE_AI_API_KEY } from "./config.js";

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(() => console.log("Google Charts Loaded"));

const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");
const chartDiv = document.getElementById('chartDiv');
const chartTypeSelect = document.getElementById('chartType');
const downloadChartBtn = document.getElementById('downloadChart');

let userMessage;
let currentChart;
let currentChartData; // Store current data for chart type switching
let isProcessing = false;

const genAI = new GoogleGenerativeAI(GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const chat = model.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 2000,
  },
});

// Funny error messages
const funnyErrors = {
  'RATE_LIMIT_EXCEEDED': '⏰ Oops! Dev forgot to upgrade the plan 💸 The API quota is exhausted! Check back later or... convince the dev to pay! 😅',
  'API_KEY_INVALID': '🔑 Invalid API key! The dev exposed secrets on GitHub and now everything is broken! 🙈',
  'NETWORK_ERROR': '🌐 Network error! Is your internet playing hide and seek? 👻',
  'CHART_ERROR': '📊 Chart error! Even AI can\'t make sense of this data! 🤷',
  'INVALID_JSON': '📝 Invalid data received! AI gave us gibberish! 🤖💬',
  'QUOTA_EXCEEDED': '💰 Quota exceeded! Dev made too many requests without paying. F for respect! 🪦',
  'PARSING_ERROR': '🔍 Couldn\'t parse the response! AI spoke in tongues! 🗣️',
  'DEFAULT': '❌ Something went wrong! Even the AI is confused now! 😕'
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

// Show loading animation
const createLoadingLi = () => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", "chat-incoming");
    chatLi.innerHTML = `<p><span class="typing-indicator"><span></span><span></span><span></span></span></p>`;
    return chatLi;
};

// Get appropriate error message
const getErrorMessage = (error) => {
    const errorStr = error.toString();
    
    if (errorStr.includes('429') || errorStr.includes('RATE_LIMIT_EXCEEDED') || errorStr.includes('quota')) {
        return funnyErrors.QUOTA_EXCEEDED;
    }
    if (errorStr.includes('invalid') || errorStr.includes('API')) {
        return funnyErrors.API_KEY_INVALID;
    }
    if (errorStr.includes('Network') || errorStr.includes('network')) {
        return funnyErrors.NETWORK_ERROR;
    }
    if (errorStr.includes('JSON') || errorStr.includes('parse')) {
        return funnyErrors.INVALID_JSON;
    }
    
    return funnyErrors.DEFAULT;
};

// Security filter to prevent sharing sensitive information
const filterSensitiveContent = (message) => {
    // List of sensitive patterns to block
    const sensitivePatterns = [
        /system prompt/gi,
        /system instruction/gi,
        /hidden instruction/gi,
        /instruction hidden/gi,
        /api.?key/gi,
        /secret.?key/gi,
        /auth token/gi,
        /bearer token/gi,
        /password/gi,
        /private.?key/gi,
        /database url/gi,
        /connection.?string/gi,
        /your.?instruction/gi,
        /your.?prompt/gi,
        /internal.?instruction/gi,
        /backend.?config/gi,
        /firebase.?config/gi,
        /development.?mode/gi,
        /debug.?mode/gi,
        /test.?mode/gi,
        /console.?log/gi,
        /environment.?variable/gi,
        /node.?env/gi,
        /process.?env/gi,
    ];
    
    // Check if message contains sensitive patterns
    for (let pattern of sensitivePatterns) {
        if (pattern.test(message)) {
            console.warn("🚨 Security Alert: AI tried to share sensitive content!");
            return "🔒 I can't share system or configuration details! Nice try though! 😏";
        }
    }
    
    return message;
};

const generateResponse = (incomingChatLi) => {
    chat.sendMessage(userMessage)
        .then((response) => {
            try {
                let msg = response.response.candidates[0].content.parts[0].text;
                console.log("API Response:", msg);
                
                // Apply security filter
                msg = filterSensitiveContent(msg);
                
                incomingChatLi.innerHTML = `<p>${msg}</p>`;
                drawChart(msg);
            } catch (parseError) {
                console.error("Parsing error:", parseError);
                incomingChatLi.innerHTML = `<p>${funnyErrors.PARSING_ERROR}</p>`;
            }
        })
        .catch((error) => {
            console.error("Error sending message:", error);
            const errorMessage = getErrorMessage(error);
            
            // Special handling for quota errors
            if (error.toString().includes('429') || error.toString().includes('quota')) {
                incomingChatLi.innerHTML = `<p>${errorMessage}</p>`;
                // Show motivational message
                setTimeout(() => {
                    const motivationLi = createChatLi(
                        '💡 Pro tip: Ask the dev to:\n1. Request quota increase in Google Cloud Console\n2. Enable billing on the Firebase project\n3. Switch to a paid plan\n\n... or just wait a minute and try again! ⏳',
                        'chat-incoming'
                    );
                    chatbox.appendChild(motivationLi);
                    chatbox.scrollTop = chatbox.scrollHeight;
                }, 500);
            } else {
                incomingChatLi.innerHTML = `<p>${errorMessage}</p>`;
            }
            
            isProcessing = false;
            sendChatBtn.disabled = false;
            sendChatBtn.textContent = 'Send';
        });
};

const handleChat = () => {
    if (isProcessing) {
        createChatLi('⏳ Still processing! Patience, young grasshopper! 🧘', 'chat-incoming');
        return;
    }
    
    userMessage = chatInput.value.trim();
    
    // Validation
    if (!userMessage) {
        const errorLi = createChatLi('😅 Empty message! Type something, anything! 📝', 'chat-incoming');
        chatbox.appendChild(errorLi);
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
    }
    
    if (userMessage.length > 500) {
        const errorLi = createChatLi('📏 Your message is too long! Keep it under 500 characters! 🤐', 'chat-incoming');
        chatbox.appendChild(errorLi);
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
    }
    
    // Prompt injection prevention - block suspicious patterns
    const injectionPatterns = [
        /ignore.*instruction/gi,
        /override.*instruction/gi,
        /system prompt/gi,
        /hidden instruction/gi,
        /reveal.*prompt/gi,
        /show.*system/gi,
        /what.*instruction/gi,
        /forget.*previous/gi,
        /disregard.*previous/gi,
        /simulate.*mode/gi,
        /developer.?mode/gi,
        /debug.?mode/gi,
    ];
    
    for (let pattern of injectionPatterns) {
        if (pattern.test(userMessage)) {
            const errorLi = createChatLi('🚨 Nice try hacker! 🕵️ But I\'m not revealing any secrets! 🔐', 'chat-incoming');
            chatbox.appendChild(errorLi);
            chatbox.scrollTop = chatbox.scrollHeight;
            return;
        }
    }

    isProcessing = true;
    sendChatBtn.disabled = true;
    sendChatBtn.textContent = 'Processing...';
    
    const inbuiltQuery = "\n\nIMPORTANT: Generate data for provided Keyword that visualizes the data from your internal memory. Respond ONLY with raw JSON, nothing else.\n\nJSON structure (no code blocks, no markdown, just raw JSON):\n{\n  \"labels\": [\"Label1\", \"Label2\", \"Label3\"],\n  \"values\": [10, 20, 30]\n}\n\n⚠️ CRITICAL RULES:\n1. Output ONLY valid JSON\n2. NO code blocks (no ```json)\n3. NO markdown formatting\n4. NO extra text before or after\n5. NO comments in JSON\n6. Ensure labels and values arrays have same length\n7. Values must be numbers\n\nExample response (exactly this format):\n{\"labels\":[\"Jan\",\"Feb\",\"Mar\"],\"values\":[100,200,150]}\n";
    
    const displayMessage = userMessage;
    userMessage += inbuiltQuery;

    chatbox.appendChild(createChatLi(displayMessage, "chat-outgoing"));
    chatInput.value = "";
    
    setTimeout(() => {
        const incomingChatLi = createLoadingLi();
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTop = chatbox.scrollHeight;
        generateResponse(incomingChatLi);
    }, 500);
};

const drawChart = (jsonData) => {
    try {
        // Clean the JSON data - remove code blocks if present
        let cleanedData = jsonData.trim();
        
        // Remove markdown code blocks (```json ... ```)
        if (cleanedData.includes('```')) {
            cleanedData = cleanedData.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '');
        }
        
        // Try to extract JSON if there's extra text
        const jsonMatch = cleanedData.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedData = jsonMatch[0];
        }
        
        cleanedData = cleanedData.trim();
        
        console.log("Cleaned JSON:", cleanedData);
        
        const dataObj = JSON.parse(cleanedData);
        
        // Validate data
        if (!dataObj.labels || !dataObj.values) {
            throw new Error("Invalid data structure - missing labels or values");
        }
        if (!Array.isArray(dataObj.labels) || !Array.isArray(dataObj.values)) {
            throw new Error("Labels and values must be arrays");
        }
        if (dataObj.labels.length !== dataObj.values.length) {
            throw new Error(`Labels and values length mismatch: ${dataObj.labels.length} labels vs ${dataObj.values.length} values`);
        }
        if (dataObj.labels.length === 0) {
            throw new Error("No data provided - arrays are empty");
        }
        
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        data.addColumn('number', 'Value');
        
        dataObj.labels.forEach((label, index) => {
            const value = Number(dataObj.values[index]);
            if (isNaN(value)) {
                throw new Error(`Invalid number value at index ${index}: ${dataObj.values[index]}`);
            }
            data.addRow([String(label), value]);
        });

        // Store the data for chart type switching
        currentChartData = {
            labels: dataObj.labels,
            values: dataObj.values
        };

        const options = {
            title: 'Generated Chart',
            backgroundColor: '#fff',
            titleTextStyle: {
                color: '#333',
                fontSize: 18,
                bold: true
            },
            animation: {
                duration: 1000,
                easing: 'out'
            }
        };

        const chartType = chartTypeSelect.value;
        
        // Clear previous chart
        chartDiv.innerHTML = '';
        
        try {
            currentChart = new google.visualization[chartType](chartDiv);
            currentChart.draw(data, options);
            
            // Success feedback
            isProcessing = false;
            sendChatBtn.disabled = false;
            sendChatBtn.textContent = 'Send';
        } catch (chartDrawError) {
            throw new Error("Failed to draw chart: " + chartDrawError.message);
        }
    } catch (error) {
        console.error('Chart error:', error);
        chartDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px; flex-direction: column; color: #666;">
                <p style="font-size: 48px; margin-bottom: 10px;">📊</p>
                <p style="font-size: 16px; text-align: center;">Couldn't create chart! ${funnyErrors.CHART_ERROR}</p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">Error: ${error.message}</p>
            </div>
        `;
        
        isProcessing = false;
        sendChatBtn.disabled = false;
        sendChatBtn.textContent = 'Send';
    }
};

chartTypeSelect.addEventListener('change', () => {
    if (!currentChart || !currentChartData) {
        const errorLi = createChatLi('📊 Generate a chart first before changing type! 🎨', 'chat-incoming');
        chatbox.appendChild(errorLi);
        chatbox.scrollTop = chatbox.scrollHeight;
        return;
    }
    
    try {
        // Recreate data table with stored data
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        data.addColumn('number', 'Value');
        
        currentChartData.labels.forEach((label, index) => {
            const value = Number(currentChartData.values[index]);
            data.addRow([String(label), value]);
        });
        
        const options = {
            title: 'Generated Chart',
            backgroundColor: '#fff',
            titleTextStyle: {
                color: '#333',
                fontSize: 18,
                bold: true
            },
            animation: {
                duration: 1000,
                easing: 'out'
            }
        };
        
        const chartType = chartTypeSelect.value;
        chartDiv.innerHTML = '';
        
        // Create and draw new chart type
        currentChart = new google.visualization[chartType](chartDiv);
        currentChart.draw(data, options);
        
        const successLi = createChatLi(`✅ Chart type changed to ${chartType}! 🎨`, 'chat-incoming');
        chatbox.appendChild(successLi);
        chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
        console.error('Error changing chart type:', error);
        const errorLi = createChatLi(`❌ Failed to change chart type: ${error.message}`, 'chat-incoming');
        chatbox.appendChild(errorLi);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});

downloadChartBtn.addEventListener('click', () => {
    try {
        if (!currentChart) {
            const errorLi = createChatLi('⬇️ Generate a chart first before downloading! 📊', 'chat-incoming');
            chatbox.appendChild(errorLi);
            return;
        }
        
        const chartContainer = chartDiv.querySelector('svg');
        if (!chartContainer) {
            throw new Error("Chart SVG not found");
        }
        
        const svgData = new XMLSerializer().serializeToString(chartContainer);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngFile;
            downloadLink.download = `chart-${new Date().getTime()}.png`;
            downloadLink.click();
            
            const successLi = createChatLi('✅ Chart downloaded successfully! 📊', 'chat-incoming');
            chatbox.appendChild(successLi);
            chatbox.scrollTop = chatbox.scrollHeight;
        };
        
        img.onerror = () => {
            throw new Error("Failed to load chart image");
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
        console.error('Download error:', error);
        const errorLi = createChatLi(`❌ Download failed! ${error.message}`, 'chat-incoming');
        chatbox.appendChild(errorLi);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});

sendChatBtn.addEventListener("click", handleChat);

// Enter key support (Shift+Enter for new line)
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});