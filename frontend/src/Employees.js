import {ArrowsUpDownIcon, ChevronDownIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid"
import {Badge, Dropdown} from "flowbite-react";
import {Dialog, Menu, Transition} from "@headlessui/react";
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import React, {Fragment, useEffect, useState} from "react";
import clsx from "clsx";
import Pagination from "./Pagination";
import {useAuth} from "./auth/Auth";
import axios from "axios";
import {paginate} from "./func";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const roles = ["Администратор", "Старший оператор", "Оператор"];

function getRoleNameByRoleNumber(rn) {
    if (rn < 0 || rn >= roles.length) return null
    return roles[rn]
}

function DeleteModal({open, setOpen, employee, setEmployee}) {
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
                                                Вы уверены, что хотите удалить учетную запись {employee?.username}? Все
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
                                                    username: employee.username
                                                }
                                            };
                                            axios.delete(`/api/users`, customConfig)
                                                .then((response) => {
                                                    setOpen(false);
                                                    setEmployee(null);
                                                })
                                                .catch((error) => {
                                                    setOpen(false);
                                                    setEmployee(null);
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
                                            setEmployee(null);
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

function ResetTimeModal({open, setOpen, employee, setEmployee}) {
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
                                                Вы уверены, что хотите сбросить время работы {employee?.username}?
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
                                                    username: employee.username
                                                }
                                            };
                                            axios.post(`/api/reset_time`, {}, customConfig)
                                                .then((response) => {
                                                    setOpen(false);
                                                    setEmployee(null);
                                                })
                                                .catch((error) => {
                                                    setOpen(false);
                                                    setEmployee(null);
                                                })

                                        }
                                    }
                                >
                                    Сбросить
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={
                                        () => {
                                            setOpen(false);
                                            setEmployee(null);
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

function EditModal({open, setOpen, employee, setEmployee}) {
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
                                            Редактировать аккаунт
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="sm:w-full sm:max-w-sm">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Логин
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="username"
                                                                name="username"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee?.username}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    newEmployee.username = e.target.value;
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Отображаемое имя
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee?.displayableName}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    newEmployee.displayableName = e.target.value;
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            ИД в админ-панели
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee?.adminID}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    if (e.target.value.length === 0)
                                                                        newEmployee.adminID = null;
                                                                    else {
                                                                        let lastChar = e.target.value[e.target.value.length - 1]
                                                                        if ("0" <= lastChar && lastChar <= 9)
                                                                            newEmployee.adminID = parseInt(e.target.value);
                                                                        else if (e.target.value.length === 1) {
                                                                            e.target.value = "";
                                                                            newEmployee.adminID = null;
                                                                        } else {
                                                                            e.target.value = e.target.value.substring(0, e.target.value.length - 1)
                                                                            newEmployee.adminID = parseInt(e.target.value);
                                                                        }
                                                                    }
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                                Роль
                                                            </label>
                                                            <div className="mt-2">
                                                                <Menu as="div"
                                                                      className="relative inline-block text-left">
                                                                    <div>
                                                                        <Menu.Button
                                                                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                        >
                                                                            {
                                                                                getRoleNameByRoleNumber(employee?.role)
                                                                            }
                                                                            <ChevronDownIcon
                                                                                className="-mr-1 h-5 w-5 text-gray-400"
                                                                                aria-hidden="true"/>
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
                                                                        <Menu.Items static
                                                                                    className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                            <div className="py-1">
                                                                                {roles.map((value, idx) => {
                                                                                    return <Menu.Item>
                                                                                        {({active}) => (
                                                                                            <button
                                                                                                className={classNames(
                                                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                                    'block w-full px-4 py-2 text-left text-sm'
                                                                                                )}
                                                                                                onClick={() => {
                                                                                                    let newEmployee = structuredClone(employee);
                                                                                                    newEmployee.role = idx;
                                                                                                    setEmployee(newEmployee);
                                                                                                }}
                                                                                            >
                                                                                                {value}
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
                                                    <div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                                Пароль
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="password"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    onChange={(e) => {
                                                                        let newEmployee = structuredClone(employee);
                                                                        newEmployee.password = e.target.value;
                                                                        setEmployee(newEmployee);
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
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={
                                        () => {
                                            if (employee.username === "") {
                                                alert("Вы не ввели имя пользователя")
                                                return
                                            }

                                            if (employee.displayableName === "") {
                                                alert("Вы не ввели отображаемое имя")
                                                return
                                            }

                                            if (employee.adminID === null) {
                                                alert("Вы не ввели ИД")
                                                return
                                            }

                                            if (employee.password === "" || employee.password === undefined || employee.password === null){
                                                employee.password = null
                                            }
                                            else if (employee.password.length < 8) {
                                                alert("Вы ввели слишком короткий пароль (< 8 знаков)")
                                                return
                                            }



                                            const customConfig = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`,
                                                }
                                            };
                                            axios.put('/api/users', employee, customConfig)
                                                .then(
                                                    (response) => {
                                                        setOpen(false);
                                                        setEmployee(null);
                                                    }
                                                )
                                                .catch(
                                                    (error) => {
                                                        let details = error.response.data?.details
                                                        if (details === "Username already used") {
                                                            alert("Пользователь с таким именем уже зарегистрирован")
                                                            return
                                                        }
                                                        if (details === "Displayable name already used") {
                                                            alert("Пользователь с таким отображаемым именем уже зарегистрирован")
                                                            return
                                                        }
                                                        if (details === "Admin ID already used") {
                                                            alert("Пользователь с таким ИД уже зарегистрирован")
                                                            return
                                                        }
                                                    }
                                                )
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
                                            setEmployee(null);
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
    const [employee, setEmployee] = useState({
        adminID: null,
        displayableName: "",
        username: "",
        password: "",
        role: 2
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
                                            Создать аккаунт
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="sm:w-full sm:max-w-sm">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Логин
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="username"
                                                                name="username"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee.username}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    newEmployee.username = e.target.value;
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            Отображаемое имя
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee.displayableName}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    newEmployee.displayableName = e.target.value;
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="block text-sm font-medium leading-6 text-gray-900">
                                                            ИД в админ-панели
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                defaultValue={employee.adminID}
                                                                onChange={(e) => {
                                                                    let newEmployee = structuredClone(employee);
                                                                    if (e.target.value.length === 0)
                                                                        newEmployee.adminID = null;
                                                                    else {
                                                                        let lastChar = e.target.value[e.target.value.length - 1]
                                                                        if ("0" <= lastChar && lastChar <= 9)
                                                                            newEmployee.adminID = parseInt(e.target.value);
                                                                        else if (e.target.value.length === 1) {
                                                                            e.target.value = "";
                                                                            newEmployee.adminID = null;
                                                                        } else {
                                                                            e.target.value = e.target.value.substring(0, e.target.value.length - 1)
                                                                            newEmployee.adminID = parseInt(e.target.value);
                                                                        }
                                                                    }
                                                                    setEmployee(newEmployee);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                    <div>
                                                            <label
                                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                                Роль
                                                            </label>
                                                            <div className="mt-2">
                                                                <Menu as="div"
                                                                      className="relative inline-block text-left">
                                                                    <div>
                                                                        <Menu.Button
                                                                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                                        >
                                                                            {
                                                                                getRoleNameByRoleNumber(employee.role)
                                                                            }
                                                                            <ChevronDownIcon
                                                                                className="-mr-1 h-5 w-5 text-gray-400"
                                                                                aria-hidden="true"/>
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
                                                                        <Menu.Items static
                                                                                    className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                            <div className="py-1">
                                                                                {roles.map((value, idx) => {
                                                                                    return <Menu.Item>
                                                                                        {({active}) => (
                                                                                            <button
                                                                                                className={classNames(
                                                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                                    'block w-full px-4 py-2 text-left text-sm'
                                                                                                )}
                                                                                                onClick={() => {
                                                                                                    let newEmployee = structuredClone(employee);
                                                                                                    newEmployee.role = idx;
                                                                                                    setEmployee(newEmployee);
                                                                                                }}
                                                                                            >
                                                                                                {value}
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
                                                    <div>
                                                        <div>
                                                            <label
                                                                className="block text-sm font-medium leading-6 text-gray-900">
                                                                Пароль
                                                            </label>
                                                            <div className="mt-2">
                                                                <input
                                                                    id="password"
                                                                    name="password"
                                                                    type="password"
                                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    onChange={(e) => {
                                                                        let newEmployee = structuredClone(employee);
                                                                        newEmployee.password = e.target.value;
                                                                        setEmployee(newEmployee);
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
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={
                                        () => {
                                            if (employee.username === "") {
                                                alert("Вы не ввели имя пользователя")
                                                return
                                            }

                                            if (employee.displayableName === "") {
                                                alert("Вы не ввели отображаемое имя")
                                                return
                                            }

                                            if (employee.password === "") {
                                                alert("Вы не ввели пароль")
                                                return
                                            }

                                            if (employee.password.length < 8) {
                                                alert("Вы ввели слишком короткий пароль (< 8 знаков)")
                                                return
                                            }

                                            const customConfig = {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`,
                                                }
                                            };
                                            axios.post('/api/users', employee, customConfig)
                                                .then(
                                                    (response) => {
                                                        setOpen(false);
                                                        setEmployee({
                                                            adminID: null,
                                                            displayableName: "",
                                                            username: "",
                                                            password: "",
                                                            role: 2
                                                        });
                                                    }
                                                )
                                                .catch(
                                                    (error) => {
                                                        let details = error.response.data?.details
                                                        if (details === "Username already used") {
                                                            alert("Пользователь с таким именем уже зарегистрирован")
                                                            return
                                                        }
                                                        if (details === "Displayable name already used") {
                                                            alert("Пользователь с таким отображаемым именем уже зарегистрирован")
                                                            return
                                                        }
                                                        if (details === "Admin ID already used") {
                                                            alert("Пользователь с таким ИД уже зарегистрирован")
                                                            return
                                                        }
                                                    }
                                                )
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
                                            setEmployee({
                                                adminID: null,
                                                displayableName: "",
                                                username: "",
                                                password: "",
                                                role: 2
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

export default function Employees() {
    const [employee, setEmployee] = useState(null);
    const [isDesktop, setMode] = useState(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    const [people, setPeople] = useState([])
    const [page, setPage] = useState(1)

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openResetTimeModal, setOpenResetTimeModal] = useState(false);
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
        const x = () => axios('/api/users', customConfig)
            .then(
                (response) => {
                    setPeople(response.data);
                }
            ).catch((error) => {
            });
        x();
        const repeater = setInterval(x, 5_000);
        return () => clearInterval(repeater);
    }, [accessToken])


    const actionMenuButtons = [
        {
            text: "Удалить",
            createOnClickHandler: (employeeData) => {
                const data = structuredClone(employeeData)
                return () => {
                    setEmployee(data);
                    setOpenDeleteModal(true);
                }
            }
        },
        {
            text: "Редактировать",
            createOnClickHandler: (employeeData) => {
                const data = structuredClone(employeeData)
                return () => {
                    setEmployee(data);
                    setOpenEditModal(true);
                }
            }
        },
        {
            text: "Сбросить время работы",
            createOnClickHandler: (employeeData) => {
                const data = structuredClone(employeeData)
                return () => {
                    setEmployee(data);
                    setOpenResetTimeModal(true);
                }
            }
        }
    ]

    return (
        <>
            <DeleteModal open={openDeleteModal} setOpen={setOpenDeleteModal} employee={employee}
                         setEmployee={setEmployee}/>
            <ResetTimeModal open={openResetTimeModal} setOpen={setOpenResetTimeModal} employee={employee}
                         setEmployee={setEmployee}/>
            <EditModal open={openEditModal} setOpen={setOpenEditModal} employee={employee} setEmployee={setEmployee}/>
            <CreateModal open={openCreateModal} setOpen={setOpenCreateModal}/>
            {!isDesktop ? <div className="flex justify-between items-center">
                <h1 className="text-3xl"
                    style={{display: "block", paddingBottom: "25px", textAlign: "center"}}>Пользователи</h1>
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
                <h1 className="text-2xl font-semibold">Пользователи</h1>
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
                <div className="gap-x-6 py-5 w-full">
                    <div className={clsx("flex gap-x-4 w-full", !isDesktop && '!gap-x-[20px] !grid grid-cols-2')}
                         style={{paddingBottom: "20px"}}>
                        <Dropdown inline label="Статус">
                            <Dropdown.Item>Статус 1</Dropdown.Item>
                            <Dropdown.Item>Статус 2</Dropdown.Item>
                        </Dropdown>
                        <Dropdown inline label="Смена">
                            <Dropdown.Item>Смена 1</Dropdown.Item>
                            <Dropdown.Item>Смена 2</Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                <div className={clsx(isDesktop && "overflow-x-auto flex-1 flex flex-col")}>
                    <div className={clsx(isDesktop && "min-w-[1500px] divide-y")}>
                        {isDesktop ? <>
                            <div
                                className="grid grid-cols-8 px-3 h-[42px] border-l border-solid border-[#E5E7EB] border-r">
                                <div className="flex font-semibold items-center justify-center text-center">
                                    ИД в админ панели
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Логин
                                </div>
                                <div className="flex font-semibold items-center justify-center ">
                                    Отображаемое имя
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Статус
                                    <ArrowsUpDownIcon className="inline h-6 w-6" style={{marginLeft: "7.5px"}}/>
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Смена
                                    <ArrowsUpDownIcon className="inline h-6 w-6" style={{marginLeft: "7.5px"}}/>
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Время работы
                                    <ArrowsUpDownIcon className="inline h-6 w-6" style={{marginLeft: "7.5px"}}/>
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Роль
                                    <ArrowsUpDownIcon className="inline h-6 w-6" style={{marginLeft: "7.5px"}}/>
                                </div>
                                <div className="flex font-semibold items-center justify-center">
                                    Действия
                                </div>
                            </div>
                            {paginate(people, 10)[page - 1]?.map((person, idx, array) => (
                                <div key={idx}
                                     className={clsx("grid px-3 py-2 grid-cols-8 border-l border-solid border-[#E5E7EB] border-r", (array.length - 1) === idx && '!border-b')}>
                                    <div className="flex justify-center items-center">
                                        {person.adminID}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {person.username}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {person.displayableName}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <Badge color={person.is_online ? "success" : "failure"}>
                                            {person.is_online ? "online" : "offline"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <Badge color={person.turn ? "success" : "failure"}>
                                            {person.turn ? "At work" : "Not at work"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {Math.floor(person.time / 3600)}:{Math.floor(person.time % 3600 / 60)} hours
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {
                                            getRoleNameByRoleNumber(person.role)
                                        }
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
                            {paginate(people, 10)[page - 1]?.map((person, idx) => (
                                <div key={idx} className="rounded overflow-hidden shadow-lg" style={{marginTop: "1em"}}>
                                    <div className="px-6 py-5">
                                        <div>
                                            ИД в админ панели: {person.adminID}
                                        </div>
                                        <div style={{display: "flex"}}>
                                            Логин: {person.username}
                                        </div>
                                        <div style={{display: "flex"}}>
                                            Отображаемое имя: {person.displayableName}
                                        </div>
                                        <div>
                                            Статус: {person.is_online ? "online" : "offline"}
                                        </div>
                                        <div>
                                            Смена: {person.turn ? "At work" : "Not at work"}
                                        </div>
                                        <div>
                                            Время
                                            работы: {Math.floor(person.time / 3600)}:{Math.floor(person.time % 3600 / 60)} hours
                                        </div>
                                        <div>
                                            Роль: {getRoleNameByRoleNumber(person.role)}
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
                <Pagination currentPage={page} setCurrentPage={setPage} totalPages={Math.ceil(people.length / 10)}/>
            </div>
        </>
    )
}
