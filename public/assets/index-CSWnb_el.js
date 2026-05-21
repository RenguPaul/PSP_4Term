(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();const c={async get(s){const t=await fetch(s);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()},async post(s,t){const e=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()},async patch(s,t){const e=await fetch(s,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return await e.json()},async delete(s){const t=await fetch(s,{method:"DELETE"});if(!t.ok&&t.status!==204)throw new Error(`HTTP error! status: ${t.status}`);return null}};class u{constructor(){this.baseUrl=""}getStocks(t=""){let e="/api/stocks";return t&&(e+=`?title=${encodeURIComponent(t)}`),e}getStockById(t){return`/api/stocks/${t}`}createStock(){return"/api/stocks"}deleteStock(t){return`/api/stocks/${t}`}updateStock(t){return`/api/stocks/${t}`}}const a=new u;class p{constructor(t){this.parent=t}getHTML(t){return`
      <div class="stock-card" data-id="${t.id}">
        <img src="${t.src}" alt="${t.title}" onerror="this.src='https://via.placeholder.com/300?text=no+image'">
        <div class="card-content">
          <h3>${this.escapeHtml(t.title)}</h3>
          <p>${this.escapeHtml(t.text)}</p>
          <div class="card-actions">
            <button class="detail-btn" data-id="${t.id}">Подробнее</button>
          </div>
        </div>
      </div>
    `}escapeHtml(t){return t.replace(/[&<>]/g,function(e){return e==="&"?"&amp;":e==="<"?"&lt;":e===">"?"&gt;":e})}addListeners(t){this.parent.querySelectorAll(".detail-btn").forEach(i=>{i.removeEventListener("click",t),i.addEventListener("click",t)})}render(t,e){this.parent.insertAdjacentHTML("beforeend",this.getHTML(t)),this.addListeners(e)}}class h{constructor(t){this.parent=t}addListeners(t){const e=document.getElementById("back-button");e&&e.addEventListener("click",t)}getHTML(){return'<button id="back-button" class="back-button btn">← На главную</button>'}render(t){this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.addListeners(t)}}class m{constructor(t){this.parent=t}getHTML(t){return`
      <div class="detail-card">
        <img src="${t.src}" alt="${t.title}">
        <h2>${this.escapeHtml(t.title)}</h2>
        <p>${this.escapeHtml(t.text)}</p>
        <div class="card-actions">
          <button id="delete-btn" data-id="${t.id}" class="btn delete-btn">🗑 Удалить</button>
        </div>
        <hr>
        <h3>Редактировать</h3>
        <form id="edit-form">
          <div class="form-group">
            <input type="text" id="edit-title" value="${this.escapeHtml(t.title)}" placeholder="Заголовок" required>
          </div>
          <div class="form-group">
            <input type="text" id="edit-src" value="${this.escapeHtml(t.src)}" placeholder="URL изображения" required>
          </div>
          <div class="form-group">
            <textarea id="edit-text" rows="3" required>${this.escapeHtml(t.text)}</textarea>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="submit">Сохранить изменения</button>
            <button type="button" id="cancel-btn" class="btn" style="background: #6c757d;">Отмена</button>
          </div>
        </form>
      </div>
    `}escapeHtml(t){return t.replace(/[&<>]/g,function(e){return e==="&"?"&amp;":e==="<"?"&lt;":e===">"?"&gt;":e})}addDeleteListener(t){const e=document.getElementById("delete-btn");e&&e.addEventListener("click",t)}addEditListener(t){const e=document.getElementById("edit-form");e&&e.addEventListener("submit",t)}addCancelListener(t){const e=document.getElementById("cancel-btn");e&&e.addEventListener("click",t)}render(t,e,i,r){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",this.getHTML(t)),this.addDeleteListener(e),this.addEditListener(i),this.addCancelListener(r)}}class l{constructor(t,e){this.parent=t,this.id=e}get pageRoot(){return document.getElementById("product-page")}getHTML(){return'<div id="product-page"></div>'}render(){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",this.getHTML()),new h(this.pageRoot).render(()=>{new d(this.parent).render()}),this.loadData()}async loadData(){try{const t=await c.get(a.getStockById(this.id));this.renderProduct(t)}catch(t){console.error(t),this.pageRoot.innerHTML+='<div class="error">Карточка не найдена</div>'}}renderProduct(t){const e=this.pageRoot;new m(e).render(t,()=>this.onDelete(t.id),r=>this.onUpdate(r,t.id),()=>this.onCancel())}async onDelete(t){if(confirm("Удалить акцию?"))try{await c.delete(a.deleteStock(t)),new d(this.parent).render()}catch(e){console.error(e),alert("Ошибка удаления")}}async onUpdate(t,e){t.preventDefault();const i=document.getElementById("edit-title").value.trim(),r=document.getElementById("edit-src").value.trim(),n=document.getElementById("edit-text").value.trim();if(!i||!r||!n){alert("Заполните все поля");return}try{await c.patch(a.updateStock(e),{title:i,src:r,text:n}),new l(this.parent,e).render()}catch(o){console.error(o),alert("Ошибка обновления")}}onCancel(){new d(this.parent).render()}}class d{constructor(t){this.parent=t,this.currentFilter=""}get pageRoot(){return document.getElementById("main-page")}getHTML(){return`
      <div id="main-page">
        <div class="form-card">
          <h2>➕ Создать новую акцию</h2>
          <form id="create-form">
            <input type="text" id="create-title" placeholder="Заголовок" required>
            <input type="text" id="create-src" placeholder="URL изображения" value="https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg">
            <textarea id="create-text" placeholder="Описание" rows="3" required></textarea>
            <button type="submit">Создать</button>
          </form>
        </div>
        <div class="search-bar">
          <input type="text" id="filter-input" placeholder="🔍 Фильтр по заголовку" value="${this.currentFilter}">
          <button id="search-btn">Найти</button>
          <button id="reset-btn">Сбросить</button>
        </div>
        <div id="stocks-container" class="stocks-grid"></div>
      </div>
    `}async render(){this.parent.innerHTML="",this.parent.insertAdjacentHTML("beforeend",this.getHTML()),this.container=document.getElementById("stocks-container"),document.getElementById("create-form").addEventListener("submit",t=>this.onCreate(t)),document.getElementById("search-btn").addEventListener("click",()=>this.onFilter()),document.getElementById("reset-btn").addEventListener("click",()=>this.onReset()),document.getElementById("filter-input").addEventListener("keypress",t=>{t.key==="Enter"&&this.onFilter()}),await this.loadStocks()}async loadStocks(){try{const t=await c.get(a.getStocks(this.currentFilter));this.renderCards(t)}catch(t){console.error(t),this.container.innerHTML='<div class="error">Ошибка загрузки</div>'}}renderCards(t){this.container.innerHTML="",t.forEach(e=>{new p(this.container).render(e,r=>{const n=r.target.dataset.id;new l(this.parent,n).render()})}),t.length===0&&(this.container.innerHTML='<div class="empty">😞 Ни одной акции не найдено</div>')}async onCreate(t){t.preventDefault();const e=document.getElementById("create-title").value.trim(),i=document.getElementById("create-src").value.trim(),r=document.getElementById("create-text").value.trim();if(!e||!i||!r){alert("Заполните все поля");return}try{await c.post(a.createStock(),{title:e,src:i,text:r}),document.getElementById("create-form").reset(),await this.loadStocks()}catch(n){console.error(n),alert("Ошибка создания")}}onFilter(){this.currentFilter=document.getElementById("filter-input").value.trim(),this.loadStocks()}onReset(){this.currentFilter="",document.getElementById("filter-input").value="",this.loadStocks()}}const g=document.getElementById("root"),f=new d(g);f.render();
