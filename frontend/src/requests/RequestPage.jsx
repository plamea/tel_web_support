import React, {useEffect, useState} from 'react';
import {useAuth} from "../auth/Auth";
import {computeTableScalingRatio} from "../utils";
import axios from "axios";
import {Badge, Dropdown} from "flowbite-react";
import clsx from "clsx";
import Sort from "../Sort";
import {paginate} from "../func";
import dayjs from "dayjs";
import Pagination from "../Pagination";

const translate = {
    "new": "Новый",
    "in_work": "В работе",
    "solved": "Решен",
    "declined": "Отклонен",
    "pending": "В ожидании",
    "deleted": "Удалён",
    "waiting": "В ожидании",
    "success": "Успешно",
    "success_error": "Усппешно (ошибка)",
    "success_operator": "Успешно (оператор)"
}

const RequestPage = () => {

    const [page, setPage] = useState(1)

    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    const [requests, setRequest] = useState([])
    const {accessToken} = useAuth();

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const x = () => axios('/api/orders', customConfig)
            .then((response) => {
                setRequest(response.data);
            }).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken])

    if (isDesktop)
        return (
            <>
                <h1 className="text-2xl font-semibold">Заказы</h1>
                <div role="list" className=" mx-auto divide-y pt-5 divide-gray-100 flex-1 flex flex-col"
                     style={{width: "fit-content", maxWidth: "100%"}}>
                    <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                        <div className={clsx(isDesktop && "min-w-[1500px] overflow-x-auto divide-y")}>
                            <div className="grid grid-cols-11 px-3 border-l border-solid border-[#E5E7EB] border-r">
                                <div className="flex items-center justify-center">
                                    <div className="font-semibold text-[14px]">
                                        ID заказа
                                    </div>
                                </div>
                                <div className="flex  items-center justify-center">
                                    <div className="text-[14px] font-semibold">
                                        Номер карты
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="text-center text-[14px] font-semibold">
                                        Маска карты
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                    <div className="text-[14px] font-semibold">
                                        Сумма
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center ">
                                    <div className="text-[14px] font-semibold">
                                        Валюта
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                    <div className="text-[14px] font-semibold">
                                        Статус заказа
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                    <div className="text-[14px] text-center font-semibold">
                                        Дата создания
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                    <div className="text-[14px] font-semibold">
                                        Дата отмены
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                    <div className="text-center text-[14px] font-semibold">
                                        Дата платежа
                                    </div>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                        <span className="text-center font-semibold text-[14px]">
                                            ID карты
                                        </span>
                                    <Sort/>
                                </div>
                                <div className="flex items-center gap-x-3 justify-center">
                                        <span className="text-center font-semibold text-[14px]">
                                            P2P
                                        </span>
                                    <Sort/>
                                </div>
                            </div>
                            {paginate(requests, 10)[page - 1]?.map((request, idx, array) => {

                                return (
                                    <div
                                        className={clsx(" grid px-3 py-2 grid-cols-11 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}
                                        key={idx}>
                                        <div className="flex  items-center ">
                                            <div
                                                className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap text-blue-700">{request.uu_id}</div>
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {request.card_number}
                                        </div>
                                        <div className="flex justify-center gap-y-2 flex-col items-center">
                                            {request.masked_card_number}
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            {request.amount}
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {request.currency}
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            <Badge color="warning">{translate[request.status]}</Badge>
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            {dayjs(request.create_time).format('DD.MM.YYYY HH:MM:ss')}
                                        </div>
                                        <div className="flex justify-center items-center">
                                            {dayjs(request.remove_time).format('DD.MM.YYYY HH:MM:ss')}
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            {dayjs(request.pay_time).format('DD.MM.YYYY HH:MM:ss')}
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            {request?.card_id}
                                        </div>
                                        <div className="flex justify-center text-center items-center">
                                            {request?.isP2PCard}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Pagination currentPage={page} setCurrentPage={setPage}
                                totalPages={Math.ceil(requests.length / 10)}/>
                </div>
            </>
        )


    return (
        <>
            <h1 className="text-3xl" style={{display: "block", paddingBottom: "25px", textAlign: "center"}}>Заказы</h1>
            <div className={clsx(isDesktop ? "px-10" : 'mb-4')}
                 style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                {paginate(requests, 10)[page - 1]?.map((request, idx) => (
                    <div key={idx} className="rounded overflow-hidden shadow-lg" style={{marginTop: "1em"}}>
                        <div className="px-6 py-5">
                            <div>
                                ID заказа: <div
                                className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap text-blue-700">{request.uu_id}</div>
                            </div>
                            <div>
                                Номер карты: {request.card_number}
                            </div>
                            <div>
                                Маска карты {request.masked_card_number}
                            </div>
                            <div>
                                Сумма: {request.amount}
                            </div>
                            <div>
                                Валюта: {request.currency}
                            </div>
                            <div>
                                Статус заказа: {translate[request.status]}
                            </div>
                            <div>
                                Дата создания: {dayjs(request.create_time).format('DD.MM.YYYY HH:MM:ss')}
                            </div>
                            <div>
                                Дата отмены: {dayjs(request.remove_time).format('DD.MM.YYYY HH:MM:ss')}
                            </div>
                            <div>
                                Дата платежа: {dayjs(request.pay_time).format('DD.MM.YYYY HH:MM:ss')}
                            </div>
                            <div>
                                ID карты: {request?.card_id}
                            </div>
                            <div>
                                P2P: {request?.isP2PCard}
                            </div>
                        </div>
                    </div>
                ))}
                <Pagination currentPage={page} setCurrentPage={setPage} totalPages={Math.ceil(requests.length / 10)}/>
            </div>
        </>
    );
};

export default RequestPage;
