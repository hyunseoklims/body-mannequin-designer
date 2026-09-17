import type { BodySpec } from './body-model';

export type OxiHumanCoreParameter = 'height' | 'weight' | 'gender' | 'muscle' | 'age';
export interface BodyMorphMap {
  core: Record<OxiHumanCoreParameter, number>;
  measurements: Record<'bust' | 'waist' | 'hips', number>;
  derived: Record<string, number>;
  customMorphs: Record<string, number>;
}
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const normalize = (value: number, min: number, max: number) => clamp01((value - min) / (max - min));

export function mapBodySpecToMorphs(spec: BodySpec): BodyMorphMap {
  return {
    core: {
      height: normalize(spec.height, 140, 205),
      weight: normalize(spec.bodyVolume, 0.72, 1.38),
      gender: spec.sex === '남성' ? 1 : 0,
      muscle: spec.sex === '남성' ? 0.48 : 0.38,
      age: 0.28,
    },
    measurements: {
      bust: normalize(spec.chestWidth / spec.headHeight, 0.9, 1.7),
      waist: normalize(spec.waistWidth / spec.headHeight, 0.65, 1.35),
      hips: normalize(spec.pelvisWidth / spec.headHeight, 0.95, 1.65),
    },
    derived: {
      headScale: spec.headHeight / (spec.height / 7.5),
      neckWidth: spec.neckWidth / spec.headHeight,
      shoulderWidth: spec.shoulderWidth / spec.headHeight,
      shoulderSlope: spec.shoulderSlope,
      armLength: spec.armLength / spec.height,
      legLength: spec.legLength / spec.height,
      handScale: spec.handLength / spec.headHeight,
      footScale: spec.footLength / spec.headHeight,
      elbowWidth: spec.elbowWidth / spec.headHeight,
      wristWidth: spec.wristWidth / spec.headHeight,
      midThighWidth: spec.midThighWidth / spec.headHeight,
      kneeWidth: spec.kneeWidth / spec.headHeight,
      ankleWidth: spec.ankleWidth / spec.headHeight,
      calfMaxPosition: spec.calfMaxPosition,
    },
    customMorphs: {
      'custom/shoulder-width': spec.modifiers.shoulder / 100,
      'custom/upper-arm-girth': (spec.bodyVolume - 1) * 0.6,
      'custom/forearm-girth': (spec.bodyVolume - 1) * 0.5,
      'custom/thigh-girth': spec.modifiers.thighs / 100,
      'custom/calf-girth': spec.modifiers.calves / 100,
      'custom/elbow-width': spec.modifiers.elbowWidth / 100,
      'custom/wrist-width': spec.modifiers.wristWidth / 100,
      'custom/mid-thigh-width': spec.modifiers.midThighWidth / 100,
      'custom/knee-width': spec.modifiers.kneeWidth / 100,
      'custom/ankle-width': spec.modifiers.ankleWidth / 100,
    },
  };
}
