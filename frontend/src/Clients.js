import React, {Fragment, useEffect, useState} from "react";
import clsx from "clsx";
import Pagination from "./Pagination";
import {useAuth} from "./auth/Auth";
import axios from "axios";
import {paginate} from "./func";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Clients() {
    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    const [people, setPeople] = useState([])
    const [page, setPage] = useState(1)

    const {accessToken} = useAuth();

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const x = () => axios('/api/clients', customConfig)
            .then(
                (response) => {
                    console.log(response.data)
                    setPeople(response.data);
                }
            ).catch((error) => {
            });
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken])

    return (
        <>
            {!isDesktop ? <div className="flex justify-between items-center">
                <h1 className="text-3xl"
                    style={{display: "block", paddingBottom: "25px", textAlign: "center"}}>Клиенты</h1>
            </div> : <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Клиенты</h1>
            </div>}
            <div
                className={clsx("overflow-x-auto divide-y divide-gray-100 flex-1 flex flex-col", !isDesktop && 'p-[1px] mb-4 ')}
                style={{maxWidth: "100%"}}>
                <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                    <div className={clsx(isDesktop && "min-w-[1500px] divide-y")}>
                        {isDesktop ? <>
                            <div
                                className="grid grid-cols-3 px-3 h-[42px] border-l border-solid border-[#E5E7EB] border-r">
                                <div className="flex font-semibold items-center justify-center">
                                    ИД
                                </div>
                                <div className="flex font-semibold items-center justify-center text-center">
                                    Юзернейм
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Имя
                                </div>
                            </div>
                            {paginate(people, 10)[page - 1]?.map((person, idx, array) => (
                                <div key={idx}
                                     className={clsx("grid px-3 py-2 grid-cols-3 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}>
                                    <div className="flex justify-center items-center">
                                        {person.user_id}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {person.username}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {person.displaybleName}
                                    </div>
                                </div>
                            ))}
                        </> : <>
                            {paginate(people, 10)[page - 1]?.map((person, idx) => (
                                <div key={idx} className="rounded overflow-hidden shadow-lg" style={{marginTop: "1em"}}>
                                    <div className="px-6 py-5">
                                        <div>
                                            ИД: {person.user_id}
                                        </div>
                                        <div style={{display: "flex"}}>
                                            Логин: {person.username}
                                        </div>
                                        <div style={{display: "flex"}}>
                                            Отображаемое имя: {person.displaybleName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>}
                    </div>
                </div>
                <Pagination currentPage={page} setCurrentPage={setPage} totalPages={Math.ceil(people.length / 10)}/>
            </div>
        </>
    )
}
