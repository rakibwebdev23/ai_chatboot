(function () {
    if (window.chatbotLoaded) return;
    window.chatbotLoaded = true;

    // Inject Styles for Perfectly Smooth Hover and Float Transitions
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes aps-wave {
      0% { transform: scale(0.9); opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes aps-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .aps-chat-button {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 64px !important;
      height: 64px !important;
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      cursor: pointer !important;
      z-index: 2147483647 !important;
      outline: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    .aps-float-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: aps-float 3s ease-in-out infinite;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .aps-chat-button:hover .aps-float-wrapper {
      transform: scale(1.15);
      animation-play-state: paused;
    }
    .aps-chat-button:active .aps-float-wrapper {
      transform: scale(0.9);
    }
    .aps-wave-effect {
      position: absolute;
      top: 0;
      left: 0;
      width: 64px;
      height: 64px;
      background: rgba(0, 0, 0, 0.08);
      border-radius: 50%;
      z-index: -1;
      animation: aps-wave 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      pointer-events: none;
    }
    .aps-button-hidden {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  `;
    document.head.appendChild(style);

    // Detect Mobile (function so it re-checks each time)
    const isMobile = () => window.innerWidth < 768;

    // Create Iframe
    const iframe = document.createElement('iframe');
    // Ensure accurate URL for deployment (Dynamic baseUrl)
    const getBaseUrl = () => {
        // Try document.currentScript first
        if (document.currentScript && document.currentScript.src) {
            return new URL(document.currentScript.src).origin;
        }
        // Fallback: search for the script tag in the document
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.includes('widget.js')) {
                return new URL(scripts[i].src).origin;
            }
        }
        // Last fallback: use current origin (works for same-domain testing)
        return window.location.origin;
    };

    const baseUrl = getBaseUrl();
    iframe.src = baseUrl + '/embed';


    // Dynamic Responsive Styles
    const desktopStyle = `
      bottom: 100px !important;
      right: 24px !important;
      width: 420px !important;
      height: 700px !important;
      border-radius: 24px !important;
    `;

    const mobileStyle = `
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      bottom: 0 !important;
      right: 0 !important;
      border-radius: 0 !important;
    `;

    iframe.style.cssText = `
      position: fixed !important;
      ${isMobile() ? mobileStyle : desktopStyle}
      border: none !important;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
      z-index: 2147483647 !important;
      background-color: #ffffff !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(30px) scale(0.95) !important;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      pointer-events: none !important;
      transform-origin: bottom right !important;
    `;

    // Re-check on resize for orientation changes
    window.addEventListener('resize', () => {
        if (isMobile()) {
            iframe.style.top = '0px';
            iframe.style.left = '0px';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.bottom = '0px';
            iframe.style.right = '0px';
            iframe.style.borderRadius = '0px';
        } else {
            iframe.style.top = 'auto';
            iframe.style.left = 'auto';
            iframe.style.bottom = '100px';
            iframe.style.right = '24px';
            iframe.style.width = '420px';
            iframe.style.height = '700px';
            iframe.style.borderRadius = '24px';
        }
    });

    document.body.appendChild(iframe);

    // Icons
    const chatIconHtml = `
    <div class="aps-float-wrapper">
      <div class="aps-wave-effect"></div>
      <div class="aps-wave-effect" style="animation-delay: 1.2s;"></div>
      <img src="${baseUrl}/images/chat-icon.png" alt="Chat" style="width: 64px; height: 64px; object-fit: contain; display: block;" />
    </div>
  `;

    // Create Toggle Button
    const button = document.createElement('button');
    button.className = 'aps-chat-button';
    button.innerHTML = chatIconHtml;
    document.body.appendChild(button);

    let isOpen = false;

    const toggleChat = (forceClose = false) => {
        if (forceClose) {
            isOpen = false;
        } else {
            isOpen = !isOpen;
        }

        if (isOpen) {
            iframe.style.setProperty('visibility', 'visible', 'important');
            iframe.style.setProperty('opacity', '1', 'important');
            iframe.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
            iframe.style.setProperty('pointer-events', 'auto', 'important');

            button.classList.add('aps-button-hidden');
        } else {
            iframe.style.setProperty('opacity', '0', 'important');
            iframe.style.setProperty('transform', 'translateY(30px) scale(0.95)', 'important');
            iframe.style.setProperty('pointer-events', 'none', 'important');

            setTimeout(() => {
                if (!isOpen) {
                    iframe.style.setProperty('visibility', 'hidden', 'important');
                }
            }, 400);

            button.innerHTML = chatIconHtml;
            button.classList.remove('aps-button-hidden');
        }
    };

    button.onclick = () => toggleChat();

    // Listen for close message from the chat app
    window.addEventListener('message', (event) => {
        if (event.data === 'close_chatbot') {
            toggleChat(true);
        }
    });
})();


// usage for cms script url : 
{/* <script src="https://chatboot-office.vercel.app/widget.js"></script> */ }
