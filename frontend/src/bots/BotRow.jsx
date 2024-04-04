import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import MenuUsers from "../users/MenuUsers";
import axios from "axios";
import {Badge} from "flowbite-react";

const BotRow = ({isDesktop, array, idx, person, setTabID}) => {

    const [online, setOnline] = useState(false)

    const startBot = async (username) => {
        try {
            await axios.post('/api/bot-start', { action: "start", token: username});
            console.log("Start");
        } catch (error) {
            console.error('Error starting bot:', error);
        }
    };
    

    const stopBot = async (username) => {
        try {
            await axios.post('/api/bot-stop', { action: "stop" , token: username});
            console.log("Stop");
        } catch (error) {
            console.error('Error stopping bot:', error);
        }
    };


    const getStatus = async () => {
        try {
            const response = await axios.post('http://5.199.168.113/api/bot-status', { action: "status", token: "7081972757:AAHPGG38PAXuwcCJhPRMJ_cZfs3bQca_iXs"});
            console.log("Status:", response.data);

            if (response.data.message === 'online') {
                setOnline(true)
            } else {
                setOnline(false)
            }

            return response

        } catch (error) {
            console.error('Error getting bot status:', error);
        }
    };

    useEffect(() => {
        getStatus();

        setInterval(getStatus, 20000);
    }, [])


    if (!isDesktop) {
        return  <div
                     className={clsx("grid px-3 py-2 grid-cols-5 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}>
            <div className="flex justify-center items-center">
                {person.guid}
            </div>
            <div className="flex justify-center items-center">
                {person.id}
            </div>
            <div className="flex justify-center items-center">
                {person.username}
            </div>
            <div className="flex justify-center items-center">
                <Badge color={online ? "success" : "failure"}>
                    {online ? "online" : "offline"}
                </Badge>
            </div>
            <div className="flex justify-center items-center">
                <MenuUsers stopBot={stopBot} startBot={startBot} setTabID={setTabID} array={array} />

            </div>
        </div>
    }

    return (
        <div key={idx}
             className={clsx("grid px-3 py-2 grid-cols-5 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}>
            <div className="flex justify-center items-center">
                {person.guid}
            </div>
            <div className="flex justify-center items-center">
                {person.id}
            </div>
            <div className="flex justify-center items-center">
                {person.username}
            </div>
            <div className="flex justify-center items-center">
                <Badge color={online ? "success" : "failure"}>
                    {online ? "online" : "offline"}
                </Badge>
            </div>
            <div className="flex justify-center items-center">
                <MenuUsers stopBot={() => stopBot(person.username)} startBot={() => startBot(person.username)} setTabID={setTabID} />



            </div>
        </div>
    );
};

export default BotRow;