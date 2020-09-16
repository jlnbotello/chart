export class DataPoint {
  public value: number;
  public timestamp: number;

  constructor(timestamp: number, value: number) {
    this.value = value;
    this.timestamp = timestamp;
  }

}