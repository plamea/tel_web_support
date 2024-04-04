import React, {useEffect} from 'react';
import clsx from "clsx";
import axios from "axios";
import {useState, useRef} from "react";
import {useAuth} from "../auth/Auth";
import {Button, Chip, Stack} from "@mui/material";

const ChatInputMessageField = ({isDesktop, uu_id}) => {
    const [message, setMessage] = useState();
    const inputRef = useRef();
    const {accessToken} = useAuth();


    const [autotexts, setAutotexts] = useState([])

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const x = () => axios('/api/autotexts', customConfig)
            .then((response) => {
                    if (JSON.stringify(response) !== JSON.stringify(autotexts)) {
                        setAutotexts(response.data);
                        console.log(response.data);
                    }
                }
            ).catch((error) => {})
        x();
        const repeater = setInterval(x, 1_000);
        return () => clearInterval(repeater);
    }, [autotexts,setAutotexts]);

    const sendMessage = () => {
        if (!message?.trim())
            return
        const customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        };
        const body = {
            'uuid': uu_id,
            "text": message
        }
        axios.post('/api/message', body, customConfig)
            .then(
                (response) => {
                    inputRef.current.value = "";
                    let customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            uu_id: uu_id,
                            value: "in_work"
                        }
                    };
                    axios.put("/api/ticket_status", {}, customConfig).catch(() => {
                    })
                }
            )
            .catch(
                (error) => {}
            )
    };

    return (
        <div className={clsx("flex flex-col gap-y-3", !isDesktop && 'absolute left-0 right-0 bottom-7')}>
            <div className="shadow-xl bg-white"
                 style={{
                     display: "flex",
                     height: "48px",
                     marginTop: "10px",
                     borderRadius: "8px",
                 }}>
                <div className="relative w-full rounded-[8px]">
                    <input className="focus:border-none bg-transparent border-none h-full w-full rounded-[8px]"
                           style={{width: "100%", overflowY: "scroll", scrollbarWidth: "none",}}
                           placeholder="Напишите сообщение"
                           onChange={e => setMessage(e.target.value)}
                           onkeypress={e => {if (e.keyCode == 13) {sendMessage()}}}
                           ref={inputRef}
                    />
                </div>
            </div>
            <Button
                color="info"
                variant="contained"
                onClick={sendMessage}
            >
                Отправить
            </Button>
            <Stack direction="row" rowGap={2} spacing={1} flexWrap="wrap">
                {
                    autotexts.sort((a, b) => {
                        return b.priority - a.priority
                    }).map(
                        el => <Chip clickable label={el.title} onClick={() => {
                            inputRef.current.value = el.message
                        }}/>
                    )
                }
            </Stack>
        </div>
    );
};

export default ChatInputMessageField;
