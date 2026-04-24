/**
 * Pathargata Digital - Smart ID Card Module (Fixed Version)
 * This script handles Modal Injection, Button Replacement, and Card Downloading.
 */

(function() {
    // ১. আইডি কার্ডের মডাল HTML ইনজেক্ট করা
    function injectCardModal() {
        if (document.getElementById('id-card-modal')) return; // একবার থাকলে আর করবে না

        const modalHTML = `
        <div id="id-card-modal" class="fixed inset-0 bg-black/80 z-[300] hidden flex items-center justify-center p-4 backdrop-blur-md">
            <div class="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl animate-fade">
                <div id="card-capture-area" class="id-card-container">
                    <div class="card-bg-pattern"><i class="fa-solid fa-map-location-dot"></i></div>
                    <div class="card-content">
                        <div class="card-header">
                            <div>
                                <h2 class="text-xs font-bold uppercase tracking-widest text-white/90">পাথরঘাটা ডিজিটাল</h2>
                                <p class="text-[9px] text-white/70">স্মার্ট উপজেলা স্মার্ট সেবা</p>
                            </div>
                            <i class="fa-solid fa-qrcode text-2xl text-white/80"></i>
                        </div>
                        
                        <div class="card-body">
                            <div id="card-user-img" class="card-avatar flex items-center justify-center border-white/40 border-2">
                                <i class="fa-solid fa-user text-3xl"></i>
                            </div>
                            <div>
                                <h3 id="card-user-name" class="text-xl font-extrabold leading-tight text-white">---</h3>
                                <p id="card-user-prof" class="text-sm font-medium text-white/80">---</p>
                            </div>
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
                    <button onclick="downloadIDCardAction()" class="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition active:scale-95 shadow-md">
                        <i class="fa-solid fa-download"></i> ডাউনলোড কার্ড
                    </button>
                    <button onclick="closeIDCardModal()" class="w-14 bg-gray-200 text-gray-600 py-3 rounded-xl flex items-center justify-center hover:bg-gray-300">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // ২. বাটন রিপ্লেস করার ফাংশন
    function applySmartButtons() {
        // প্রোফাইল পেজের এডিট বাটন কন্টেইনার খুঁজে বের করা
        const targetContainer = document.querySelector('#page-profile .flex.gap-3.mt-6.border-b.pb-4') || 
                                document.querySelector('#page-profile .flex.gap-3.mt-6') ||
                                document.querySelector('.flex.gap-3.mt-6.border-b.pb-4');

        if (targetContainer && !targetContainer.dataset.cardLoaded) {
            targetContainer.innerHTML = `
                <button onclick="openIDCardModal()" class="flex-1 bg-white border-2 border-green-600 text-green-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:bg-green-50 active:scale-95 shadow-sm">
                    <i class="fa-solid fa-id-card"></i> আমার কার্ড
                </button>
                <button onclick="toggleEditProfile(true)" class="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition hover:bg-green-700 active:scale-95 shadow-md">
                    <i class="fa-solid fa-user-pen"></i> এডিট প্রোফাইল
                </button>
            `;
            targetContainer.dataset.cardLoaded = "true";
        }
    }

    // ৩. অ্যাপের ডাটা লোড হওয়া পর্যন্ত অপেক্ষা করা এবং বাটন চেক করা
    function initModule() {
        injectCardModal();
        
        // এটি প্রতি ১ সেকেন্ড পরপর চেক করবে প্রোফাইল পেজে বাটনটি আছে কিনা
        const checkInterval = setInterval(() => {
            applySmartButtons();
            // বাটন একবার লোড হয়ে গেলে ইন্টারভাল বন্ধ করার প্রয়োজন নেই, কারণ ইউজার পেজ চেঞ্জ করতে পারে
        }, 1000);
    }

    // ফাংশনগুলো গ্লোবালি এভেলেবল করা
    window.openIDCardModal = function() {
        const u = window.userDetails;
        if (!u) {
            alert("আপনার প্রোফাইল ডাটা লোড হচ্ছে, দয়া করে একটু অপেক্ষা করুন।");
            return;
        }

        document.getElementById('card-user-name').innerText = u.name || "অজ্ঞাত ইউজার";
        document.getElementById('card-user-prof').innerText = u.profession || "স্মার্ট নাগরিক";
        document.getElementById('card-user-loc').innerText = (u.village || "পাথরঘাটা") + ", " + (u.union || "");
        document.getElementById('card-user-id').innerText = (window.currentUser ? window.currentUser.uid.substring(0, 8).toUpperCase() : "00000000");
        
        const imgBox = document.getElementById('card-user-img');
        if (u.profile_pic) {
            imgBox.innerHTML = `<img src="${u.profile_pic}" class="w-full h-full object-cover rounded-full">`;
        }

        document.getElementById('id-card-modal').classList.remove('hidden');
        history.pushState({ modal: 'smart-card' }, null, "#smart-id-card");
    };

    window.closeIDCardModal = function() {
        document.getElementById('id-card-modal').classList.add('hidden');
    };

    window.downloadIDCardAction = function() {
        const area = document.getElementById('card-capture-area');
        if (typeof html2canvas === 'undefined') {
            alert("ডাউনলোড লাইব্রেরি এখনো লোড হয়নি। দয়া করে একটু পর চেষ্টা করুন।");
            return;
        }

        showToast("কার্ড তৈরি হচ্ছে...");
        html2canvas(area, {
            scale: 3,
            useCORS: true,
            backgroundColor: null,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Patharghata_ID_${window.userDetails.name || 'User'}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            showToast("সফলভাবে ডাউনলোড হয়েছে!");
        });
    };

    // মডিউল চালু করা
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initModule();
    } else {
        document.addEventListener('DOMContentLoaded', initModule);
    }

})();
