import type { BodyRegion, SilhouettePoint } from './mannequin-geometry';

export type DebugRole='primary'|'dependent';
export type DebugPoint=SilhouettePoint&{role:DebugRole;displacement:string};

type DebugGroup={primary:string[];dependent:string[]};

const groups:Record<string,DebugGroup>={
  shoulder:{primary:['shoulderOuter','shoulderMid','deltoidTop'],dependent:['shoulderArmRoot','upperArmUpper','armpit']},
  chest:{primary:['upperChest','chest-max','lower-chest'],dependent:['armpit','upperWaist','waistMaxNarrow']},
  waist:{primary:['waist','waistMaxNarrow'],dependent:['upperWaist','lowerWaist','upperPelvis']},
  hip:{primary:['upperPelvis','pelvis-max'],dependent:['lowerWaist','hipLower','thighRoot']},
  upperBody:{primary:['neckBase','trapeziusTransition','chest-max'],dependent:['upperChest','upperWaist','lowerChest']},
  legs:{primary:['upperThigh','thighMax','knee-outer','calfMax'],dependent:['lowerThigh','kneeUpper','upper-calf-outer','midCalf']},
  thighs:{primary:['upperThigh','thighMax','mid-thigh-outer'],dependent:['lowerThigh','kneeUpper','knee-outer']},
  calves:{primary:['upper-calf-outer','calfMax','midCalf'],dependent:['lower-calf-outer','ankleUpper','ankle-outer']},
  headWidth:{primary:['upperCranium','craniumSide','cheekbone','jawAngle'],dependent:['jawNeckTransition','neckUpper','neckMid']},
  neckLength:{primary:['neckUpper','neckMid','neckBase'],dependent:['trapeziusTransition','shoulderInner']},
  neckWidth:{primary:['neckUpper','neckMid','neckBase'],dependent:['jawNeckTransition','trapeziusTransition']},
  shoulderSlope:{primary:['shoulderOuter','deltoidTop'],dependent:['shoulderArmRoot','upperArmUpper']},
  chestHeight:{primary:['upperChest','chest-max','lower-chest'],dependent:['upperWaist','waistMaxNarrow']},
  waistPosition:{primary:['waist','waistMaxNarrow'],dependent:['upperPelvis','pelvis-max','thighRoot']},
  pelvisHeight:{primary:['upperPelvis','pelvis-max','hipLower'],dependent:['thighRoot','upperThigh','upper-thigh-outer']},
  arms:{primary:['upperArmMax','elbow-outer','forearm-max-outer','wristUpper'],dependent:['upper-arm-inner','elbow-inner','forearm-inner','palmInner']},
  upperArmWidth:{primary:['upperArmUpper','upper-arm-max','upperArmLower'],dependent:['upper-arm-inner','elbowUpper','elbowLower']},
  elbowWidth:{primary:['elbowUpper','elbow-outer','elbowLower'],dependent:['elbow-inner','forearmUpper']},
  forearmWidth:{primary:['forearmUpper','forearm-max-outer','forearmLower'],dependent:['forearm-inner','wristUpper']},
  wristWidth:{primary:['wristUpper','wristOuter'],dependent:['wristInner','palmOuter']},
  handLength:{primary:['middleFingerTip','thumbTip'],dependent:['palmOuter','palmInner','wristInner']},
  handWidth:{primary:['palmOuter','palmInner','thumbTip'],dependent:['indexSide','littleFingerSide','middleFingerTip']},
  upperThighWidth:{primary:['upperThigh','thighMax'],dependent:['upper-thigh-inner','lowerThigh','kneeUpper']},
  midThighWidth:{primary:['mid-thigh-outer'],dependent:['mid-thigh-inner','lowerThigh','knee-outer']},
  kneeWidth:{primary:['kneeUpper','knee-outer','kneeLower'],dependent:['lowerThigh','upper-calf-outer']},
  calfMaxPosition:{primary:['calfMax','midCalf'],dependent:['upper-calf-outer','lower-calf-outer']},
  ankleWidth:{primary:['ankleUpper','ankle-outer'],dependent:['lower-calf-outer','ankleInner']},
  footWidth:{primary:['forefootOuter','forefootInner','soleOuter','soleInner'],dependent:['heelOuter','heelInner','floorContact']},
  footLength:{primary:['floorContact'],dependent:['soleOuter','soleInner']},
};

const sectionFor=(region:BodyRegion)=>region.replace('-', ' ');

export function getDebugPoints(points:SilhouettePoint[],activeKey:string):DebugPoint[]{
  const group=groups[activeKey]||groups.shoulder;
  const roleByName=new Map<string,DebugRole>();
  group.primary.forEach((name)=>roleByName.set(name,'primary'));
  group.dependent.forEach((name)=>roleByName.set(name,'dependent'));
  return points
    .filter((point)=>roleByName.has(point.name.replace(/-right$/,'')))
    .map((point)=>({
      ...point,
      role:roleByName.get(point.name.replace(/-right$/,''))||'dependent',
      displacement:'base profile 기준 현재 modifier 영향값',
    }));
}

export function debugPointTitle(point:DebugPoint){
  return `${point.name}\nsection: ${sectionFor(point.region)}\nrole: ${point.role}\ncoordinate: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})\n${point.displacement}`;
}
