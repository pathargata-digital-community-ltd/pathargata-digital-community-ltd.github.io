/**
 * Pathargata Digital - Remote Card Loader
 * এটি মেইন অ্যাপে আইডি কার্ডের সব ডিজাইন ও লজিক ইনজেক্ট করবে।
 */

(function() {
    // ১. কার্ডের জন্য প্রয়োজনীয় CSS ইনজেক্ট করা
    const style = document.createElement('style');
    style.innerHTML = `
        .remote-card-container {
            width: 100%; max-width: 360px;
            background: linear-gradient(135deg, #16a34a 0%, #0d9488 100%);
            border-radius: 20px; position: relative; overflow: hidden;
            color: white; box-shadow: 0 15px 30px rgba(0,0,0,0.2);
            aspect-ratio: 1.6 / 1; margin: 0 auto;
        }
        .remote-card-content { padding: 20px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; position: relative; z-index: 5; }
        .remote-card-avatar { width: 70px; height: 70px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); overflow: hidden; background: rgba(255,255,255,0.1); }
        .remote-verified-tag { background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 50px; font-size: 10px; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // ২. মডাল HTML ইনজেক্ট করা
    const modalDiv = document.createElement('div');
    modalDiv.id = 'remote-card-modal';
    modalDiv.className = 'fixed inset-0 bg-black/80 z-[300] hidden flex items-center justify-center p-4 backdrop-blur-sm';
    modalDiv.innerHTML = `
        <div class="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl relative">
            <button onclick="document.getElementById('remote-card-modal').classList.add('hidden')" class="absolute top-3 right-3 w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center z-50"><i class="fa-solid fa-xmark"></i></button>
            <div id="remote-capture-area" class="remote-card-container">
                <div class="remote-card-content">
                    <div class="flex justify-between items-start">
                        <div><h2 class="text-[10px] font-bold uppercase tracking-widest opacity-80">পাথরঘাটা ডিজিটাল</h2><p class="text-[8px] opacity-60">স্মার্ট উপজেলা স্মার্ট সেবা</p></div>
                        <i class="fa-solid fa-qrcode text-xl opacity-70"></i>
                    </div>
                    <div class="flex items-center gap-4 my-2">
                        <div id="remote-card-img-box" class="remote-card-avatar flex items-center justify-center"><i class="fa-solid fa-user text-3xl opacity-40"></i></div>
                        <div><h3 id="remote-card-name-txt" class="text-lg font-bold leading-tight">---</h3><p id="remote-card-prof-txt" class="text-xs opacity-80">---</p></div>
                    </div>
                    <div class="flex justify-between items-end border-t border-white/10 pt-2">
                        <div class="text-[9px]"><p><i class="fa-solid fa-location-dot mr-1"></i> <span id="remote-card-loc-txt">---</span></p><p>UID: <span id="remote-card-uid-txt">---</span></p></div>
                        <div class="remote-verified-tag">VERIFIED</div>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-gray-50 flex gap-3">
                <button onclick="downloadRemoteIDCard()" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition"><i class="fa-solid fa-download"></i> ডাউনলোড</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
})();

// ৩. ফাংশনসমূহ
window.loadAndOpenCard = function() {
    const u = window.userDetails;
    if (!u) { showToast("প্রোফাইল লোড হচ্ছে...", "error"); return; }
    document.getElementById('remote-card-name-txt').innerText = u.name || "অজ্ঞাত";
    document.getElementById('remote-card-prof-txt').innerText = u.profession || "স্মার্ট নাগরিক";
    document.getElementById('remote-card-loc-txt').innerText = (u.village || "পাথরঘাটা") + ", " + (u.union || "");
    document.getElementById('remote-card-uid-txt').innerText = (window.currentUser ? window.currentUser.uid.substring(0, 8).toUpperCase() : "UID");
    if (u.profile_pic) document.getElementById('remote-card-img-box').innerHTML = `<img src="${u.profile_pic}" class="w-full h-full object-cover">`;
    document.getElementById('remote-card-modal').classList.remove('hidden');
};

window.downloadRemoteIDCard = function() {
    const area = document.getElementById('remote-capture-area');
    showToast("কার্ড তৈরি হচ্ছে...");
    html2canvas(area, { scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Patharghata_ID_Card.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
};
