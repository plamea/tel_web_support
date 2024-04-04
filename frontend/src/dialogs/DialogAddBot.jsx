import React, {useState} from 'react'
import {Button} from "flowbite-react";
import {
    DialogTitle,
    Stack,
    Dialog,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Input from "@mui/material/Input";

function DialogAddBot() {
    let [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setIsOpen(true)} color="gray">Добавить</Button>
            <Dialog maxWidth="sm" fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Добавление бота</DialogTitle>

                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <Input placeholder="Токен"
                        />
                        <Input placeholder="Адрес"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Добавить</Button>
                    <Button color="failure" onClick={() => setIsOpen(false)}>Отменить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogAddBot