import React from 'react';
import {Menu} from "@headlessui/react";
import {MenuItem} from "@mui/material";
import {Button} from "flowbite-react";

const DetailButton = () => {
    return (
        <div className="relative">
            <Menu>
                <Menu.Button
                    className="shadow-xl relative flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    style={{marginTop: "16px"}}
                >
                    ...
                </Menu.Button>
                <Menu.Items className="absolute top-auto bottom-0 bg-white rounded-xl z-50 right-0 left-0 ">
                    <MenuItem className="!px-lg mx-xl">
                        <Button className="w-full">Потерянные платежи</Button>
                    </MenuItem>
                    <MenuItem className="!px-lg mx-xl">
                        <Button color="blue" className="w-full">Просмотр логов</Button>
                    </MenuItem>
                    <MenuItem className="!px-lg mx-xl">
                        <Button color="red" className="w-full">Заблокировать</Button>
                    </MenuItem>
                </Menu.Items>
            </Menu>
        </div>
    );
};

export default DetailButton;
