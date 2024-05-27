import React, { ChangeEvent } from "react";
import Stack from "react-bootstrap/Stack"
import Table from "react-bootstrap/Table"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { gameActions, gameSelectors } from "../../redux/features/game/gameSlice";

export const GameOverview: React.FC = () => {
    const [newGameName, setnewGameName] = React.useState("")

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        dispatch(gameActions.fetchAll())
    }, [dispatch])

    const games = useAppSelector(gameSelectors.selectAll)

    const addNewGame = () => {
        dispatch(gameActions.createOne({ name: newGameName, players:{} }))
        setnewGameName("")
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
                {games.map(({ id, name }) => (<tr key={id}>
                    <td>{name}</td>
                    <td>
                        <Button variant="danger" onClick={() => dispatch(gameActions.removeOne(id))}>-</Button>
                    </td>
                </tr>))}
                <tr>
                    <td colSpan={2}>
                        <Stack direction="horizontal" gap={5}>
                            <Form.Control
                                type="text"
                                value={newGameName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setnewGameName(e.target.value)}
                                onKeyDown={(e) => e.code === "Enter" && addNewGame()}
                            />
                            <Button
                                variant="success"
                                onClick={addNewGame} >+</Button>
                        </Stack>
                    </td>

                </tr>
            </tbody>
        </Table>
    )
}