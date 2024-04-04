import {useAuth} from "./auth/Auth";
import {useState} from "react";
import Input from "@mui/joy/Input";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Key from "@mui/icons-material/Key";
import {Alert, Button} from "@mui/joy";
import axios from "axios";

function AddUser() {
    const {login} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        axios.post('/api/register/', {username, password}, customConfig)
            .then((response) => {
                setError('')
            })
            .catch((error) => {
                setError(error.response.data.detail)
            });
    };

    return (
        <div style={{width: "33%", height: "33%", marginLeft: "33%", marginTop: "250px"}}>
            {error ?<Alert color="danger">{error}</Alert> : null}
            <Input style={{marginTop: "25px"}} startDecorator={<AccountBoxIcon/>} placeholder="Login"
                   onChange={(e) => setUsername(e.target.value)}/>
            <Input style={{marginTop: "25px"}} type="password" startDecorator={<Key/>} placeholder="Password"
                   onChange={(e) => setPassword(e.target.value)}/>
            <div style={{marginTop: "25px"}}>
                <Button style={{width: "100%"}} onClick={handleRegister}>
                    Создать пользователя
                </Button>
            </div>
        </div>
    );
}

export default AddUser;
