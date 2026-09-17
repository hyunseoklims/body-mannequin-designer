import type { Sex } from './body-types';

export type ReferenceMetadata={
  sex:Sex;
  src:string;
  width:number;
  height:number;
  baselineY:number;
  headTopY:number;
  centerX:number;
};

export const MaleReferenceMetadata:ReferenceMetadata={
  sex:'남성',src:'/male-front-reference-alpha.png',width:1024,height:1536,
  baselineY:1469,headTopY:32,centerX:512,
};

export const FemaleReferenceMetadata:ReferenceMetadata={
  sex:'여성',src:'/female-front-reference-alpha.png',width:1024,height:1536,
  baselineY:1471,headTopY:34,centerX:512,
};

export const getReferenceMetadata=(sex:Sex)=>sex==='남성'?MaleReferenceMetadata:FemaleReferenceMetadata;
