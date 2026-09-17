import type { BodySpec } from '../lib/body-model';
import { createMannequinGeometry } from '../lib/mannequin-geometry';
import { debugPointTitle, getDebugPoints } from '../lib/geometry-debug';
import { getReferenceMetadata } from '../lib/reference-metadata';

type MannequinProps={spec:BodySpec;debug?:boolean;activeDebugKey?:string;showReference?:boolean;referenceSex?:'남성'|'여성';referenceOpacity?:number;mannequinOpacity?:number;showCenterLine?:boolean;showHeightGuide?:boolean;className?:string;referenceOnly?:boolean};

export default function Mannequin({spec,debug=false,activeDebugKey='shoulder',showReference=false,referenceSex,referenceOpacity=.45,mannequinOpacity=1,showCenterLine=true,showHeightGuide=true,className='',referenceOnly=false}:MannequinProps) {
  const geometry=createMannequinGeometry(spec);
  const {landmarks,widths}=geometry;
  const left=(half:number)=>geometry.centerX-half;
  const right=(half:number)=>geometry.centerX+half;
  const guide=(y:number,half:number)=>`M ${left(half)} ${y} H ${right(half)}`;
  const bodyScale=spec.height/200;
  const transform=`translate(${geometry.centerX} ${geometry.floorY}) scale(${bodyScale}) translate(${-geometry.centerX} ${-geometry.floorY})`;
  const kneeCenterLeft=geometry.centerX-(widths.kneeWidth*.45+Math.max(5,spec.headHeight*1000/spec.height*.045));
  const kneeCenterRight=geometry.centerX+(geometry.centerX-kneeCenterLeft);
  const controlPoint=(name:string)=>geometry.points.find((item)=>item.name===name)!;
  const elbowOuter=controlPoint('elbow-outer');
  const elbowInner=controlPoint('elbow-inner');
  const elbowCenterLeft=(elbowOuter.x+elbowInner.x)/2;
  const elbowCenterRight=geometry.centerX+(geometry.centerX-elbowCenterLeft);
  const handInner=controlPoint('palmInner');
  const fingertip=controlPoint('middleFingerTip');
  const rightHandInner=controlPoint('palmInner-right');
  const rightFingertip=controlPoint('middleFingerTip-right');
  const debugPoints=debug?getDebugPoints(geometry.points,activeDebugKey):[];
  const reference=getReferenceMetadata(referenceSex||spec.sex);
  const referencePersonHeight=reference.baselineY-reference.headTopY;
  const referenceScale=geometry.height/referencePersonHeight;
  const referenceImageWidth=reference.width*referenceScale;
  const referenceImageHeight=reference.height*referenceScale;
  const referenceImageX=geometry.centerX-reference.centerX*referenceScale;
  const referenceImageY=geometry.floorY-reference.baselineY*referenceScale;
  const overlayTransform=transform;
  const heightGuideY=geometry.floorY-(spec.height/200)*geometry.height;
  const heightGuideColor=spec.sex==='남성'?'#3478f6':'#ed4f64';

  return <svg className={`mannequin ${className}`} viewBox={`0 0 ${geometry.width} ${geometry.height}`} style={{height:'100%'}} aria-label={`${spec.height}cm ${spec.sex} 정면 인체 마네킹`} data-profile={spec.profileId} data-geometry-valid={geometry.validation.valid} data-geometry-errors={geometry.validation.errors.join(',')} data-constraint-adjustments={spec.constraintAdjustments.join(',')} data-height-span={geometry.landmarks.floorContactY-geometry.landmarks.topY} data-floor-contact-y={geometry.landmarks.floorContactY}>
    {showReference&&<g className="reference-overlay" transform={overlayTransform} opacity={referenceOpacity}>
      <image href={reference.src} x={referenceImageX} y={referenceImageY} width={referenceImageWidth} height={referenceImageHeight} preserveAspectRatio="none"/>
    </g>}
    {showHeightGuide&&<g className="height-guide-line" pointerEvents="none">
      <path d={`M 8 ${heightGuideY} H ${geometry.centerX}`} fill="none" stroke={heightGuideColor} strokeWidth="1.5" opacity=".82"/>
      <circle cx={geometry.centerX} cy={heightGuideY} r="3" fill={heightGuideColor} opacity=".92"/>
    </g>}
    {!referenceOnly&&<g transform={transform} opacity={mannequinOpacity}>
      <path d={geometry.outlinePath} fill="white" stroke="#17202a" strokeWidth="2.15" strokeLinejoin="round"/>
      {debugPoints.map((point,index)=><g key={`${point.name}-${index}`} className={`debug-point ${point.role}`}>
        <circle cx={point.x} cy={point.y} r="5" fill={point.role==='primary'?'#111827':'#3478f6'} stroke="white" strokeWidth="1.5"><title>{debugPointTitle(point)}</title></circle>
        {(index===0||point.role==='dependent')&&<path d={`M ${point.x} ${point.y} l ${point.role==='primary'?-16:16} 0`} stroke={point.role==='primary'?'#111827':'#3478f6'} strokeDasharray="2 3" strokeWidth=".8" opacity=".65"/>}
      </g>)}
      <g fill="none" stroke="#87929d" strokeWidth="1" strokeDasharray="5 5" opacity="0.56">
        <path d={guide(landmarks.chinY*.56,widths.headHalf)}/>
        <path d={guide(landmarks.shoulderY,widths.shoulderHalf)}/>
        <path d={guide(landmarks.chestY,widths.chestHalf)}/>
        <path d={guide(landmarks.waistY,widths.waistHalf)}/>
        <path d={guide(landmarks.pelvisY,widths.pelvisHalf)}/>
        <path d={guide(landmarks.elbowY,widths.elbowWidth*.55)}/>
        <path d={guide(landmarks.kneeY,widths.kneeWidth*.7)}/>
      </g>
      <g fill="none" stroke="#5f6b76" strokeWidth="1.05" opacity="0.46">
        {showCenterLine&&<path d={`M ${geometry.centerX} 0 L ${geometry.centerX} ${landmarks.crotchY}`}/>} 
        <path d={`M ${left(widths.shoulderHalf*.88)} ${landmarks.shoulderY} Q ${geometry.centerX} ${landmarks.shoulderY+18} ${right(widths.shoulderHalf*.88)} ${landmarks.shoulderY}`}/>
        <path d={`M ${left(widths.chestHalf*.80)} ${landmarks.chestY} Q ${geometry.centerX} ${landmarks.chestY+(landmarks.waistY-landmarks.chestY)*.32} ${right(widths.chestHalf*.80)} ${landmarks.chestY}`}/>
        <path d={`M ${left(widths.pelvisHalf*.82)} ${landmarks.pelvisY} Q ${geometry.centerX} ${landmarks.crotchY-14} ${right(widths.pelvisHalf*.82)} ${landmarks.pelvisY}`}/>
        <path d={`M ${left(widths.pelvisHalf*.72)} ${landmarks.pelvisY+3} L ${geometry.centerX-7} ${landmarks.crotchY-3} M ${right(widths.pelvisHalf*.72)} ${landmarks.pelvisY+3} L ${geometry.centerX+7} ${landmarks.crotchY-3}`}/>
        <ellipse cx={elbowCenterLeft} cy={landmarks.elbowY} rx={widths.elbowWidth*.32} ry={widths.elbowWidth*.38}/>
        <ellipse cx={elbowCenterRight} cy={landmarks.elbowY} rx={widths.elbowWidth*.32} ry={widths.elbowWidth*.38}/>
        <ellipse cx={kneeCenterLeft} cy={landmarks.kneeY} rx={widths.kneeWidth*.28} ry={widths.kneeWidth*.38}/>
        <ellipse cx={kneeCenterRight} cy={landmarks.kneeY} rx={widths.kneeWidth*.28} ry={widths.kneeWidth*.38}/>
        <path d={`M ${handInner.x} ${handInner.y} Q ${(handInner.x+fingertip.x)/2} ${fingertip.y-8} ${fingertip.x} ${fingertip.y}`}/>
        <path d={`M ${rightHandInner.x} ${rightHandInner.y} Q ${(rightHandInner.x+rightFingertip.x)/2} ${rightFingertip.y-8} ${rightFingertip.x} ${rightFingertip.y}`}/>
      </g>
      {showCenterLine&&<path d={`M ${geometry.centerX} 0 L ${geometry.centerX} ${landmarks.floorY}`} fill="none" stroke="#9ca3af" strokeDasharray="4 4" strokeWidth="1" opacity=".45"/>}
    </g>}
  </svg>;
}
