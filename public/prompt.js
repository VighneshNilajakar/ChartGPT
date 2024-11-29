// script.js
import { GoogleGenerativeAI } from "@google/generative-ai";
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
const API_KEY = "AIzaSyBQnzQnnFPPu6sWl3AZNU71w8TpKnkaCPc";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 2000,
  },
});

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    chat.sendMessage(userMessage).then((response) => {
        const msg = response.response.candidates[0].content.parts[0].text;
        console.log("API Response:", msg); // Log the response
        incomingChatLi.innerHTML = `<p>${msg}</p>`;
        drawChart(msg);
    }).catch((error) => {
        console.error("Error sending message:", error);
        incomingChatLi.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    });
};

const handleChat = () => {
    userMessage = chatInput.value;
    if (!userMessage) return;
    const inbuiltQuery = "\nGenerate data for provided Keyword that visualizes the data from your internal memory. Provide the output in JSON format with the following structure:\n{\n  \"labels\": [\"Label1\", \"Label2\", \"Label3\", ...],\n  \"values\": [Value1, Value2, Value3, ...]\n}\nEnsure the labels represent [WHAT_LABELS_REPRESENT] and the values represent [WHAT_VALUES_REPRESENT]. If applicable, ensure the values fall within an appropriate range based on the data. Make sure to not to generate any other text content. Just the JSON Content with absolute in raw form. Don't incapsulate the JSON content in code blocks.\n";
    
    const displayMessage = userMessage;
    userMessage += inbuiltQuery;

    chatbox.appendChild(createChatLi(displayMessage, "chat-outgoing"));
    chatInput.value = "";
    setTimeout(() => {
        const incomingChatLi = createChatLi("THINKING...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    }, 1000);
};

const drawChart = (jsonData) => {
    try {
        const dataObj = JSON.parse(jsonData);
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Label');
        data.addColumn('number', 'Value');
        dataObj.labels.forEach((label, index) => {
            data.addRow([label, dataObj.values[index]]);
        });

        const options = {
            title: 'Generated Chart',
            width: 600,
            height: 400,
        };

        const chartType = chartTypeSelect.value;
        currentChart = new google.visualization[chartType](chartDiv);
        currentChart.draw(data, options);
    } catch (error) {
        console.error('Error parsing JSON data:', error);
    }
};

chartTypeSelect.addEventListener('change', () => {
    if (currentChart) {
        drawChart(JSON.stringify(currentChart.getDataTable().toJSON()));
    }
});

downloadChartBtn.addEventListener('click', () => {
    const chartContainer = chartDiv.querySelector('svg');
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
        downloadLink.download = 'chart.png';
        downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
});

sendChatBtn.addEventListener("click", handleChat);