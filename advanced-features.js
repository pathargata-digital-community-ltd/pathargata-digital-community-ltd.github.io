// --- Advanced Security & UI Module for Patharghata Digital ---
// Version: 4.0.0 (Root Ready)

window.ADVANCED_FEATURES = {
    patharghataLat: 22.0450,
    patharghataLng: 89.9675,
    maxRadiusKm: 15, 

    getDistanceFromLatLonInKm: function(lat1, lon1, lat2, lon2) {
        var R = 6371; 
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    checkUserLocation: function() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ status: 'pending', lat: null, lng: null }); return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let userLat = position.coords.latitude;
                    let userLng = position.coords.longitude;
                    let distance = this.getDistanceFromLatLonInKm(this.patharghataLat, this.patharghataLng, userLat, userLng);
                    if (distance <= this.maxRadiusKm) {
                        resolve({ status: 'approved', lat: userLat, lng: userLng });
                    } else {
                        resolve({ status: 'pending', lat: userLat, lng: userLng });
                    }
                },
                (error) => resolve({ status: 'pending', lat: null, lng: null }),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    },

    showLockScreen: function(userData) {
        document.getElementById('main-app').style.display = 'none';
        
        // পুরাতন লক স্ক্রিন থাকলে রিমুভ করা
        let oldLock = document.getElementById('smart-lock-screen');
        if(oldLock) oldLock.remove();

        const lockScreen = document.createElement('div');
        lockScreen.id = 'smart-lock-screen';
        lockScreen.className = 'fixed inset-0 bg-gray-50 z-[1000] flex flex-col items-center justify-center p-6 text-center';

        let statusHTML = '';

        if (userData.status === 'pending_review') {
            statusHTML = `
                <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 text-4xl mb-4 shadow-lg border-4 border-white mx-auto">
                    <i class="fa-solid fa-hourglass-half"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">যাচাই চলছে...</h2>
                <p class="text-sm text-gray-600 mb-6 bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-200">
                    আপনার NID কার্ডটি অ্যাডমিন প্যানেলে জমা হয়েছে। যাচাই শেষে আপনাকে অ্যাপে প্রবেশের অনুমতি দেওয়া হবে।
                </p>
                <button onclick="window.location.reload()" class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700">রিফ্রেশ করুন</button>
            `;
        } else {
            statusHTML = `
                <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-4xl mb-4 shadow-lg border-4 border-white mx-auto">
                    <i class="fa-solid fa-lock"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">অ্যাকাউন্ট পেন্ডিং!</h2>
                <p class="text-sm text-gray-600 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    আপনার বর্তমান লোকেশন পাথরঘাটার সীমানার বাইরে। আপনি যদি পাথরঘাটার স্থায়ী বাসিন্দা হন, তবে NID দিয়ে প্রমাণ দিন। অথবা ট্যুরিস্ট হিসেবে প্রবেশ করুন।
                </p>
                
                <div id="lock-options" class="w-full max-w-sm space-y-3 mx-auto">
                    <button onclick="ADVANCED_FEATURES.showNidUploadForm()" class="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow hover:bg-blue-700 transition flex justify-center items-center gap-2">
                        <i class="fa-solid fa-id-card"></i> NID / জন্ম নিবন্ধন আপলোড
                    </button>
                    
                    <a href="https://wa.me/" id="admin-wa-btn" target="_blank" class="w-full bg-green-500 text-white font-bold py-3.5 rounded-xl shadow hover:bg-green-600 transition flex justify-center items-center gap-2">
                        <i class="fa-brands fa-whatsapp text-lg"></i> অ্যাডমিনের সাথে কথা বলুন
                    </a>
                    
                    <div class="my-4 border-t border-gray-300 relative">
                        <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-50 px-2 text-gray-500 text-sm font-bold">অথবা</span>
                    </div>
                    
                    <button onclick="ADVANCED_FEATURES.requestTouristMode()" class="w-full bg-white text-purple-600 border-2 border-purple-600 font-bold py-3.5 rounded-xl shadow hover:bg-purple-50 transition flex justify-center items-center gap-2">
                        <i class="fa-solid fa-plane-departure"></i> ট্যুরিস্ট হিসেবে প্রবেশ করুন
                    </button>
                </div>

                <div id="nid-upload-section" class="w-full max-w-sm mx-auto hidden bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4">
                    <h3 class="font-bold text-gray-800 mb-2 text-left text-sm">NID/জন্ম নিবন্ধন আপলোড করুন</h3>
                    <input type="file" id="nid-file-input" accept="image/*" class="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-sm mb-3">
                    <div class="flex gap-2">
                        <button onclick="ADVANCED_FEATURES.cancelNidUpload()" class="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-sm">বাতিল</button>
                        <button onclick="ADVANCED_FEATURES.submitNid()" id="nid-submit-btn" class="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm">সাবমিট করুন</button>
                    </div>
                </div>
            `;
        }

        lockScreen.innerHTML = statusHTML;
        document.body.appendChild(lockScreen);
        
        // হোয়াটসঅ্যাপ লিঙ্ক ফেচ করার ইভেন্ট পাঠানো
        window.dispatchEvent(new CustomEvent('fetchWhatsAppLink'));
    },

    showNidUploadForm: function() {
        document.getElementById('lock-options').classList.add('hidden');
        document.getElementById('nid-upload-section').classList.remove('hidden');
    },

    cancelNidUpload: function() {
        document.getElementById('lock-options').classList.remove('hidden');
        document.getElementById('nid-upload-section').classList.add('hidden');
    },

    submitNid: function() {
        const fileInput = document.getElementById('nid-file-input');
        if (!fileInput.files[0]) {
            alert("দয়া করে একটি ছবি সিলেক্ট করুন");
            return;
        }
        const btn = document.getElementById('nid-submit-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আপলোড হচ্ছে...';
        btn.disabled = true;

        // মেইন ইনডেক্স ফাইলে ইভেন্ট পাঠানো (Firebase & Cloudinary হ্যান্ডেল করার জন্য)
        window.dispatchEvent(new CustomEvent('uploadNIDEvent', { 
            detail: { file: fileInput.files[0] } 
        }));
    },

    requestTouristMode: function() {
        if(confirm("ট্যুরিস্ট মোডে আপনি শুধুমাত্র তথ্য দেখতে পারবেন, পোস্ট বা মেসেজ করতে পারবেন না। আপনি কি নিশ্চিত?")) {
            window.dispatchEvent(new CustomEvent('updateStatusEvent', { 
                detail: { newStatus: 'tourist' } 
            }));
            window.location.reload();
        }
    },

    enableTouristMode: function() {
        // ট্যুরিস্টদের জন্য নির্দিষ্ট বাটন হাইড করা
        const touristStyle = document.createElement('style');
        touristStyle.innerHTML = `
            #fab-container, #btn-messages, #btn-post-submit, #btn-chat-send, .btn-blood-req {
                display: none !important;
            }
        `;
        document.head.appendChild(touristStyle);
        console.log("Tourist Mode Enabled: UI restricted.");
    }
};
