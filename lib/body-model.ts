import { solveBodyConstraints } from './body-constraints';
import { applySliderModifiers } from './body-influence-map';
import { getBaseProfile } from './body-profiles';
import type { BodyDimensions, BodySpec, BodySpecDraft, BodySpecInput, ManualModifiers, Sex } from './body-types';

export type { BodyDimensions, BodySpec, BodySpecDraft, BodySpecInput, ManualModifiers, Sex } from './body-types';

export const defaultModifiers:ManualModifiers = {
  shoulder:0,chest:0,waist:0,hip:0,upperBody:0,legs:0,arms:0,thighs:0,calves:0,
  headWidth:0,neckLength:0,neckWidth:0,shoulderSlope:0,chestHeight:0,waistPosition:0,pelvisHeight:0,
  upperArmWidth:0,elbowWidth:0,forearmWidth:0,wristWidth:0,handLength:0,handWidth:0,
  upperThighWidth:0,midThighWidth:0,kneeWidth:0,calfMaxPosition:0,ankleWidth:0,footLength:0,footWidth:0,
};

const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));
const dimensionsOf=(spec:BodySpecDraft):BodyDimensions=>({
  headHeight:spec.headHeight,headWidth:spec.headWidth,neckLength:spec.neckLength,neckWidth:spec.neckWidth,
  shoulderWidth:spec.shoulderWidth,shoulderSlope:spec.shoulderSlope,chestWidth:spec.chestWidth,chestHeight:spec.chestHeight,
  torsoLength:spec.torsoLength,waistWidth:spec.waistWidth,waistPosition:spec.waistPosition,pelvisWidth:spec.pelvisWidth,pelvisHeight:spec.pelvisHeight,
  upperArmLength:spec.upperArmLength,upperArmWidth:spec.upperArmWidth,elbowWidth:spec.elbowWidth,forearmLength:spec.forearmLength,
  forearmWidth:spec.forearmWidth,wristWidth:spec.wristWidth,elbowPosition:spec.elbowPosition,handLength:spec.handLength,handWidth:spec.handWidth,
  upperThighWidth:spec.upperThighWidth,midThighWidth:spec.midThighWidth,kneeWidth:spec.kneeWidth,thighLength:spec.thighLength,
  calfLength:spec.calfLength,calfWidth:spec.calfWidth,calfMaxPosition:spec.calfMaxPosition,ankleWidth:spec.ankleWidth,kneePosition:spec.kneePosition,
  footLength:spec.footLength,footWidth:spec.footWidth,
});

export function calculateAutoBodySpec(input:Omit<BodySpecInput,'modifiers'>):BodySpecDraft {
  const profile=getBaseProfile(input.sex);
  const height=clamp(input.height,100,250);
  const weight=clamp(input.weight,20,250);
  const headCount=clamp(input.headCount,4,10);
  const headHeight=height/headCount;
  const expectedWeight=profile.referenceWeight*Math.pow(height/profile.referenceHeight,2);
  const bodyVolume=clamp(Math.sqrt(weight/expectedWeight),.72,1.38);
  const weighted=(base:number,coefficient:number)=>base*(1+(bodyVolume-1)*coefficient);
  const vertical=profile.verticalLandmarks;
  const headDelta=headHeight-height/7.5;
  const waistPosition=height*vertical.waistHeight+headDelta*.14;
  const pelvisHeight=height*profile.pelvisHeightHeight;
  const kneePosition=height*vertical.kneeHeight-headDelta*.05;
  const anklePosition=height-headHeight*.34;
  const shoulderPosition=headHeight+headHeight*profile.neckLengthH*vertical.shoulderNeckFraction;

  return {
    profileId:profile.id,sex:input.sex,height,weight,headCount,bodyVolume,
    headHeight,headWidth:headHeight*profile.headWidthH,neckLength:headHeight*profile.neckLengthH,neckWidth:headHeight*profile.neckWidthH,
    shoulderWidth:headHeight*profile.shoulderWidthH,shoulderSlope:profile.shoulderSlope,
    chestWidth:weighted(headHeight*profile.chestWidthH,profile.weightCoefficients.chest),chestHeight:headHeight*profile.chestHeightH,
    torsoLength:waistPosition+pelvisHeight-shoulderPosition,
    waistWidth:weighted(headHeight*profile.waistWidthH,profile.weightCoefficients.waist),waistPosition,
    pelvisWidth:weighted(headHeight*profile.pelvisWidthH,profile.weightCoefficients.pelvis),pelvisHeight,
    upperArmLength:height*profile.upperArmLengthHeight,
    upperArmWidth:weighted(headHeight*profile.upperArmWidthH,profile.weightCoefficients.upperArm),elbowWidth:headHeight*profile.elbowWidthH,
    forearmLength:height*profile.forearmLengthHeight,forearmWidth:weighted(headHeight*profile.forearmWidthH,profile.weightCoefficients.forearm),
    wristWidth:headHeight*profile.wristWidthH,elbowPosition:shoulderPosition+height*profile.upperArmLengthHeight,
    handLength:headHeight*profile.handLengthH,handWidth:headHeight*profile.handWidthH,
    upperThighWidth:weighted(headHeight*profile.upperThighWidthH,profile.weightCoefficients.thigh),
    midThighWidth:weighted(headHeight*profile.midThighWidthH,profile.weightCoefficients.thigh*.88),kneeWidth:headHeight*profile.kneeWidthH,
    thighLength:kneePosition-(waistPosition+pelvisHeight),calfLength:anklePosition-kneePosition,
    calfWidth:weighted(headHeight*profile.calfWidthH,profile.weightCoefficients.calf),calfMaxPosition:vertical.calfPeakFraction,
    ankleWidth:headHeight*profile.ankleWidthH,kneePosition,footLength:headHeight*profile.footLengthH,footWidth:headHeight*profile.footWidthH,
  };
}

export function calculateBodySpec(input:BodySpecInput):BodySpec {
  const modifiers={...defaultModifiers,...input.modifiers};
  const profile=getBaseProfile(input.sex);
  const autoSpec=calculateAutoBodySpec({sex:input.sex,height:input.height,weight:input.weight,headCount:input.headCount});
  const requestedSpec=applySliderModifiers(autoSpec,modifiers);
  const {spec,adjustments}=solveBodyConstraints(requestedSpec,profile);
  return {
    ...spec,modifiers,requestedDimensions:dimensionsOf(requestedSpec),constraintAdjustments:adjustments,
    hipWidth:spec.pelvisWidth,upperBodyLength:spec.torsoLength,
    legLength:spec.thighLength+spec.calfLength,armLength:spec.upperArmLength+spec.forearmLength,thighWidth:spec.upperThighWidth,
    heelWidth:spec.ankleWidth*1.30,forefootWidth:spec.footWidth*1.72,toeSpread:spec.footWidth*.10,
  };
}
