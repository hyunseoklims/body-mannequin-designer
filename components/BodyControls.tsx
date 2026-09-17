import type { ManualModifiers } from '../lib/body-model';

type SliderConfig={key:keyof ManualModifiers;label:string;min?:number;max?:number};
type SectionConfig={title:string;open?:boolean;sliders:SliderConfig[]};

const sections:SectionConfig[]=[
  {title:'기본',open:true,sliders:[
    {key:'shoulder',label:'어깨폭'},{key:'chest',label:'흉곽폭'},{key:'waist',label:'허리폭'},{key:'hip',label:'골반폭'},
    {key:'upperBody',label:'상체 길이',min:-10,max:10},{key:'legs',label:'다리 길이',min:-8,max:8},{key:'arms',label:'팔 길이',min:-10,max:10},
    {key:'thighs',label:'허벅지 굵기'},{key:'calves',label:'종아리 굵기'},
  ]},
  {title:'머리·목',sliders:[
    {key:'headWidth',label:'머리 폭'},{key:'neckLength',label:'목 길이',min:-10,max:10},{key:'neckWidth',label:'목 폭'},
  ]},
  {title:'상체',sliders:[
    {key:'shoulderSlope',label:'어깨 경사'},{key:'chestHeight',label:'흉곽 높이',min:-10,max:10},
    {key:'waistPosition',label:'허리 위치',min:-8,max:8},{key:'pelvisHeight',label:'골반 높이',min:-10,max:10},
  ]},
  {title:'팔·손',sliders:[
    {key:'upperArmWidth',label:'상완 굵기'},{key:'elbowWidth',label:'팔꿈치 폭'},{key:'forearmWidth',label:'전완 굵기'},
    {key:'wristWidth',label:'손목 폭'},{key:'handLength',label:'손 길이',min:-10,max:10},{key:'handWidth',label:'손 폭'},
  ]},
  {title:'골반·다리',sliders:[
    {key:'upperThighWidth',label:'상부 허벅지'},{key:'midThighWidth',label:'중부 허벅지'},{key:'kneeWidth',label:'무릎 폭'},
    {key:'calfMaxPosition',label:'종아리 최대점'},{key:'ankleWidth',label:'발목 폭'},
    {key:'footLength',label:'발 길이',min:-10,max:10},{key:'footWidth',label:'발 폭'},
  ]},
];

export default function BodyControls({modifiers,onChange,onReset,onActiveKey}:{modifiers:ManualModifiers;onChange:(key:keyof ManualModifiers,value:number)=>void;onReset:()=>void;onActiveKey?:(key:keyof ManualModifiers)=>void}) {
  return <div className="settings body-controls">
    <div className="section-label">체형 조정 <button onClick={onReset}>초기화</button></div>
    {sections.map((section)=><details key={section.title} open={section.open}>
      <summary>{section.title}</summary>
      <div className="control-section">{section.sliders.map((slider)=>{
        const value=modifiers[slider.key];
        const updateValue=(event:React.ChangeEvent<HTMLInputElement>)=>onChange(slider.key,+event.target.value);
        return <label key={slider.key}>{slider.label}<input aria-label={slider.label} type="range" min={slider.min??-15} max={slider.max??15} value={value} onMouseEnter={()=>onActiveKey?.(slider.key)} onFocus={()=>onActiveKey?.(slider.key)} onInput={updateValue} onChange={updateValue}/><span>{value>0?'+':''}{value}%</span></label>;
      })}</div>
    </details>)}
  </div>;
}
