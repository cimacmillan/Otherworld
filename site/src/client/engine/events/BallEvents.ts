interface BallBounce {
  type: BallEventType.BOUNCE;
}

export enum BallEventType {
  BOUNCE = "BOUNCE",
}

export type BallEvents = BallBounce;
