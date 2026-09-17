import type { BodySpec } from './body-model';
import { mapBodySpecToMorphs } from './body-morph-mapper';

export const OXIHUMAN_STATUS = {
  packageVersion: '0.2.0',
  packageName: '@cooljapan/oxihuman',
  meshSourceReady: false,
  reason: 'The published npm API loads OBJ/ZIP packs; the official OHPK constructor is documented only for the newer repository build.',
} as const;

export function createOxiHumanMorphPlan(spec: BodySpec) {
  return mapBodySpecToMorphs(spec);
}
