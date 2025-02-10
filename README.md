# Echo
- The application is an anonymous chat for the most secure communication possible.
- All information is encrypted (E2EE).
- Accounts and connections between them are established through a token system.

Echo is an anonymous chat application that allows you to communicate with friends and/or acquaintances without worrying about your personal data being leaked to third parties. To create and use an account, you only need a password, and the messages you send are encrypted. This way, no one will have access to your data or messages!

## Technologies Used: Python, Django, SQLite, JavaScript, React Native

## To run the project as a developer, you need:

### 1.1 Windows: Docker Desktop - [Download Here](https://www.docker.com/products/docker-desktop/)
- When installing Docker, you will need to restart your computer.
- After starting Docker, you might get an error requiring a newer version of WSL. Use the command: `wsl --update` - [More Info](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package).
- The first time you start Docker, it may be quite slow, so give it about 5 minutes.
- Once Docker has started successfully, open CMD and enter the following command: - docker run --name my-redis -p 6379:6379 -d redis:7
- If port 6379 is already in use, you won't be able to start the Redis server.

### 1.2 Microsoft Visual C++ 14.0 or newer - [Download Here](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

### 1.3 Install the required libraries:
- Navigate to the `server` folder in CMD and use the command:
 `pip install -r requirements.txt`

### 1.4 Migrate the project to set up the database:
- Go to the `server` directory in CMD and run:
    `python manage.py makemigrations`
    `python manage.py migrate`

### 1.5 Host the project:
- Run the command:
`daphne -b <your-ip-address> shush.asgi:application`.

### 2.1 Setting up the Client:
- Go to the `client` folder and install dependencies: `npm i`

### 2.2 Configure the `.env` file:
- If you don’t have a `.env` file, create one and add: `SERVER_IP = <your-ip-address>`

### 2.3 Running the Client:
#### 2.3.1 If you change the IP address in the `.env` file for the first time, start the project with: `npm run startClearCache`
#### 2.3.2 Start the Expo server: `npm start`You will need to scan the QR code from the console using the "Expo Go" app on your phone.

#### 2.3.3 Start the Expo server for Android:`npm run android` - If you have an Android emulator running, the application will open in it.

