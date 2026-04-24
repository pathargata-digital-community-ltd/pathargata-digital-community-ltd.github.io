document.addEventListener("DOMContentLoaded", function() {
    injectCardElements();
    replaceProfileButtons();
});

function injectCardElements() {
    const modalHTML = `
    <div id="id-card-modal" class="fixed inset-0 bg-black/80 z-[300] hidden flex items-center justify-center p-4 backdrop-blur-md">
        <div class="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
            <div id="card-capture-area" class="id-card-container">
                <div class="card-bg-pattern"><i class="fa-solid fa-map-location-dot"></i></div>
                <div class="card-content">
                    <div class="card-header">
                        <div><h2 class="text-xs font-bold uppercase tracking-widest text-white/90">পাথরঘাটা ডিজিটাল</h2><p class="text-[9px] text-white/70">স্মার্ট উপজেলা স্মার্ট সেবা</p></div>
                        <i class="fa-solid fa-qrcode text-2xl text-white/80"></i>
                    </div>
                    <div class="card-body">
                        <div id="card-user-img" class="card-avatar flex items-center justify-center"><i class="fa-solid fa-user text-3xl"></i></div>
                        <div><h3 id="card-user-name" class="text-xl font-extrabold leading-tight">---</h3><p id="card-user-prof" class="text-sm font-medium text-white/80">---</p></div>
                    </div>
                    <div class="card-footer">
                        <div class="text-[10px] space-y-1">
                            <p><i class="fa-solid fa-location-dot mr-1 text-white/60"></i> <span id="card-user-loc">---</span></p>
                            <p><i class="fa-solid fa-hashtag mr-1 text-white/60"></i> ID: <span id="card-user-id">---</span></p>
                        </div>
                        <div class="verified-badge-card">VERIFIED USER</div>
                    </div>
                </div>
            </div>
            <div class="p-5 flex gap-3 bg-gray-50">
                <button onclick="downloadIDCardAction()" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">
                    <i class="fa-solid fa-download"></i> ডাউনলোড
                </button>
                <button onclick="closeIDCardModal()" class="w-14 bg-gray-200 text-gray-600 py-3 rounded-xl flex items-center justify-center hover:bg-gray-300">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function replaceProfileButtons() {
    const profileActions = document.querySelector('#page-profile .flex.gap-3.mt-6');
    if (profileActions) {
        profileActions.innerHTML = `
            <button onclick="openIDCardModal()" class="flex-1 bg-white border-2 border-green-600 text-green-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <i class="fa-solid fa-id-card"></i> আমার কার্ড
            </button>
            <button onclick="toggleEditProfile(true)" class="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <i class="fa-solid fa-pen"></i> এডিট প্রোফাইল
            </button>
        `;
    }
}

window.openIDCardModal = () => {
    document.getElementById('card-user-name').innerText = userDetails.name || "অজ্ঞাত";
    document.getElementById('card-user-prof').innerText = userDetails.profession || "স্মার্ট নাগরিক";
    document.getElementById('card-user-loc').innerText = (userDetails.village || "পাথরঘাটা") + ", " + (userDetails.union || "");
    document.getElementById('card-user-id').innerText = window.currentUser.uid.substring(0, 8).toUpperCase();
    if (userDetails.profile_pic) document.getElementById('card-user-img').innerHTML = `<img src="${userDetails.profile_pic}" class="w-full h-full object-cover">`;
    document.getElementById('id-card-modal').classList.remove('hidden');
    history.pushState({ modal: 'smart-card' }, null, "#smart-id-card");
};

window.closeIDCardModal = () => { document.getElementById('id-card-modal').classList.add('hidden'); };

window.downloadIDCardAction = () => {
    const area = document.getElementById('card-capture-area');
    showToast("প্রস্তুত হচ্ছে...");
    html2canvas(area, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `ID_Card_${userDetails.name}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        showToast("ডাউনলোড হয়েছে!");
    });
};
