import {useAuth} from "./auth/Auth";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

function App() {
    const {accessToken} = useAuth();

    if (accessToken) {
        return <AdminPanel/>;
    } else {
        return <Login/>;
    }
}

export default App;
