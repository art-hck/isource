import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  stars: number[] = [1, 2, 3, 4, 5];

  @Output() sendRate = new EventEmitter<number>();
  @Output() close = new EventEmitter();

  rateValue: number;

  constructor() { }

  ngOnInit(): void {
  }

  setRating(star) {
    this.rateValue = star;
  }
  onSendRating() {
    this.sendRate.emit(this.rateValue);
  }

}
