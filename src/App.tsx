import * as React from 'react';
import { useState, useRef } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  padding-top: 2rem;
  margin: 0 auto;

  button {
    display: block;
    margin: 0 auto;
  }
`;

const Container = styled.div`
  width: 375px;
  margin: 0 auto;
`;

const Title = styled.div`
  text-align: center;
  margin: 3rem 0;
`;

const Board = styled.div`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  width: 300px;
`;

const Cell = styled.li`
  list-style: none;
  height: 100px;
  flex: 1 0 33.3333%;

  div {
    height: 100%;
    border: 1px solid black;
    border-collapse: collapse;
    font-size: 3rem;
    text-align: center;
    line-height: 98px;
  }
`;

type CellProps = {
  children: React.ReactNode;
  onClick: (i: number) => void;
  id: number;
};

function CellContainer({ children, onClick, id }: CellProps) {
  return (
    <Cell>
      <div onClick={() => onClick(id)}>{children}</div>
    </Cell>
  );
}

type Player = 'O' | 'X';
type Value = Player | null;

interface Cell {
  value: Value;
}

const initialState = (): Cell[] =>
  Array.from({ length: 9 }, () => ({
    value: null,
  }));

export default function App() {
  const [board, setBoard] = useState<Cell[]>(initialState());
  const order = useRef<number>(0);
  const [winner, setWinner] = useState<Value>(null);
  const [history, setHistory] = useState<Cell[][]>([initialState()]);

  const getPlayer = (): Player => (order.current % 2 === 0 ? 'O' : 'X');

  const onClick = (id: number) => {
    if (winner) return;

    if (board[id].value) return;

    const newBoard = board.map((cell, i) =>
      i === id ? { ...cell, value: getPlayer() } : cell
    );

    setHistory([...history.filter((board, i) => i <= order.current), newBoard]);
    handleBoard(newBoard);
    order.current += 1;
  };

  const handleBoard = (newBoard: Cell[]) => {
    setWinner(isOver(newBoard));
    setBoard(newBoard);
  };

  const handleHistory = (id: number): void => {
    order.current = id;
    handleBoard(history[id]);
  };

  return (
    <Container>
      <Title>
        <h1>Tic-Tac-Toe</h1>
        <h2>{winner ? `Winner: ${winner}` : `Next: ${getPlayer()}`}</h2>
      </Title>
      <Board>
        {board.map((cell, i) => (
          <CellContainer key={i} onClick={onClick} id={i}>
            {cell.value}
          </CellContainer>
        ))}
      </Board>
      <Panel>
        {history.map((board, i) => (
          <button key={i} onClick={() => handleHistory(i)}>
            Goto Move #{i}
          </button>
        ))}
      </Panel>
    </Container>
  );
}

// 게임오버조건
// 1. 일직선으로 다채우거나
// 2. 대각선으로 다채우거나
const overTemplate = [
  // 가로
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //세로
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //대각선
  [0, 4, 8],
  [2, 4, 6],
];

function isOver(board: Cell[]): Value {
  for (const [a, b, c] of overTemplate) {
    if (
      board[a].value &&
      board[a].value === board[b].value &&
      board[a].value === board[c].value
    ) {
      return board[a].value;
    }
  }

  return null;
}
