import type { BodyDimensions, BodySpecDraft, ManualModifiers, Sex } from './body-types';

type DimensionKey = keyof BodyDimensions;
type Influence = { target:DimensionKey; amount:number; mode?:'scale'|'add' };
export type SliderInfluenceMap = Record<keyof ManualModifiers, readonly Influence[]>;

const shared:SliderInfluenceMap = {
  shoulder:[{target:'shoulderWidth',amount:1},{target:'neckWidth',amount:.20},{target:'chestWidth',amount:.25},{target:'upperArmWidth',amount:.45}],
  chest:[{target:'chestWidth',amount:1},{target:'upperArmWidth',amount:.12},{target:'waistWidth',amount:.08}],
  waist:[{target:'waistWidth',amount:1},{target:'chestWidth',amount:.08},{target:'pelvisWidth',amount:.08}],
  hip:[{target:'pelvisWidth',amount:1},{target:'upperThighWidth',amount:.20},{target:'midThighWidth',amount:.08}],
  upperBody:[{target:'waistPosition',amount:.72},{target:'pelvisHeight',amount:.28},{target:'chestHeight',amount:.35}],
  legs:[{target:'waistPosition',amount:-.58},{target:'kneePosition',amount:-.42}],
  arms:[{target:'upperArmLength',amount:.56},{target:'forearmLength',amount:.44},{target:'handLength',amount:.10}],
  thighs:[{target:'upperThighWidth',amount:1},{target:'midThighWidth',amount:.80},{target:'kneeWidth',amount:.10},{target:'pelvisWidth',amount:.20}],
  calves:[{target:'calfWidth',amount:1},{target:'kneeWidth',amount:.10},{target:'ankleWidth',amount:.15}],
  headWidth:[{target:'headWidth',amount:1},{target:'neckWidth',amount:.08}],
  neckLength:[{target:'neckLength',amount:1}],
  neckWidth:[{target:'neckWidth',amount:1},{target:'shoulderWidth',amount:.08}],
  shoulderSlope:[{target:'shoulderSlope',amount:1}],
  chestHeight:[{target:'chestHeight',amount:1},{target:'waistPosition',amount:.12}],
  waistPosition:[{target:'waistPosition',amount:1}],
  pelvisHeight:[{target:'pelvisHeight',amount:1}],
  upperArmWidth:[{target:'upperArmWidth',amount:1},{target:'elbowWidth',amount:.18}],
  elbowWidth:[{target:'elbowWidth',amount:1},{target:'upperArmWidth',amount:.08},{target:'forearmWidth',amount:.08}],
  forearmWidth:[{target:'forearmWidth',amount:1},{target:'wristWidth',amount:.18}],
  wristWidth:[{target:'wristWidth',amount:1},{target:'handWidth',amount:.12}],
  handLength:[{target:'handLength',amount:1}],
  handWidth:[{target:'handWidth',amount:1},{target:'wristWidth',amount:.10}],
  upperThighWidth:[{target:'upperThighWidth',amount:1},{target:'midThighWidth',amount:.35},{target:'pelvisWidth',amount:.14}],
  midThighWidth:[{target:'midThighWidth',amount:1},{target:'upperThighWidth',amount:.30},{target:'kneeWidth',amount:.18}],
  kneeWidth:[{target:'kneeWidth',amount:1},{target:'midThighWidth',amount:.12},{target:'calfWidth',amount:.10}],
  calfMaxPosition:[{target:'calfMaxPosition',amount:.004,mode:'add'}],
  ankleWidth:[{target:'ankleWidth',amount:1},{target:'calfWidth',amount:.12},{target:'footWidth',amount:.10}],
  footLength:[{target:'footLength',amount:1}],
  footWidth:[{target:'footWidth',amount:1},{target:'ankleWidth',amount:.10}],
};

export const MaleInfluenceMap:SliderInfluenceMap = {
  ...shared,
  shoulder:[{target:'shoulderWidth',amount:1},{target:'neckWidth',amount:.20},{target:'chestWidth',amount:.27},{target:'upperArmWidth',amount:.45}],
  hip:[{target:'pelvisWidth',amount:1},{target:'upperThighWidth',amount:.18},{target:'midThighWidth',amount:.07}],
};

export const FemaleInfluenceMap:SliderInfluenceMap = {
  ...shared,
  shoulder:[{target:'shoulderWidth',amount:1},{target:'neckWidth',amount:.17},{target:'chestWidth',amount:.22},{target:'upperArmWidth',amount:.38}],
  hip:[{target:'pelvisWidth',amount:1},{target:'upperThighWidth',amount:.28},{target:'midThighWidth',amount:.12}],
};

export const getInfluenceMap=(sex:Sex)=>sex==='남성'?MaleInfluenceMap:FemaleInfluenceMap;

export function applySliderModifiers(base:BodySpecDraft,modifiers:ManualModifiers):BodySpecDraft {
  const map=getInfluenceMap(base.sex);
  const scaleTotals=new Map<DimensionKey,number>();
  const addTotals=new Map<DimensionKey,number>();

  (Object.keys(modifiers) as (keyof ManualModifiers)[]).forEach((modifierKey)=>{
    const value=modifiers[modifierKey];
    map[modifierKey].forEach(({target,amount,mode='scale'})=>{
      const totals=mode==='add'?addTotals:scaleTotals;
      totals.set(target,(totals.get(target)??0)+value*amount);
    });
  });

  const result={...base};
  scaleTotals.forEach((percent,key)=>{ result[key]=base[key]*(1+percent/100); });
  addTotals.forEach((value,key)=>{ result[key]=result[key]+value; });
  return result;
}
