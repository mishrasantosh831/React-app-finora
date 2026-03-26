import { Show, SignIn, UserButton, useUser } from '@clerk/react';
// import { getDailyPerformance } from './services/alphaVantageService';
import StockList from './components/StockList';
import './App.css';
function App() {
  const { user } = useUser();
  // const data = getDailyPerformance('AAPL');
  // console.log("data", data);
  return (
    <div className="app-container">
      <header>
        <h1>Finora - Your Personal Finance Dashboard</h1>
        <h3>Track your investments and manage your finances effortlessly</h3>
      </header>
      <Show when="signed-out">
        <SignIn></SignIn>

      </Show>

      <Show when="signed-in">
        {user ? (
          <div className='user-header'>
            <UserButton/><h1>Welcome, {user.firstName || user.username || "User"}! 👋</h1>
            <StockList userId={user.id} />
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        

      </Show>
      
    </div>
  )
}

export default App