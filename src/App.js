import React, { Component } from 'react';
import './App.css';

const underscore = require('underscore')

class LetterPicker extends Component {
  constructor(props) {
    super(props)
  }

  pickX = () => {
    this.props.pick('x')
  }

  pickO = () => {
    this.props.pick('o')
  }

  render() {
    const styles = {
      margin: '20px auto 0 auto',
      padding: '20px',
      clear: 'both',
    }
    return (<div style={styles}>
              <p>Pick your marker</p>
              <button onClick={this.pickX}>X</button><button onClick={this.pickO}>O</button>
            </div>);
  }
}

class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: new Array(9).fill(''),
      marker: 'x',
      userClick: true
    }
  }

  reset = () => {
    this.setState({ board: new Array(9).fill(''), marker: 'x', userClick: true })
  }
  mark = (i, cb) => {
    this.setState({
      board: this.state.board.map((e, index) => index === i ? this.state.marker : e),
      marker: this.state.marker === 'x' ? 'o' : 'x',
    }, cb)
  }

  fullBoard = () => {
    return this.state.board.filter(e => e === '').length === 0
  }

  handleClick = (i) => {
    const gameOver = () => {
      const winningSequences = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                                [0, 4, 8], [2, 4, 6]]
      return winningSequences.map(seq => [this.state.board[seq[0]],this.state.board[seq[1]],this.state.board[seq[2]]])
                      .map(seq => seq[0] === seq[1] && seq[1] === seq[2] && seq[0] === seq[2] && seq[0] !== '').filter(e => e).length > 0
    }
    if (this.state.userClick) {
      this.mark(i, () => {
        if (gameOver()) {
          this.setState({ userClick: false })
          setTimeout(() => {
            alert('you won!')
            this.reset()
          }, 1000)
        } else if(this.fullBoard()) {
          this.setState({ userClick: false })
          setTimeout(() => {
            alert('cat\'s game')
            this.reset()
          }, 1000)
        } else {
          //computer move
          //get indices of unfilled squares
          const unfilled = this.state.board.reduce((a, e, i) => { if (e === '') { return a.concat(i) } else { return a } }, [])
          //get random unfilled square index
          const randomUnfilled = underscore.sample(unfilled)
          this.mark(randomUnfilled, () => {
            if (gameOver()) {
              this.setState({ userClick: false })
              setTimeout(() => {
                alert('computer won...')
                this.reset()
              }, 1000)
            }
          })
        }
      })
    }
  }

  pick = (e) => {
    this.setState({ marker: e })
  }

  render() {
    const styles = {
      border: '1px solid black',
      width: '300px',
      height: '300px',
      margin: '20px auto 0 auto',
    }

    return (
      <div style={styles}>
        {this.state.board.map((e, i) => <Cell handleClick={() => this.handleClick(i)} index={i} marker={this.state.board[i]}></Cell>)}
        <LetterPicker pick={this.pick}></LetterPicker>
      </div>
    );
  }
}

class Cell extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const styles = {
      boxSizing: 'border-box',
      width: '100px',
      height: '100px',
      border: '1px solid black',
      float: 'left',
      fontSize: '80px',
      cursor: 'default', 
      userSelect: 'none',
    }

    return (
      <div style={styles} onClick={this.props.handleClick}>
        {this.props.marker}
      </div>
    );
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <Board>
        </Board>
      </div>
    );
  }
}

export default App;
