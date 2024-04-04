import {Badge} from "flowbite-react";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import React, {Fragment, useEffect, useState} from "react";
import clsx from "clsx";
import Pagination from "./Pagination";
import {useAuth} from "./auth/Auth";
import axios from "axios";
import {paginate} from "./func";
import {EllipsisHorizontalIcon} from "@heroicons/react/24/solid";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function DeleteModal({open, setOpen, bot, setBot}) {
    const {accessToken} = useAuth();
    return <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
        }}
        >
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600"
                                                                 aria-hidden="true"/>
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            Удаление аккаунта
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Вы уверены, что хотите удалить бота {bot?.name}? Все
                                                данные
                                                будут удалены навсегда. Это действие не может быть отменено.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={
                                        () => {

                                            let customConfig = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`
                                                },
                                                params: {
                                                    token: bot.token
                                                }
                                            };
                                            axios.delete(`/api/bots`, customConfig)
                                                .then((response) => {
                                                    setOpen(false);
                                                    setBot(null);
                                                })
                                                .catch((error) => {
                                                    setOpen(false);
                                                    setBot(null);
                                                })

                                        }
                                    }
                                >
                                    Удалить
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={
                                        () => {
                                            setOpen(false);
                                            setBot(null);
                                        }
                                    }
                                >
                                    Отмена
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
}


function EditModal({open, setOpen, bot, setBot}) {
    const {accessToken} = useAuth();
    const [botOriginalToken, setBotOriginalToken] = useState(null)
    useEffect(() => {
        if (botOriginalToken == null) setBotOriginalToken(bot?.token);
    }, [bot, botOriginalToken])
    console.log(botOriginalToken)
    return <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
        }}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            Редактировать бот
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="sm:w-full sm:max-w-sm">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Токен
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="token"
                                                                name="Токен"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={bot?.token}
                                                                onChange={(e) => {
                                                                    let newbot = structuredClone(bot);
                                                                    newbot.token = e.target.value;
                                                                    setBot(newbot);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Название
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={bot?.name}
                                                                onChange={(e) => {
                                                                    let newbot = structuredClone(bot);
                                                                    newbot.name = e.target.value;
                                                                    setBot(newbot);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={
                                        () => {
                                            if (bot.token === "") {
                                                alert("Вы не ввели токен бота")
                                                return
                                            }

                                            if (bot.name === "") {
                                                alert("Вы не ввели название бота")
                                                return
                                            }

                                            const customConfig = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`,
                                                },
                                                params: {
                                                    token: botOriginalToken
                                                }
                                            };
                                            axios.put('/api/bots', bot, customConfig)
                                                .then(
                                                    (response) => {
                                                        setOpen(false);
                                                        setBot(null);
                                                        setBotOriginalToken(null);
                                                    }
                                                ).catch((error) => {})
                                        }
                                    }
                                >
                                    Сохранить
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={
                                        () => {
                                            setOpen(false);
                                            setBot(null);
                                            setBotOriginalToken(null);
                                        }
                                    }
                                >
                                    Отмена
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
}

function CreateModal({open, setOpen}) {
    const [bot, setBot] = useState({
        token: "",
        name: ""
    });

    const {accessToken} = useAuth();

    return <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {
        }}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <Dialog.Panel
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3"
                                                      className="text-base font-semibold leading-6 text-gray-900">
                                            Создать бота
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="sm:w-full sm:max-w-sm">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Токен
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="token"
                                                                name="token"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={bot.token}
                                                                onChange={(e) => {
                                                                    let newbot = structuredClone(bot);
                                                                    newbot.token = e.target.value;
                                                                    setBot(newbot);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Отображаемое название
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={bot.name}
                                                                onChange={(e) => {
                                                                    let newbot = structuredClone(bot);
                                                                    newbot.name = e.target.value;
                                                                    setBot(newbot);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={
                                        () => {
                                            if (bot.token === "") {
                                                alert("Вы не ввели токен бота")
                                                return
                                            }

                                            if (bot.name === "") {
                                                alert("Вы не ввели название бота")
                                                return
                                            }

                                            const customConfig = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`,
                                                }
                                            };
                                            axios.post('/api/bots', bot, customConfig)
                                                .then(
                                                    (response) => {
                                                        setOpen(false);
                                                        setBot({
                                                            token: "",
                                                            name: "",
                                                        });
                                                    }
                                                ).catch((error) => {})
                                        }
                                    }
                                >
                                    Создать
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={
                                        () => {
                                            setOpen(false);
                                            setBot({
                                                token: "",
                                                name: ""
                                            });
                                        }
                                    }
                                >
                                    Отмена
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition.Root>
}

export default function Bots() {
    const [bot, setBot] = useState(null);
    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    const [botList, setBotList] = useState([])
    const [page, setPage] = useState(1)

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const {accessToken} = useAuth();

    useEffect(() => {
        let customConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const x = () => axios('/api/bots', customConfig)
            .then(
                (response) => {
                    setBotList(response.data);
                }
            ).catch((error) => {});
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken])


    const actionMenuButtons = [
        {
            text: "Удалить",
            createOnClickHandler: (botData) => {
                const data = structuredClone(botData)
                return () => {
                    setBot(data);
                    setOpenDeleteModal(true);
                }
            }
        },
        {
            text: "Редактировать",
            createOnClickHandler: (botData) => {
                const data = structuredClone(botData)
                return () => {
                    setBot(data);
                    setOpenEditModal(true);
                }
            }
        },
        {
            text: "Запустить",
            createOnClickHandler: (botData) => {
                const data = structuredClone(botData)
                return () => {
                    console.log(accessToken)
                    let customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            token: data.token
                        }
                    };
                    axios.post('/api/bot_start', {}, customConfig).catch((error) => {});
                }
            }
        },
        {
            text: "Остановить",
            createOnClickHandler: (botData) => {
                const data = structuredClone(botData)
                return () => {
                    console.log(accessToken)
                    let customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        params: {
                            token: data.token
                        }
                    };
                    axios.post('/api/bot_stop', {}, customConfig).catch((error) => {});
                }
            }
        }
    ]

    return (
        <>
            <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} bot={bot}
                         setBot={setBot}/>
            <EditModal open={openEditModal} setOpen={setOpenEditModal} bot={bot} setBot={setBot}/>
            <CreateModal open={openCreateModal} setOpen={setOpenCreateModal}/>
            {!isDesktop ? <div className="flex justify-between items-center">
                <h1 className="text-3xl"
                    style={{display: "block", paddingBottom: "25px", textAlign: "center"}}>Боты</h1>
                <div>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                        onClick={
                            () => {
                                setOpenCreateModal(true);
                            }
                        }
                    >
                        Создать
                    </button>
                </div>
            </div> : <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Боты</h1>
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={
                        () => {
                            setOpenCreateModal(true);
                        }
                    }
                >
                    Создать
                </button>
            </div>}
            <div
                className={clsx("overflow-x-auto divide-y divide-gray-100 flex-1 flex flex-col", !isDesktop && 'p-[1px] mb-4 ')}
                style={{maxWidth: "100%"}}>
                <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                    <div className={clsx(isDesktop && "min-w-[1500px] divide-y")}>
                        {isDesktop ? <>
                            <div
                                className="grid grid-cols-4 px-3 h-[42px] border-l border-solid border-[#E5E7EB] border-r">
                                <div className="flex font-semibold items-center justify-center">
                                    Название бота
                                </div>
                                <div className="flex font-semibold items-center justify-center text-center">
                                    Токен
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Статус
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Действия
                                </div>
                            </div>
                            {paginate(botList, 10)[page - 1]?.map((person, idx, array) => (
                                <div key={idx}
                                     className={clsx("grid px-3 py-2 grid-cols-4 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}>
                                    <div className="flex justify-center items-center">
                                        {person.token}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {person.name}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <Badge color={person.is_online ? "success" : "failure"}>
                                            {person.is_online ? "онлайн" : "оффлайн"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button
                                                    className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                                    <EllipsisHorizontalIcon className="block h-6 w-6"/>
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
                                                        {actionMenuButtons.map((value) => {
                                                            return <Menu.Item>
                                                                {({active}) => (
                                                                    <button
                                                                        onClick={value.createOnClickHandler(person)}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block w-full px-4 py-2 text-left text-sm'
                                                                        )}
                                                                    >
                                                                        {value.text}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        })}
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            ))}
                        </> : <>
                            {paginate(botList, 10)[page - 1]?.map((person, idx) => (
                                <div key={idx} className="rounded overflow-hidden shadow-lg" style={{marginTop: "1em"}}>
                                    <div className="px-6 py-5">
                                        <div>
                                            Токен: {person.token}
                                        </div>
                                        <div>
                                            Название: {person.name}
                                        </div>
                                        <div>
                                            Статус: {person.is_online ? "online" : "offline"}
                                        </div>
                                        <div className="flex items-center gap-x-4">
                                            Действия: <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button
                                                    className="block rounded-md border-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-inset hover:ring-indigo-600">
                                                    <EllipsisHorizontalIcon className="block h-6 w-6"/>
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
                                                    className="absolute right-0 z-10 mt-[-12rem] w-56 left-[-1rem] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <div className="py-1">
                                                        {actionMenuButtons.map((value) => {
                                                            return <Menu.Item>
                                                                {({active}) => (
                                                                    <button
                                                                        onClick={value.createOnClickHandler(person)}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                            'block w-full px-4 py-2 text-left text-sm'
                                                                        )}
                                                                    >
                                                                        {value.text}
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        })}
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>}
                    </div>
                </div>
                <Pagination currentPage={page} setCurrentPage={setPage} totalPages={Math.ceil(botList.length / 10)}/>
            </div>
        </>
    )
}
