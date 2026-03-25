import { Show, SignIn, UserButton, useUser } from '@clerk/react';
// import { getDailyPerformance } from './services/alphaVantageService';
import StockList from './components/StockList';
function App() {
  // const { user } = useUser();
  // const data = getDailyPerformance('AAPL');
  // console.log("data", data);
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignIn></SignIn>

        </Show>

        <Show when="signed-in">
          {user ? (
            <>
              <UserButton></UserButton>
              <StockList userId={user.id}></StockList>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
          

        </Show>
      </header>
    </>
  )
}

export default App