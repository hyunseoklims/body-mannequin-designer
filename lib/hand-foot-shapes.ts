import type { Sex } from './body-types';

export type HandLandmarkName='wristInner'|'wristOuter'|'palmInner'|'palmOuter'|'thumbBase'|'thumbTip'|'indexSide'|'littleFingerSide'|'middleFingerTip';
export type FootLandmarkName='ankleInner'|'ankleOuter'|'heelInner'|'heelOuter'|'forefootInner'|'forefootOuter'|'bigToeTip'|'littleToeTip'|'soleInner'|'soleOuter'|'floorContact';
export type ShapePoint={name:HandLandmarkName|FootLandmarkName;distance:number;y:number};

export type HandBaseShape={
  palmWidthFactor:number; thumbReachFactor:number; thumbY:number; fingerTipY:number;
  middleTipFactor:number; indexFactor:number; littleFingerFactor:number;
};
export type FootBaseShape={
  heelFactor:number; forefootFactor:number; toeSpread:number; heelY:number; forefootY:number;
};

export const MaleHandBaseShape:HandBaseShape={palmWidthFactor:.96,thumbReachFactor:.18,thumbY:.40,fingerTipY:.94,middleTipFactor:.82,indexFactor:.92,littleFingerFactor:.66};
export const FemaleHandBaseShape:HandBaseShape={palmWidthFactor:.92,thumbReachFactor:.16,thumbY:.38,fingerTipY:.94,middleTipFactor:.80,indexFactor:.90,littleFingerFactor:.64};
export const MaleFootBaseShape:FootBaseShape={heelFactor:.58,forefootFactor:.94,toeSpread:.12,heelY:.82,forefootY:.96};
export const FemaleFootBaseShape:FootBaseShape={heelFactor:.56,forefootFactor:.92,toeSpread:.15,heelY:.82,forefootY:.96};

export const getHandBaseShape=(sex:Sex)=>sex==='남성'?MaleHandBaseShape:FemaleHandBaseShape;
export const getFootBaseShape=(sex:Sex)=>sex==='남성'?MaleFootBaseShape:FemaleFootBaseShape;

export function createHandBaseShape(input:{sex:Sex;wristCenterDistance:number;wristWidth:number;handWidth:number;handLength:number;wristY:number;headHeight:number;minDistance:number}):ShapePoint[] {
  const shape=getHandBaseShape(input.sex);
  const palmHalf=input.handWidth*shape.palmWidthFactor/2;
  const outer=input.wristCenterDistance+input.wristWidth*.52;
  const inner=Math.max(input.minDistance,input.wristCenterDistance-input.wristWidth*.48);
  const y=(fraction:number)=>input.wristY+input.handLength*fraction;
  return [
    {name:'wristOuter',distance:outer,y:input.wristY},
    {name:'palmOuter',distance:input.wristCenterDistance+palmHalf,y:y(.18)},
    {name:'thumbBase',distance:input.wristCenterDistance+palmHalf,y:y(.28)},
    {name:'thumbTip',distance:input.wristCenterDistance+palmHalf+input.handWidth*shape.thumbReachFactor,y:y(shape.thumbY)},
    {name:'indexSide',distance:input.wristCenterDistance+palmHalf*shape.indexFactor,y:y(.70)},
    {name:'middleFingerTip',distance:input.wristCenterDistance+palmHalf*shape.middleTipFactor,y:y(shape.fingerTipY)},
    {name:'littleFingerSide',distance:input.wristCenterDistance+palmHalf*shape.littleFingerFactor,y:y(.86)},
    {name:'palmInner',distance:Math.max(input.minDistance,input.wristCenterDistance-palmHalf),y:y(.58)},
    {name:'wristInner',distance:inner,y:input.wristY},
  ];
}

export function createFootBaseShape(input:{sex:Sex;ankleCenterDistance:number;ankleWidth:number;heelWidth:number;forefootWidth:number;toeSpread:number;floorY:number;headHeight:number;minDistance:number}):ShapePoint[] {
  const shape=getFootBaseShape(input.sex);
  const inner=Math.max(input.minDistance,input.ankleCenterDistance-input.ankleWidth*.50);
  const outer=input.ankleCenterDistance+input.ankleWidth*.50;
  const heelHalf=input.heelWidth/2;
  const forefootHalf=input.forefootWidth/2;
  const floor=input.floorY;
  const yHeel=floor-input.headHeight*(1-shape.heelY);
  const yForefoot=floor-input.headHeight*(1-shape.forefootY);
  const outerToe=input.ankleCenterDistance+forefootHalf+input.toeSpread;
  const innerToe=Math.max(input.minDistance,input.ankleCenterDistance-forefootHalf-input.toeSpread);
  const innerHeel=Math.max(input.minDistance,input.ankleCenterDistance-heelHalf);
  const floorContact=(outerToe+innerToe)/2;
  return [
    {name:'ankleOuter',distance:outer,y:yHeel-input.headHeight*.07},
    {name:'heelOuter',distance:input.ankleCenterDistance+heelHalf,y:yHeel},
    {name:'forefootOuter',distance:outerToe*.98,y:yForefoot},
    {name:'soleOuter',distance:outerToe*.98,y:floor},
    {name:'floorContact',distance:floorContact,y:floor},
    {name:'soleInner',distance:innerHeel,y:floor},
    {name:'bigToeTip',distance:innerToe,y:floor},
    {name:'forefootInner',distance:Math.max(input.minDistance,innerToe*.98),y:yForefoot},
    {name:'heelInner',distance:innerHeel,y:yHeel},
    {name:'ankleInner',distance:inner,y:yHeel-input.headHeight*.07},
  ];
}
