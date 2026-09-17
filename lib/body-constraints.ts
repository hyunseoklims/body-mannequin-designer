import type { BodyBaseProfile, RatioConstraint } from './body-profiles';
import type { BodySpecDraft } from './body-types';

const clamp=(value:number,min:number,max:number)=>Math.min(max,Math.max(min,value));

function projectRatio(spec:BodySpecDraft,rule:RatioConstraint,adjustments:string[]) {
  const numerator=spec[rule.numerator];
  const denominator=spec[rule.denominator];
  const ratio=numerator/denominator;
  if(ratio>=rule.min&&ratio<=rule.max)return;
  const boundary=ratio<rule.min?rule.min:rule.max;
  const projectedDenominator=(boundary*numerator+denominator)/(boundary*boundary+1);
  const projectedNumerator=boundary*projectedDenominator;
  spec[rule.numerator]=projectedNumerator;
  spec[rule.denominator]=projectedDenominator;
  adjustments.push(`${rule.numerator}/${rule.denominator}`);
}

export function solveBodyConstraints(requested:BodySpecDraft,profile:BodyBaseProfile) {
  const spec={...requested};
  const adjustments:string[]=[];
  const mark=(name:string,before:number,after:number)=>{ if(Math.abs(before-after)>.0001)adjustments.push(name); return after; };
  const minWidth=spec.headHeight*.11;

  spec.height=clamp(requested.height,100,250);
  spec.headCount=clamp(requested.headCount,4,10);
  spec.headHeight=spec.height/spec.headCount;
  spec.headWidth=mark('headWidth',spec.headWidth,Math.max(spec.headWidth,spec.headHeight*.52));
  spec.neckLength=mark('neckLength',spec.neckLength,clamp(spec.neckLength,spec.headHeight*.22,spec.headHeight*.62));
  spec.neckWidth=mark('neckWidth',spec.neckWidth,clamp(spec.neckWidth,minWidth,spec.shoulderWidth*.48));
  spec.shoulderSlope=mark('shoulderSlope',spec.shoulderSlope,clamp(spec.shoulderSlope,.035,.24));

  profile.softRatioConstraints.forEach((rule)=>projectRatio(spec,rule,adjustments));

  spec.upperArmWidth=mark('upperArmWidth',spec.upperArmWidth,Math.max(spec.upperArmWidth,minWidth*1.35));
  spec.forearmWidth=mark('forearmWidth',spec.forearmWidth,clamp(spec.forearmWidth,minWidth,spec.upperArmWidth*.93));
  spec.wristWidth=mark('wristWidth',spec.wristWidth,clamp(spec.wristWidth,minWidth*.72,spec.forearmWidth*.82));
  spec.elbowWidth=mark('elbowWidth',spec.elbowWidth,clamp(spec.elbowWidth,spec.wristWidth*1.05,spec.upperArmWidth*.90));
  spec.handWidth=mark('handWidth',spec.handWidth,Math.max(spec.handWidth,spec.wristWidth*1.08));

  spec.upperThighWidth=mark('upperThighWidth',spec.upperThighWidth,Math.max(spec.upperThighWidth,minWidth*1.7));
  spec.midThighWidth=mark('midThighWidth',spec.midThighWidth,clamp(spec.midThighWidth,spec.kneeWidth*1.16,spec.upperThighWidth*.94));
  spec.kneeWidth=mark('kneeWidth',spec.kneeWidth,clamp(spec.kneeWidth,minWidth,spec.upperThighWidth*.72));
  spec.calfWidth=mark('calfWidth',spec.calfWidth,Math.max(spec.calfWidth,minWidth*1.28));
  spec.ankleWidth=mark('ankleWidth',spec.ankleWidth,clamp(spec.ankleWidth,minWidth*.78,spec.calfWidth*.72));
  spec.calfMaxPosition=mark('calfMaxPosition',spec.calfMaxPosition,clamp(spec.calfMaxPosition,.24,.66));

  const shoulderPosition=spec.headHeight+spec.neckLength*profile.verticalLandmarks.shoulderNeckFraction;
  const minimumWaist=shoulderPosition+spec.chestHeight*.72;
  spec.waistPosition=mark('waistPosition',spec.waistPosition,clamp(spec.waistPosition,minimumWaist,spec.height*.55));
  const anklePosition=spec.height-spec.headHeight*.34;
  spec.pelvisHeight=mark('pelvisHeight',spec.pelvisHeight,clamp(spec.pelvisHeight,spec.headHeight*.55,spec.height*.17));
  let crotchPosition=spec.waistPosition+spec.pelvisHeight;
  if(crotchPosition>anklePosition-spec.headHeight*1.25){
    spec.pelvisHeight=anklePosition-spec.headHeight*1.25-spec.waistPosition;
    adjustments.push('pelvisHeight/verticalOrder');
    crotchPosition=spec.waistPosition+spec.pelvisHeight;
  }
  spec.kneePosition=mark('kneePosition',spec.kneePosition,clamp(spec.kneePosition,crotchPosition+spec.headHeight*.62,anklePosition-spec.headHeight*.62));
  spec.thighLength=spec.kneePosition-crotchPosition;
  spec.calfLength=anklePosition-spec.kneePosition;
  spec.torsoLength=crotchPosition-shoulderPosition;

  spec.upperArmLength=mark('upperArmLength',spec.upperArmLength,clamp(spec.upperArmLength,spec.headHeight*.82,spec.height*.22));
  spec.forearmLength=mark('forearmLength',spec.forearmLength,clamp(spec.forearmLength,spec.headHeight*.62,spec.height*.19));
  spec.handLength=mark('handLength',spec.handLength,clamp(spec.handLength,spec.headHeight*.48,spec.headHeight*.96));
  spec.elbowPosition=shoulderPosition+spec.upperArmLength;

  const uniqueAdjustments=Array.from(new Set(adjustments));
  return {spec,adjustments:uniqueAdjustments};
}
