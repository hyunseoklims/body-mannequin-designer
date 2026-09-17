export type Sex = '남성' | '여성';

export type ManualModifiers = {
  shoulder:number; chest:number; waist:number; hip:number; upperBody:number; legs:number; arms:number; thighs:number; calves:number;
  headWidth:number; neckLength:number; neckWidth:number; shoulderSlope:number; chestHeight:number; waistPosition:number; pelvisHeight:number;
  upperArmWidth:number; elbowWidth:number; forearmWidth:number; wristWidth:number; handLength:number; handWidth:number;
  upperThighWidth:number; midThighWidth:number; kneeWidth:number; calfMaxPosition:number; ankleWidth:number; footLength:number; footWidth:number;
};

export type BodySpecInput = {
  sex:Sex;
  height:number;
  weight:number;
  headCount:number;
  modifiers?:Partial<ManualModifiers>;
};

export interface BodyDimensions {
  headHeight:number; headWidth:number; neckLength:number; neckWidth:number;
  shoulderWidth:number; shoulderSlope:number;
  chestWidth:number; chestHeight:number; torsoLength:number; waistWidth:number; waistPosition:number; pelvisWidth:number; pelvisHeight:number;
  upperArmLength:number; upperArmWidth:number; elbowWidth:number; forearmLength:number; forearmWidth:number; wristWidth:number; elbowPosition:number;
  handLength:number; handWidth:number;
  upperThighWidth:number; midThighWidth:number; kneeWidth:number; thighLength:number;
  calfLength:number; calfWidth:number; calfMaxPosition:number; ankleWidth:number; kneePosition:number;
  footLength:number; footWidth:number;
}

export interface BodySpecDraft extends BodyDimensions {
  profileId:'male-average'|'female-average';
  sex:Sex;
  height:number;
  weight:number;
  headCount:number;
  bodyVolume:number;
}

export interface BodySpec extends BodySpecDraft {
  modifiers:ManualModifiers;
  requestedDimensions:BodyDimensions;
  constraintAdjustments:string[];
  hipWidth:number;
  upperBodyLength:number;
  legLength:number;
  armLength:number;
  thighWidth:number;
  heelWidth:number;
  forefootWidth:number;
  toeSpread:number;
}
