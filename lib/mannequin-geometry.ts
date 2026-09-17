import type { BodySpec } from './body-model';
import { getBaseProfile } from './body-profiles';
import { createFootBaseShape, createHandBaseShape } from './hand-foot-shapes';

export type BodyRegion='head'|'neck-shoulder'|'arm-hand'|'torso-pelvis'|'thigh-knee'|'calf-ankle'|'foot';
export type SilhouettePoint={name:string;region:BodyRegion;x:number;y:number};
type XY={x:number;y:number};
type FinalGeometry={
  width:number;height:number;centerX:number;floorY:number;points:SilhouettePoint[];
  landmarks:Record<string,number>;widths:Record<string,number>;preferredTension:number;
};
export type MannequinGeometry=FinalGeometry&{
  outlinePath:string;sampledOutline:XY[];curveTension:number;
  validation:{valid:boolean;errors:string[]};
};

const round=(value:number)=>Number(value.toFixed(2));
const point=(name:string,region:BodyRegion,x:number,y:number):SilhouettePoint=>({name,region,x:round(x),y:round(y)});

function smoothClosedContour(points:SilhouettePoint[],tension:number) {
  if(points.length<3)return {path:'',samples:[] as XY[]};
  let path=`M ${points[0].x} ${points[0].y}`;
  const samples:XY[]=[{x:points[0].x,y:points[0].y}];
  for(let index=0;index<points.length;index+=1){
    const p0=points[(index-1+points.length)%points.length];
    const p1=points[index];
    const p2=points[(index+1)%points.length];
    const p3=points[(index+2)%points.length];
    const c1={x:p1.x+(p2.x-p0.x)*tension/6,y:p1.y+(p2.y-p0.y)*tension/6};
    const c2={x:p2.x-(p3.x-p1.x)*tension/6,y:p2.y-(p3.y-p1.y)*tension/6};
    path+=` C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${p2.x} ${p2.y}`;
    for(let step=1;step<=8;step+=1){
      const t=step/8;
      const inverse=1-t;
      samples.push({
        x:inverse**3*p1.x+3*inverse**2*t*c1.x+3*inverse*t**2*c2.x+t**3*p2.x,
        y:inverse**3*p1.y+3*inverse**2*t*c1.y+3*inverse*t**2*c2.y+t**3*p2.y,
      });
    }
  }
  return {path:`${path} Z`,samples};
}

const cross=(a:XY,b:XY,c:XY)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
function segmentsIntersect(a:XY,b:XY,c:XY,d:XY) {
  const abC=cross(a,b,c); const abD=cross(a,b,d); const cdA=cross(c,d,a); const cdB=cross(c,d,b);
  return abC*abD<-.0001&&cdA*cdB<-.0001;
}

function findSelfIntersection(samples:XY[]):[number,number]|null {
  const segmentCount=samples.length-1;
  for(let first=0;first<segmentCount;first+=1){
    for(let second=first+2;second<segmentCount;second+=1){
      if(first===0&&second===segmentCount-1)continue;
      if(segmentsIntersect(samples[first],samples[first+1],samples[second],samples[second+1]))return [first,second];
    }
  }
  return null;
}

const hasSelfIntersection=(samples:XY[])=>findSelfIntersection(samples)!==null;

export function createFinalGeometry(spec:BodySpec):FinalGeometry {
  const profile=getBaseProfile(spec.sex);
  const vertical=profile.verticalLandmarks;
  const horizontal=profile.horizontalLandmarks;
  const shape=profile.silhouette;
  const controls=profile.controlPoints;
  const width=440; const height=1000; const centerX=width/2; const floorY=1000;
  const unit=height/spec.height;
  const cm=(value:number)=>value*unit;
  const lx=(distance:number)=>centerX-distance;

  const headHeight=cm(spec.headHeight); const headHalf=cm(spec.headWidth)/2; const neckHalf=cm(spec.neckWidth)/2;
  const shoulderHalf=cm(spec.shoulderWidth)/2; const chestHalf=cm(spec.chestWidth)/2; const waistHalf=cm(spec.waistWidth)/2; const pelvisHalf=cm(spec.pelvisWidth)/2;
  const upperArmWidth=cm(spec.upperArmWidth); const elbowWidth=cm(spec.elbowWidth); const forearmWidth=cm(spec.forearmWidth); const wristWidth=cm(spec.wristWidth); const handWidth=cm(spec.handWidth);
  const upperThighWidth=cm(spec.upperThighWidth); const midThighWidth=cm(spec.midThighWidth); const kneeWidth=cm(spec.kneeWidth); const calfWidth=cm(spec.calfWidth); const ankleWidth=cm(spec.ankleWidth);
  const footWidth=cm(spec.footWidth); const heelWidth=cm(spec.heelWidth); const forefootWidth=cm(spec.forefootWidth); const toeSpread=cm(spec.toeSpread);

  const topY=0; const chinY=headHeight;
  const shoulderY=chinY+cm(spec.neckLength)*vertical.shoulderNeckFraction;
  const chestY=shoulderY+cm(spec.chestHeight)*vertical.chestPeakFraction;
  const lowerChestY=shoulderY+cm(spec.chestHeight)*vertical.lowerChestFraction;
  const waistY=cm(spec.waistPosition); const upperHipY=waistY+cm(spec.pelvisHeight)*vertical.upperPelvisFraction;
  const pelvisY=waistY+cm(spec.pelvisHeight)*vertical.pelvisPeakFraction; const crotchY=waistY+cm(spec.pelvisHeight);
  const elbowY=shoulderY+cm(spec.upperArmLength); const wristY=elbowY+cm(spec.forearmLength);
  const handBottomY=wristY+cm(spec.handLength);
  const kneeY=cm(spec.kneePosition); const ankleY=floorY-headHeight*.34;
  const calfMaxY=kneeY+(ankleY-kneeY)*spec.calfMaxPosition;

  const armClearance=Math.max(chestHalf,pelvisHalf)+headHeight*.025;
  const torsoEdge=(distance:number)=>Math.min(distance,armClearance-headHeight*.04);
  const upperArmOuter=Math.max(shoulderHalf+upperArmWidth*shape.neckShoulder.deltoidExpansion,armClearance+upperArmWidth*.18);
  const elbowCenter=Math.max(shoulderHalf+upperArmWidth*.01,armClearance+elbowWidth*.50); const elbowOuter=elbowCenter+elbowWidth*.52; const elbowInner=elbowCenter-elbowWidth*.48;
  const forearmCenter=Math.max(shoulderHalf-wristWidth*.04,armClearance+forearmWidth*.50); const forearmOuter=forearmCenter+forearmWidth*.52; const forearmInner=forearmCenter-forearmWidth*.48;
  // Keep the inner arm edge outside the torso contour at the armpit/chest
  // transition. This prevents a single closed silhouette from folding through
  // the rib cage when female hip/chest proportions are wider than the arm.
  const upperArmInnerDistance=Math.min(elbowInner+upperArmWidth*.10,upperArmOuter-upperArmWidth*.18);
  const wristOuter=forearmCenter+wristWidth*.52; const wristInner=forearmCenter-wristWidth*.48;
  const armpit=Math.max(chestHalf*horizontal.armpitChestFactor,shoulderHalf-upperArmWidth*horizontal.armpitArmFactor);
  const legGap=Math.max(5,headHeight*horizontal.legGapH);
  const thighOuter=legGap+upperThighWidth*horizontal.thighOuterFactor; const midThighOuter=legGap+midThighWidth*horizontal.midThighOuterFactor;
  const kneeOuter=legGap+kneeWidth*horizontal.kneeOuterFactor; const calfOuter=legGap+calfWidth*horizontal.calfOuterFactor;
  const ankleOuter=legGap+ankleWidth*horizontal.ankleOuterFactor;
  const innerLeg=legGap;
  const handPoints=createHandBaseShape({sex:spec.sex,wristCenterDistance:forearmCenter,wristWidth,handWidth,handLength:cm(spec.handLength),wristY,headHeight,minDistance:armClearance});
  const footPoints=createFootBaseShape({sex:spec.sex,ankleCenterDistance:innerLeg+ankleWidth*.34,ankleWidth,heelWidth,forefootWidth,toeSpread,floorY,headHeight,minDistance:innerLeg});

  const left:SilhouettePoint[]=[
    point('headTop','head',centerX,headHeight*controls.head.headTop.y),
    point('upperCranium','head',lx(headHalf*controls.head.upperCranium.x),headHeight*controls.head.upperCranium.y),
    point('craniumSide','head',lx(headHalf*controls.head.craniumSide.x),headHeight*controls.head.craniumSide.y),
    point('temple','head',lx(headHalf*controls.head.temple.x),headHeight*controls.head.temple.y),
    point('cheekbone','head',lx(headHalf*controls.head.cheekbone.x),headHeight*controls.head.cheekbone.y),
    point('midCheek','head',lx(headHalf*controls.head.midCheek.x),headHeight*controls.head.midCheek.y),
    point('jawAngle','head',lx(headHalf*controls.head.jawAngle.x),headHeight*controls.head.jawAngle.y),
    point('lowerJaw','head',lx(headHalf*controls.head.lowerJaw.x),headHeight*controls.head.lowerJaw.y),
    point('chinSide','head',lx(headHalf*controls.head.chinSide.x),headHeight*controls.head.chinSide.y),
    point('chinTip','head',centerX,headHeight*controls.head.chinTip.y),
    point('jawNeckTransition','neck-shoulder',lx(neckHalf*controls.neckShoulder.jawNeckTransition.x),chinY+headHeight*controls.neckShoulder.jawNeckTransition.y),
    point('neckUpper','neck-shoulder',lx(neckHalf*controls.neckShoulder.neckUpper.x),shoulderY+headHeight*controls.neckShoulder.neckUpper.y),
    point('neckMid','neck-shoulder',lx(neckHalf*controls.neckShoulder.neckMid.x),shoulderY+headHeight*controls.neckShoulder.neckMid.y),
    point('neckBase','neck-shoulder',lx(neckHalf*controls.neckShoulder.neckBase.x),shoulderY+headHeight*controls.neckShoulder.neckBase.y),
    point('trapeziusTransition','neck-shoulder',lx(shoulderHalf*controls.neckShoulder.trapeziusTransition.x),shoulderY+headHeight*controls.neckShoulder.trapeziusTransition.y),
    point('shoulderInner','neck-shoulder',lx(shoulderHalf*controls.neckShoulder.shoulderInner.x),shoulderY+headHeight*controls.neckShoulder.shoulderInner.y),
    point('shoulderMid','neck-shoulder',lx(shoulderHalf*controls.neckShoulder.shoulderMid.x),shoulderY+headHeight*controls.neckShoulder.shoulderMid.y),
    point('shoulderOuter','neck-shoulder',lx(shoulderHalf*controls.neckShoulder.shoulderOuter.x),shoulderY+headHeight*spec.shoulderSlope),
    point('deltoidTop','neck-shoulder',lx(upperArmOuter),shoulderY+headHeight*controls.neckShoulder.deltoidTop.y),
    point('shoulderArmRoot','arm-hand',lx(upperArmOuter),shoulderY+headHeight*controls.neckShoulder.deltoidTop.y),
    point('upperArmUpper','arm-hand',lx(upperArmOuter+upperArmWidth*(controls.arm.upperArmUpper.x-1)),shoulderY+cm(spec.upperArmLength)*controls.arm.upperArmUpper.y),
    point('upper-arm-max','arm-hand',lx(upperArmOuter+upperArmWidth*(controls.arm.upperArmMax.x-1)),shoulderY+cm(spec.upperArmLength)*controls.arm.upperArmMax.y),
    point('upperArmLower','arm-hand',lx(upperArmOuter+upperArmWidth*(controls.arm.upperArmLower.x-1)),shoulderY+cm(spec.upperArmLength)*controls.arm.upperArmLower.y),
    point('elbowUpper','arm-hand',lx(elbowOuter+elbowWidth*(controls.arm.elbowUpper.x-1)),shoulderY+cm(spec.upperArmLength)*controls.arm.elbowUpper.y),
    point('elbow-outer','arm-hand',lx(elbowOuter),elbowY),
    point('elbowLower','arm-hand',lx(elbowOuter+elbowWidth*(controls.arm.elbowLower.x-1)),elbowY+cm(spec.forearmLength)*controls.arm.elbowLower.y),
    point('forearmUpper','arm-hand',lx(forearmOuter+forearmWidth*(controls.arm.forearmUpper.x-1)),elbowY+cm(spec.forearmLength)*controls.arm.forearmUpper.y),
    point('forearm-max-outer','arm-hand',lx(forearmOuter+forearmWidth*(controls.arm.forearmMax.x-1)),elbowY+cm(spec.forearmLength)*controls.arm.forearmMax.y),
    point('forearmLower','arm-hand',lx(forearmOuter+forearmWidth*(controls.arm.forearmLower.x-1)),elbowY+cm(spec.forearmLength)*controls.arm.forearmLower.y),
    point('wristUpper','arm-hand',lx(wristOuter+wristWidth*(controls.arm.wristUpper.x-1)),elbowY+cm(spec.forearmLength)*controls.arm.wristUpper.y),
    ...handPoints.slice(1,-1).map((item)=>point(item.name,'arm-hand',lx(item.distance),item.y)),
    point('forearm-inner','arm-hand',lx(forearmInner),elbowY+(wristY-elbowY)*.47),
    point('elbow-inner','arm-hand',lx(elbowInner),elbowY),
    point('upper-arm-inner','arm-hand',lx(upperArmInnerDistance),shoulderY+(elbowY-shoulderY)*.42),
    point('armpit','torso-pelvis',lx(torsoEdge(chestHalf*controls.torso.armpit.x)),shoulderY+headHeight*controls.torso.armpit.y),
    point('upperChest','torso-pelvis',lx(torsoEdge(chestHalf*controls.torso.upperChest.x)),shoulderY+cm(spec.chestHeight)*controls.torso.upperChest.y),
    point('chest-max','torso-pelvis',lx(torsoEdge(chestHalf*controls.torso.chestMax.x)),shoulderY+cm(spec.chestHeight)*controls.torso.chestMax.y),
    point('lower-chest','torso-pelvis',lx(torsoEdge(chestHalf*controls.torso.lowerChest.x)),shoulderY+cm(spec.chestHeight)*controls.torso.lowerChest.y),
    point('upperWaist','torso-pelvis',lx(torsoEdge((chestHalf+waistHalf)*.5)),lowerChestY+(waistY-lowerChestY)*controls.torso.upperWaist.y),
    point('waistMaxNarrow','torso-pelvis',lx(torsoEdge(waistHalf*controls.torso.waistMaxNarrow.x)),waistY-headHeight*.02),
    point('waist','torso-pelvis',lx(torsoEdge(waistHalf)),waistY),
    point('lowerWaist','torso-pelvis',lx(torsoEdge((waistHalf+pelvisHalf)*.48)),waistY+cm(spec.pelvisHeight)*controls.torso.lowerWaist.y),
    point('upperPelvis','torso-pelvis',lx(torsoEdge((waistHalf+pelvisHalf)*controls.torso.upperPelvis.x)),waistY+cm(spec.pelvisHeight)*controls.torso.upperPelvis.y),
    point('pelvis-max','torso-pelvis',lx(torsoEdge(pelvisHalf*controls.torso.pelvisMax.x)),waistY+cm(spec.pelvisHeight)*controls.torso.pelvisMax.y),
    point('hipLower','torso-pelvis',lx(torsoEdge((pelvisHalf+thighOuter)*.5*controls.torso.hipLower.x)),waistY+cm(spec.pelvisHeight)*controls.torso.hipLower.y),
    point('thighRoot','thigh-knee',lx(Math.max(pelvisHalf*controls.torso.thighRoot.x,thighOuter)),crotchY),
    point('upper-thigh-outer','thigh-knee',lx(Math.max(pelvisHalf*shape.torso.pelvisToThigh,thighOuter)),crotchY+headHeight*controls.leg.upperThigh.y),
    point('upperThigh','thigh-knee',lx(thighOuter*controls.leg.upperThigh.x),crotchY+(kneeY-crotchY)*controls.leg.upperThigh.y),
    point('thighMax','thigh-knee',lx(thighOuter*controls.leg.thighMax.x),crotchY+(kneeY-crotchY)*controls.leg.thighMax.y),
    point('mid-thigh-outer','thigh-knee',lx(midThighOuter*controls.leg.midThigh.x),crotchY+(kneeY-crotchY)*controls.leg.midThigh.y),
    point('lowerThigh','thigh-knee',lx((midThighOuter+kneeOuter)*shape.leg.lowerThighBlend),crotchY+(kneeY-crotchY)*controls.leg.lowerThigh.y),
    point('kneeUpper','thigh-knee',lx(kneeOuter*controls.leg.kneeUpper.x),kneeY-headHeight*(1-controls.leg.kneeUpper.y)*.22),
    point('knee-outer','thigh-knee',lx(kneeOuter*controls.leg.knee.x),kneeY),
    point('kneeLower','calf-ankle',lx(kneeOuter*controls.leg.kneeLower.x),kneeY+(calfMaxY-kneeY)*controls.leg.kneeLower.y),
    point('upper-calf-outer','calf-ankle',lx((kneeOuter+calfOuter)*shape.leg.upperCalfBlend),kneeY+(calfMaxY-kneeY)*controls.leg.upperCalf.y),
    point('calfMax','calf-ankle',lx(calfOuter*controls.leg.calfMax.x),calfMaxY),
    point('midCalf','calf-ankle',lx(calfOuter*controls.leg.midCalf.x),kneeY+(ankleY-kneeY)*controls.leg.midCalf.y),
    point('lower-calf-outer','calf-ankle',lx((calfOuter+ankleOuter)*shape.leg.lowerCalfBlend),kneeY+(ankleY-kneeY)*controls.leg.lowerCalf.y),
    point('ankleUpper','calf-ankle',lx(ankleOuter*controls.leg.ankleUpper.x),kneeY+(ankleY-kneeY)*controls.leg.ankleUpper.y),
    point('ankle-outer','calf-ankle',lx(ankleOuter*controls.leg.ankle.x),ankleY),
    ...footPoints.slice(1,-1).map((item)=>point(item.name,'foot',lx(item.distance),item.y)),
    point('lower-calf-inner','calf-ankle',lx(innerLeg+calfWidth*.13),calfMaxY+(ankleY-calfMaxY)*.50),
    point('knee-inner','thigh-knee',lx(innerLeg+kneeWidth*.12),kneeY),
    point('mid-thigh-inner','thigh-knee',lx(innerLeg+midThighWidth*.08),crotchY+(kneeY-crotchY)*shape.leg.midThighPosition),
    point('upper-thigh-inner','thigh-knee',lx(innerLeg+upperThighWidth*.04),crotchY+headHeight*(shape.leg.upperThighDrop-.02)),
    point('crotch','torso-pelvis',lx(innerLeg),crotchY),
  ];
  const right=left.slice(1).reverse().map((item)=>point(`${item.name}-right`,item.region,centerX+(centerX-item.x),item.y));
  return {
    width,height,centerX,floorY,points:[...left,...right],preferredTension:profile.defaultContourCurvature,
    landmarks:{topY,chinY,shoulderY,chestY,waistY,pelvisY,crotchY,elbowY,wristY,handBottomY,kneeY,calfMaxY,ankleY,floorY,floorContactY:floorY},
    widths:{headHalf,neckHalf,shoulderHalf,chestHalf,waistHalf,pelvisHalf,upperArmWidth,elbowWidth,forearmWidth,wristWidth,handWidth,upperThighWidth,midThighWidth,kneeWidth,calfWidth,ankleWidth,heelWidth,forefootWidth,footWidth},
  };
}

export function validateMannequinGeometry(geometry:Pick<MannequinGeometry,'width'|'centerX'|'points'|'sampledOutline'|'landmarks'>) {
  const errors:string[]=[];
  if(geometry.points.some((item)=>!Number.isFinite(item.x)||!Number.isFinite(item.y)))errors.push('non-finite-point');
  if(geometry.points.some((item)=>item.x<0||item.x>geometry.width))errors.push('centerline-or-canvas-crossing');
  if(geometry.points.some((item)=>item.y>geometry.landmarks.floorY+.001))errors.push('below-floor-contact');
  const l=geometry.landmarks;
  const vertical=[l.topY,l.chinY,l.shoulderY,l.chestY,l.waistY,l.pelvisY,l.crotchY,l.kneeY,l.calfMaxY,l.ankleY,l.floorY];
  if(vertical.some((value,index)=>index>0&&value<=vertical[index-1]))errors.push('vertical-landmark-order');
  // Check the control polygon for topology problems. Sampled Bézier points from
  // the same segment are intentionally not treated as separate contour edges.
  const intersection=findSelfIntersection(geometry.points);
  if(intersection)errors.push(`self-intersection-${geometry.points[intersection[0]].name}-${geometry.points[intersection[0]+1].name}/${geometry.points[intersection[1]].name}-${geometry.points[intersection[1]+1].name}`);
  return {valid:errors.length===0,errors};
}

export function createMannequinGeometry(spec:BodySpec):MannequinGeometry {
  const finalGeometry=createFinalGeometry(spec);
  const tensions=[finalGeometry.preferredTension,.66,.48,0];
  let contour=smoothClosedContour(finalGeometry.points,tensions[0]);
  let curveTension=tensions[0];
  for(const tension of tensions){
    const candidate=smoothClosedContour(finalGeometry.points,tension);
    if(!hasSelfIntersection(finalGeometry.points)){ contour=candidate; curveTension=tension; break; }
  }
  const geometry={...finalGeometry,outlinePath:contour.path,sampledOutline:contour.samples,curveTension};
  return {...geometry,validation:validateMannequinGeometry(geometry)};
}
