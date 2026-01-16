const svg = document.getElementById('svg-layer');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status-text');

// Инициализация связей
let connections = [
    { from: 'n2', to: 'n1', hasArrow: true }, // Игорь Зверёк -> Алликсаар
    { from: 'n3', to: 'n1', hasArrow: true }, // Антон Строй -> Алликсаар
    { from: 'n4', to: 'n1', hasArrow: true }, // Станислав Клитотехнис -> Алликсаар
    { from: 'n5', to: 'n4', hasArrow: true }, // Людмила Водолазская -> Станислав Клитотехнис
    { from: 'n6', to: 'n4', hasArrow: true },  // Ольга Боргдорф -> Станислав Клитотехнис
    { from: 'n7', to: 'n4', hasArrow: true }, // Сергей Брус -> Станислав Клитотехнис
    { from: 'n8', to: 'n1', hasArrow: true },  // Ду Хаст Вячеславович -> Алликсаар
    { from: 'n9', to: 'n1', hasArrow: true }, // Анастасия Ширинкина -> Алликсаар
    { from: 'n10', to: 'n4', hasArrow: true }, // Александр Троян -> Станислав Клитотехнис
    { from: 'n11', to: 'n6', hasArrow: true }, // Дмитрий Возигнуй -> Ольга Боргдорф
    { from: 'n12', to: 'n6', hasArrow: true }, // Кристина Болтушкина -> Ольга Боргдорф
    { from: 'n13', to: 'n11', hasArrow: true },  // Максим Висюлькин -> Дмитрий Возигнуй
    { from: 'n13', to: 'n6', hasArrow: true }  // Максим Висюлькин -> Ольга Боргдорф
];

// Есть функционал создания линий без стрелок ({ from: 'node1', to: 'node2', hasArrow: false }), он избыточен

let currentMode = null; 
let sourceNode = null;

function drawLines() {
    svg.querySelectorAll('.connection-path').forEach(p => p.remove());
    connections.forEach((conn, index) => {
        const sEl = document.getElementById(conn.from);
        const eEl = document.getElementById(conn.to);
        if (!sEl || !eEl) return;

        const s = { x: sEl.offsetLeft, y: sEl.offsetTop, w: sEl.offsetWidth, h: sEl.offsetHeight };
        const e = { x: eEl.offsetLeft, y: eEl.offsetTop, w: eEl.offsetWidth, h: eEl.offsetHeight };

        let startX, startY, endX, endY, d;
        const dx = (e.x + e.w/2) - (s.x + s.w/2);
        const dy = (e.y + e.h/2) - (s.y + s.h/2);

        if (Math.abs(dx) > Math.abs(dy)) {
            startX = (dx > 0) ? s.x + s.w : s.x; startY = s.y + s.h/2;
            endX = (dx > 0) ? e.x : e.x + e.w; endY = e.y + e.h/2;
            const midX = startX + (endX - startX) / 2;
            d = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
        } else {
            startX = s.x + s.w/2; startY = (dy > 0) ? s.y + s.h : s.y;
            endX = e.x + e.w/2; endY = (dy > 0) ? e.y : e.y + e.h;
            const midY = startY + (endY - startY) / 2;
            d = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("class", "connection-path");
        path.setAttribute("d", d);
        if (conn.hasArrow) path.setAttribute("marker-end", "url(#arrowhead)");
        path.onclick = () => { if (currentMode === 'delete-conn') { connections.splice(index, 1); drawLines(); } };
        svg.appendChild(path);
    });
}

function initNode(el) {
    el.onmousedown = function(e) {
        if (currentMode === 'arrow' || currentMode === 'line') {
            if (!sourceNode) { sourceNode = el; el.classList.add('selected'); } 
            else if (sourceNode !== el) {
                connections.push({ from: sourceNode.id, to: el.id, hasArrow: currentMode === 'arrow' });
                drawLines(); setMode(null);
            }
            return;
        }
        if (currentMode === 'edit-node') {
            const newText = prompt("Текст блока:", el.innerHTML.replace('<br>', '\n'));
            if (newText) el.innerHTML = newText.replace('\n', '<br>');
            setMode(null); drawLines(); return;
        }
        if (currentMode === 'remove-node') {
            connections = connections.filter(c => c.from !== el.id && c.to !== el.id);
            el.remove(); drawLines(); setMode(null); return;
        }

        let shiftX = e.clientX - el.getBoundingClientRect().left;
        let shiftY = e.clientY - el.getBoundingClientRect().top;
        function move(e) {
            el.style.left = Math.max(0, e.pageX - canvas.getBoundingClientRect().left - shiftX) + 'px';
            el.style.top = Math.max(0, e.pageY - canvas.getBoundingClientRect().top - shiftY) + 'px';
            drawLines();
        }
        document.addEventListener('mousemove', move);
        document.onmouseup = () => document.removeEventListener('mousemove', move);
    };
    el.ondragstart = () => false;
}

function setMode(mode) {
    currentMode = (currentMode === mode) ? null : mode;
    sourceNode = null;
    document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
    document.querySelectorAll('.editor-toolbar button').forEach(b => b.classList.remove('active', 'active-delete'));
    document.querySelector('.diagram-editor-container').classList.remove('delete-mode');
    
    if (!currentMode) { statusText.innerText = "Редактировать схему"; return; }

    const btnMap = { 'arrow': 'mode-arrow', 'line': 'mode-line', 'delete-conn': 'mode-delete-conn', 'edit-node': 'mode-edit', 'remove-node': 'mode-remove-node' };
    const btn = document.getElementById(btnMap[currentMode]);
    if (currentMode.includes('delete') || currentMode.includes('remove')) {
        btn.classList.add('active-delete');
        if(currentMode === 'delete-conn') document.querySelector('.diagram-editor-container').classList.add('delete-mode');
    } else btn.classList.add('active');
    statusText.innerText = "Режим: " + btn.innerText;
}

document.getElementById('add-node').onclick = () => {
    const text = prompt("Текст:", "Новый блок");
    if (!text) return;
    const n = document.createElement('div');
    n.id = 'n' + Date.now(); n.className = 'node';
    n.style.left = '50px'; n.style.top = '50px'; n.innerText = text;
    canvas.appendChild(n); initNode(n);
};

document.getElementById('mode-arrow').onclick = () => setMode('arrow');
document.getElementById('mode-line').onclick = () => setMode('line');
document.getElementById('mode-delete-conn').onclick = () => setMode('delete-conn');
document.getElementById('mode-edit').onclick = () => setMode('edit-node');
document.getElementById('mode-remove-node').onclick = () => setMode('remove-node');

document.querySelectorAll('.node').forEach(initNode);
window.onload = drawLines;