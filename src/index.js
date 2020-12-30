import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 関数コンポーネント
// render メソッドだけを有して state がないコンポーネントをシンプルに書ける
function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={ this.props.squares[i] }
        onClick={ () => { this.props.onClick(i) } }
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          { this.renderSquare(0) }
          { this.renderSquare(1) }
          { this.renderSquare(2) }
        </div>
        <div className="board-row">
          { this.renderSquare(3) }
          { this.renderSquare(4) }
          { this.renderSquare(5) }
        </div>
        <div className="board-row">
          { this.renderSquare(6) }
          { this.renderSquare(7) }
          { this.renderSquare(8) }
        </div>
      </div>
    );
  }

}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] !== null && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function toPoint(i) {
  return [1, 2, 3].flatMap((row) => {
    return [1, 2, 3].map((col) => {
      return { row: row, col: col };
    });
  })[i];
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      histories: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const histories = this.state.histories.slice(0, this.state.stepNumber + 1);
    const current = histories[ histories.length - 1 ];
    const squares = current.squares.slice();
    if (squares[i] !== null || calculateWinner(squares) !== null) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      histories: histories.concat([{
        squares: squares,
        ...toPoint(i),
      }]),
      stepNumber: histories.length,
      xIsNext: !this.state.xIsNext,
    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const histories = this.state.histories;
    const current = histories[ this.state.stepNumber ];
    const winner = calculateWinner(current.squares);
    const status = (() => {
      if (winner !== null) {
        return `Winner: ${ winner }`;
      } else {
        return `Next player: ${ this.state.xIsNext ? 'X' : 'O' }`;
      }
    })();
    const moves = histories.map((step, index) => {
      const desc = index !== 0 ? `col: ${ step.col }, row: ${ step.row }` : 'Go to game start';
      return (
        <li key={ index } class={ index === this.state.stepNumber ? 'current-history' : '' }>
          <button onClick={ () => this.jumpTo(index) }>{ desc }</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            onClick={ i => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
