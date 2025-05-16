# Solance - a financial tracker for crypto assets on Solana
# Project Development Guidelines

This document provides guidelines and instructions for developing and maintaining the Solance/PromiseSync project, a Solana blockchain wallet application.

## Build/Configuration Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm (v7+ recommended)

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   node main.js
   ```

   The server will run on port 3001 by default.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The frontend will run on port 3000 by default and will be accessible at http://localhost:3000.

### Environment Configuration
- The backend is configured to allow CORS from specific origins defined in the `allowedOrigins` array in `backend/main.js`.
- The backend connects to the Solana mainnet-beta by default. To change this, modify the `version` variable in `backend/main.js`.

## Additional Development Information

### Project Structure
- **Backend**: Express.js server that interacts with the Solana blockchain
    - `main.js`: Main server file with API endpoints
    - API endpoints:
        - `/checkAccount`: Gets account information from a Solana wallet address
        - `/history`: Gets transaction history for a wallet
        - `/tokens`: Gets token information for a wallet
        - `/tokengraph`: Gets price history for a specific token

- **Frontend**: React application
    - Uses React Router for navigation
    - Uses Redux for state management
    - Follows a Container/Component pattern
    - Uses CSS modules for styling

### Code Style and Patterns

#### Frontend
1. **Component Structure**:
    - Functional components with hooks
    - Container/Component pattern:
        - Container components handle data and logic
        - Presentational components handle rendering

2. **Styling**:
    - CSS Modules (imported as `s` in components)
    - Example: `import s from "./Component.module.css"`

3. **State Management**:
    - Redux for global state
    - React hooks (useState, useEffect) for local state

#### Backend
1. **API Structure**:
    - RESTful endpoints
    - Express.js middleware for request handling

2. **Performance Optimization**:
    - Uses NodeCache for caching responses
    - Implements middleware for caching common requests

3. **Error Handling**:
    - Try/catch blocks for async operations
    - Proper HTTP status codes for different error scenarios

### Working with the Solana Blockchain
- The application uses `@solana/web3.js` for interacting with the Solana blockchain
- Token information is fetched using `@solana/spl-token` and `@metaplex-foundation/js`
- Price data is fetched from the CoinGecko API

### Debugging Tips
1. **Frontend**:
    - Use React DevTools for component inspection
    - Use Redux DevTools for state debugging

2. **Backend**:
    - Check server logs for errors
    - Use tools like Postman to test API endpoints directly

3. **Blockchain Interactions**:
    - Use Solana Explorer (https://explorer.solana.com/) to verify transactions and account data
    - Test with known wallet addresses before using production data
