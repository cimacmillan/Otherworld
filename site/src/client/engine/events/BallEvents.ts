interface BallBounce {
  type: BallEventType.BOUNCE;
}

export enum BallEventType {
  BOUNCE = "BOUNCE",
  CREATE = "CREATE",
}

export type BallEvents = BallBounce;
