import React from "react";

import Nav from "react-bootstrap/Nav"
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"

import { MultipleChoiceListEdit } from "./components/multiple-choice-list-edit.tsx/multiple-choice-list-edit";
import { Link, Outlet, Route, Routes, useLocation, useResolvedPath } from "react-router-dom";
import { PlayerDashboard } from "./pages/player/player-dashboard";
import { GameDashboard } from "./pages/game/game-dashboard";
import { GameSelector } from "./components/game/game-selector";


const multipleChoiceListEdit = <MultipleChoiceListEdit />

export const AdminApp: React.FC = () => {
    const { pathname: fullPath } = useLocation()
    const { pathname: basePath } = useResolvedPath(".")

    return (
        <>
            <Nav className="justify-content-between" variant="tabs" activeKey={fullPath}>
                <Stack direction="horizontal">
                    <Nav.Link eventKey={`${basePath}/questions`} as={Link} to="./questions">Vragen</Nav.Link>
                    <Nav.Link eventKey={`${basePath}/players`} as={Link} to="./players">Spelers</Nav.Link>
                    <Nav.Link eventKey={`${basePath}/games`} as={Link} to="./games">Sessies</Nav.Link>
                </Stack>
                <Stack direction="horizontal" gap={1}>
                    <GameSelector />
                    <Nav.Link as={Link} to="/">Exit</Nav.Link>
                </Stack>
            </Nav>
            <Outlet />
            <Routes>
                <Route index element={multipleChoiceListEdit} />
                <Route path="/questions" element={multipleChoiceListEdit} />
                <Route path="/players" element={<PlayerDashboard />} />
                <Route path="/games" element={<GameDashboard />} />

            </Routes>
        </>
    )
}