export class LinearSpace {
  private delta:number;
  private length:number;
  private accu: number;
  private index: number;
  private space:number[];

  constructor(start:number, delta:number, length:number) {
    this.accu = start;
    this.index = 0;
    this.delta = delta;
    this.length = length;
    this.space = Array.apply(null, { length: this.length }).map(() => {
      let retVal = this.accu;
      this.accu += this.delta;
      return retVal;
    });
  }


  getNext():number {
    let retVal = this.space[this.index];
    this.index = (++this.index) % this.length;
    return retVal;
  }
}