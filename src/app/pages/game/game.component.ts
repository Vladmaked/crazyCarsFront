import {Component, ElementRef, HostListener, Injectable, OnInit, Renderer2, ViewChild} from '@angular/core';
import {HtmlService} from '../../html.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class GameComponent implements OnInit {
  @ViewChild('mountains0')
  mountains0: SVGElement;

  @ViewChild('mountains1')
  mountains1: ElementRef;

  @ViewChild('treeContainer0')
  treeContainer0: ElementRef;

  @ViewChild('treeContainer1')
  treeContainer1: ElementRef;

  @ViewChild('grassContainer0')
  grassContainer0: ElementRef;

  @ViewChild('grassContainer1')
  grassContainer1: ElementRef;

  text = this.htmlService.textOnService;
  indexLetter = 0;
  indexSpan = 0;
  letters = [{
    symbol: this.text.split(''),
    display: false,
    correct: false
  }];
  typedLetter: string;
  start;
  finish;
  timeOfThisLatter: number;
  timeOfLastLatter: number;
  speedCar = 7;
  speedOpponent = 5;
  positionCar = 0;
  positionOpponent = 0;
  backgroundObjects;
  arrayOfGrassIds = [];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.typedLetter = event.key;
    this.checkLetter();
  }

  constructor(private htmlService: HtmlService,
              private render: Renderer2) {
  }

  ngOnInit() {
    for (let i = 0; i < this.letters[0].symbol.length; i++) {
      const child = document.createElement('span');
      child.innerText = this.letters[0].symbol[i];
      document.getElementById('textZone').appendChild(child);
      child.setAttribute('id', String(i));
      child.setAttribute('class', 'text');
    }
    this.start = Date.now();
    this.timeOfLastLatter = this.start;
    for (let i = 0; i < 8; i++) {
      this.arrayOfGrassIds[i] = i;
    }
    this.backgroundObjects = [
      {
        id: this.mountains0,
        position: -screen.width,
        distance: 50
      },
      {
        id: this.mountains1,
        position: screen.width,
        distance: 50
      },
      {
        id: this.treeContainer0,
        position: 1,
        distance: 100
      },
      {
        id: this.treeContainer1,
        position: screen.width,
        distance: 100
      },
      {
        id: this.grassContainer0,
        position: 1,
        distance: 150
      },
      {
        id: this.grassContainer1,
        position: screen.width,
        distance: 150
      }
    ];
  }

  checkLetter() {
    const span = document.getElementById(String(this.indexSpan));
    if ( this.letters[0].symbol[this.indexLetter] === this.typedLetter ) {
      this.timeOfThisLatter = Date.now();
      if (this.indexLetter === this.letters[0].symbol.length - 1) {
        this.finish = this.timeOfThisLatter;
      }
      this.speedCar = 1000 / (this.timeOfThisLatter - this.timeOfLastLatter);
      this.timeOfLastLatter = this.timeOfThisLatter;
      this.letters[0].correct = true;
      this.indexLetter ++;
      this.indexSpan ++;
      span.style.backgroundColor = '#67ff65';
      this.move();
    } else {
      span.style.backgroundColor = '#8a0505';
    }
  }

  move() {
    this.checkPosition();
    if (this.finish || this.indexLetter === 0) {
      this.speedCar -= 0.1;
      if (this.speedCar < 0) {
        this.speedCar = 0;
        this.speedOpponent = 0;
      }
    }
    this.transformOfBlocks();
    requestAnimationFrame(() => this.move());
  }

  checkPosition() {
    const MAX_POSITION = screen.width / 3;
    const speed = this.speedCar; // this may contain const for animation (now remove it)
    this.speedOpponent = Math.random() * 5 + 5;
    if (this.positionCar > MAX_POSITION) {
      this.backgroundObjects.forEach((object) => {
        object.position -= speed;
        if (object.position < -screen.width) {
          object.position += screen.width;
        }
      });
      this.positionOpponent += this.speedOpponent - speed;
    } else {
      this.positionCar += speed;
      this.positionOpponent += this.speedOpponent;
    }
  }

  transformOfBlocks() {
    this.backgroundObjects.forEach((object) => {
      console.log(object);
      this.render.setStyle(object.id.nativeElement, 'left', object.position);
    });
    document.getElementById('car').style.left = `(${ Math.round(this.positionCar) }px)`;
    document.getElementById('carOpponent').style.left = `(${ Math.round(this.positionOpponent) }px)`;
  }

}
