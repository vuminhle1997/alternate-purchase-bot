# Alternate GPU-Purchase-Bot

A lighweight script bot, that buys a specific GPU from alternate.
This script uses Puppeteer as library and this should be installed.

## Requirements
- NodeJS environenment >= 12
- NPM or Yarn

## Getting started
To get started, first install the required dependencies.
It is your preferencens which package manager you use (npm or yarn), but I prefer yarn.
After you've installed the libraries, changed the value of the variables "email", "password" and "gpu" for your personal preferences

```bash
    yarn install 
    or 
    npm install
```

When you're done changing the script, write this into the terminal
```bash
    node index.js
```
The bot will find the articles. If it is not available yet, the bot will refresh the site every 2 seconds and tries to find the gpu.
When it finds it, the bot will click on the article and will buy it.