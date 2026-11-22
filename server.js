// ==============================================================================
// Faculty of Information and Communication Technology, Mahidol University
// ITDS242 Web Technologies Lab - Root Launcher
// File: server.js
// Description: Starts both Web Service Server (Port 3000) and Front-end Server (Port 3100)
// ==============================================================================

const path = require('path');

// 1. Start Web Service Server (Port 3000)
require(path.join(__dirname, 'secX_grY_ws_src', 'server.js'));

// 2. Start Front-end Server (Port 3100)
require(path.join(__dirname, 'secX_grY_fe_src', 'server.js'));
