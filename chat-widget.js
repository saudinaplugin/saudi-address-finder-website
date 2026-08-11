// Facebook Messenger "Customer Chat" widget.
//
// This file is intentionally inert until MESSENGER_PAGE_ID below is filled
// in with a real Facebook Page ID (see Task 5 of
// docs/superpowers/plans/2026-08-12-help-faq-messenger-chat.md). Loading
// this script with no Page ID configured is a silent no-op — safe to
// include on every page ahead of time.

const MESSENGER_PAGE_ID = ""; // TODO(Task 5): fill in with the real Facebook Page ID

if (MESSENGER_PAGE_ID) {
  window.fbAsyncInit = function () {
    FB.init({
      xfbml: true,
      version: "v20.0",
    });
  };

  (function (d, s, id) {
    if (d.getElementById(id)) return;
    const js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    d.body.appendChild(js);
  })(document, "script", "facebook-jssdk");

  const chatDiv = document.createElement("div");
  chatDiv.id = "fb-customer-chat";
  chatDiv.className = "fb-customerchat";
  chatDiv.setAttribute("page_id", MESSENGER_PAGE_ID);
  document.body.appendChild(chatDiv);
}
