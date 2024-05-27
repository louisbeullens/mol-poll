import React, { ChangeEvent } from "react";
import { playerActions, playerSelectors } from "../../redux/features/player/playerSlice";

import Stack from "react-bootstrap/Stack"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IPlayer } from "../../common/types";
import { playerApi } from "../../api/player.api";

export const PlayerOverview: React.FC = () => {
    const [newPlayerName, setNewPlayerName] = React.useState("")

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        dispatch(playerActions.fetchAll())
    }, [dispatch])

    const players = useAppSelector(playerSelectors.selectAll)

    const share = (player: IPlayer) => {
        playerApi.setCurrentPlayerId(player.id)
    }

    const addNewUser = () => {
        dispatch(playerActions.createOne({ name: newPlayerName }))
        setNewPlayerName("")
        return true
    }

    return (
        <Table striped bordered>
            <thead>
                <tr>
                    <td>Naam</td>
                </tr>
            </thead>
            <tbody>
                {players.map(({ id, name }) => (<tr key={id}>
                    <td>{name}</td>
                    <td>
                        <Button onClick={() => share({ id, name })}>Connect</Button>
                        <Button variant="danger" onClick={() => dispatch(playerActions.removeOne(id))}>-</Button>
                    </td>
                </tr>))}
                <tr>
                    <td colSpan={2}>
                        <Stack direction="horizontal" gap={5}>
                            <Form.Control
                                type="text"
                                value={newPlayerName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)}
                                onKeyDown={(e) => e.code === "Enter" && addNewUser()}
                            />
                            <Button
                                variant="success"
                                onClick={addNewUser} >+</Button>
                        </Stack>
                    </td>

                </tr>
            </tbody>
        </Table>
    )
}