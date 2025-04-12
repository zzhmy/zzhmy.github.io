// 存储网址数据的数组
let sites = JSON.parse(localStorage.getItem('sites')) || [];

// DOM 元素
const siteList = document.getElementById('siteList');
const addSiteBtn = document.getElementById('addSiteBtn');
const siteModal = document.getElementById('siteModal');
const siteForm = document.getElementById('siteForm');
const cancelBtn = document.getElementById('cancelBtn');
const sortByVisitsBtn = document.getElementById('sortByVisits');
const modalTitle = document.getElementById('modalTitle');

// 当前编辑的网址索引
let currentEditIndex = -1;

// 初始化页面
function init() {
    renderSites();
    addEventListeners();
}

// 添加事件监听器
function addEventListeners() {
    addSiteBtn.addEventListener('click', () => openModal());
    cancelBtn.addEventListener('click', closeModal);
    siteForm.addEventListener('submit', handleFormSubmit);
    sortByVisitsBtn.addEventListener('click', sortSitesByVisits);
}

// 渲染网址列表
function renderSites() {
    siteList.innerHTML = sites.map((site, index) => `
        <div class="site-card">
            <h3>${site.name}</h3>
            <p><a href="${site.url}" target="_blank" onclick="incrementVisits(${index})">${site.url}</a></p>
            <p>访问次数: ${site.visits || 0}</p>
            <div class="site-actions">
                <button class="btn" onclick="editSite(${index})">编辑</button>
                <button class="btn btn-secondary" onclick="deleteSite(${index})">删除</button>
            </div>
        </div>
    `).join('');
}

// 打开模态框
function openModal(index = -1) {
    currentEditIndex = index;
    modalTitle.textContent = index === -1 ? '添加网址' : '编辑网址';
    if (index !== -1) {
        document.getElementById('siteName').value = sites[index].name;
        document.getElementById('siteUrl').value = sites[index].url;
    } else {
        siteForm.reset();
    }
    siteModal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    siteModal.style.display = 'none';
    siteForm.reset();
    currentEditIndex = -1;
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('siteName').value;
    const url = document.getElementById('siteUrl').value;

    if (currentEditIndex === -1) {
        // 添加新网址
        sites.push({ name, url, visits: 0 });
    } else {
        // 编辑现有网址
        sites[currentEditIndex].name = name;
        sites[currentEditIndex].url = url;
    }

    saveSites();
    closeModal();
    renderSites();
}

// 编辑网址
function editSite(index) {
    openModal(index);
}

// 删除网址
function deleteSite(index) {
    if (confirm('确定要删除这个网址吗？')) {
        sites.splice(index, 1);
        saveSites();
        renderSites();
    }
}

// 增加访问次数
function incrementVisits(index) {
    sites[index].visits = (sites[index].visits || 0) + 1;
    saveSites();
    renderSites();
}

// 按访问次数排序
function sortSitesByVisits() {
    sites.sort((a, b) => (b.visits || 0) - (a.visits || 0));
    renderSites();
}

// 保存数据到本地存储
function saveSites() {
    localStorage.setItem('sites', JSON.stringify(sites));
}

// 初始化应用
init(); 