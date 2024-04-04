import React, {useCallback, useState} from 'react'
import {Button} from "flowbite-react";
import {
    DialogTitle,
    Stack,
    Dialog,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import Input from "@mui/material/Input";
import {axios} from "../utils/axios";
import {useAuth} from "../auth/Auth";


function DialogAdd() {
    let [isOpen, setIsOpen] = useState(false)
    const {accessToken} = useAuth();

    const [values, setValues] = useState({
        username: '',
        displayableName: '',
        role: 0,
        password: '',
        password2: ''
    })

    const onChangeValue = useCallback((key, value) => {
            setValues(values => {
                return {
                    ...values,
                    [key]: value
                }
            })
        }, [values]
    )

    const onAddUser = async () => {
        await axios.post('/api/register', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        alert('Пользователь добавлен')
        setIsOpen(false)
        window.location.reload()
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} color="gray">Добавить</Button>
            <Dialog maxWidth="sm" fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Добавление пользователя</DialogTitle>

                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <Input placeholder="Имя" value={values.displayableName}
                               onChange={e => onChangeValue('displayableName', e.target.value)}
                        />
                        <Input placeholder="Логин" value={values.username}
                               onChange={e => onChangeValue('username', e.target.value)}
                        />
                        <Input type="password" placeholder="Пароль" value={values.password}
                               onChange={e => onChangeValue('password', e.target.value)}
                        />
                        <Input type="password" placeholder="Повторите" value={values.password2}
                               onChange={e => onChangeValue('password2', e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel >Роль</InputLabel>
                            <Select value={values.role}
                                label="Роль"
                                    onChange={e => onChangeValue('role', e.target.value)}
                            >
                                <MenuItem value={0}>Админ</MenuItem>
                                <MenuItem value={1}>Пользователь</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onAddUser}>Добавить</Button>
                    <Button color="failure" onClick={() => setIsOpen(false)}>Отменить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogAdd
