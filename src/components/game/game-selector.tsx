import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { gameActions, gameSelectors, useCurrentGame } from "../../redux/features/game/gameSlice";
import { IGame } from "../../common/types";
import { gameApi } from "../../api/game.api";

export const GameSelector: React.FC = () => {
    const games = useAppSelector(gameSelectors.selectAll)
    const currentGame = useCurrentGame()
    const dispatch = useAppDispatch()

    React.useEffect(() => {
        dispatch(gameActions.fetchAll())
    }, [dispatch])

    const onSelect = ((eventKey: string | null) => {
        eventKey && gameApi.setCurrentGameId(eventKey)
    })

    return (
        <Dropdown as={ButtonGroup} defaultValue={currentGame?.id} onSelect={onSelect}>
            <Dropdown.Toggle split>{currentGame?.name ?? "Select Game"}</Dropdown.Toggle>
            <Dropdown.Menu>
                {games.map(({ id, name }: IGame) => (<Dropdown.Item key={id} eventKey={id}>{name}</Dropdown.Item>))}
            </Dropdown.Menu>
            <Button variant="success">+</Button>
        </Dropdown>
    )
}