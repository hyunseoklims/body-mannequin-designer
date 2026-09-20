import type { Sex } from './body-types';

export type BodyPresetLevel = 1|2|3|4|5;
export type PresetMode = 'auto'|'manual';

export const calculateBmi=(heightCm:number,weightKg:number)=>{
  if(heightCm<=0||weightKg<=0) return 0;
  const m=heightCm/100;
  return weightKg/(m*m);
};

export const bmiToPreset=(bmi:number):BodyPresetLevel=>{
  if(bmi<18.5) return 1;
  if(bmi<22) return 2;
  if(bmi<25) return 3;
  if(bmi<30) return 4;
  return 5;
};

export const resolvedPreset=(heightCm:number,weightKg:number,mode:PresetMode,manual:BodyPresetLevel)=>
  mode==='auto'?bmiToPreset(calculateBmi(heightCm,weightKg)):manual;

/**
 * Sprite sheet layout for body-preset-sprite.png (1536x1024).
 * Male row: y 0..511, Female row: y 512..1023.
 * Columns are the five generated presets from lean -> heavy.
 *
 * baselineY/headTopY are absolute coordinates in the source sprite.
 * They are deliberately metadata, not CSS offsets: renderer must align
 * baselineY to graph 0cm and headTopY to the entered height.
 */
const centers=[202,494,768,1045,1340] as const;
const bounds=[0,348,631,902,1193,1536] as const;

export type BodyPresetMetadata={
  sex:Sex; level:BodyPresetLevel; src:string;
  sourceX:number; sourceY:number; sourceWidth:number; sourceHeight:number;
  baselineY:number; headTopY:number; centerX:number;
};

export const getBodyPresetMetadata=(sex:Sex,level:BodyPresetLevel):BodyPresetMetadata=>{
  const i=level-1;
  const sourceX=bounds[i];
  const sourceY=sex==='남성'?0:512;
  const sourceWidth=bounds[i+1]-sourceX;
  const sourceHeight=512;
  const baselineY=sex==='남성'?493:980;
  const headTopY=sex==='남성'?9:520;
  return {
    sex,level,src:'/body-preset-sprite.png',
    sourceX,sourceY,sourceWidth,sourceHeight,
    baselineY,headTopY,centerX:centers[i],
  };
};
