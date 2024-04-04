import {ChevronLeftIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import React, {Fragment, useEffect, useRef, useState} from "react";
import clsx from "clsx";
import DetailTicketModal from "./DetailTicketModal";
import dayjs from "dayjs";
import ChatInputMessageField from "./DetailTicket/ChatInputMessageField";
import {useAuth} from "./auth/Auth";
import axios from "axios";
import {Badge} from "flowbite-react";
import {Button, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography} from "@mui/material";
import {Menu, Transition} from "@headlessui/react";
import Viewer from 'react-viewer';

const translate = {
    "new": "Новый",
    "in_work": "В работе",
    "solved": "Решен",
    "declined": "Отклонен",
    "pending": "В ожидании",

    "deleted": "Удалён",
    "waiting": "В ожидании",
    "success": "Решен",
    "success_error": "Решен (ошибка)",
    "success_operator": "Решен (оператор)"
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

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function ChatHeader({setMobileShowDetails, isDesktop, currentTicket, setCurrentTicket}) {
    if (isDesktop)
        return <div className="flex items-center absolute gap-x-4 top-0 h-16 left-0 right-0 px-6">
            <div
                className="cursor-pointer flex items-center justify-center h-[32px] border border-solid border-[#E5E7EB] rounded-xl w-[32px] "
                onClick={() => setCurrentTicket(null)}>
                <ChevronLeftIcon className="h-4 w-4"/>
            </div>
            <div className="text-[18px] font-semibold">Тикет #{currentTicket.uu_id}</div>
            <Badge color={status_colors[currentTicket.ticket_status]}>{translate[currentTicket.ticket_status]}</Badge>
        </div>
    return <div className="w-full justify-between shadow-2xl"
                style={{display: "flex", height: "48px", padding: "8px", borderRadius: "8px",}}>
        <div
            className="cursor-pointer h-[32px] border flex items-center justify-center border-solid border-[#E5E7EB] rounded-xl w-[32px] "
            onClick={() => setCurrentTicket(null)}>
            <ChevronLeftIcon className="h-4 w-4"/>
        </div>
        <div onClick={() => setMobileShowDetails(true)}>
            <EllipsisHorizontalIcon className="w-8 h-8"/>
        </div>
    </div>
}

function ChatMessage({text, imgSrc, style, fromOperator, timestamp}) {
    const [visible, setVisible] = React.useState(false);
    return <div className="py-2 px-4 shadow-xl" style={{
        display: "inline-table",
        maxWidth: "40%",
        minWidth: "5rem",
        width: "fit-content",
        minHeight: "2rem",
        color: 'black',
        height: "fit-content",
        margin: "0.5rem",
        borderRadius: "16px", ...style
    }}>
        {
            imgSrc ? <>
                <img src={imgSrc} onClick={() => {
                    setVisible(true)
                }}/>
                <Viewer
                    visible={visible}
                    onClose={() => {
                        setVisible(false);
                    }}
                    images={[{src: imgSrc, alt: ''}]}
                />
            </> : null
        }
        <span style={{whiteSpace: "pre-line", wordWrap: "anywhere"}}>
            {text}
        </span>
        <span style={{display: "block", textAlign: (fromOperator ? "right" : "left")}}>
            {dayjs.unix(timestamp).format('DD.MM.YYYY HH:MM:ss')}
        </span>
    </div>
}

function OperatorChatMessage({text, timestamp}) {
    return <ChatMessage text={text} style={{alignSelf: "end", backgroundColor: '#d7ecfd'}} fromOperator={true}
                        timestamp={timestamp}/>
}

function UserChatMessage({text, imgSrc, timestamp}) {
    return <ChatMessage style={{backgroundColor: '#f1efe8'}} text={text} imgSrc={imgSrc} timestamp={timestamp}/>
}

function ChatBody({ticket}) {

    const [messages, setMessages] = useState([])
    const {accessToken} = useAuth();

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Clen': messages.length,
                'uuid': ticket.uu_id
            }
        };
        const x = () => axios('/api/messages', customConfig)
            .then((response) => {
                    if (response.data.length) {
                        setMessages([...messages, ...response.data]);
                        console.log(response.data);
                    }
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 1_000);
        return () => clearInterval(repeater);
    }, [messages, setMessages, accessToken, ticket.uu_id]);

    return <div className="flex-1 shadow-xl" style={{
        backgroundColor: "",
        borderRadius: "8px",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
    }}>
        {
            messages.map(
                (message) => {
                    if (message.from_operator) {
                        return <OperatorChatMessage
                            text={message.text} timestamp={message.timestamp}/>
                    }
                    return <UserChatMessage
                        text={message.text} imgSrc={message.img} timestamp={message.timestamp}/>
                }
            ).reverse()
        }
    </div>
}

function Chat({setMobileShowDetails, isDesktop, currentTicket, setCurrentTicket, height_px}) {
    return <div className={clsx("flex flex-col flex-1 relative", !isDesktop && 'pb-7 mt-[10px]')}
                style={{height: `${height_px}px`, maxHeight: `${height_px}px`}}>
        <ChatBody ticket={currentTicket}/>
        <ChatInputMessageField isDesktop={isDesktop} uu_id={currentTicket.uu_id}/>
    </div>
}

function Details({ticket, setMobileDetails, isDesktop, height_px, style}) {

    const [openEditModal, setOpenEditModal] = useState(false);
    const {accessToken} = useAuth();

    const createOnClickOrderHandler = (id, literal) => {
        return () => {
            let customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    uu_id: id,
                    value: literal
                }
            };
            axios.put("/api/order_status", {}, customConfig).catch(() => {
            })
        }
    }

    const createOnClickTicketHandler = (id, literal) => {
        return () => {
            let customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    uu_id: id,
                    value: literal
                }
            };
            axios.put("/api/ticket_status", {}, customConfig).catch(() => {
            })
        }
    }

    const actionOrderStatusMenuButtons = [
        "deleted",
        "waiting",
        "success",
        "success_error",
        "success_operator"
    ]

    const actionTicketStatusMenuButtons = [
        "new",
        "in_work",
        "solved",
        "declined",
        "pending"
    ]

    if (isDesktop)
        return <div style={{...style}}>
            <div className="relative" style={{
                backgroundColor: "",
                borderRadius: "8px",
                display: "grid",
                flexDirection: "column",
            }}>
                <div className="p-3 space-y-2 grid grid-cols-3">
                    <div>
                        Код заявки: <span>{`WA-${String(ticket.uu_id).toUpperCase()}`}</span>
                    </div>
                    <div>
                        Клиент: {ticket.client_username}
                    </div>
                    <div>
                        Платежная информация: {ticket.masked_card_number}
                    </div>
                    <div>Сумма: {ticket.amount} {ticket.currency}
                    </div>
                    <div>
                        Источник: {ticket.source}
                    </div>
                    <div>
                        Валюта: {ticket.currency}
                    </div>
                    <div>
                        Статус тикета: <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                <Badge
                                    color={status_colors[ticket.ticket_status]}>{translate[ticket.ticket_status]}</Badge>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {actionTicketStatusMenuButtons.map((value) => {
                                        return <Menu.Item>
                                            {({active}) => (
                                                <button
                                                    onClick={createOnClickTicketHandler(ticket.uu_id, value)}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                >
                                                    {translate[value]}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    </div>
                    <div>
                        Статус заявки: <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                <Badge
                                    color={status_colors[ticket.order_status]}>{translate[ticket.order_status]}</Badge>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {actionOrderStatusMenuButtons.map((value) => {
                                        return <Menu.Item>
                                            {({active}) => (
                                                <button
                                                    onClick={createOnClickOrderHandler(ticket.uu_id, value)}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                >
                                                    {translate[value]}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    </div>
                    {ticket.is_checked === null ? null : <div>
                        Проверена: <span
                        className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{ticket.is_checked ? "Да" : "Нет"}</span>
                    </div>}
                    <div>
                        Последний ответ: {ticket.lastAnswer ? "Оператор" : "Пользователь"}
                    </div>
                    <div>
                        Оператор: {ticket.operator}
                    </div>
                    <div>
                        Дата
                        обращения: {dayjs(ticket.date_of_request).format('DD.MM.YYYY HH:MM:ss')}
                    </div>
                    <div>
                        Последнее
                        изменение: {dayjs(ticket.date_of_last_change).format('DD.MM.YYYY HH:MM:ss')}
                    </div>
                </div>
            </div>
        </div>
    return <>
        <div className="w-full justify-between"
             style={{display: "flex", height: "48px", padding: "8px", borderRadius: "8px"}}>
            <div
                className="cursor-pointer h-[32px] border flex items-center justify-center shadow-xl border-solid border-[#E5E7EB] rounded-xl w-[32px] "
                onClick={() => setMobileDetails(null)}>
                <ChevronLeftIcon className="h-4 w-4"/>
            </div>
        </div>
        <div style={{...style}}>
            <div className="shadow-xl" style={{
                height: `${height_px - 160}px`,
                backgroundColor: "",
                borderRadius: "8px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                display: "flex",
                flexDirection: "column",
                marginTop: "10px"
            }}>
                <div className="px-6 py-5">
                    <div>
                        Код заявки: <span>{`WA-${String(ticket.uu_id).toUpperCase()}`}</span>
                    </div>
                    <div>
                        Клиент: {ticket.client_username}
                    </div>
                    <div>
                        Платежная информация: {ticket.masked_card_number}
                    </div>
                    <div>Сумма: {ticket.amount} {ticket.currency}
                    </div>
                    <div>
                        Источник: {ticket.source}
                    </div>
                    <div>
                        Валюта: {ticket.currency}
                    </div>
                    <div>
                        Статус тикета: <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                <Badge
                                    color={status_colors[ticket.ticket_status]}>{translate[ticket.ticket_status]}</Badge>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {actionTicketStatusMenuButtons.map((value) => {
                                        return <Menu.Item>
                                            {({active}) => (
                                                <button
                                                    onClick={createOnClickOrderHandler(ticket.uu_id, value)}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                >
                                                    {translate[value]}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    </div>
                    <div>
                        Статус заявки: <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button
                                className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                <Badge
                                    color={status_colors[ticket.order_status]}>{translate[ticket.order_status]}</Badge>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                                <div className="py-1">
                                    {actionOrderStatusMenuButtons.map((value) => {
                                        return <Menu.Item>
                                            {({active}) => (
                                                <button
                                                    onClick={createOnClickTicketHandler(ticket.uu_id, value)}
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                >
                                                    {translate[value]}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    })}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    </div>
                    {ticket.is_checked === null ? null : <div>
                        Проверена: {ticket.is_checked ? "Да" : "Нет"}
                    </div>
                    }
                    <div>
                        Последний ответ: {ticket.is_last_answer_from_operator ? "Оператор" : "Пользователь"}
                    </div>
                    <div>
                        Оператор: {ticket.operator}
                    </div>
                    <div>
                        Дата
                        обращения: {dayjs(ticket.date_of_request).format('DD.MM.YYYY HH:MM:ss')}
                    </div>
                    <div>
                        Последнее
                        изменение: {dayjs(ticket.date_of_last_change).format('DD.MM.YYYY HH:MM:ss')}
                    </div>
                </div>
            </div>
            <button
                className="flex w-full shadow-xl justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                style={{marginTop: "8px"}}
            >
                Действия
            </button>
            <button onClick={() => setOpenEditModal(true)}
                    className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    style={{marginTop: "16px"}}
            >
                Отклонить тикет
            </button>
            <DetailTicketModal openEditModal={openEditModal} setOpenEditModal={setOpenEditModal}/>
        </div>
    </>
}

function DetailTicket({currentTicket, setCurrentTicket}) {
    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    const [mobileShowDetails, setMobileShowDetails] = useState(false);
    const [clientHeight, setClientHeight] = useState(document.documentElement.clientHeight);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValue(0);
    }, [setValue]);

    useEffect(() => {
        function handleResize() {
            setMode(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            setClientHeight(document.documentElement.clientHeight);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {accessToken} = useAuth();
    const [tickets, setTickets] = useState([])
    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };

        const x = () => axios('/api/tickets', customConfig)
            .then((response) => {
                    if (JSON.stringify(response.data) !== JSON.stringify(tickets))
                        setTickets(response.data);
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, tickets]);


    const [logs, setLogs] = useState([])
    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const x = () => axios.post('https://vonderlinde228.xyz/api/admin/getOrderLogs', {"orderID": currentTicket.uu_id}, customConfig)
            .then((response) => {
                    if (response.data?.error) return;
                    if (JSON.stringify(response.data) !== JSON.stringify(logs))
                        setLogs(response.data?.logs);
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, currentTicket.uu_id, logs]);


    const [payments, setPayments] = useState([])
    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const x = () => axios.post('https://vonderlinde228.xyz/api/admin/findMissingPays', {"orderID": currentTicket.uu_id}, customConfig)
            .then((response) => {
                    if (response.data?.error) return;
                    if (JSON.stringify(response.data) !== JSON.stringify(payments))
                        setPayments(response.data?.payments);
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, currentTicket.uu_id, payments]);


    const [notes, setNotes] = useState([])
    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                uu_id: currentTicket.uu_id
            }
        };

        const x = () => axios('/api/notes', customConfig)
            .then((response) => {
                    if (response.data?.error) return;
                    if (JSON.stringify(response.data) !== JSON.stringify(notes))
                        setNotes([...response.data]);
                }
            ).catch((error) => {
            })
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken, currentTicket.uu_id, notes]);

    console.log("RERENDER")
    const noteInputRef = useRef(null);

    if (isDesktop)
        return <>
            <ChatHeader setMobileShowDetails={setMobileShowDetails}
                        isDesktop={isDesktop} currentTicket={currentTicket} setCurrentTicket={setCurrentTicket}/>
            <hr className="mt-2"/>
            <Stack direction="row" spacing={2} my={2}>
                {/*<Button variant="contained">Оставить заметку по тикету</Button>*/}
                {/*<Button variant="outlined" color="error">Забанить пользователя</Button>*/}
            </Stack>
            <div className="grid grid-cols-[2fr_1fr] gap-x-7 my-5 h-full flex-1">
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h5">Чаты</Typography>
                    <Chat isDesktop={isDesktop} currentTicket={currentTicket}
                          setCurrentTicket={setCurrentTicket} height_px={clientHeight - 220}/>
                    <Details ticket={currentTicket} isDesktop={true}/>
                </div>
                <div className="flex flex-col gap-y-2">
                    <Typography variant="h5">Информация</Typography>
                    <div className="flex flex-col gap-y-3">
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            {currentTicket.isP2PCard ? null : <Tab label="Логи"/>}
                            {currentTicket.isP2PCard ? null : <Tab label="Потерянные"/>}
                            <Tab label="Клиент"/>
                        </Tabs>
                        {value === 2 ?
                            <>
                                <div className="flex flex-col gap-y-2">
                                    <Typography variant="subtitle1">История обращений</Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Номер</TableCell>
                                                <TableCell>Дата обращения</TableCell>
                                                <TableCell>Статус</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tickets
                                                .filter((element) => element.client_username === currentTicket.client_username
                                                )
                                                .map((element) => {
                                                    return (
                                                        <TableRow>
                                                            <TableCell>{element.uu_id}</TableCell>
                                                            <TableCell>{dayjs(element.date_of_request).format('DD.MM.YYYY HH:MM:ss')}</TableCell>
                                                            <TableCell>{translate[element.order_status]}</TableCell>
                                                        </TableRow>
                                                    )
                                                })

                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                            : (
                                value === 0 ?
                                    <div className="flex flex-col gap-y-2">
                                        <Typography variant="subtitle1">Логи</Typography>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ИД заказа</TableCell>
                                                    <TableCell>Текст</TableCell>
                                                    <TableCell>Время</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    logs.map((element) => {
                                                        return (
                                                            <TableRow>
                                                                <TableCell>{element.orderID}</TableCell>
                                                                <TableCell>{element.text}</TableCell>
                                                                <TableCell>{dayjs(element.time).format('DD.MM.YYYY HH:MM:ss')}</TableCell>
                                                            </TableRow>
                                                        )
                                                    })}</TableBody>
                                        </Table></div>
                                    : (
                                        value === 1 ? <div className="flex flex-col gap-y-2">
                                                <Typography variant="subtitle1">Потерянные</Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>ИД</TableCell>
                                                            <TableCell>Сумма</TableCell>
                                                            <TableCell>Заявка</TableCell>
                                                            <TableCell></TableCell>
                                                            <TableCell>Время</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {payments.map((element) => {
                                                            return (
                                                                <TableRow>
                                                                    <TableCell>{element.id}</TableCell>
                                                                    <TableCell>{element.count}</TableCell>
                                                                    <TableCell>{element.uuID}</TableCell>
                                                                    <TableCell>{dayjs(element.time).format('DD.MM.YYYY HH:MM:ss')}</TableCell>
                                                                </TableRow>
                                                            )
                                                        })} </TableBody>
                                                </Table>
                                            </div> :
                                            null
                                    )
                            )
                        }
                        <div className="flex flex-col gap-y-2">
                            <Typography variant="subtitle1">История заметок</Typography>
                            <input ref={noteInputRef}/>
                            <Button
                                sx={{ml: 'auto'}}
                                style={{width: "100%"}}
                                onClick={
                                    () => {
                                        if (!noteInputRef.current.value) return
                                        let customConfig = {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${accessToken}`
                                            },
                                            params: {
                                                uu_id: currentTicket.uu_id
                                            }
                                        };
                                        axios.post("/api/notes", noteInputRef.current.value, customConfig)
                                            .then(
                                                () => {
                                                    noteInputRef.current.value = ""
                                                }
                                            ).catch(() => {
                                        })
                                    }
                                }
                            >
                                Добавить заметку
                            </Button>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Содержание</TableCell>
                                        <TableCell>Дата создания</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        notes.map(
                                            (value) => {
                                                return <TableRow>
                                                    <TableCell>{value.text}</TableCell>
                                                    <TableCell>{value.time}</TableCell>
                                                </TableRow>
                                            }
                                        )
                                    }

                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    if (mobileShowDetails)
        return <Details ticket={currentTicket} setMobileDetails={setMobileShowDetails} height_px={clientHeight - 160}
                        isDesktop={false}
                        style={{width: "100%"}}/>
    return <>
        <ChatHeader setMobileShowDetails={setMobileShowDetails}
                    isDesktop={isDesktop} currentTicket={currentTicket} setCurrentTicket={setCurrentTicket}/>
        <Stack direction="row" spacing={2}>
            <Button>Оставить заметку по тикету</Button>
            {/*<Button>Забанить пользователя</Button>*/}
        </Stack>
        <Chat mobileShowDetails={mobileShowDetails} setMobileShowDetails={setMobileShowDetails} isDesktop={false}
              width="100%" height_px={clientHeight - 160} currentTicket={currentTicket}
              setCurrentTicket={setCurrentTicket}/></>
}

export default DetailTicket;
