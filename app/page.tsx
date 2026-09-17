'use client';

import { useRef, useState } from 'react';
import Mannequin from '../components/Mannequin';
import BodyControls from '../components/BodyControls';
import { calculateBodySpec, defaultModifiers, ManualModifiers } from '../lib/body-model';

type Character = { id:number; name:string; sex:'남성'|'여성'; height:number; weight:number; head:number; color:string; mod:ManualModifiers };
const colors = ['#3478f6','#ed6a5a','#20a486','#9b5de5','#f4a261'];
const empty:ManualModifiers = defaultModifiers;
const initial:Character[] = [
  { id:1, name:'기본 남성', sex:'남성', height:175, weight:65, head:7.5, color:colors[0], mod:{...empty} },
  { id:2, name:'기본 여성', sex:'여성', height:162, weight:52, head:7.5, color:colors[1], mod:{...empty} },
];

export default function Page() {
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState(1);
  const [spacing, setSpacing] = useState(90);
  const [modal, setModal] = useState(false);
  const [renameId, setRenameId] = useState<number|null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [draft, setDraft] = useState({ name:'새 인물', sex:'남성' as '남성'|'여성', height:175, weight:65, head:7.5 });
  const [debugEnabled,setDebugEnabled]=useState(true);
  const [activeDebugKey,setActiveDebugKey]=useState<keyof ManualModifiers>('shoulder');
  const [referenceVisible,setReferenceVisible]=useState(true);
  const [mannequinVisible,setMannequinVisible]=useState(false);
  const [referenceOpacity,setReferenceOpacity]=useState(50);
  const [mannequinOpacity,setMannequinOpacity]=useState(20);
  const [showCenterLine,setShowCenterLine]=useState(true);
  const [showHeightGuide,setShowHeightGuide]=useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const cur = items.find((item) => item.id === selected) || items[0];
  const specs = items.map((item) => ({ ...item, spec: calculateBodySpec({ sex:item.sex, height:item.height, weight:item.weight, headCount:item.head, modifiers:item.mod }) }));

  const add = () => { if (items.length < 5) { setItems([...items, { ...draft, id:Date.now(), color:colors[items.length], mod:{...empty} }]); setModal(false); } };
  const update = (key:keyof ManualModifiers, value:number) => setItems(items.map((item) => item.id === cur.id ? { ...item, mod:{...item.mod,[key]:value} } : item));
  const remove = (id:number) => { if (items.length > 1) { const next = items.filter((item) => item.id !== id); setItems(next); if (id === selected) setSelected(next[0].id); } };
  const move = (index:number, direction:number) => { const target = index + direction; if (target < 0 || target >= items.length) return; const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; setItems(next); };
  const openRename = (item:Character) => { setRenameId(item.id); setRenameValue(item.name); };
  const saveRename = () => { if (renameId===null) return; setItems(items.map((item) => item.id===renameId ? {...item,name:renameValue.trim()||item.name} : item)); setRenameId(null); };
  const fitCanvas = () => { canvasRef.current?.scrollTo({left:0,top:0,behavior:'smooth'}); };
  const exportPng = () => {
    const svgs = Array.from(canvasRef.current?.querySelectorAll<SVGSVGElement>('.mannequin') || []); if (!svgs.length) return;
    const root=document.createElementNS('http://www.w3.org/2000/svg','svg'); root.setAttribute('xmlns','http://www.w3.org/2000/svg'); root.setAttribute('viewBox','0 0 1200 1100');
    const background=document.createElementNS('http://www.w3.org/2000/svg','rect'); background.setAttribute('width','1200'); background.setAttribute('height','1100'); background.setAttribute('fill','white'); root.appendChild(background);
    svgs.forEach((svg,index)=>{ const group=document.createElementNS('http://www.w3.org/2000/svg','g'); group.setAttribute('transform',`translate(${80+index*260} 50) scale(.82)`); group.appendChild(svg.cloneNode(true)); root.appendChild(group); });
    const data = new XMLSerializer().serializeToString(root); const image = new Image();
    image.onload = () => { const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1100; const context = canvas.getContext('2d')!; context.fillStyle = 'white'; context.fillRect(0,0,canvas.width,canvas.height); context.drawImage(image,0,0); const link = document.createElement('a'); link.download = 'body-mannequin-comparison.png'; link.href = canvas.toDataURL('image/png'); link.click(); };
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data);
  };

  return <main className="app">
    <aside className="sidebar left">
      <div className="brand"><span className="mark">BM</span><div><strong>Body Mannequin</strong><small>Designer · v0.1</small></div></div>
      <div className="side-title"><span>인물</span><em>{items.length} / 5</em></div>
      <div className="cards">{items.map((item, index) => <button className={'card '+(item.id === selected ? 'active' : '')} key={item.id} onClick={() => setSelected(item.id)} onDoubleClick={(event) => { event.stopPropagation(); openRename(item); }} draggable onDragStart={(event) => event.dataTransfer.setData('i',String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const from = Number(event.dataTransfer.getData('i')); const next = [...items]; const [moved] = next.splice(from,1); next.splice(index,0,moved); setItems(next); }}><span className="dot" style={{background:item.color}}/><span className="card-main"><strong>{item.name}</strong><small>{item.sex} · {item.height} cm · {item.weight} kg</small><small>{item.head.toFixed(1)}H</small></span><span className="card-actions"><i onClick={(event) => { event.stopPropagation(); move(index,-1); }}>↑</i><i onClick={(event) => { event.stopPropagation(); remove(item.id); }}>×</i></span></button>)}</div>
      <button className="add" onClick={() => setModal(true)} disabled={items.length >= 5}>＋ 인물 추가</button>
    </aside>
    <section className="workspace">
      <div className="canvas-head"><div><span className="eyebrow">COMPARISON CANVAS</span><h1>신체 비교</h1></div><div className="canvas-tools"><button onClick={fitCanvas}>화면 맞춤</button><span>100%</span></div></div>
      <div className="dev-tools">
        <label><input type="checkbox" checked={referenceVisible} onChange={(event)=>setReferenceVisible(event.target.checked)}/> 마네킹 보기</label>
        <label>투명도 <input type="range" min="0" max="100" value={referenceOpacity} onChange={(event)=>setReferenceOpacity(+event.target.value)}/></label>
        <label><input type="checkbox" checked={mannequinVisible} onChange={(event)=>{setMannequinVisible(event.target.checked);if(event.target.checked)setMannequinOpacity(20)}}/> 마네킹 만들기</label>
        <label>투명도 <input type="range" min="0" max="100" value={mannequinOpacity} onChange={(event)=>setMannequinOpacity(+event.target.value)}/></label>
      </div>
      <div className="dev-tools debug-tools">
        <label><input type="checkbox" checked={showCenterLine} onChange={(event)=>setShowCenterLine(event.target.checked)}/> Center line</label>
        <label><input type="checkbox" checked={showHeightGuide} onChange={(event)=>setShowHeightGuide(event.target.checked)}/> 키 표시선</label>
      </div>
      <div className="dev-tools geometry-debug-tools">
        <label><input type="checkbox" checked={debugEnabled} onChange={(event)=>setDebugEnabled(event.target.checked)}/> Geometry Debug</label>
      </div>
      <div className="canvas" ref={canvasRef}><div className="compare-stage">
        <div className="height-axis">{Array.from({length:21},(_,i) => <span key={i}>{200-i*10}</span>)}</div>
        <div className="grid-lines">{Array.from({length:21},(_,i) => <i key={i} style={{top:(i*5)+'%'}}/>)}</div>
      <div className="mannequin-row" style={{gap:spacing}}>{specs.map((item) => { const isSelected=item.id===selected; return <div className={'figure '+(isSelected ? 'chosen' : '')} key={item.id} onClick={() => setSelected(item.id)}><Mannequin spec={item.spec} debug={debugEnabled&&isSelected&&mannequinVisible} activeDebugKey={activeDebugKey} showReference={referenceVisible} referenceSex={item.sex} referenceOpacity={referenceOpacity/100} mannequinOpacity={mannequinOpacity/100} showCenterLine={showCenterLine} showHeightGuide={showHeightGuide} referenceOnly={!mannequinVisible}/><div className="figure-label" style={{top:'calc('+(100-item.spec.height/2)+'% - 24px)'}}><i style={{background:item.color}}/>{item.name} <small>({item.height}cm, {item.weight}kg)</small></div></div>; })}</div>
      </div></div>
      <div className="canvas-foot"><label>인물 간격 <input type="range" min="30" max="180" value={spacing} onChange={(event) => setSpacing(+event.target.value)}/></label><span>가로 · 세로 스크롤 · 선택 인물 {cur.name}</span></div>
    </section>
    <aside className="sidebar right">
      <div className="right-pane profile-pane">
        <div className="panel-title"><span>선택 인물</span><span className="selected-dot" style={{background:cur.color}}/></div><div className="profile"><input className="profile-name" aria-label="인물 이름" value={cur.name} onChange={(event) => setItems(items.map((item) => item.id === cur.id ? {...item,name:event.target.value} : item))}/><span>{cur.sex}</span></div>
        <div className="field-grid"><label>키(cm)<input type="number" min="100" max="250" value={cur.height} onChange={(event) => setItems(items.map((item) => item.id === cur.id ? {...item,height:+event.target.value} : item))}/></label><label>체중(kg)<input type="number" min="20" max="250" value={cur.weight} onChange={(event) => setItems(items.map((item) => item.id === cur.id ? {...item,weight:+event.target.value} : item))}/></label><label>등신(H)<input type="number" min="4" max="10" step=".1" value={cur.head} onChange={(event) => setItems(items.map((item) => item.id === cur.id ? {...item,head:+event.target.value} : item))}/></label></div>
      </div>
      {mannequinVisible&&<div className="right-pane body-pane">
        <BodyControls modifiers={cur.mod} onChange={update} onActiveKey={setActiveDebugKey} onReset={() => setItems(items.map((item) => item.id === cur.id ? {...item,mod:{...empty}} : item))}/>
      </div>}
    </aside>
    <footer><span>Body Mannequin Designer <small>v0.1 · Phase 5</small></span><button onClick={exportPng}>마네킹 이미지 저장</button></footer>
    {modal && <div className="modal-backdrop"><div className="modal"><h2>인물 추가</h2><label>이름<input value={draft.name} onChange={(event) => setDraft({...draft,name:event.target.value})}/></label><label>성별<select value={draft.sex} onChange={(event) => setDraft({...draft,sex:event.target.value as '남성'|'여성'})}><option>남성</option><option>여성</option></select></label><div className="row"><label>키(cm)<input type="number" value={draft.height} onChange={(event) => setDraft({...draft,height:+event.target.value})}/></label><label>체중(kg)<input type="number" value={draft.weight} onChange={(event) => setDraft({...draft,weight:+event.target.value})}/></label></div><label>등신(H)<input type="number" step=".1" value={draft.head} onChange={(event) => setDraft({...draft,head:+event.target.value})}/></label><div className="modal-actions"><button onClick={() => setModal(false)}>취소</button><button className="primary" onClick={add}>추가하기</button></div></div></div>}
    {renameId!==null && <div className="modal-backdrop" onDoubleClick={() => setRenameId(null)}><div className="modal" onDoubleClick={(event) => event.stopPropagation()}><h2>이름 수정</h2><label>인물 이름<input autoFocus value={renameValue} onChange={(event) => setRenameValue(event.target.value)} onKeyDown={(event) => { if(event.key==='Enter') saveRename(); if(event.key==='Escape') setRenameId(null); }}/></label><div className="modal-actions"><button onClick={() => setRenameId(null)}>취소</button><button className="primary" onClick={saveRename}>저장</button></div></div></div>}
  </main>;
}
