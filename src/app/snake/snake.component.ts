import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Snake } from './../model/snake';
import { Row } from './../model/row';
import { Component, OnInit, HostListener } from '@angular/core';
import { Direction } from '../model/direction';
import { Cell } from '../model/cell';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit {

  rows: Row[] = [];
  snake: Snake[] = [];
  rowsCount = 20;
  cellCount = 20;
  running = false;
  gameSubscription: Subscription;
  direction: Direction = Direction.Left;

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction === Direction.Down) {
          return;
        }
        this.direction = Direction.Up;
        break;
      case 'ArrowDown':
        if (this.direction === Direction.Up) {
          return;
        }
        this.direction = Direction.Down;
        break;
      case 'ArrowLeft':
        if (this.direction === Direction.Right) {
          return;
        }
        this.direction = Direction.Left;
        break;
      case 'ArrowRight':
        if (this.direction === Direction.Left) {
          return;
        }
        this.direction = Direction.Right;
        break;
    }
  }

  ngOnInit(): void {
    this.initGameField();
    this.initPlayerModel();
    this.setNewFruit();
  }

  startGame() {
    this.running = true;
    this.gameSubscription = Observable.timer(1000, 100).subscribe(() => this.movePlayer());
  }

  stopGame() {
    this.running = false;
    this.gameSubscription.unsubscribe();
  }

  movePlayer() {
    const tail = this.snake[0];
    const nextHead = this.getNextHead();
    if (this.isGameOver(nextHead)) {
      alert('Game over!');
      this.stopGame();
      return;
    }
    if (this.foundFruit(nextHead)) {
      this.setNewFruit();
    }else {
      this.snake.splice(0, 1);
      this.rows[tail.row].cells[tail.cell] = Cell.Blank;
    }
    this.rows[nextHead.row].cells[nextHead.cell] = Cell.Snake;
    this.snake.push(nextHead);
  }

  private setNewFruit() {
    const row = Math.floor(Math.random() * (this.rowsCount));
    const cell = Math.floor(Math.random() * (this.cellCount));
    if (this.rows[row].cells[cell] === Cell.Blank) {
      this.rows[row].cells[cell] = Cell.Fruit;
    } else {
      this.setNewFruit();
    }
  }

  private getNextHead(): Snake {
    const currentHead = this.snake[this.snake.length - 1];
    switch (this.direction) {
      case Direction.Down:
        return new Snake(currentHead.row + 1, currentHead.cell);
      case Direction.Up:
        return new Snake(currentHead.row - 1, currentHead.cell);
      case Direction.Left:
        return new Snake(currentHead.row, currentHead.cell - 1);
      case Direction.Right:
        return new Snake(currentHead.row, currentHead.cell + 1);
    }
  }

  private isGameOver(nextHead: Snake): boolean {
    if (nextHead.cell > this.cellCount || nextHead.cell < 0) {
      return true;
    }
    if (nextHead.row > this.rowsCount || nextHead.row < 0) {
      return true;
    }
    const nextGameField = this.rows[nextHead.row].cells[nextHead.cell];
    if (nextGameField === Cell.Snake) {
      return true;
    }
    return false;
  }

  private foundFruit(nextHead: Snake): boolean {
    return this.rows[nextHead.row].cells[nextHead.cell] === Cell.Fruit;
  }

  private initPlayerModel() {
    for (let f = 0; f < 4; f++) {
      this.rows[10].cells[10 - f] = Cell.Snake;
      this.snake.push(new Snake(10, 10 - f));
    }
  }

  private initGameField() {
    for (let i = 0; i < this.rowsCount; i++) {
      this.rows[i] = new Row();
      this.rows[i].cells = [];
      for (let j = 0; j < this.cellCount; j++) {
        this.rows[i].cells[j] = Cell.Blank;
      }
    }
  }

}