interface BallBounce {
  type: BallEventType.BOUNCE;
}

interface ForceBounce {
  type: BallEventType.FORCE_BOUNCE;
}

export enum BallEventType {
  BOUNCE = "BOUNCE",
  FORCE_BOUNCE = "FORCE_BOUNCE",
}

export type BallEvents = BallBounce | ForceBounce;
