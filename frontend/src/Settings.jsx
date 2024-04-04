import React, {useEffect, useState} from 'react';
import {FloatingLabel, Button} from 'flowbite-react';
import axios from "axios";
import {useAuth} from "./auth/Auth";
import {QRCodeCanvas, QRCodeSVG} from "qrcode.react";
// import QRCode from "react-qr-code";
// import {QrCode} from "@mui/icons-material";

const Settings = () => {
    const [password, setPassword] = useState("")
    const {accessToken} = useAuth();

    const [F2A, setF2A] = useState(null)

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const x = () => axios('/api/otp_status', customConfig)
            .then((response) => {
                    let data = response.data
                    console.log(data)
                    if (data === 0) {
                        if (F2A) {
                            setF2A(null);
                            return;
                        }
                    }
                    if (data) {
                        if (F2A === null) {
                            let customConfig = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`
                                }
                            };

                            axios("/api/otp", customConfig).then((response) => {
                                setF2A(response.data)
                                console.log(response.data)
                            }).catch(() => {
                            })
                        }
                    }
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, F2A, setF2A]);

    return (
        <div className="flex flex-col gap-y-8 w-[30%] items-start mx-auto">
            <h3 className="text-2xl font-semibold">Двухфакторная аутентификация</h3>
            {
                F2A ?
                    <div>
                        <QRCodeCanvas value={F2A} size={384} level="H" includeMargin={true}/>
                        <div style={{height: "2rem"}}/>
                        <Button
                            color="gray"
                            onClick={() => {
                                const customConfig = {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${accessToken}`,
                                    },
                                    params: {
                                        value: 0
                                    }
                                };
                                axios.post('/api/otp_status', {}, customConfig).catch(() => {
                                })
                            }}
                        >
                            Выключить
                        </Button>
                    </div> : <Button
                        color="gray"
                        onClick={() => {
                            const customConfig = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                                params: {
                                    value: 1
                                }
                            };
                            axios.post('/api/otp_status', {}, customConfig).catch(() => {
                            })
                        }}
                    >
                        Включить
                    </Button>
            }
            <h3 className="text-2xl font-semibold">Изменение пароля</h3>
            <label
                className="block text-sm font-medium leading-6 text-gray-900">
                Новый пароль
            </label>
            <input
                id="password"
                name="password"
                type="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Button
                color="gray"
                onClick={() => {
                    if (password === "") {
                        alert("Вы не ввели пароль")
                        return
                    }

                    if (password.length < 8) {
                        alert("Вы ввели слишком короткий пароль (< 8 знаков)")
                        return
                    }
                    const customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    };
                    axios.post('/api/reset_password', {password: password}, customConfig)
                        .then(
                            (response) => {
                                alert("Вы успешно поменяли пароль")
                            })
                        .catch(() => {
                        })
                }}
            >
                Сохранить
            </Button>
        </div>
    );
};

export default Settings;
