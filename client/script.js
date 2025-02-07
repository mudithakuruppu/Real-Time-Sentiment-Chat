//web socet connect 3000 port start server port |node server.js|
const socket = io('http://localhost:3000');
let sentimentData = [];
const ctx = document.getElementById('sentimentChart').getContext('2d');

//chart line create and design with colors +1 to -1
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sentiment Score',
      data: [],
      borderColor: '#007bff',
      tension: 0.1
    }]
  },
  options: {
    scales: {
      y: {
        min: -1,
        max: 1
      }
    }
  }
});

//recive message 

socket.on('message', (message) => {
  const messagesDiv = document.getElementById('messages');
  const messageElement = document.createElement('div');
  
  messageElement.className = 'message';
  messageElement.innerHTML = `
    <strong>${message.user}</strong> 
    [${message.timestamp}]: ${message.text}
    <div class="sentiment">Sentiment: ${message.sentiment.toFixed(2)}</div>
  `;


  messageElement.style.background = message.sentiment > 0 
    ? 'rgba(0,123,255,0.1)' 
    : message.sentiment < 0 
    ? 'rgba(255,0,0,0.1)' 
    : '#f8f9fa';

    // append messg to messge box
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

 // chart update
  sentimentData.push(message.sentiment);
  chart.data.labels.push(message.timestamp);
  chart.data.datasets[0].data = sentimentData;
  chart.update();
});

//messge send

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = {
    text: input.value,
    user: 'User' + Math.floor(Math.random() * 1000)
  };

  if (message.text.trim()) {
    socket.emit('message', message);
    input.value = '';
  }
}

//enter key push 
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});