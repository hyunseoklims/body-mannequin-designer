import type { Sex } from './body-types';

export type WeightedRegion = 'chest' | 'upperArm' | 'forearm' | 'waist' | 'pelvis' | 'thigh' | 'calf';
export type RatioConstraint = { numerator:'shoulderWidth'|'chestWidth'|'waistWidth'|'pelvisWidth'|'upperThighWidth'|'calfWidth'; denominator:'chestWidth'|'waistWidth'|'pelvisWidth'|'upperThighWidth'|'kneeWidth'|'ankleWidth'; min:number; max:number };

export interface VerticalLandmarks {
  waistHeight:number; kneeHeight:number;
  shoulderNeckFraction:number; chestPeakFraction:number; lowerChestFraction:number;
  upperPelvisFraction:number; pelvisPeakFraction:number; calfPeakFraction:number;
}

export interface HorizontalLandmarks {
  legGapH:number; armpitChestFactor:number; armpitArmFactor:number;
  thighOuterFactor:number; midThighOuterFactor:number; kneeOuterFactor:number;
  calfOuterFactor:number; ankleOuterFactor:number; footOuterFactor:number;
}

export interface SilhouetteControlProfile {
  head:{upperSkull:number;templeY:number;cheekX:number;cheekY:number;jawX:number;jawY:number};
  neckShoulder:{neckBase:number;trapeziusX:number;trapeziusLift:number;shoulderMidX:number;shoulderMidLift:number;deltoidExpansion:number;deltoidDrop:number};
  torso:{lowerChestX:number;upperPelvisBlend:number;pelvisToThigh:number};
  arm:{upperArmPeak:number;forearmUpperPeak:number;thumbReach:number;handOuterReach:number};
  leg:{upperThighDrop:number;midThighPosition:number;lowerThighBlend:number;lowerThighLift:number;upperCalfBlend:number;lowerCalfBlend:number};
}
export type NormalizedControlPoint={x:number;y:number};

export interface BodyBaseProfile {
  id: 'male-average' | 'female-average';
  referenceHeight:number; referenceWeight:number;
  headWidthH:number; neckLengthH:number; neckWidthH:number;
  shoulderWidthH:number; shoulderSlope:number;
  chestWidthH:number; chestHeightH:number; waistWidthH:number;
  pelvisWidthH:number; pelvisHeightHeight:number;
  upperArmLengthHeight:number; upperArmWidthH:number; elbowWidthH:number;
  forearmLengthHeight:number; forearmWidthH:number; wristWidthH:number;
  handLengthH:number; handWidthH:number;
  upperThighWidthH:number; midThighWidthH:number; kneeWidthH:number;
  calfWidthH:number; ankleWidthH:number; footLengthH:number; footWidthH:number;
  verticalLandmarks:VerticalLandmarks;
  horizontalLandmarks:HorizontalLandmarks;
  silhouette:SilhouetteControlProfile;
  controlPoints:{
    head:Record<string,NormalizedControlPoint>;
    neckShoulder:Record<string,NormalizedControlPoint>;
    torso:Record<string,NormalizedControlPoint>;
    arm:Record<string,NormalizedControlPoint>;
    leg:Record<string,NormalizedControlPoint>;
  };
  segmentProportions:{torso:number;upperArm:number;forearm:number;pelvis:number;thigh:number;calf:number};
  defaultContourCurvature:number;
  weightCoefficients:Record<WeightedRegion,number>;
  softRatioConstraints:readonly RatioConstraint[];
}

export const MaleBaseProfile:BodyBaseProfile = {
  id:'male-average',referenceHeight:175,referenceWeight:65,
  headWidthH:.76,neckLengthH:.38,neckWidthH:.46,
  shoulderWidthH:1.72,shoulderSlope:.10,chestWidthH:1.48,chestHeightH:1.03,waistWidthH:1.03,
  pelvisWidthH:1.25,pelvisHeightHeight:.118,
  upperArmLengthHeight:.178,upperArmWidthH:.43,elbowWidthH:.31,forearmLengthHeight:.145,forearmWidthH:.35,wristWidthH:.23,
  handLengthH:.76,handWidthH:.34,
  upperThighWidthH:.66,midThighWidthH:.54,kneeWidthH:.35,calfWidthH:.46,ankleWidthH:.25,footLengthH:1.02,footWidthH:.39,
  verticalLandmarks:{waistHeight:.425,kneeHeight:.765,shoulderNeckFraction:.72,chestPeakFraction:.61,lowerChestFraction:.92,upperPelvisFraction:.29,pelvisPeakFraction:.63,calfPeakFraction:.42},
  horizontalLandmarks:{legGapH:.045,armpitChestFactor:.94,armpitArmFactor:.82,thighOuterFactor:.82,midThighOuterFactor:.82,kneeOuterFactor:.80,calfOuterFactor:.82,ankleOuterFactor:.78,footOuterFactor:.50},
  silhouette:{
    head:{upperSkull:.78,templeY:.39,cheekX:.92,cheekY:.69,jawX:.61,jawY:.91},
    neckShoulder:{neckBase:1.08,trapeziusX:.54,trapeziusLift:.08,shoulderMidX:.82,shoulderMidLift:.02,deltoidExpansion:.14,deltoidDrop:.25},
    torso:{lowerChestX:.94,upperPelvisBlend:.52,pelvisToThigh:.94},
    arm:{upperArmPeak:.04,forearmUpperPeak:.09,thumbReach:.23,handOuterReach:.27},
    leg:{upperThighDrop:.18,midThighPosition:.48,lowerThighBlend:.52,lowerThighLift:.22,upperCalfBlend:.53,lowerCalfBlend:.56},
  },
  controlPoints:{
    head:{headTop:{x:0,y:0},upperCranium:{x:.78,y:.10},craniumSide:{x:1,y:.28},temple:{x:1,y:.40},cheekbone:{x:.98,y:.56},midCheek:{x:.92,y:.69},jawAngle:{x:.80,y:.82},lowerJaw:{x:.61,y:.91},chinSide:{x:.30,y:.97},chinTip:{x:0,y:1}},
    neckShoulder:{jawNeckTransition:{x:.72,y:.02},neckUpper:{x:1,y:-.14},neckMid:{x:1.04,y:-.08},neckBase:{x:1.08,y:-.02},trapeziusTransition:{x:.42,y:-.08},shoulderInner:{x:.63,y:-.04},shoulderMid:{x:.82,y:-.01},shoulderOuter:{x:1,y:.10},deltoidTop:{x:1.07,y:.18}},
    torso:{armpit:{x:.94,y:.28},upperChest:{x:.98,y:.48},chestMax:{x:1,y:.61},lowerChest:{x:.94,y:.92},upperWaist:{x:.82,y:.55},waistMaxNarrow:{x:1,y:0},lowerWaist:{x:.94,y:.20},upperPelvis:{x:.76,y:.30},pelvisMax:{x:1,y:.63},hipLower:{x:.93,y:.84},thighRoot:{x:.94,y:1}},
    arm:{shoulderArmRoot:{x:1.07,y:.18},upperArmUpper:{x:1.03,y:.25},upperArmMax:{x:1.05,y:.43},upperArmLower:{x:1.02,y:.74},elbowUpper:{x:1,y:.86},elbow:{x:1,y:1},elbowLower:{x:1.01,y:.14},forearmUpper:{x:1.03,y:.24},forearmMax:{x:1.03,y:.48},forearmLower:{x:1.01,y:.78},wristUpper:{x:1,y:.92},wrist:{x:1,y:1}},
    leg:{thighRoot:{x:1,y:0},upperThigh:{x:1.02,y:.18},thighMax:{x:1,y:.36},midThigh:{x:.92,y:.52},lowerThigh:{x:.78,y:.78},kneeUpper:{x:.80,y:.90},knee:{x:.80,y:1},kneeLower:{x:.78,y:.14},upperCalf:{x:.87,y:.34},calfMax:{x:1,y:.42},midCalf:{x:.94,y:.60},lowerCalf:{x:.82,y:.82},ankleUpper:{x:.78,y:.94},ankle:{x:.78,y:1}},
  },
  segmentProportions:{torso:.245,upperArm:.178,forearm:.145,pelvis:.118,thigh:.221,calf:.185},
  defaultContourCurvature:.78,
  weightCoefficients:{chest:.58,upperArm:.70,forearm:.52,waist:.92,pelvis:.72,thigh:.84,calf:.62},
  softRatioConstraints:[
    {numerator:'shoulderWidth',denominator:'chestWidth',min:1.02,max:1.32},
    {numerator:'chestWidth',denominator:'waistWidth',min:1.15,max:1.62},
    {numerator:'waistWidth',denominator:'pelvisWidth',min:.68,max:.98},
    {numerator:'pelvisWidth',denominator:'upperThighWidth',min:1.62,max:2.25},
    {numerator:'upperThighWidth',denominator:'kneeWidth',min:1.55,max:2.22},
    {numerator:'calfWidth',denominator:'ankleWidth',min:1.45,max:2.20},
  ],
};

export const FemaleBaseProfile:BodyBaseProfile = {
  id:'female-average',referenceHeight:162,referenceWeight:52,
  headWidthH:.74,neckLengthH:.43,neckWidthH:.39,
  shoulderWidthH:1.48,shoulderSlope:.145,chestWidthH:1.30,chestHeightH:1.00,waistWidthH:.88,
  pelvisWidthH:1.45,pelvisHeightHeight:.126,
  upperArmLengthHeight:.174,upperArmWidthH:.38,elbowWidthH:.28,forearmLengthHeight:.142,forearmWidthH:.30,wristWidthH:.205,
  handLengthH:.72,handWidthH:.30,
  upperThighWidthH:.72,midThighWidthH:.58,kneeWidthH:.33,calfWidthH:.43,ankleWidthH:.225,footLengthH:.92,footWidthH:.34,
  verticalLandmarks:{waistHeight:.418,kneeHeight:.758,shoulderNeckFraction:.74,chestPeakFraction:.58,lowerChestFraction:.91,upperPelvisFraction:.27,pelvisPeakFraction:.61,calfPeakFraction:.40},
  horizontalLandmarks:{legGapH:.042,armpitChestFactor:.91,armpitArmFactor:.79,thighOuterFactor:.86,midThighOuterFactor:.84,kneeOuterFactor:.80,calfOuterFactor:.83,ankleOuterFactor:.77,footOuterFactor:.48},
  silhouette:{
    head:{upperSkull:.80,templeY:.38,cheekX:.94,cheekY:.68,jawX:.58,jawY:.91},
    neckShoulder:{neckBase:1.05,trapeziusX:.49,trapeziusLift:.065,shoulderMidX:.79,shoulderMidLift:.012,deltoidExpansion:.10,deltoidDrop:.23},
    torso:{lowerChestX:.96,upperPelvisBlend:.47,pelvisToThigh:.99},
    arm:{upperArmPeak:.025,forearmUpperPeak:.075,thumbReach:.21,handOuterReach:.25},
    leg:{upperThighDrop:.15,midThighPosition:.46,lowerThighBlend:.49,lowerThighLift:.20,upperCalfBlend:.50,lowerCalfBlend:.53},
  },
  controlPoints:{
    head:{headTop:{x:0,y:0},upperCranium:{x:.80,y:.10},craniumSide:{x:1,y:.28},temple:{x:1,y:.39},cheekbone:{x:.99,y:.55},midCheek:{x:.94,y:.68},jawAngle:{x:.78,y:.82},lowerJaw:{x:.58,y:.91},chinSide:{x:.28,y:.97},chinTip:{x:0,y:1}},
    neckShoulder:{jawNeckTransition:{x:.68,y:.02},neckUpper:{x:1,y:-.15},neckMid:{x:1.02,y:-.08},neckBase:{x:1.05,y:-.02},trapeziusTransition:{x:.39,y:-.07},shoulderInner:{x:.58,y:-.035},shoulderMid:{x:.79,y:-.01},shoulderOuter:{x:1,y:.145},deltoidTop:{x:1.05,y:.18}},
    torso:{armpit:{x:.91,y:.28},upperChest:{x:.98,y:.47},chestMax:{x:1,y:.58},lowerChest:{x:.96,y:.91},upperWaist:{x:.80,y:.54},waistMaxNarrow:{x:1,y:0},lowerWaist:{x:.94,y:.20},upperPelvis:{x:.74,y:.27},pelvisMax:{x:1,y:.61},hipLower:{x:.97,y:.84},thighRoot:{x:.99,y:1}},
    arm:{shoulderArmRoot:{x:1.05,y:.18},upperArmUpper:{x:1.03,y:.24},upperArmMax:{x:1.04,y:.42},upperArmLower:{x:1.02,y:.74},elbowUpper:{x:1,y:.86},elbow:{x:1,y:1},elbowLower:{x:1.01,y:.14},forearmUpper:{x:1.03,y:.24},forearmMax:{x:1.03,y:.48},forearmLower:{x:1.01,y:.78},wristUpper:{x:1,y:.92},wrist:{x:1,y:1}},
    leg:{thighRoot:{x:1,y:0},upperThigh:{x:1.04,y:.16},thighMax:{x:1,y:.34},midThigh:{x:.94,y:.50},lowerThigh:{x:.82,y:.77},kneeUpper:{x:.80,y:.90},knee:{x:.80,y:1},kneeLower:{x:.78,y:.14},upperCalf:{x:.90,y:.32},calfMax:{x:1,y:.40},midCalf:{x:.96,y:.58},lowerCalf:{x:.84,y:.82},ankleUpper:{x:.77,y:.94},ankle:{x:.77,y:1}},
  },
  segmentProportions:{torso:.238,upperArm:.174,forearm:.142,pelvis:.126,thigh:.218,calf:.184},
  defaultContourCurvature:.84,
  weightCoefficients:{chest:.68,upperArm:.76,forearm:.56,waist:.86,pelvis:.82,thigh:.92,calf:.66},
  softRatioConstraints:[
    {numerator:'shoulderWidth',denominator:'chestWidth',min:1.02,max:1.28},
    {numerator:'chestWidth',denominator:'waistWidth',min:1.22,max:1.70},
    {numerator:'waistWidth',denominator:'pelvisWidth',min:.52,max:.82},
    {numerator:'pelvisWidth',denominator:'upperThighWidth',min:1.72,max:2.32},
    {numerator:'upperThighWidth',denominator:'kneeWidth',min:1.72,max:2.45},
    {numerator:'calfWidth',denominator:'ankleWidth',min:1.52,max:2.25},
  ],
};

export const getBaseProfile=(sex:Sex)=>sex==='남성'?MaleBaseProfile:FemaleBaseProfile;
