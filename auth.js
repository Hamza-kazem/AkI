// Authentication Module
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authToken = null;
        this.init();
    }

    init() {
        // Listen for authentication state changes
        window.firebaseAuth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                // User is signed in
                this.getAuthToken();
                this.showMainInterface();
            } else {
                // User is signed out
                this.authToken = null;
                this.showLoginInterface();
            }
        });
    }

    async getAuthToken() {
        if (this.currentUser) {
            try {
                this.authToken = await this.currentUser.getIdToken();
                return this.authToken;
            } catch (error) {
                console.error('Error getting auth token:', error);
                return null;
            }
        }
        return null;
    }

    async login(email, password) {
        try {
            const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async logout() {
        try {
            await window.firebaseAuth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Logout error' };
        }
    }

    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'User not found',
            'auth/wrong-password': 'Incorrect password',
            'auth/invalid-email': 'Invalid email address',
            'auth/user-disabled': 'This user has been disabled',
            'auth/too-many-requests': 'Too many attempts, please try again later',
            'auth/network-request-failed': 'Network connection error',
            'auth/invalid-credential': 'Invalid credentials'
        };
        return errorMessages[errorCode] || 'Authentication error occurred';
    }

    showLoginInterface() {
        const terminal = document.querySelector('.terminal');
        terminal.innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <!-- AKI ASCII Logo -->
                <div style="color: #00ff00; font-family: 'Courier New', monospace; font-size: 14px; margin-bottom: 30px; white-space: pre-line; text-shadow: 0 0 10px #00ff00;">
           _  _______ 
     /\   | |/ /_   _|
    /  \  | ' /  | |  
   / /\ \ |  <   | |  
  / ____ \| . \ _| |_ 
 /_/    \_\_|\_\_____|
                      
                </div>
                
                <div style="color: #00ff00; font-size: 18px; margin-bottom: 30px;">
                    <span class="mysql-prompt">mysql></span> AUTHENTICATION REQUIRED
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; color: #00ff00;">Email:</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" 
                           style="width: 300px; padding: 8px; font-family: monospace; background-color: black; color: white; border: 1px solid white;">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 5px; color: #00ff00;">Password:</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password"
                           style="width: 300px; padding: 8px; font-family: monospace; background-color: black; color: white; border: 1px solid white;">
                </div>
                
                <button id="loginBtn" style="padding: 10px 20px; font-family: monospace; background-color: black; color: white; border: 1px solid white; cursor: pointer;">
                    Login
                </button>
                
                <div id="loginError" style="color: #ff0000; margin-top: 15px; display: none;"></div>
                <div id="loginLoading" style="color: #00ff00; margin-top: 15px; display: none;">Authenticating...</div>
            </div>
        `;

        // Add event listeners
        document.getElementById('loginBtn').addEventListener('click', this.handleLogin.bind(this));
        document.getElementById('loginEmail').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('loginPassword').focus();
            }
        });
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        const loadingDiv = document.getElementById('loginLoading');
        const loginBtn = document.getElementById('loginBtn');

        if (!email || !password) {
            errorDiv.textContent = 'Please enter both email and password';
            errorDiv.style.display = 'block';
            return;
        }

        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'block';
        loginBtn.disabled = true;

        const result = await this.login(email, password);
        
        loadingDiv.style.display = 'none';
        loginBtn.disabled = false;

        if (!result.success) {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        }
    }

    showMainInterface() {
        const terminal = document.querySelector('.terminal');
        terminal.innerHTML = `
            <!-- Terminal Title Bar -->
            <div style="background-color: #333; margin: -15px -15px 15px -15px; padding: 5px 15px; border-bottom: 1px solid #555; font-size: 12px; color: #ccc;">
                <span style="color: #00ff00;">●</span> MySQL Terminal - Secure Database Access
            </div>
            
            <!-- Terminal Header with Options -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <div style="margin-bottom: 5px;">
                        <span class="mysql-prompt">mysql></span> SELECT * FROM users WHERE username = 
                        <input type="text" id="usernameSearch" placeholder="Enter username" style="padding: 5px; font-family: monospace; font-size: 16px; background-color: black; color: white; border: 1px solid white; margin: 0 5px; width: 250px;">
                        <button id="loadData" style="padding: 5px 10px; font-family: monospace; font-size: 16px; background-color: black; color: white; border: 1px solid white; margin-left: 5px;">Execute</button>
                    </div>
                    <div>
                        <span id="loadingMsg" style="color: #00ff00; display: none;">Loading...</span>
                    </div>
                </div>
                
                <!-- Options Menu -->
                <div class="options-menu" style="position: relative; margin-left: 20px;">
                    <button id="optionsBtn" class="options-btn">
                        [Options]
                    </button>
                    <div id="optionsMenu" class="options-dropdown" style="display: none; position: absolute; top: 100%; right: 0; z-index: 1000;">
                        <div id="addDataOption" class="options-item">
                            Add New Data
                        </div>
                        <div id="logoutOption" class="options-item">
                            Logout
                        </div>
                    </div>
                </div>
            </div>
            
            <table id="resultsTable" style="display:none;">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th>Extra</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Results will be inserted here -->
                </tbody>
            </table>
            
            <div id="errorMsg" style="color: #ff0000; margin-top: 10px; display: none;"></div>
            <div id="noDataMsg" style="color: #ffff00; margin-top: 10px; display: none;">No data to display</div>
        `;

        // Re-initialize the main app functionality
        if (window.initMainApp) {
            window.initMainApp();
        }

        // Add options menu functionality
        const optionsBtn = document.getElementById('optionsBtn');
        const optionsMenu = document.getElementById('optionsMenu');
        const addDataOption = document.getElementById('addDataOption');
        const logoutOption = document.getElementById('logoutOption');

        // Toggle options menu
        optionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            optionsMenu.style.display = optionsMenu.style.display === 'none' ? 'block' : 'none';
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            optionsMenu.style.display = 'none';
        });

        // Prevent menu from closing when clicking inside it
        optionsMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Add new data functionality
        addDataOption.addEventListener('click', () => {
            optionsMenu.style.display = 'none';
            window.open('add-data.html', '_blank');
        });

        // Add logout functionality
        logoutOption.addEventListener('click', async () => {
            optionsMenu.style.display = 'none';
            const result = await this.logout();
            if (!result.success) {
                alert(result.error);
            }
        });
    }

    isAuthenticated() {
        return this.currentUser !== null && this.authToken !== null;
    }

    async getValidToken() {
        if (!this.isAuthenticated()) {
            return null;
        }
        
        // Refresh token if needed
        try {
            this.authToken = await this.currentUser.getIdToken(true);
            return this.authToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
