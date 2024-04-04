import React, {Fragment, useEffect, useState} from "react";
import DetailTicket from "./DetailTicket";
import clsx from "clsx";
import dayjs from "dayjs";
import {Badge, Dropdown} from "flowbite-react";
import Sort from "./Sort";
import Pagination from "./Pagination";
import axios from "axios";
import {useAuth} from "./auth/Auth";
import {paginate} from "./func";
import {Button, Stack} from "@mui/material";
import moment from "moment";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/24/outline";

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

const status_colors = {
    "new": "lime",
    "in_work": "yellow",
    "solved": "green",
    "declined": "red",
    "pending": "grey",

    "deleted": "red",
    "waiting": "grey",
    "success": "green",
    "success_error": "green",
    "success_operator": "green"
}

export default function Tickets({isOperator}) {

    const [page, setPage] = useState(1)

    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const [currentTicket, setCurrentTicket] = useState(null);

    const [isStart, setIsStart] = useState(false)

    const [filters, setFilters] = useState({
        currency: "ASC",
        ticket_status: "ASC",
        order_status: "ASC",
        is_checked: "ASC",
        is_last_answer_from_operator: "ASC",
        operator: "ASC",
        date_of_request: "ASC",
        date_of_last_change: "ASC"
    })

    console.log(filters)

    const [tickets, setTickets] = useState([])
    const {accessToken} = useAuth();

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        axios('/api/turn', customConfig)
            .then((response) => {
                    setIsStart(response.data);
                }
            ).catch((error) => {
        })
    }, [accessToken]);

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const x = () => axios('/api/tickets', customConfig)
            .then((response) => {
                    let data = response.data
                    if (isOperator)
                        data = data.map((value) => {
                            value.is_checked = null;
                            return value;
                        })
                    data.sort((a, b) => {
                        if (filters.currency === 'ASC') {
                            if (a.currency < b.currency) {
                                return -1
                            } else if (a.currency > b.currency) {
                                return 1
                            }
                        } else {
                            if (a.currency < b.currency) {
                                return 1
                            } else if (a.currency > b.currency) {
                                return -1
                            }
                        }

                        if (filters.ticket_status === 'ASC') {
                            if (a.ticket_status < b.ticket_status) {
                                return -1
                            } else if (a.ticket_status > b.ticket_status) {
                                return 1
                            }
                        } else {
                            if (a.ticket_status < b.ticket_status) {
                                return 1
                            } else if (a.ticket_status > b.ticket_status) {
                                return -1
                            }
                        }

                        if (filters.order_status === 'ASC') {
                            if (a.order_status < b.order_status) {
                                return -1
                            } else if (a.order_status > b.order_status) {
                                return 1
                            }
                        } else {
                            if (a.order_status < b.order_status) {
                                return 1
                            } else if (a.order_status > b.order_status) {
                                return -1
                            }
                        }

                        if (filters.is_checked === 'ASC') {
                            if (a.is_checked < b.is_checked) {
                                return -1
                            } else if (a.is_checked > b.is_checked) {
                                return 1
                            }
                        } else {
                            if (a.is_checked < b.is_checked) {
                                return 1
                            } else if (a.is_checked > b.is_checked) {
                                return -1
                            }
                        }

                        if (filters.is_last_answer_from_operator === 'ASC') {
                            if (a.is_last_answer_from_operator < b.is_last_answer_from_operator) {
                                return -1
                            } else if (a.is_last_answer_from_operator > b.is_last_answer_from_operator) {
                                return 1
                            }
                        } else {
                            if (a.is_last_answer_from_operator < b.is_last_answer_from_operator) {
                                return 1
                            } else if (a.is_last_answer_from_operator > b.is_last_answer_from_operator) {
                                return -1
                            }
                        }

                        if (filters.operator === 'ASC') {
                            if (a.operator < b.operator) {
                                return -1
                            } else if (a.operator > b.operator) {
                                return 1
                            }
                        } else {
                            if (a.operator < b.operator) {
                                return 1
                            } else if (a.operator > b.operator) {
                                return -1
                            }
                        }

                        if (filters.date_of_request === 'ASC') {
                            if (a.date_of_request < b.date_of_request) {
                                return -1
                            } else if (a.date_of_request > b.date_of_request) {
                                return 1
                            }
                        } else {
                            if (a.date_of_request < b.date_of_request) {
                                return 1
                            } else if (a.date_of_request > b.date_of_request) {
                                return -1
                            }
                        }

                        if (filters.date_of_last_change === 'ASC') {
                            if (a.date_of_last_change < b.date_of_last_change) {
                                return -1
                            } else if (a.date_of_last_change > b.date_of_last_change) {
                                return 1
                            }
                        } else {
                            if (a.date_of_last_change < b.date_of_last_change) {
                                return 1
                            } else if (a.date_of_last_change > b.date_of_last_change) {
                                return -1
                            }
                        }

                        return 0
                    })
                    if (JSON.stringify(data) === JSON.stringify(tickets)) return
                    setTickets(data);
                    const urlParams = new URLSearchParams(window.location.search);
                    const t = urlParams.get('ticket');
                    if (currentTicket === null && t) {
                        data.map((ticket) => {
                            if (ticket.uu_id === t) {
                                setCurrentTicket(ticket);
                            }
                        })

                    }
                    data.map((ticket) => {
                        if (ticket.uu_id === currentTicket.uu_id && JSON.stringify(ticket) !== JSON.stringify(currentTicket)) {
                            setCurrentTicket(ticket);
                        }
                    })
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, currentTicket, filters.currency, filters.date_of_last_change, filters.date_of_request, filters.is_checked, filters.is_last_answer_from_operator, filters.operator, filters.order_status, filters.ticket_status, isOperator, tickets]);

    if (currentTicket !== null) {
        return <DetailTicket currentTicket={currentTicket} setCurrentTicket={setCurrentTicket}/>
    }

    if (isDesktop)
        return (
            <>
                <h1 className="text-2xl font-semibold">Тикеты</h1>
                <div role="list" className=" mx-auto divide-y divide-gray-100 flex-1 flex flex-col"
                     style={{width: "fit-content", maxWidth: "100%"}}>
                    <div className="gap-x-6 py-5" style={{width: "100%"}}>
                        <div className="flex gap-x-4" style={{width: "100%", paddingBottom: "20px"}}>
                            <Dropdown inline label="Валюта">
                                <Dropdown.Item>USD</Dropdown.Item>
                            </Dropdown>
                            <Dropdown inline label="Статус тикета">
                                <Dropdown.Item>Статус 1</Dropdown.Item>
                                <Dropdown.Item>Статус 2</Dropdown.Item>
                            </Dropdown>
                            <Dropdown inline label="Статус заявки">
                                <Dropdown.Item>Статус 1</Dropdown.Item>
                                <Dropdown.Item>Статус 2</Dropdown.Item>
                            </Dropdown>
                            <Dropdown inline label="Проверена">
                                <Dropdown.Item>Да</Dropdown.Item>
                                <Dropdown.Item>Нет</Dropdown.Item>
                            </Dropdown>
                            <Dropdown inline label="Последний ответ">
                                <Dropdown.Item>Ответ 1</Dropdown.Item>
                                <Dropdown.Item>Ответ 2</Dropdown.Item>
                            </Dropdown>
                            <Dropdown inline label="Оператор">
                                <Dropdown.Item>Оператор 1</Dropdown.Item>
                                <Dropdown.Item>Оператор 2</Dropdown.Item>
                            </Dropdown>
                            {isOperator ?
                                <Stack direction="row" ml="auto" spacing={2}>
                                    <Button
                                        disabled={isStart}
                                        onClick={
                                            () => axios.post("/api/turn", {}, {
                                                headers: {'Authorization': `Bearer ${accessToken}`},
                                                params: {state: true}
                                            })
                                                .then(() => setIsStart(true))
                                                .catch(() => {
                                                })
                                        }
                                        variant="contained"
                                    >
                                        Начать смену
                                    </Button>
                                    <Button
                                        disabled={!isStart}
                                        onClick={
                                            () => axios.post("/api/turn", {}, {
                                                headers: {'Authorization': `Bearer ${accessToken}`},
                                                params: {state: false}
                                            })
                                                .then(() => setIsStart(false))
                                                .catch(() => {
                                                })
                                        }
                                        variant="contained"
                                    >
                                        Закончить смену
                                    </Button>
                                </Stack> : null
                            }
                        </div>
                    </div>

                    {isOperator ? <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                            <div className={clsx(isDesktop && "min-w-[1775px] overflow-x-auto divide-y")}>
                                <div
                                    className={"grid grid-cols-10 px-3 border-l border-solid border-[#E5E7EB] border-r"}>
                                    <div className="flex items-center justify-center">
                                        <div className="font-semibold text-[14px]">
                                            Код заявки
                                        </div>
                                    </div>
                                    <div className="flex  items-center justify-center">
                                        <div className="text-[14px] font-semibold">Клиент
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="text-center text-[14px] font-semibold">
                                            Платежная информация
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Валюта
                                        </div>
                                        {
                                            filters.currency === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.currency = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.currency = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Статус тикета
                                        </div>
                                        {
                                            filters.ticket_status === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.ticket_status = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.ticket_status = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center ">
                                        <div className="text-[14px] font-semibold">
                                            Статус заявки
                                        </div>
                                        {
                                            filters.order_status === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.order_status = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.order_status = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] text-center font-semibold">
                                            Последний ответ
                                        </div>
                                        {
                                            filters.is_last_answer_from_operator === "ASC" ?
                                                <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_last_answer_from_operator = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_last_answer_from_operator = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Оператор
                                        </div>
                                        {
                                            filters.operator === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.operator = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.operator = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-center text-[14px] font-semibold">
                                            Дата обращения
                                        </div>
                                        {
                                            filters.date_of_request === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_request = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_request = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                            <span className="text-center font-semibold text-[14px]">
                                Последнее изменение
                            </span>
                                        {
                                            filters.date_of_last_change === "ASC" ?
                                                <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_last_change = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_last_change = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                </div>
                                {paginate(tickets, 10)[page - 1]?.map((ticket, idx, array) => {
                                    return (
                                        <div
                                            className={clsx(` grid px-3 py-2 grid-cols-10 border-l border-solid border-[#E5E7EB] border-r`, (array.length - 1) === idx && '!border-b')}
                                            key={idx}>
                                            <div className="flex  items-center "
                                                 onClick={() => setCurrentTicket(ticket)}>
                                                <div
                                                    className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap text-blue-700">{`WA-${String(ticket.uu_id).toUpperCase()}`}</div>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                {ticket.client_username}
                                            </div>
                                            <div className="flex justify-center gap-y-2 flex-col items-center">
                                                <div className="flex items-center gap-x-2"><img src="/credit.png"
                                                                                                alt="credit"/> - <span>*{ticket.masked_card_number}</span>
                                                </div>
                                                <div className="flex items-center gap-x-2"><img src="/wallet.png"
                                                                                                alt="credit"/> - <span>{ticket.amount}</span> {ticket.currency}
                                                </div>
                                                <div className="flex items-center gap-x-2"><img src="/box.png"
                                                                                                alt="credit"/> - <span>{ticket.source}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-center items-center">
                                                {ticket.currency}
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge
                                                    color={status_colors[ticket.ticket_status]}>{translate[ticket.ticket_status]}</Badge>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge
                                                    color={status_colors[ticket.order_status]}>{translate[ticket.order_status]}</Badge>
                                            </div>
                                            <div className="flex justify-center text-center items-center">
                                                {ticket.is_last_answer_from_operator ? "Оператор" : "Пользователь"}
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge color="warning">{ticket.operator}</Badge>
                                            </div>
                                            <div className="flex justify-center text-center items-center"
                                                 style={{flexDirection: "column"}}>
                                                <div>
                                                    {dayjs(ticket.date_of_request).format('DD.MM.YYYY HH:MM:ss')}
                                                </div>
                                                <div style={{color: "grey"}}>
                                                    {moment(dayjs(ticket.date_of_request).toDate()).fromNow()}
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-center items-center"
                                                 style={{flexDirection: "column"}}>
                                                <div>
                                                    {dayjs(ticket.date_of_last_change).format('DD.MM.YYYY HH:MM:ss')}
                                                </div>
                                                <div style={{color: "grey"}}>
                                                    {moment(dayjs(ticket.date_of_last_change).toDate()).fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div> :
                        <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                            <div className={clsx(isDesktop && "min-w-[1775px] overflow-x-auto divide-y")}>
                                <div
                                    className={"grid grid-cols-11 px-3 border-l border-solid border-[#E5E7EB] border-r"}>
                                    <div className="flex items-center justify-center">
                                        <div className="font-semibold text-[14px]">
                                            Код заявки
                                        </div>
                                    </div>
                                    <div className="flex  items-center justify-center">
                                        <div className="text-[14px] font-semibold">Клиент
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <div className="text-center text-[14px] font-semibold">
                                            Платежная информация
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Валюта
                                        </div>
                                        {
                                            filters.currency === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.currency = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.currency = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Статус тикета
                                        </div>
                                        {
                                            filters.ticket_status === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.ticket_status = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.ticket_status = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center ">
                                        <div className="text-[14px] font-semibold">
                                            Статус заявки
                                        </div>
                                        {
                                            filters.order_status === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.order_status = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.order_status = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Проверена
                                        </div>
                                        {
                                            filters.is_checked === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_checked = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_checked = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] text-center font-semibold">
                                            Последний ответ
                                        </div>
                                        {
                                            filters.is_last_answer_from_operator === "ASC" ?
                                                <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_last_answer_from_operator = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.is_last_answer_from_operator = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-[14px] font-semibold">
                                            Оператор
                                        </div>
                                        {
                                            filters.operator === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.operator = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.operator = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                                        <div className="text-center text-[14px] font-semibold">
                                            Дата обращения
                                        </div>
                                        {
                                            filters.date_of_request === "ASC" ? <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_request = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_request = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                    <div className="flex items-center gap-x-3 justify-center">
                            <span className="text-center font-semibold text-[14px]">
                                Последнее изменение
                            </span>
                                        {
                                            filters.date_of_last_change === "ASC" ?
                                                <ArrowUpIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_last_change = "DESC";
                                                        setFilters(newFilters);
                                                    }
                                                }/> :
                                                <ArrowDownIcon height="1.25rem" onClick={
                                                    () => {
                                                        let newFilters = structuredClone(filters);
                                                        newFilters.date_of_last_change = "ASC";
                                                        setFilters(newFilters);
                                                    }
                                                }/>
                                        }
                                    </div>
                                </div>
                                {paginate(tickets, 10)[page - 1]?.map((ticket, idx, array) => {
                                    return (
                                        <div
                                            className={clsx(` grid px-3 py-2 grid-cols-11 border-l border-solid border-[#E5E7EB] border-r`, (array.length - 1) === idx && '!border-b')}
                                            key={idx}>
                                            <div className="flex  items-center "
                                                 onClick={() => setCurrentTicket(ticket)}>
                                                <div
                                                    className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap text-blue-700">{`WA-${String(ticket.uu_id).toUpperCase()}`}</div>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                {ticket.client_username}
                                            </div>
                                            <div className="flex justify-center gap-y-2 flex-col items-center">
                                                <div className="flex items-center gap-x-2"><img src="/credit.png"
                                                                                                alt="credit"/> - <span>*{ticket.masked_card_number}</span>
                                                </div>
                                                <div className="flex items-center gap-x-2"><img src="/wallet.png"
                                                                                                alt="credit"/> - <span>{ticket.amount}</span> {ticket.currency}
                                                </div>
                                                <div className="flex items-center gap-x-2"><img src="/box.png"
                                                                                                alt="credit"/> - <span>{ticket.source}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-center items-center">
                                                {ticket.currency}
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge
                                                    color={status_colors[ticket.ticket_status]}>{translate[ticket.ticket_status]}</Badge>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge
                                                    color={status_colors[ticket.order_status]}>{translate[ticket.order_status]}</Badge>
                                            </div>
                                            <div className="flex justify-center items-center">
                                                <Badge
                                                    color={ticket.is_checked ? "green" : "red"}> {ticket.is_checked ? "Да" : "Нет"} </Badge>
                                            </div>
                                            <div className="flex justify-center text-center items-center">
                                                {ticket.is_last_answer_from_operator ? "Оператор" : "Пользователь"}
                                            </div>
                                            <div className="flex justify-center items-center">
                                                {ticket.operator ?
                                                    <Badge color="warning">{ticket.operator}</Badge> : null}
                                            </div>
                                            <div className="flex justify-center text-center items-center"
                                                 style={{flexDirection: "column"}}>
                                                <div>
                                                    {dayjs(ticket.date_of_request).format('DD.MM.YYYY HH:MM:ss')}
                                                </div>
                                                <div style={{color: "grey"}}>
                                                    {moment(dayjs(ticket.date_of_request).toDate()).fromNow()}
                                                </div>
                                            </div>
                                            <div className="flex justify-center text-center items-center"
                                                 style={{flexDirection: "column"}}>
                                                <div>
                                                    {dayjs(ticket.date_of_last_change).format('DD.MM.YYYY HH:MM:ss')}
                                                </div>
                                                <div style={{color: "grey"}}>
                                                    {moment(dayjs(ticket.date_of_last_change).toDate()).fromNow()}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>}
                    <Pagination currentPage={page} setCurrentPage={setPage}
                                totalPages={Math.ceil(tickets.length / 10)}/>
                </div>
            </>
        )
    return <>
        <h1 className="text-3xl" style={{display: "block", paddingBottom: "25px", textAlign: "center"}}>Тикеты</h1>
        <div className={clsx(isDesktop ? "px-10" : 'mb-4')}
             style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
            <div style={{display: "grid", gap: '10px', gridTemplateColumns: "1fr 1fr"}}>
                <Dropdown inline label="Валюта">
                    <Dropdown.Item>USD</Dropdown.Item>
                </Dropdown>
                <Dropdown inline label="Статус тикета">
                    <Dropdown.Item>Статус 1</Dropdown.Item>
                    <Dropdown.Item>Статус 2</Dropdown.Item>
                </Dropdown>
                <Dropdown inline label="Статус заявки">
                    <Dropdown.Item>Статус 1</Dropdown.Item>
                    <Dropdown.Item>Статус 2</Dropdown.Item>
                </Dropdown>
                <Dropdown inline label="Проверена">
                    <Dropdown.Item>Да</Dropdown.Item>
                    <Dropdown.Item>Нет</Dropdown.Item>
                </Dropdown>
                <Dropdown inline label="Последний ответ">
                    <Dropdown.Item>Ответ 1</Dropdown.Item>
                    <Dropdown.Item>Ответ 2</Dropdown.Item>
                </Dropdown>
                <Dropdown inline label="Оператор">
                    <Dropdown.Item>Оператор 1</Dropdown.Item>
                    <Dropdown.Item>Оператор 2</Dropdown.Item>
                </Dropdown>
                <Stack ml="auto">
                    <Button>Начать смену</Button>
                    <Button>Закончить смену</Button>
                </Stack>
            </div>
            {paginate(tickets, 10)[page - 1]?.map((ticket, idx) => (
                <div key={idx} className="rounded overflow-hidden shadow-lg" style={{marginTop: "1em"}}>
                    <div className="px-6 py-5">
                        <div>
                            Код заявки: <span onClick={() => setCurrentTicket(ticket)}>{ticket.uu_id}</span>
                        </div>
                        <div>
                            Клиент: {ticket.client_username}
                        </div>
                        <div style={{display: "flex"}}>
                            <div>
                                Платежная информация:
                            </div>
                            <div style={{marginLeft: "0.5em"}}>
                                Карта - {ticket.masked_card_number}
                                <br/>
                                Сумма - {ticket.amount}
                                <br/>
                                Источник - {ticket.source}
                            </div>
                        </div>
                        <div>
                            Валюта: {ticket.currency}
                        </div>
                        <div>
                            Статус тикета: <Badge
                            color={status_colors[ticket.ticket_status]}>{translate[ticket.ticket_status]}</Badge>
                        </div>
                        <div>
                            Статус заявки: <Badge
                            color={status_colors[ticket.order_status]}>{translate[ticket.order_status]}</Badge>
                        </div>
                        {isOperator ? null :
                            <div>
                                Проверена: {ticket.is_checked ? "Да" : "Нет"}
                            </div>
                        }
                        <div>
                            Последний ответ: {ticket.is_last_answer_from_operator ? "Оператор" : "Пользователь"}
                        </div>
                        {isOperator ? null : (ticket.operator ? <div>
                            Оператор: {ticket.operator}
                        </div> : null)}
                        <div>
                            Дата обращения: {dayjs(ticket.date_of_request).format('DD.MM.YYYY HH:MM:ss')}
                            <span
                                style={{color: "grey"}}> ({moment(dayjs(ticket.date_of_request).toDate()).fromNow()})</span>
                        </div>
                        <div>
                            Последнее
                            изменение: {dayjs(ticket.date_of_last_change).format('DD.MM.YYYY HH:MM:ss')}
                            <span
                                style={{color: "grey"}}> ({moment(dayjs(ticket.date_of_last_change).toDate()).fromNow()})</span>
                        </div>
                    </div>
                </div>
            ))}
            <Pagination currentPage={page} setCurrentPage={setPage} totalPages={Math.ceil(tickets.length / 10)}/>
        </div>
    </>
}
