

import { Outlet, Route, Routes } from "react-router-dom";
import Quiz from "./Quiz";
import React from "react";

import styled from "styled-components";
import { playerApi } from "./api/player.api";
import { gameApi } from "./api/game.api";

const quiz = <Quiz />

const StyledApp = styled.div`
  width: 100vw;
  min-height: 100vh;
  color: ${p => p.theme.color};
  background-color: ${p => p.theme.bgColor};
`;

export const App: React.FC = () => {
  React.useEffect(() => {
    playerApi.startFetchCurrentPlayer()
    gameApi.startFetchCurrentGame()
  }, [])

  return (<StyledApp>
    <Outlet />
    <Routes>
      <Route index element={quiz} />
      <Route path="/poll" element={quiz} />
    </Routes>
  </StyledApp>)
}