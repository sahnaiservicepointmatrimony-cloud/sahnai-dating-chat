// ===============================
// HOME
// ===============================

function login() {
    window.location.href = "login.html";
}

function register() {
    window.location.href = "register.html";
}

function startChat() {
    window.location.href = "register.html";
}


// ===============================
// REGISTRATION
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm =
        document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        if (!name || !email || !password) {
            alert("सभी जानकारी भरें।");
            return;
        }

        if (password.length < 6) {
            alert(
                "Password कम से कम 6 characters का होना चाहिए।"
            );
            return;
        }

        const {
            error
        } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {
                    data: {
                        name: name
                    }
                }

            });

        if (error) {

            alert(
                "Registration failed: " +
                error.message
            );

            return;
        }

        alert(
            "Registration सफल हो गया!"
        );

        window.location.href =
            "login.html";

    });

});


// ===============================
// OPEN CHAT
// ===============================

function openChat(name, userId) {

    window.location.href =
        "chat.html?user=" +
        encodeURIComponent(name) +
        "&id=" +
        encodeURIComponent(userId);

}


// ===============================
// UNREAD COUNT
// ===============================

function getUnreadCount() {

    const count =
        localStorage.getItem(
            "unreadMessages"
        );

    return count
        ? Number(count)
        : 0;

}


function setUnreadCount(count) {

    localStorage.setItem(
        "unreadMessages",
        String(count)
    );

    updateUnreadBadge();

}


function addUnreadMessage() {

    setUnreadCount(
        getUnreadCount() + 1
    );

}


function clearUnreadMessages() {

    setUnreadCount(0);

}


// ===============================
// UNREAD BADGE
// ===============================

function updateUnreadBadge() {

    let badge =
        document.getElementById(
            "unreadMessageBadge"
        );

    if (!badge) {

        badge =
            document.createElement(
                "div"
            );

        badge.id =
            "unreadMessageBadge";

        badge.style.position =
            "fixed";

        badge.style.right =
            "18px";

        badge.style.bottom =
            "80px";

        badge.style.background =
            "#ef4444";

        badge.style.color =
            "white";

        badge.style.padding =
            "11px 17px";

        badge.style.borderRadius =
            "30px";

        badge.style.fontSize =
            "16px";

        badge.style.fontWeight =
            "bold";

        badge.style.boxShadow =
            "0 4px 15px rgba(0,0,0,0.25)";

        badge.style.zIndex =
            "99999";

        badge.style.cursor =
            "pointer";

        badge.onclick =
            function () {

                window.location.href =
                    "users.html";

            };

        document.body.appendChild(
            badge
        );

    }


    const count =
        getUnreadCount();


    if (count > 0) {

        badge.textContent =
            "💬 " +
            count +
            " नया message";

        badge.style.display =
            "block";

    } else {

        badge.style.display =
            "none";

    }

}


// ===============================
// MESSAGE NOTIFICATION
// ===============================

function showNewMessageNotification(
    senderName,
    senderId
) {

    let notification =
        document.getElementById(
            "messageNotification"
        );

    if (notification) {
        notification.remove();
    }


    notification =
        document.createElement(
            "div"
        );


    notification.id =
        "messageNotification";


    notification.innerHTML = `

        <div style="
            font-size:19px;
            font-weight:bold;
            margin-bottom:6px;
        ">
            💬 नया message
        </div>

        <div>
            ${senderName || "किसी user"}
            ने आपको message भेजा है।
        </div>

        <div style="
            margin-top:10px;
            font-size:14px;
            color:#4f46e5;
            font-weight:bold;
        ">
            Chat खोलने के लिए tap करें
        </div>

    `;


    notification.style.position =
        "fixed";

    notification.style.top =
        "20px";

    notification.style.left =
        "50%";

    notification.style.transform =
        "translateX(-50%)";

    notification.style.width =
        "calc(100% - 40px)";

    notification.style.maxWidth =
        "400px";

    notification.style.background =
        "white";

    notification.style.color =
        "#222";

    notification.style.padding =
        "17px";

    notification.style.borderRadius =
        "16px";

    notification.style.boxShadow =
        "0 5px 25px rgba(0,0,0,0.30)";

    notification.style.zIndex =
        "100000";

    notification.style.cursor =
        "pointer";


    notification.onclick =
        function () {

            window.location.href =
                "chat.html?id=" +
                encodeURIComponent(
                    senderId
                ) +
                "&user=" +
                encodeURIComponent(
                    senderName || "User"
                );

        };


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            if (notification) {
                notification.remove();
            }

        },
        6000
    );

}


// ===============================
// GET SENDER NAME
// ===============================

async function getSenderName(
    senderId
) {

    if (!senderId) {
        return "नया user";
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select("name")
                .eq(
                    "id",
                    senderId
                )
                .maybeSingle();


        if (
            error ||
            !data
        ) {

            return "नया user";

        }


        return (
            data.name ||
            "नया user"
        );


    } catch (error) {

        return "नया user";

    }

}


// ===============================
// CHECK NEW MESSAGES
// ===============================

async function checkNewMessages() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    if (!user) {
        return;
    }


    const storageKey =
        "lastMessageCheck_" +
        user.id;


    let lastCheck =
        localStorage.getItem(
            storageKey
        );


    const checkStarted =
        new Date().toISOString();


    if (!lastCheck) {

        localStorage.setItem(
            storageKey,
            checkStarted
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .select(
                "id, sender_id, receiver_id, content, created_at, read_at"
            )
            .eq(
                "receiver_id",
                user.id
            )
            .gt(
                "created_at",
                lastCheck
            )
            .lte(
                "created_at",
                checkStarted
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.log(
            "Message check error:",
            error.message
        );

        return;
    }


    localStorage.setItem(
        storageKey,
        checkStarted
    );


    if (
        !data ||
        data.length === 0
    ) {
        return;
    }


    for (
        const message of data
    ) {

        const seenKey =
            "seenMessage_" +
            message.id;


        if (
            localStorage.getItem(
                seenKey
            )
        ) {
            continue;
        }


        localStorage.setItem(
            seenKey,
            "1"
        );


        addUnreadMessage();


        const senderName =
            await getSenderName(
                message.sender_id
            );


        showNewMessageNotification(
            senderName,
            message.sender_id
        );

    }

}


// ===============================
// MESSAGE CHECKER
// ===============================

let messageCheckerStarted =
    false;


function startMessageChecker() {

    if (
        messageCheckerStarted
    ) {
        return;
    }


    messageCheckerStarted =
        true;


    checkNewMessages();


    setInterval(
        function () {

            checkNewMessages();

        },
        3000
    );

}


// ===============================
// CHAT VARIABLES
// ===============================

let currentChatUser =
    null;

let currentChatUserId =
    null;

let chatChannel =
    null;


// ===============================
// LOAD CHAT
// ===============================

async function loadChat() {

    const messagesBox =
        document.getElementById(
            "messages"
        );


    const chatUserName =
        document.getElementById(
            "chatUserName"
        );


    if (
        !messagesBox ||
        !chatUserName
    ) {
        return;
    }


    const {
        data: {
            user
        }
    } =
        await supabaseClient
            .auth
            .getUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    currentChatUser =
        user;


    const params =
        new URLSearchParams(
            window.location.search
        );


    currentChatUserId =
        params.get("id");


    const name =
        params.get("user") ||
        "User";


    if (!currentChatUserId) {

        messagesBox.innerHTML =
            "<p>Chat user नहीं मिला।</p>";

        return;
    }


    chatUserName.textContent =
        name;


    clearUnreadMessages();


    await markMessagesAsRead();

    await loadMessages();

    startRealtime();

}


// ===============================
// MARK MESSAGES AS READ
// ===============================

async function markMessagesAsRead() {

    if (
        !currentChatUser ||
        !currentChatUserId
    ) {
        return;
    }


    const {
        error
    } =
        await supabaseClient
            .from("messages")
            .update({

                read_at:
                    new Date().toISOString()

            })
            .eq(
                "receiver_id",
                currentChatUser.id
            )
            .eq(
                "sender_id",
                currentChatUserId
            )
            .is(
                "read_at",
                null
            );


    if (error) {

        console.log(
            "Read status error:",
            error.message
        );

    }

}


// ===============================
// LOAD MESSAGES
// ===============================

async function loadMessages() {

    const messagesBox =
        document.getElementById(
            "messages"
        );


    if (!messagesBox) {
        return;
    }


    const myId =
        currentChatUser.id;


    const otherId =
        currentChatUserId;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .select(
                "id, sender_id, receiver_id, content, created_at, read_at"
            )
            .or(
                "and(sender_id.eq." +
                myId +
                ",receiver_id.eq." +
                otherId +
                "),and(sender_id.eq." +
                otherId +
                ",receiver_id.eq." +
                myId +
                ")"
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        messagesBox.innerHTML =
            "<p>Messages load नहीं हुए:<br>" +
            error.message +
            "</p>";

        return;
    }


    messagesBox.innerHTML =
        "";


    if (
        !data ||
        data.length === 0
    ) {

        messagesBox.innerHTML =
            "<p style='text-align:center;'>अभी कोई message नहीं है।</p>";

        return;
    }


    data.forEach(
        function (item) {

            showMessage(item);

        }
    );


    scrollMessages();

}


// ===============================
// SHOW MESSAGE
// ===============================

function showMessage(item) {

    const messagesBox =
        document.getElementById(
            "messages"
        );


    if (!messagesBox) {
        return;
    }


    if (
        messagesBox.querySelector(
            '[data-message-id="' +
            item.id +
            '"]'
        )
    ) {
        return;
    }


    const message =
        document.createElement(
            "div"
        );


    message.className =
        item.sender_id ===
        currentChatUser.id
            ? "message sent"
            : "message received";


    message.dataset.messageId =
        item.id;


    const text =
        document.createElement(
            "span"
        );


    text.className =
        "message-text";


    text.textContent =
        item.content;


    message.appendChild(
        text
    );


    const time =
        document.createElement(
            "span"
        );


    time.className =
        "message-time";


    const date =
        new Date(
            item.created_at
        );


    time.textContent =
        date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    if (
        item.sender_id ===
        currentChatUser.id
    ) {

        const status =
            document.createElement(
                "span"
            );


        status.className =
            "read-status";


        status.style.marginLeft =
            "6px";


        if (item.read_at) {

            status.textContent =
                "✓✓";

            status.style.color =
                "#2563eb";

        } else {

            status.textContent =
                "✓";

            status.style.color =
                "#666";

        }


        time.appendChild(
            status
        );

    }


    message.appendChild(
        time
    );


    messagesBox.appendChild(
        message
    );


    scrollMessages();

}


// ===============================
// UPDATE READ STATUS
// ===============================

function updateMessageReadStatus(
    messageId
) {

    const message =
        document.querySelector(
            '[data-message-id="' +
            messageId +
            '"]'
        );


    if (!message) {
        return;
    }


    const status =
        message.querySelector(
            ".read-status"
        );


    if (!status) {
        return;
    }


    status.textContent =
        "✓✓";


    status.style.color =
        "#2563eb";

}


// ===============================
// SEND MESSAGE
// ===============================

async function sendMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    if (
        !currentChatUser ||
        !currentChatUserId
    ) {

        alert(
            "Chat अभी तैयार नहीं है।"
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("messages")
            .insert({

                sender_id:
                    currentChatUser.id,

                receiver_id:
                    currentChatUserId,

                content:
                    text

            })
            .select(
                "id, sender_id, receiver_id, content, created_at, read_at"
            )
            .single();


    if (error) {

        alert(
            "Message भेजने में समस्या: " +
            error.message
        );

        return;
    }


    input.value =
        "";


    if (data) {

        showMessage(data);

    }

}


// ===============================
// REALTIME
// ===============================

function startRealtime() {

    if (
        !currentChatUser ||
        !currentChatUserId
    ) {
        return;
    }


    if (chatChannel) {

        supabaseClient.removeChannel(
            chatChannel
        );

    }


    chatChannel =
        supabaseClient
            .channel(
                "chat-" +
                currentChatUser.id +
                "-" +
                currentChatUserId
            )


            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },

                async function (payload) {

                    const message =
                        payload.new;


                    const isThisChat =
                        (
                            message.sender_id ===
                            currentChatUser.id &&
                            message.receiver_id ===
                            currentChatUserId
                        )
                        ||
                        (
                            message.sender_id ===
                            currentChatUserId &&
                            message.receiver_id ===
                            currentChatUser.id
                        );


                    if (!isThisChat) {
                        return;
                    }


                    showMessage(
                        message
                    );


                    if (
                        message.sender_id ===
                        currentChatUserId &&
                        message.receiver_id ===
                        currentChatUser.id
                    ) {

                        await supabaseClient
                            .from("messages")
                            .update({

                                read_at:
                                    new Date().toISOString()

                            })
                            .eq(
                                "id",
                                message.id
                            );

                    }

                }
            )


            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "messages"
                },

                function (payload) {

                    const message =
                        payload.new;


                    if (
                        message.sender_id ===
                        currentChatUser.id &&
                        message.read_at
                    ) {

                        updateMessageReadStatus(
                            message.id
                        );

                    }

                }
            )


            .subscribe();

}


// ===============================
// SCROLL
// ===============================

function scrollMessages() {

    const box =
        document.getElementById(
            "messages"
        );


    if (!box) {
        return;
    }


    box.scrollTop =
        box.scrollHeight;

}


// ===============================
// LOGOUT
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (!logoutButton) {
            return;
        }


        logoutButton.addEventListener(
            "click",
            async function () {

                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signOut();


                if (error) {

                    alert(
                        "Logout failed: " +
                        error.message
                    );

                    return;
                }


                clearUnreadMessages();


                window.location.href =
                    "index.html";

            }
        );

    }
);


// ===============================
// PAGE START
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
        ===================================
        CURRENT PAGE
        ===================================
        */

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /*
        ===================================
        CHAT PAGE
        ===================================
        */

        if (
            currentPage ===
            "chat.html"
        ) {

            updateUnreadBadge();

            loadChat();

            return;
        }


        /*
        ===================================
        USERS PAGE
        ===================================
        */

        if (
            currentPage ===
            "users.html"
        ) {

            updateUnreadBadge();

            startMessageChecker();

            return;
        }


        /*
        ===================================
        ALL OTHER PAGES
        ===================================

        Home
        Login
        Register
        Admin
        Profile
        Matches
        etc.

        यहाँ message checker नहीं चलेगा।
        */

    }
);
