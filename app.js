/* Prototype only: data lives in the browser (localStorage). "Reset demo data" restores the sample content. */
const KEY='extranet_demo_v1',$=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const today=()=>new Date().toISOString().slice(0,10);
const seed=()=>({
 users:[{id:1,name:'Amelia Grant',email:'amelia@acme.com',role:'Admin'},{id:2,name:'Marc Dubois',email:'marc@client.fr',role:'Client'},{id:3,name:'Priya Shah',email:'priya@partner.com',role:'Contributor'},{id:4,name:'Tom Becker',email:'tom@acme.com',role:'Contributor'}],
 projects:[{id:1,name:'Website Redesign',desc:'New public website and content migration.',status:'On track',progress:65,due:'2026-11-30',members:[1,2,3],log:[{d:'2026-09-20',t:'Design approved by client'}]},
  {id:2,name:'Mobile App Launch',desc:'iOS and Android release for customers.',status:'At risk',progress:35,due:'2026-12-15',members:[1,4],log:[{d:'2026-09-18',t:'Testing delayed by two weeks'}]},
  {id:3,name:'Data Migration',desc:'Move legacy records to the new platform.',status:'Complete',progress:100,due:'2026-09-01',members:[3,4],log:[{d:'2026-09-01',t:'Migration signed off'}]}],
 docs:[{id:1,name:'Project-Brief.pdf',project:1,size:'240 KB',date:'2026-09-02',by:'Amelia Grant'},{id:2,name:'Design-Mockups.zip',project:1,size:'4.2 MB',date:'2026-09-15',by:'Priya Shah'},{id:3,name:'Test-Plan.docx',project:2,size:'88 KB',date:'2026-09-10',by:'Tom Becker'}],
 next:{u:5,p:4,d:4}});
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
db=db||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
const pname=id=>(db.projects.find(p=>p.id==id)||{name:'(deleted project)'}).name;
const uname=id=>(db.users.find(u=>u.id==id)||{name:'?'}).name;
const stCls=s=>s==='Complete'?'ok':s==='On track'?'':s==='At risk'?'warn':'bad';
const bar=n=>`<div class="prog" role="progressbar" aria-valuenow="${n}" aria-valuemin="0" aria-valuemax="100"><i style="width:${n}%"></i></div>`;
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2200)}
function modal(title,body,onSave,label='Save changes'){
 $('#box').innerHTML=`<h2>${title}</h2><div>${body}</div><div class="acts"><button class="alt" id="mc">Cancel</button>${onSave?`<button id="ms">${label}</button>`:''}</div>`;
 $('#modal').classList.add('open');$('#mc').onclick=close;
 if(onSave)$('#ms').onclick=()=>{if(onSave()!==false)close()};
 const f=$('#box input,#box select,#box textarea');if(f)f.focus()}
function close(){$('#modal').classList.remove('open')}
const val=id=>$('#'+id).value.trim();
function shell(page){
 const pages=[['index.html','Dashboard'],['documents.html','Documents'],['users.html','Users'],['projects.html','Projects'],['progress.html','Progress']];
 document.body.insertAdjacentHTML('afterbegin',`<header><b>Acme Client Extranet</b><nav>${pages.map(p=>`<a href="${p[0]}" class="${p[0]==page?'on':''}">${p[1]}</a>`).join('')}</nav><span class="who">Signed in as Amelia Grant (Admin)</span></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer>Prototype for demonstration. Data is stored in this browser only. <a href="#" id="rst">Reset demo data</a></footer><div id="modal"><div id="box" role="dialog" aria-modal="true"></div></div><div id="toast" role="status"></div>`);
 $('#rst').onclick=e=>{e.preventDefault();db=seed();save();R[page]();toast('Demo data restored')};
 $('#modal').onclick=e=>{if(e.target.id=='modal')close()};document.onkeydown=e=>{if(e.key=='Escape')close()};
 R[page]()}
const R={};
R['index.html']=()=>{const p=db.projects;
 $('#app').innerHTML=`<h1>Dashboard</h1><p class="sub">A summary of your projects, people and documents.</p>
 <div class="grid"><div class="stat"><b>${p.length}</b><span>Projects</span></div><div class="stat"><b>${p.filter(x=>x.status!='Complete').length}</b><span>Active projects</span></div><div class="stat"><b>${db.users.length}</b><span>Users</span></div><div class="stat"><b>${db.docs.length}</b><span>Documents</span></div></div>
 <div class="card"><h2>Project progress</h2><div class="wrap"><table><tr><th>Project</th><th>Status</th><th style="width:30%">Progress</th><th>Due</th></tr>${p.map(x=>`<tr><td>${esc(x.name)}</td><td><span class="tag ${stCls(x.status)}">${x.status}</span></td><td>${bar(x.progress)} ${x.progress}%</td><td>${x.due}</td></tr>`).join('')||'<tr><td colspan=4 class="empty">No projects yet.</td></tr>'}</table></div></div>
 <div class="card"><h2>Recent documents</h2>${db.docs.slice(-4).reverse().map(d=>`<div>${esc(d.name)} <span class="tag">${esc(pname(d.project))}</span> <small>${d.date}</small></div>`).join('')||'<div class="empty">No documents uploaded.</div>'}</div>`};
R['documents.html']=()=>{
 $('#app').innerHTML=`<div class="bar"><div><h1>Documents</h1><p class="sub" style="margin:0">Upload files and link them to a project.</p></div><button id="up">Upload document</button></div>
 <div class="card"><div class="wrap"><table><tr><th>Name</th><th>Project</th><th>Size</th><th>Uploaded</th><th>By</th><th></th></tr>${db.docs.map(d=>`<tr><td>${esc(d.name)}</td><td>${esc(pname(d.project))}</td><td>${d.size}</td><td>${d.date}</td><td>${esc(d.by)}</td><td><button class="del sm" data-id="${d.id}">Remove</button></td></tr>`).join('')||'<tr><td colspan=6 class="empty">No documents yet. Select Upload document to add one.</td></tr>'}</table></div></div>`;
 $('#up').onclick=()=>modal('Upload document',`<label for="f">File</label><input type="file" id="f"><label for="pr">Project</label><select id="pr">${db.projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>`,()=>{
  const f=$('#f').files[0];if(!f){alert('Choose a file first.');return false}
  const kb=f.size/1024;db.docs.push({id:db.next.d++,name:f.name,project:+$('#pr').value,size:kb>1024?(kb/1024).toFixed(1)+' MB':Math.max(1,Math.round(kb))+' KB',date:today(),by:'Amelia Grant'});save();R['documents.html']();toast('Document uploaded')},'Upload');
 document.querySelectorAll('.del').forEach(b=>b.onclick=()=>{if(confirm('Remove this document?')){db.docs=db.docs.filter(d=>d.id!=b.dataset.id);save();R['documents.html']();toast('Document removed')}})};
function userForm(u){u=u||{};return`<label for="n">Full name</label><input id="n" value="${esc(u.name)}"><label for="e">Email</label><input id="e" type="email" value="${esc(u.email)}"><label for="r">Role</label><select id="r">${['Admin','Contributor','Client'].map(r=>`<option${u.role==r?' selected':''}>${r}</option>`).join('')}</select>`}
R['users.html']=()=>{
 $('#app').innerHTML=`<div class="bar"><div><h1>Users</h1><p class="sub" style="margin:0">Manage who can sign in to the extranet.</p></div><button id="add">Add user</button></div>
 <div class="card"><div class="wrap"><table><tr><th>Name</th><th>Email</th><th>Role</th><th>Projects</th><th></th></tr>${db.users.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.role}</td><td>${db.projects.filter(p=>p.members.includes(u.id)).map(p=>`<span class="tag">${esc(p.name)}</span>`).join('')||'<small>None</small>'}</td><td><button class="alt sm" data-e="${u.id}">Edit</button> <button class="del sm" data-d="${u.id}">Delete</button></td></tr>`).join('')}</table></div></div>`;
 const grab=()=>{if(!val('n')||!val('e')){alert('Name and email are required.');return null}return{name:val('n'),email:val('e'),role:$('#r').value}};
 $('#add').onclick=()=>modal('Add user',userForm(),()=>{const v=grab();if(!v)return false;db.users.push({id:db.next.u++,...v});save();R['users.html']();toast('User added')},'Add user');
 document.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const u=db.users.find(x=>x.id==b.dataset.e);modal('Edit user',userForm(u),()=>{const v=grab();if(!v)return false;Object.assign(u,v);save();R['users.html']();toast('User updated')})});
 document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const id=+b.dataset.d;if(confirm('Delete '+uname(id)+'? They will be removed from all projects.')){db.users=db.users.filter(u=>u.id!=id);db.projects.forEach(p=>p.members=p.members.filter(m=>m!=id));save();R['users.html']();toast('User deleted')}})};
function projForm(p){p=p||{};return`<label for="n">Project name</label><input id="n" value="${esc(p.name)}"><label for="d">Description</label><textarea id="d" rows="3">${esc(p.desc)}</textarea><label for="due">Due date</label><input id="due" type="date" value="${p.due||''}">`}
R['projects.html']=()=>{
 $('#app').innerHTML=`<div class="bar"><div><h1>Projects</h1><p class="sub" style="margin:0">Create projects and choose who works on them.</p></div><button id="add">Add project</button></div>
 <div class="card"><div class="wrap"><table><tr><th>Project</th><th>Team</th><th>Due</th><th></th></tr>${db.projects.map(p=>`<tr><td><b>${esc(p.name)}</b><br><small>${esc(p.desc)}</small></td><td>${p.members.map(m=>`<span class="tag">${esc(uname(m))}</span>`).join('')||'<small>No one assigned</small>'}</td><td>${p.due}</td><td style="white-space:nowrap"><button class="sm" data-a="${p.id}">Assign users</button> <button class="alt sm" data-e="${p.id}">Edit</button> <button class="del sm" data-d="${p.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan=4 class="empty">No projects yet.</td></tr>'}</table></div></div>`;
 const grab=()=>{if(!val('n')){alert('Project name is required.');return null}return{name:val('n'),desc:val('d'),due:val('due')||today()}};
 $('#add').onclick=()=>modal('Add project',projForm(),()=>{const v=grab();if(!v)return false;db.projects.push({id:db.next.p++,...v,status:'On track',progress:0,members:[],log:[]});save();R['projects.html']();toast('Project added')},'Add project');
 document.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const p=db.projects.find(x=>x.id==b.dataset.e);modal('Edit project',projForm(p),()=>{const v=grab();if(!v)return false;Object.assign(p,v);save();R['projects.html']();toast('Project updated')})});
 document.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const id=+b.dataset.d;if(confirm('Delete "'+pname(id)+'" and its documents?')){db.projects=db.projects.filter(p=>p.id!=id);db.docs=db.docs.filter(d=>d.project!=id);save();R['projects.html']();toast('Project deleted')}});
 document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const p=db.projects.find(x=>x.id==b.dataset.a);
  modal('Assign users: '+esc(p.name),db.users.map(u=>`<label class="chk"><input type="checkbox" value="${u.id}"${p.members.includes(u.id)?' checked':''}>${esc(u.name)} <small>(${u.role})</small></label>`).join(''),()=>{p.members=[...document.querySelectorAll('#box input:checked')].map(c=>+c.value);save();R['projects.html']();toast('Team updated')})})};
R['progress.html']=()=>{
 $('#app').innerHTML=`<h1>Progress</h1><p class="sub">Track how each project is moving and post updates for the client.</p>`+(db.projects.map(p=>`<div class="card"><div class="bar" style="margin:0 0 8px"><h2 style="margin:0">${esc(p.name)} <span class="tag ${stCls(p.status)}">${p.status}</span></h2><button class="sm" data-u="${p.id}">Update progress</button></div>${bar(p.progress)}<p style="margin:6px 0"><b>${p.progress}%</b> complete. Due ${p.due}. Team: ${p.members.map(uname).join(', ')||'none'}.</p><div><b style="font-family:Verdana,sans-serif;font-size:13px">Updates</b>${p.log.slice().reverse().map(l=>`<div><small>${l.d}</small> ${esc(l.t)}</div>`).join('')||'<div class="empty">No updates yet.</div>'}</div></div>`).join('')||'<div class="card empty">No projects to track yet.</div>');
 document.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const p=db.projects.find(x=>x.id==b.dataset.u);
  modal('Update: '+esc(p.name),`<label for="pg">Progress: <span id="pv">${p.progress}</span>%</label><input id="pg" type="range" min="0" max="100" step="5" value="${p.progress}"><label for="st">Status</label><select id="st">${['On track','At risk','Delayed','Complete'].map(s=>`<option${p.status==s?' selected':''}>${s}</option>`).join('')}</select><label for="nt">Note (optional)</label><textarea id="nt" rows="2"></textarea>`,()=>{
   p.progress=+$('#pg').value;p.status=$('#st').value;if(p.progress==100)p.status='Complete';if(val('nt'))p.log.push({d:today(),t:val('nt')});save();R['progress.html']();toast('Progress saved')});
  $('#pg').oninput=e=>$('#pv').textContent=e.target.value})};
document.addEventListener('DOMContentLoaded',()=>{const pg=document.body.dataset.page;shell(pg)});
